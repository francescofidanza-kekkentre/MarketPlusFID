#!/usr/bin/env python3
"""
MarketPulse Pro - Local Server & Financial API Proxy for Chromebook (ChromeOS)
Zero-dependency, uses Python standard library only.
"""

import sys
import os
import ssl
import json
import time
import datetime
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
HISTORY_CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'history_cache.json')
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
SSL_CTX = ssl._create_unverified_context()


def load_history_store():
    if os.path.exists(HISTORY_CACHE_FILE):
        try:
            with open(HISTORY_CACHE_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return data
        except Exception:
            pass
    return {}


def save_history_store(store):
    try:
        with open(HISTORY_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(store, f, separators=(',', ':'))
    except Exception as e:
        print(f"[MarketPulse] Impossibile salvare {HISTORY_CACHE_FILE}: {e}")


def extract_bars_from_yahoo(payload):
    """Extracts {timestamp_sec: {o, h, l, c, v}} and meta from Yahoo v8 chart JSON."""
    try:
        res_obj = payload.get('chart', {}).get('result', [None])[0]
        if not res_obj:
            return None, {}
        timestamps = res_obj.get('timestamp') or []
        quotes = (res_obj.get('indicators', {}).get('quote') or [{}])[0]
        opens = quotes.get('open') or []
        highs = quotes.get('high') or []
        lows = quotes.get('low') or []
        closes = quotes.get('close') or []
        volumes = quotes.get('volume') or []

        bars = {}
        for i, ts in enumerate(timestamps):
            o = opens[i] if i < len(opens) else None
            c = closes[i] if i < len(closes) else None
            if o is not None and c is not None:
                h = highs[i] if i < len(highs) and highs[i] is not None else max(o, c)
                l = lows[i] if i < len(lows) and lows[i] is not None else min(o, c)
                v = volumes[i] if i < len(volumes) else None
                bars[str(int(ts))] = {
                    'o': float(o),
                    'h': float(h),
                    'l': float(l),
                    'c': float(c),
                    'v': float(v) if v is not None else None
                }
        meta = res_obj.get('meta') or {}
        return bars, meta
    except Exception:
        return None, {}


def build_yahoo_chart_response(bars_dict, meta=None, since_sec=None):
    """Rebuilds a standard Yahoo v8 chart JSON response from stored bars."""
    sorted_keys = sorted(bars_dict.keys(), key=lambda x: int(x))
    if since_sec is not None:
        sorted_keys = [k for k in sorted_keys if int(k) >= int(since_sec)]

    timestamps = [int(k) for k in sorted_keys]
    opens = [bars_dict[k]['o'] for k in sorted_keys]
    highs = [bars_dict[k]['h'] for k in sorted_keys]
    lows = [bars_dict[k]['l'] for k in sorted_keys]
    closes = [bars_dict[k]['c'] for k in sorted_keys]
    volumes = [bars_dict[k]['v'] for k in sorted_keys]

    return {
        'chart': {
            'result': [{
                'meta': meta or {},
                'timestamp': timestamps,
                'indicators': {
                    'quote': [{
                        'open': opens,
                        'high': highs,
                        'low': lows,
                        'close': closes,
                        'volume': volumes
                    }]
                }
            }],
            'error': None
        }
    }


def get_canonical_cache_key(symbol, interval):
    app_sym = 'VWCE' if symbol.upper() == 'VWCE.DE' else symbol.upper()
    if interval in ('5m', '15m', '30m', '1h'):
        return f"{app_sym}_INTRADAY"
    return f"{app_sym}_DAILY"


def fetch_cnbc_bars(symbol, is_intraday=False, is_incremental=False):
    """Fetches real OHLCV bars from CNBC Harmony API (keyless, rate-limit free)."""
    bar_type = '30M' if is_intraday else '1D'
    now_dt = datetime.datetime.now(datetime.timezone.utc)
    end_dt = now_dt + datetime.timedelta(days=2)
    if is_incremental:
        days_back = 3 if is_intraday else 6
    else:
        days_back = 16 if is_intraday else (5 * 365)
    start_dt = now_dt - datetime.timedelta(days=days_back)

    start_str = start_dt.strftime('%Y%m%d000000')
    end_str = end_dt.strftime('%Y%m%d235959')
    url = f"https://ts-api.cnbc.com/harmony/app/bars/{symbol}/{bar_type}/{start_str}/{end_str}/adjusted/EST5EDT.json"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=8, context=SSL_CTX) as response:
        data = json.loads(response.read().decode('utf-8'))
        raw_bars = (data.get('barData') or {}).get('priceBars') or []
        bars = {}
        for b in raw_bars:
            try:
                ts_ms = b.get('tradeTimeinMills')
                if not ts_ms:
                    continue
                ts_sec = int(int(ts_ms) // 1000)
                o = float(str(b['open']).replace(',', ''))
                h = float(str(b['high']).replace(',', ''))
                l = float(str(b['low']).replace(',', ''))
                c = float(str(b['close']).replace(',', ''))
                v = float(str(b.get('volume') or 0).replace(',', ''))
                if o > 0 and c > 0:
                    bars[str(ts_sec)] = {
                        'o': o,
                        'h': h if h > 0 else max(o, c),
                        'l': l if l > 0 else min(o, c),
                        'c': c,
                        'v': v if v > 0 else None
                    }
            except Exception:
                continue
        return bars if len(bars) > 0 else None


def fetch_and_update_history(symbol, range_val='2y', interval='1d', since_sec=None):
    """
    Loads saved historical data from disk if available and fetches ONLY new candles
    since the last saved timestamp. Saves merged history back to disk.
    """
    store = load_history_store()
    cache_key = get_canonical_cache_key(symbol, interval)
    entry = store.get(cache_key)

    now_sec = int(time.time())
    is_intraday = interval in ('5m', '15m', '30m', '1h')
    init_range = '5d' if is_intraday else '5y'

    if entry and isinstance(entry.get('bars'), dict) and len(entry['bars']) >= (10 if is_intraday else 50):
        bars = entry['bars']
        meta = entry.get('meta') or {}
        inc_range = '1d' if is_intraday else '5d'

        # 1. Try incremental update via CNBC Harmony API first
        updated = False
        try:
            new_bars = fetch_cnbc_bars(symbol, is_intraday=is_intraday, is_incremental=True)
            if new_bars:
                bars.update(new_bars)
                entry['bars'] = bars
                entry['updated_at'] = now_sec
                store[cache_key] = entry
                save_history_store(store)
                updated = True
        except Exception:
            pass

        # 2. Fallback to Yahoo Finance incremental update
        if not updated:
            url = (
                f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
                f"?range={inc_range}&interval={interval}"
            )
            req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=6, context=SSL_CTX) as response:
                    raw_payload = json.loads(response.read().decode('utf-8'))
                    new_bars, new_meta = extract_bars_from_yahoo(raw_payload)
                    if new_bars:
                        bars.update(new_bars)
                        if new_meta:
                            meta = new_meta
                        entry['bars'] = bars
                        entry['meta'] = meta
                        entry['updated_at'] = now_sec
                        store[cache_key] = entry
                        save_history_store(store)
            except Exception:
                pass

        return build_yahoo_chart_response(bars, meta, since_sec=since_sec)

    # First time downloading history for this symbol/interval
    try:
        bars = fetch_cnbc_bars(symbol, is_intraday=is_intraday, is_incremental=False)
        if bars:
            store[cache_key] = {
                'symbol': symbol,
                'range': init_range,
                'interval': interval,
                'updated_at': now_sec,
                'meta': {'symbol': symbol},
                'bars': bars
            }
            save_history_store(store)
            return build_yahoo_chart_response(bars, {'symbol': symbol}, since_sec=since_sec)
    except Exception:
        pass

    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={init_range}&interval={interval}"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=8, context=SSL_CTX) as response:
        raw_payload = json.loads(response.read().decode('utf-8'))
        bars, meta = extract_bars_from_yahoo(raw_payload)
        if bars:
            store[cache_key] = {
                'symbol': symbol,
                'range': init_range,
                'interval': interval,
                'updated_at': now_sec,
                'meta': meta,
                'bars': bars
            }
            save_history_store(store)
            return build_yahoo_chart_response(bars, meta, since_sec=since_sec)
        return raw_payload


DEFAULT_STOCK_SYMBOLS = [
    ('NVDA', 'NVDA'),
    ('AAPL', 'AAPL'),
    ('MSFT', 'MSFT'),
    ('TSLA', 'TSLA'),
    ('GOOGL', 'GOOGL'),
    ('AMZN', 'AMZN'),
    ('META', 'META'),
    ('ASML', 'ASML'),
    ('SPY', 'SPY'),
    ('QQQ', 'QQQ'),
    ('VWCE', 'VWCE.DE'),
    ('SOXX', 'SOXX'),
    ('GLD', 'GLD'),
    ('URTH', 'URTH'),
]


def sync_all_saved_histories():
    """
    Downloads initial history for all default assets if missing, and incrementally
    updates all saved series in history_cache.json with only new bars (?range=5d / ?range=1d).
    """
    print(" 🔄 Sincronizzazione incrementale storico mercati (history_cache.json)...")

    # Ensure all default stocks/ETFs have their DAILY (2y/1d) and INTRADAY (5d/15m) series synced
    for app_sym, yahoo_sym in DEFAULT_STOCK_SYMBOLS:
        for range_val, interval in [('2y', '1d'), ('5d', '15m')]:
            try:
                fetch_and_update_history(yahoo_sym, range_val, interval)
            except Exception as e:
                print(f"   ⚠️ Salto {yahoo_sym} ({range_val}/{interval}): {e}")

    # Also incrementally update any additional custom ticker series already in store
    store = load_history_store()
    default_keys = {
        get_canonical_cache_key(y_sym, inv)
        for _, y_sym in DEFAULT_STOCK_SYMBOLS
        for inv in ('1d', '15m')
    }
    for key, entry in list(store.items()):
        if key in default_keys or not isinstance(entry, dict):
            continue
        symbol = entry.get('symbol')
        range_val = entry.get('range', '2y')
        interval = entry.get('interval', '1d')
        if symbol:
            try:
                fetch_and_update_history(symbol, range_val, interval)
            except Exception as e:
                print(f"   ⚠️ Salto {key}: {e}")
    print(" ✅ Storico mercati salvato e aggiornato in history_cache.json.")

class MarketPulseHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing & PWA Service Worker headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # API Proxy endpoint for Yahoo Finance (Bypasses CORS in local dev)
        if self.path.startswith('/api/quote'):
            self.handle_quote_proxy()
            return
        elif self.path.startswith('/api/history'):
            self.handle_history_proxy()
            return
        elif self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'app': 'MarketPulse Pro'}).encode('utf-8'))
            return

        # Serve static PWA files
        super().do_GET()

    def handle_quote_proxy(self):
        query = self.path.split('?')
        params = {}
        if len(query) > 1:
            for pair in query[1].split('&'):
                if '=' in pair:
                    k, v = pair.split('=', 1)
                    params[k] = v

        symbol = params.get('symbol', 'NVDA')
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"

        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (X11; CrOS aarch64 15183.78.0) AppleWebKit/537.36'}
        )

        try:
            with urllib.request.urlopen(req, timeout=5, context=SSL_CTX) as response:
                data = response.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def handle_history_proxy(self):
        query = self.path.split('?')
        params = {}
        if len(query) > 1:
            for pair in query[1].split('&'):
                if '=' in pair:
                    k, v = pair.split('=', 1)
                    params[k] = v

        symbol = params.get('symbol', 'NVDA')
        range_val = params.get('range', '1mo')
        interval = params.get('interval', '1d')
        since_param = params.get('since')
        since_sec = int(since_param) if since_param and since_param.isdigit() else None

        try:
            payload = fetch_and_update_history(symbol, range_val, interval, since_sec=since_sec)
            data = json.dumps(payload).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

def run_server():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    if '--sync' in sys.argv or '--update' in sys.argv:
        sync_all_saved_histories()
        return

    sync_all_saved_histories()

    port = PORT
    for p in [8080, 8000, 5000, 3000]:
        try:
            server = HTTPServer(('0.0.0.0', p), MarketPulseHandler)
            port = p
            break
        except OSError:
            continue

    print("=" * 65)
    print(" 🚀 MarketPulse Pro • Server Chromebook Avviato con Successo!")
    print("=" * 65)
    print(f" • Apri nel browser Chrome su Chromebook: http://localhost:{port}")
    print(" • Per installare come app nativa: Clicca l'icona 'Installa App' nella barra")
    print("   oppure clicca l'icona di installazione nella barra degli indirizzi di Chrome.")
    print("=" * 65)
    print(" Premi Ctrl+C per arrestare il server.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArresto del server...")
        server.server_close()

if __name__ == '__main__':
    run_server()
