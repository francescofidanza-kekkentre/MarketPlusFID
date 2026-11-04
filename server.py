#!/usr/bin/env python3
"""
MarketPulse Pro - Local Server & Financial API Proxy for Chromebook (ChromeOS)
Zero-dependency, uses Python standard library only.
"""

import sys
import os
import json
import time
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
HISTORY_CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'history_cache.json')
USER_AGENT = 'Mozilla/5.0 (X11; CrOS aarch64 15183.78.0) AppleWebKit/537.36'


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


def fetch_and_update_history(symbol, range_val='1mo', interval='1d', since_sec=None):
    """
    Loads saved historical data from disk if available and fetches ONLY new candles
    since the last saved timestamp. Saves merged history back to disk.
    """
    store = load_history_store()
    cache_key = f"{symbol}_{range_val}_{interval}"
    entry = store.get(cache_key)

    now_sec = int(time.time())

    if entry and isinstance(entry.get('bars'), dict) and len(entry['bars']) > 0:
        bars = entry['bars']
        meta = entry.get('meta') or {}
        inc_range = '1d' if interval in ('5m', '15m', '30m', '1h') else '5d'

        # Fetch only the recent window of new bars and merge into saved history
        url = (
            f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
            f"?range={inc_range}&interval={interval}"
        )
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
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
            # If network fails, we still return the saved historical data from disk
            pass

        return build_yahoo_chart_response(bars, meta, since_sec=since_sec)

    # First time downloading history for this symbol/range/interval
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={range_val}&interval={interval}"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=5) as response:
        raw_payload = json.loads(response.read().decode('utf-8'))
        bars, meta = extract_bars_from_yahoo(raw_payload)
        if bars:
            store[cache_key] = {
                'symbol': symbol,
                'range': range_val,
                'interval': interval,
                'updated_at': now_sec,
                'meta': meta,
                'bars': bars
            }
            save_history_store(store)
            return build_yahoo_chart_response(bars, meta, since_sec=since_sec)
        return raw_payload


def sync_all_saved_histories():
    """Updates all previously downloaded series in history_cache.json with only new bars."""
    store = load_history_store()
    if not store:
        return
    print(f" 🔄 Aggiornamento incrementale di {len(store)} serie storiche salvate...")
    for key, entry in list(store.items()):
        symbol = entry.get('symbol')
        range_val = entry.get('range', '1mo')
        interval = entry.get('interval', '1d')
        if symbol:
            try:
                fetch_and_update_history(symbol, range_val, interval)
            except Exception as e:
                print(f"   ⚠️ Salto {key}: {e}")

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
            with urllib.request.urlopen(req, timeout=5) as response:
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
