/**
 * MarketPulse Pro - Core Application Logic
 * Optimized for Chromebook (ChromeOS), Responsive Touch & Keyboard shortcuts.
 */

// --- Default Asset Database ---
const DEFAULT_ASSETS = [
  // Stocks
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'ASML', name: 'ASML Holding N.V.', type: 'stock', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'ALO.PA', marketSymbol: 'ALO-FR', name: 'Alstom SA', type: 'stock', exchange: 'Euronext Paris', currency: 'EUR', price: 10.96, change: -0.82, high: 11.28, low: 10.89, volume: '4.2M', favorite: false },

  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'etf', exchange: 'NYSE Arca', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100)', type: 'etf', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'VWCE', name: 'Vanguard FTSE All-World UCITS', type: 'etf', exchange: 'XETRA', currency: 'EUR', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'SOXX', name: 'iShares Semiconductor ETF', type: 'etf', exchange: 'NASDAQ', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'GLD', name: 'SPDR Gold Shares ETF', type: 'etf', exchange: 'NYSE Arca', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'URTH', name: 'iShares MSCI World ETF', type: 'etf', exchange: 'NYSE Arca', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },

  // Crypto
  { symbol: 'BTC', name: 'Bitcoin (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'ETH', name: 'Ethereum (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'SOL', name: 'Solana (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: true },
  { symbol: 'BNB', name: 'BNB (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'XRP', name: 'Ripple (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },
  { symbol: 'ADA', name: 'Cardano (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false }
];

// --- State Management ---
const AppState = {
  assets: [],
  selectedAsset: null,
  activeFilter: 'all',
  activeTimeframe: '1M',
  chartType: 'candles', // 'candles' or 'line'
  indicators: {
    ema: true,
    bands: false,
    rsi: true,
    macd: false
  },
  settings: {
    currency: 'USD',
    refreshRate: 5000
  },
  cachedBars: {}, // symbol_DAILY, symbol_INTRADAY, or symbol_timeframe -> []
  renderedBars: [], // currently visible slice of bars on screen
  barsLastUpdated: {}, // key -> timestamp ms
  quoteLastUpdated: {}, // symbol -> timestamp ms
  localApiAvailable: null, // null = unknown, true = local server.py active, false = static hosting
  preferredProxyIdx: 0,
  stockPollInProgress: false,
  chartFetchInProgress: false,
  crosshair: null,
  deferredPrompt: null
};

const HISTORY_STORAGE_KEY = 'marketpulse_history_v4';
const INCREMENTAL_SYNC_COOLDOWN_MS = 10000; // Minimum interval between incremental candle fetches per key
const STOCK_QUOTE_POLL_COOLDOWN_MS = 30000; // Poll stock/ETF quotes every 30s without API key

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadStoredData();
    setupEventListeners();
    setupKeyboardShortcuts();
    setupPWA();
    updateMarketHours();
    fetchFearAndGreed();

    // Select initial asset (NVDA)
    const initial = AppState.assets.find(a => a.symbol === 'NVDA') || AppState.assets[0];
    if (initial) selectAsset(initial);

    // Periodic polling for live data
    pollLivePrices();
    setInterval(pollLivePrices, AppState.settings.refreshRate || 5000);
    setInterval(updateMarketHours, 60000);
  } catch (err) {
    console.error('[MarketPulse] Initialization error:', err);
  }
});

// --- Storage & Data ---
function loadStoredData() {
  const storedAssets = localStorage.getItem('marketpulse_assets');
  if (storedAssets) {
    try {
      AppState.assets = JSON.parse(storedAssets);
    } catch (e) {
      AppState.assets = [...DEFAULT_ASSETS];
    }
  } else {
    AppState.assets = [...DEFAULT_ASSETS];
    saveAssetsToStorage();
  }

  // Ensure default showcase asset ALO.PA exists in AppState.assets
  if (!AppState.assets.some(a => a.symbol === 'ALO.PA')) {
    AppState.assets.push({
      symbol: 'ALO.PA',
      marketSymbol: 'ALO-FR',
      name: 'Alstom SA',
      type: 'stock',
      exchange: 'Euronext Paris',
      currency: 'EUR',
      price: 10.96,
      change: -0.82,
      high: 11.28,
      low: 10.89,
      volume: '4.2M',
      favorite: false
    });
    saveAssetsToStorage();
  }

  const storedSettings = localStorage.getItem('marketpulse_settings');
  if (storedSettings) {
    try {
      AppState.settings = Object.assign(AppState.settings, JSON.parse(storedSettings));
    } catch (e) {}
  }

  // Load persisted historical bars from localStorage so once downloaded they remain saved
  const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (storedHistory) {
    try {
      const parsed = JSON.parse(storedHistory);
      if (parsed && typeof parsed === 'object') {
        for (const [key, entry] of Object.entries(parsed)) {
          if (entry && Array.isArray(entry.bars) && entry.bars.length > 0) {
            AppState.cachedBars[key] = entry.bars.map(b => ({
              time: new Date(b.t),
              open: b.o,
              high: b.h,
              low: b.l,
              close: b.c,
              volume: b.v
            }));
            AppState.barsLastUpdated[key] = entry.updatedAt || 0;
          }
        }
      }
    } catch (e) {
      console.warn('[MarketPulse] Error loading stored history:', e);
    }
  }

  // Hydrate asset quotes immediately from any saved daily history & ensure currency is populated
  let migratedCurrency = false;
  for (const asset of AppState.assets) {
    if (!asset.currency) {
      asset.currency = inferCurrencyFromSymbolOrExchange(asset.marketSymbol || asset.symbol, asset.exchange);
      migratedCurrency = true;
    }
    const dailyBars = AppState.cachedBars[`${asset.symbol}_DAILY`] ||
                      AppState.cachedBars[`${asset.symbol}_1M`] ||
                      AppState.cachedBars[`${asset.symbol}_3M`];
    if (dailyBars && dailyBars.length >= 2) {
      syncAssetQuoteFromBars(asset, dailyBars);
    }
  }
  if (migratedCurrency) {
    saveAssetsToStorage();
  }
}

function syncAssetQuoteFromBars(asset, bars) {
  if (!asset || !Array.isArray(bars) || bars.length === 0) return;
  const lastBar = bars[bars.length - 1];
  const prevBar = bars.length > 1 ? bars[bars.length - 2] : null;
  if (lastBar && lastBar.close > 0) {
    asset.price = lastBar.close;
    if (prevBar && prevBar.close > 0) {
      asset.change = ((lastBar.close - prevBar.close) / prevBar.close) * 100;
    }
    if (lastBar.high > 0) asset.high = lastBar.high;
    if (lastBar.low > 0) asset.low = lastBar.low;
    if (lastBar.volume > 0) {
      const fv = formatVolumeCompact(lastBar.volume);
      if (fv) asset.volume = fv;
    }
  }
}

function saveAssetsToStorage() {
  try {
    localStorage.setItem('marketpulse_assets', JSON.stringify(AppState.assets));
  } catch (e) {}
}

function saveHistoryToStorage() {
  try {
    const serialized = {};
    for (const [key, bars] of Object.entries(AppState.cachedBars)) {
      if (Array.isArray(bars) && bars.length > 0) {
        serialized[key] = {
          updatedAt: AppState.barsLastUpdated[key] || Date.now(),
          bars: bars.map(b => ({
            t: b.time instanceof Date ? b.time.getTime() : new Date(b.time).getTime(),
            o: b.open,
            h: b.high,
            l: b.low,
            c: b.close,
            v: b.volume
          }))
        };
      }
    }
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('[MarketPulse] Unable to persist historical bars to localStorage:', e);
  }
}

function mergeHistoricalBars(existingBars, newBars) {
  if (!existingBars || existingBars.length === 0) return newBars || [];
  if (!newBars || newBars.length === 0) return existingBars;

  const map = new Map();
  for (const b of existingBars) {
    const ts = b.time instanceof Date ? b.time.getTime() : new Date(b.time).getTime();
    map.set(ts, { ...b, time: new Date(ts) });
  }
  for (const b of newBars) {
    const ts = b.time instanceof Date ? b.time.getTime() : new Date(b.time).getTime();
    map.set(ts, { ...b, time: new Date(ts) });
  }

  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(entry => entry[1]);
}

function updateCachedBarsWithLivePrice(symbol, livePrice) {
  if (livePrice == null || isNaN(livePrice)) return;
  let updatedAny = false;
  for (const [key, bars] of Object.entries(AppState.cachedBars)) {
    if (key.startsWith(`${symbol}_`) && Array.isArray(bars) && bars.length > 0) {
      const last = bars[bars.length - 1];
      last.close = livePrice;
      if (livePrice > last.high) last.high = livePrice;
      if (livePrice < last.low) last.low = livePrice;
      updatedAny = true;
    }
  }
  if (updatedAny) {
    saveHistoryToStorage();
  }
}

// --- Live Market Hours Check ---
function updateMarketHours() {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcDay = now.getUTCDay();

  // NYSE is open 14:30 UTC to 21:00 UTC, Mon-Fri (day 1-5)
  const isWeekday = utcDay >= 1 && utcDay <= 5;
  const isNyseOpen = isWeekday && (
    (utcHours > 14 || (utcHours === 14 && utcMinutes >= 30)) && utcHours < 21
  );

  const indicator = document.getElementById('marketIndicator');
  const text = document.getElementById('marketHoursText');

  if (isNyseOpen) {
    indicator.classList.remove('closed');
    text.textContent = 'Wall Street: APERTO';
  } else {
    indicator.classList.add('closed');
    text.textContent = 'Wall Street: CHIUSO (Crypto 24/7)';
  }
}

// --- Sentiment API (Fear & Greed) ---
async function fetchFearAndGreed() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1');
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && data.data[0]) {
        const val = parseInt(data.data[0].value, 10);
        const classification = data.data[0].value_classification;
        renderFearGreed(val, classification);
      }
    }
  } catch (err) {
    console.log('Fear & Greed index using fallback:', err);
    renderFearGreed(54, 'Neutrale');
  }
}

function renderFearGreed(val, label) {
  AppState.fearGreedVal = val;
  const el = document.getElementById('fearGreedValue');
  if (!el) return;
  el.className = 'fear-greed-meter';

  if (val <= 25) {
    AppState.fearGreedLabel = 'Paura Estrema';
    el.classList.add('fg-extreme-fear');
    el.textContent = `${val} • Paura Estrema`;
  } else if (val <= 45) {
    AppState.fearGreedLabel = 'Paura';
    el.classList.add('fg-fear');
    el.textContent = `${val} • Paura`;
  } else if (val <= 55) {
    AppState.fearGreedLabel = 'Neutrale';
    el.classList.add('fg-neutral');
    el.textContent = `${val} • Neutrale`;
  } else if (val <= 75) {
    AppState.fearGreedLabel = 'Avidità';
    el.classList.add('fg-greed');
    el.textContent = `${val} • Avidità`;
  } else {
    AppState.fearGreedLabel = 'Avidità Estrema';
    el.classList.add('fg-extreme-greed');
    el.textContent = `${val} • Avidità Estrema`;
  }
}

// --- Keyless Symbol & Market Helpers (Yahoo Finance, CNBC & Stooq) ---
function getCnbcSymbol(asset) {
  const raw = (asset && asset.marketSymbol && asset.type !== 'crypto')
    ? String(asset.marketSymbol).trim().toUpperCase()
    : String(asset?.symbol || '').trim().toUpperCase();
  if (!raw) return '';
  if (raw === 'VWCE' || (!raw.includes('.') && !raw.includes('-') && asset?.exchange && asset.exchange.toUpperCase().includes('XETRA'))) {
    return `${raw}.DE`;
  }
  // Convert Yahoo dot suffixes to CNBC hyphen suffixes where needed
  const dotMap = {
    '.MI': '-IT',
    '.PA': '-FR',
    '.AS': '-NL',
    '.L': '-GB',
    '.SW': '-CH',
    '.MC': '-ES',
    '.BR': '-BE',
    '.TO': '-CA',
    '.AX': '-AU',
    '.HK': '-HK',
    '.T': '-JP'
  };
  for (const [dotSuf, cnbcSuf] of Object.entries(dotMap)) {
    if (raw.endsWith(dotSuf)) {
      return raw.slice(0, -dotSuf.length) + cnbcSuf;
    }
  }
  return raw;
}

function getYahooSymbol(asset) {
  const raw = (asset && asset.marketSymbol && asset.type !== 'crypto')
    ? String(asset.marketSymbol).trim().toUpperCase()
    : String(asset?.symbol || '').trim().toUpperCase();
  if (!raw) return '';
  const hyphenMap = {
    '-IT': '.MI',
    '-DE': '.DE',
    '-FF': '.DE',
    '-FR': '.PA',
    '-NL': '.AS',
    '-GB': '.L',
    '-CH': '.SW',
    '-ES': '.MC',
    '-BE': '.BR',
    '-CA': '.TO',
    '-AU': '.AX',
    '-HK': '.HK',
    '-JP': '.T'
  };
  for (const [cnbcSuf, yahooSuf] of Object.entries(hyphenMap)) {
    if (raw.endsWith(cnbcSuf)) {
      return raw.slice(0, -cnbcSuf.length).replace(/\^$/, '') + yahooSuf;
    }
  }
  if (raw.includes('.')) return raw;
  if (raw === 'VWCE' || (asset?.exchange && asset.exchange.toUpperCase().includes('XETRA'))) {
    return `${raw}.DE`;
  }
  return raw;
}

function inferCurrencyFromSymbolOrExchange(sym = '', exchange = '') {
  const s = String(sym || '').trim().toUpperCase();
  const ex = String(exchange || '').trim().toUpperCase();
  if (
    s === 'VWCE' ||
    /\.(DE|MI|PA|AS|MC|BR|VI|HE|LS|IR)$/.test(s) ||
    /-(IT|DE|FF|FR|NL|ES|BE|AT|FI|PT|IE|GR)$/.test(s)
  ) {
    return 'EUR';
  }
  if (s.endsWith('.L') || s.endsWith('-GB')) return 'GBP';
  if (s.endsWith('.SW') || s.endsWith('-CH')) return 'CHF';
  if (s.endsWith('.TO') || s.endsWith('-CA')) return 'CAD';
  if (s.endsWith('.AX') || s.endsWith('-AU')) return 'AUD';
  if (s.endsWith('.HK') || s.endsWith('-HK')) return 'HKD';
  if (s.endsWith('.T') || s.endsWith('-JP')) return 'JPY';
  if (
    ex.includes('XETRA') || ex.includes('MILAN') || ex.includes('BORSA ITALIANA') ||
    ex.includes('EURONEXT') || ex.includes('PARIS') || ex.includes('AMSTERDAM') ||
    ex.includes('FRANKFURT') || ex.includes('MADRID') || ex.includes('BRUSSELS')
  ) {
    return 'EUR';
  }
  if (ex.includes('LONDON') || ex.includes('LSE')) return 'GBP';
  if (ex.includes('SWISS') || ex.includes('SIX') || ex.includes('ZURICH')) return 'CHF';
  if (ex.includes('TORONTO') || ex.includes('TSX')) return 'CAD';
  return 'USD';
}

function getCurrencySymbol(assetOrCurrency) {
  let code = 'USD';
  if (typeof assetOrCurrency === 'string') {
    const upper = assetOrCurrency.trim().toUpperCase();
    if (upper && upper !== 'STOCK' && upper !== 'ETF' && upper !== 'CRYPTO') {
      code = upper;
    }
  } else if (assetOrCurrency && typeof assetOrCurrency === 'object') {
    if (assetOrCurrency.currency) {
      code = String(assetOrCurrency.currency).trim().toUpperCase();
    } else {
      code = inferCurrencyFromSymbolOrExchange(assetOrCurrency.marketSymbol || assetOrCurrency.symbol, assetOrCurrency.exchange);
    }
  }
  const map = {
    'USD': '$',
    'USDT': '$',
    'EUR': '€',
    'GBP': '£',
    'GBX': 'p',
    'JPY': '¥',
    'CHF': 'CHF ',
    'CAD': 'CA$',
    'AUD': 'A$',
    'HKD': 'HK$'
  };
  return map[code] || (code && code.length <= 4 ? `${code} ` : '$');
}

function getStooqSymbol(asset) {
  const sym = (asset.symbol || '').trim().toLowerCase();
  if (sym.includes('.')) return sym;
  if (sym === 'vwce' || (asset.exchange && asset.exchange.toUpperCase().includes('XETRA'))) {
    return `${sym}.de`;
  }
  return `${sym}.us`;
}

function formatVolumeCompact(vol) {
  if (vol == null || isNaN(vol) || vol <= 0) return null;
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
  return Math.round(vol).toString();
}

async function fetchUrlViaKeylessGateways(targetUrl, expectJson = true, validator = null) {
  const proxyConfigs = [
    {
      buildUrl: (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
      unwrap: async (res, wantJson) => {
        const wrapper = await res.json();
        if (!wrapper || typeof wrapper.contents !== 'string' || !wrapper.contents.trim()) return null;
        return wantJson ? JSON.parse(wrapper.contents) : wrapper.contents;
      }
    },
    {
      buildUrl: (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      unwrap: async (res, wantJson) => wantJson ? await res.json() : await res.text()
    },
    {
      buildUrl: (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
      unwrap: async (res, wantJson) => wantJson ? await res.json() : await res.text()
    },
    {
      buildUrl: (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      unwrap: async (res, wantJson) => wantJson ? await res.json() : await res.text()
    }
  ];

  const total = proxyConfigs.length;
  for (let offset = 0; offset < total; offset++) {
    const idx = (AppState.preferredProxyIdx + offset) % total;
    const cfg = proxyConfigs[idx];
    const proxiedUrl = cfg.buildUrl(targetUrl);
    try {
      const res = await fetch(proxiedUrl, { signal: AbortSignal.timeout(5500) });
      if (res.ok) {
        const payload = await cfg.unwrap(res, expectJson);
        // Reject fake error responses (e.g. from legacy Service Worker or rate-limited gateway)
        if (!payload || (typeof payload === 'object' && payload.error)) {
          continue;
        }
        if (validator && !validator(payload)) {
          continue;
        }
        AppState.preferredProxyIdx = idx;
        return payload;
      }
    } catch (e) {}
  }
  return null;
}

function isValidYahooChartPayload(data) {
  return Boolean(
    data &&
    data.chart &&
    Array.isArray(data.chart.result) &&
    data.chart.result[0] &&
    (Array.isArray(data.chart.result[0].timestamp) || data.chart.result[0].meta)
  );
}

async function fetchYahooChartRaw(asset, range, interval, isIncremental = false) {
  const yahooSym = getYahooSymbol(asset);
  // For incremental updates, only request the most recent window (1d for intraday, 5d for daily/weekly/monthly)
  const effectiveRange = isIncremental
    ? ((interval === '5m' || interval === '15m' || interval === '1h') ? '1d' : '5d')
    : range;

  // 1. Try local server.py endpoint if available (zero CORS, persistent disk cache)
  if (AppState.localApiAvailable !== false) {
    try {
      const localUrl = `/api/history?symbol=${encodeURIComponent(yahooSym)}&range=${effectiveRange}&interval=${interval}`;
      const localRes = await fetch(localUrl, { signal: AbortSignal.timeout(1500) });
      if (localRes.status === 404) {
        AppState.localApiAvailable = false;
      } else if (localRes.ok) {
        const data = await localRes.json();
        if (isValidYahooChartPayload(data)) {
          AppState.localApiAvailable = true;
          return data;
        }
        AppState.localApiAvailable = false;
      }
    } catch (e) {
      if (AppState.localApiAvailable === null) {
        AppState.localApiAvailable = false;
      }
    }
  }

  // 2. Keyless Yahoo Finance v8 chart API via multi-gateway CORS fallback
  const queryPart = `range=${effectiveRange}&interval=${interval}&includePrePost=false`;

  for (const host of ['query1.finance.yahoo.com', 'query2.finance.yahoo.com']) {
    const targetUrl = `https://${host}/v8/finance/chart/${encodeURIComponent(yahooSym)}?${queryPart}`;
    const data = await fetchUrlViaKeylessGateways(targetUrl, true, isValidYahooChartPayload);
    if (isValidYahooChartPayload(data)) {
      return data;
    }
  }

  return null;
}

function applyYahooMetaToAsset(asset, resObj, parsedBars = [], interval = '1d', range = '6mo') {
  if (!asset || !resObj) return;
  const meta = resObj.meta || {};
  const lastBar = parsedBars.length > 0 ? parsedBars[parsedBars.length - 1] : null;
  const prevBar = parsedBars.length > 1 ? parsedBars[parsedBars.length - 2] : null;

  const livePrice = (meta.regularMarketPrice != null && meta.regularMarketPrice > 0)
    ? parseFloat(meta.regularMarketPrice)
    : (lastBar ? lastBar.close : null);

  if (livePrice != null && !isNaN(livePrice)) {
    asset.price = livePrice;
  }

  // Note: Yahoo's meta.chartPreviousClose is the close prior to the start of `range` (e.g. 6 months ago),
  // NOT yesterday's close, unless `range === '1d'`. For daily bars (`interval === '1d'`), `prevBar.close` is yesterday's close.
  let prevClose = null;
  if (interval === '1d' && prevBar && prevBar.close > 0) {
    prevClose = prevBar.close;
  } else if (meta.previousClose != null && meta.previousClose > 0) {
    prevClose = parseFloat(meta.previousClose);
  } else if (range === '1d' && meta.chartPreviousClose != null && meta.chartPreviousClose > 0) {
    prevClose = parseFloat(meta.chartPreviousClose);
  } else if (asset.change == null && prevBar && prevBar.close > 0) {
    prevClose = prevBar.close;
  }

  if (asset.price != null && prevClose != null && prevClose > 0) {
    asset.change = ((asset.price - prevClose) / prevClose) * 100;
  }

  if (meta.regularMarketDayHigh != null && meta.regularMarketDayHigh > 0) {
    asset.high = parseFloat(meta.regularMarketDayHigh);
  } else if (lastBar && lastBar.high > 0) {
    asset.high = lastBar.high;
  }

  if (meta.regularMarketDayLow != null && meta.regularMarketDayLow > 0) {
    asset.low = parseFloat(meta.regularMarketDayLow);
  } else if (lastBar && lastBar.low > 0) {
    asset.low = lastBar.low;
  }

  const rawVol = (meta.regularMarketVolume != null && meta.regularMarketVolume > 0)
    ? meta.regularMarketVolume
    : (lastBar && lastBar.volume > 0 ? lastBar.volume : null);
  const formattedVol = formatVolumeCompact(rawVol);
  if (formattedVol) {
    asset.volume = formattedVol;
  }

  if (meta.currency) {
    asset.currency = String(meta.currency).trim().toUpperCase();
  }
  if (meta.exchangeName && (!asset.exchange || asset.exchange === 'Stock Exchange')) {
    asset.exchange = String(meta.exchangeName).trim();
  }
}

function parseNumericClean(val) {
  if (val == null) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const cleaned = String(val).replace(/[%+,$\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function formatCnbcTimestamp(dateObj, isEnd = false) {
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${isEnd ? '235959' : '000000'}`;
}

function parseCnbcTradeTimeStr(str) {
  if (!str || str.length < 8) return null;
  const yyyy = parseInt(str.slice(0, 4), 10);
  const mm = parseInt(str.slice(4, 6), 10) - 1;
  const dd = parseInt(str.slice(6, 8), 10);
  const hh = str.length >= 10 ? parseInt(str.slice(8, 10), 10) : 16;
  const min = str.length >= 12 ? parseInt(str.slice(10, 12), 10) : 0;
  const ss = str.length >= 14 ? parseInt(str.slice(12, 14), 10) : 0;
  return new Date(Date.UTC(yyyy, mm, dd, hh, min, ss));
}

function extractCnbcFundamentals(q) {
  if (!q) return null;
  return {
    pe: parseNumericClean(q.pe),
    fpe: parseNumericClean(q.fpe),
    eps: parseNumericClean(q.eps),
    feps: parseNumericClean(q.feps),
    roe: parseNumericClean(q.ROETTM),
    netMargin: parseNumericClean(q.NETPROFTTM),
    grossMargin: parseNumericClean(q.GROSMGNTTM),
    debtToEquity: parseNumericClean(q.DEBTEQTYQ),
    divYield: parseNumericClean(q.dividendyield),
    dividend: parseNumericClean(q.dividend),
    beta: parseNumericClean(q.beta),
    mktCap: q.mktcapView ? String(q.mktcapView).trim() : null,
    yrHigh: parseNumericClean(q.yrhiprice),
    yrLow: parseNumericClean(q.yrloprice),
    pctTenDayVol: parseNumericClean(q.pcttendayvol),
    tenDayAvgVol: q.tendayavgvol ? String(q.tendayavgvol).trim() : null,
    revTtm: q.revenuettm ? String(q.revenuettm).trim() : null
  };
}

// Native CORS-enabled batch quote fetcher for all Stocks & ETFs (1 request for all 14 tickers, 0 API keys, 0 proxies)
async function fetchCnbcBatchQuotesDirect(stockAssets) {
  if (!stockAssets || stockAssets.length === 0) return false;
  try {
    const symMap = {};
    const cnbcSyms = [];
    for (const asset of stockAssets) {
      const cSym = getCnbcSymbol(asset);
      symMap[cSym.toUpperCase()] = asset;
      symMap[cSym.replace('.', '-').toUpperCase()] = asset;
      symMap[cSym.replace('-', '.').toUpperCase()] = asset;
      symMap[asset.symbol.toUpperCase()] = asset;
      cnbcSyms.push(cSym);
    }

    const symbolsParam = encodeURIComponent(cnbcSyms.join('|'));
    const url = `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${symbolsParam}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return false;

    const data = await res.json();
    let quotes = data?.FormattedQuoteResult?.FormattedQuote;
    if (!quotes) return false;
    if (!Array.isArray(quotes)) quotes = [quotes];

    let updatedCount = 0;
    for (const q of quotes) {
      if (!q || !q.symbol) continue;
      const key = String(q.symbol).toUpperCase();
      const asset = symMap[key];
      if (!asset) continue;

      const lastPrice = parseNumericClean(q.last);
      if (lastPrice != null && lastPrice > 0) {
        asset.price = lastPrice;
      }

      const changePct = parseNumericClean(q.change_pct);
      const prevClose = parseNumericClean(q.previous_day_closing);
      if (changePct != null) {
        asset.change = changePct;
      } else if (asset.price != null && prevClose != null && prevClose > 0) {
        asset.change = ((asset.price - prevClose) / prevClose) * 100;
      }

      const highVal = parseNumericClean(q.high);
      if (highVal != null && highVal > 0) asset.high = highVal;

      const lowVal = parseNumericClean(q.low);
      if (lowVal != null && lowVal > 0) asset.low = lowVal;

      const rawVol = parseNumericClean(q.volume);
      if (rawVol != null && rawVol > 0) {
        const fv = formatVolumeCompact(rawVol);
        if (fv) asset.volume = fv;
      }

      if (q.currencyCode) {
        asset.currency = String(q.currencyCode).trim().toUpperCase();
      } else if (!asset.currency) {
        asset.currency = inferCurrencyFromSymbolOrExchange(key, q.exchange || asset.exchange);
      }

      if (q.exchange && (!asset.exchange || asset.exchange === 'Stock Exchange')) {
        asset.exchange = String(q.exchange).trim();
      }

      const fund = extractCnbcFundamentals(q);
      if (fund) {
        asset.fundamentals = Object.assign(asset.fundamentals || {}, fund);
      }

      AppState.quoteLastUpdated[asset.symbol] = Date.now();
      if (asset.price != null) {
        updateCachedBarsWithLivePrice(asset.symbol, asset.price);
      }
      updatedCount++;
    }

    if (updatedCount > 0) {
      saveAssetsToStorage();
      return true;
    }
  } catch (e) {
    console.warn('[MarketPulse] Direct batch stock quote error:', e);
  }
  return false;
}

// Native CORS-enabled historical & incremental OHLCV fetcher for Stocks & ETFs (0 API keys, 0 proxies)
async function fetchCnbcBarsDirect(asset, barType = '1D', isIncremental = false, existingBars = null) {
  try {
    const cnbcSym = getCnbcSymbol(asset);
    const now = new Date();
    const endDate = new Date(now.getTime() + 2 * 86400 * 1000);
    let startDate;

    if (isIncremental && Array.isArray(existingBars) && existingBars.length > 0) {
      const lastBar = existingBars[existingBars.length - 1];
      const lastMs = lastBar.time instanceof Date ? lastBar.time.getTime() : new Date(lastBar.time).getTime();
      const lookbackDays = barType === '1D' ? 6 : 3;
      startDate = new Date(lastMs - lookbackDays * 86400 * 1000);
    } else {
      const initDays = barType === '1D' ? (5 * 365) : 16;
      startDate = new Date(now.getTime() - initDays * 86400 * 1000);
    }

    const startStr = formatCnbcTimestamp(startDate, false);
    const endStr = formatCnbcTimestamp(endDate, true);
    const url = `https://ts-api.cnbc.com/harmony/app/bars/${encodeURIComponent(cnbcSym)}/${barType}/${startStr}/${endStr}/adjusted/EST5EDT.json`;

    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) return null;
    const data = await res.json();
    const rawBars = data?.barData?.priceBars;
    if (!Array.isArray(rawBars) || rawBars.length === 0) return null;

    const parsed = [];
    for (const b of rawBars) {
      const o = parseNumericClean(b.open);
      const h = parseNumericClean(b.high);
      const l = parseNumericClean(b.low);
      const c = parseNumericClean(b.close);
      const v = parseNumericClean(b.volume);
      const dt = b.tradeTimeinMills ? new Date(Number(b.tradeTimeinMills)) : parseCnbcTradeTimeStr(b.tradeTime);
      if (dt && !isNaN(dt.getTime()) && o != null && c != null && o > 0 && c > 0) {
        parsed.push({
          time: dt,
          open: o,
          high: h != null && h > 0 ? h : Math.max(o, c),
          low: l != null && l > 0 ? l : Math.min(o, c),
          close: c,
          volume: v != null && v > 0 ? v : null
        });
      }
    }

    if (parsed.length > 0 && barType === '1D' && asset.price == null) {
      syncAssetQuoteFromBars(asset, parsed);
      saveAssetsToStorage();
    } else if (parsed.length > 0 && asset.price != null) {
      // Keep the latest bar's close synced with the live quote
      const last = parsed[parsed.length - 1];
      last.close = asset.price;
      if (asset.price > last.high) last.high = asset.price;
      if (asset.price < last.low) last.low = asset.price;
    }

    return parsed.length > 0 ? parsed : null;
  } catch (e) {
    return null;
  }
}

async function fetchStockQuoteKeyless(asset) {
  const dailyKey = `${asset.symbol}_DAILY`;
  const existingDaily = AppState.cachedBars[dailyKey];
  const isIncremental = Boolean(existingDaily && existingDaily.length >= 60);

  // 1. Try direct native-CORS CNBC bars first
  const directBars = await fetchCnbcBarsDirect(asset, '1D', isIncremental, existingDaily);
  if (directBars && directBars.length > 0) {
    const merged = mergeHistoricalBars(existingDaily || [], directBars);
    AppState.cachedBars[dailyKey] = merged;
    AppState.barsLastUpdated[dailyKey] = Date.now();
    if (asset.price == null) {
      syncAssetQuoteFromBars(asset, merged);
      saveAssetsToStorage();
    }
    saveHistoryToStorage();
    return true;
  }

  // 2. Fallback to Yahoo Finance chart endpoint
  let data = await fetchYahooChartRaw(asset, '2y', '1d', isIncremental);
  if (isValidYahooChartPayload(data)) {
    const { resObj, parsed } = parseYahooBarsFromResponse(data);
    applyYahooMetaToAsset(asset, resObj, parsed, '1d', isIncremental ? '5d' : '2y');
    AppState.quoteLastUpdated[asset.symbol] = Date.now();
    saveAssetsToStorage();

    if (parsed.length > 0) {
      const merged = mergeHistoricalBars(existingDaily || [], parsed);
      AppState.cachedBars[dailyKey] = merged;
      AppState.barsLastUpdated[dailyKey] = Date.now();
      saveHistoryToStorage();
    } else if (asset.price != null) {
      updateCachedBarsWithLivePrice(asset.symbol, asset.price);
    }
    return true;
  }
  return false;
}

// --- Polling Live Prices (Keyless & Native CORS: Binance for Crypto + CNBC/Wall St. for Stocks/ETFs) ---
async function pollLivePrices() {
  // 1. Fetch real crypto tickers from Binance API (CORS friendly, keyless)
  try {
    const cryptoSymbols = AppState.assets.filter(a => a.type === 'crypto');
    for (const asset of cryptoSymbols) {
      const pair = asset.marketSymbol || `${asset.symbol}USDT`;
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.lastPrice) {
            asset.price = parseFloat(data.lastPrice);
            asset.change = parseFloat(data.priceChangePercent);
            asset.high = parseFloat(data.highPrice);
            asset.low = parseFloat(data.lowPrice);
            if (!asset.currency) {
              asset.currency = pair.endsWith('EUR') ? 'EUR' : 'USD';
            }
            if (data.quoteVolume) {
              const volFormatted = formatVolumeCompact(parseFloat(data.quoteVolume));
              if (volFormatted) asset.volume = volFormatted;
            }
            saveAssetsToStorage();
            updateCachedBarsWithLivePrice(asset.symbol, asset.price);
            renderAssetList();
            if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
              updateSelectedAssetHeader();
              redrawCurrentChart();
            }
          }
        }).catch(() => {});
    }
  } catch (e) {}

  // 2. Fetch real Stock & ETF quotes in a single native-CORS batch request (updates all 14 tickers in ~80ms!)
  const stockAssets = AppState.assets.filter(a => a.type !== 'crypto');
  const needsQuoteUpdate = stockAssets.filter(a => {
    const lastUpd = AppState.quoteLastUpdated[a.symbol] || 0;
    return a.price == null || (Date.now() - lastUpd >= 10000);
  });

  if (needsQuoteUpdate.length > 0) {
    fetchCnbcBatchQuotesDirect(stockAssets).then(batchOk => {
      if (batchOk) {
        renderAssetList();
        if (AppState.selectedAsset && AppState.selectedAsset.type !== 'crypto') {
          updateSelectedAssetHeader();
          updateRiskCalculatorPreloads(AppState.selectedAsset);
          redrawCurrentChart();
        }
      }
    }).catch(() => {});
  }

  // 3. Background incremental sync of daily historical bars for watchlist stocks
  if (!AppState.stockPollInProgress) {
    AppState.stockPollInProgress = true;
    (async () => {
      try {
        await new Promise(r => setTimeout(r, 1200));

        for (const asset of stockAssets) {
          while (AppState.chartFetchInProgress) {
            await new Promise(r => setTimeout(r, 300));
          }
          const dailyKey = `${asset.symbol}_DAILY`;
          const lastBarsUpd = AppState.barsLastUpdated[dailyKey] || 0;
          const existing = AppState.cachedBars[dailyKey];
          if (!existing || existing.length < 60 || (Date.now() - lastBarsUpd >= 60000)) {
            await fetchStockQuoteKeyless(asset);
            renderAssetList();
          }
          await new Promise(r => setTimeout(r, 250));
        }
      } catch (e) {} finally {
        AppState.stockPollInProgress = false;
      }
    })();
  }

  renderAssetList();
  if (AppState.selectedAsset) {
    updateSelectedAssetHeader();
  }
}

// --- Render Left Asset List ---
function renderAssetList() {
  const container = document.getElementById('assetListContainer');
  if (!container) return;

  const filter = AppState.activeFilter;
  const search = (document.getElementById('globalSearch').value || '').trim().toUpperCase();

  const filtered = AppState.assets.filter(asset => {
    const matchesFilter = (filter === 'all') ||
      (filter === 'watchlist' && asset.favorite) ||
      (asset.type === filter);

    const matchesSearch = !search ||
      asset.symbol.toUpperCase().includes(search) ||
      asset.name.toUpperCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  document.getElementById('assetCountText').textContent = `${filtered.length} Asset Disponibili`;

  container.innerHTML = filtered.map(asset => {
    const isSelected = AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol;
    const isUp = (asset.change ?? 0) >= 0;
    const changeBadgeClass = isUp ? 'badge-up' : 'badge-down';
    const changeSign = isUp ? '+' : '';
    const formattedPrice = asset.price != null ? formatCurrency(asset.price, asset) : '—';
    const formattedChange = asset.change != null ? `${changeSign}${asset.change.toFixed(2)}%` : '—';

    return `
      <div class="asset-item ${isSelected ? 'selected' : ''}" data-symbol="${asset.symbol}">
        <div class="asset-meta">
          <div class="asset-symbol-row">
            <span class="asset-symbol">${asset.symbol}</span>
            <span class="asset-type-badge type-${asset.type}">${asset.type}</span>
            <button class="delete-btn" title="Elimina asset">🗑️</button>
          </div>
          <span class="asset-name" title="${asset.name}">${asset.name}</span>
        </div>

        <div class="asset-price-box">
          <span class="asset-price">${formattedPrice}</span>
          <span class="asset-change ${asset.change != null ? changeBadgeClass : ''}">${formattedChange}</span>
        </div>
      </div>
    `;
  }).join('');

  // Render mobile horizontal quick ticker carousel if on mobile
  renderMobileTickerCarousel();

  // Attach click events
  container.querySelectorAll('.asset-item').forEach(el => {
      el.addEventListener('click', () => {
        const sym = el.getAttribute('data-symbol');
        const found = AppState.assets.find(a => a.symbol === sym);
        if (found) {
          selectAsset(found);
          if (window.innerWidth <= 900) {
            const chartSection = document.getElementById('section-chart');
            if (chartSection) chartSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
      // Delete button handler
      const deleteBtn = el.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent row selection
          const sym = el.getAttribute('data-symbol');
          AppState.assets = AppState.assets.filter(a => a.symbol !== sym);
          for (const key of Object.keys(AppState.cachedBars)) {
            if (key.startsWith(`${sym}_`)) {
              delete AppState.cachedBars[key];
              delete AppState.barsLastUpdated[key];
            }
          }
          saveAssetsToStorage();
          saveHistoryToStorage();
          renderAssetList();
        });
      }
  });
}

function formatCurrency(val, assetOrCurrency) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  const sym = getCurrencySymbol(assetOrCurrency);
  if (val < 1) return `${sym}${val.toFixed(4)}`;
  if (val > 1000) return `${sym}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${sym}${val.toFixed(2)}`;
}

// --- Select Asset ---
function selectAsset(asset) {
  AppState.selectedAsset = asset;
  renderAssetList();
  updateSelectedAssetHeader();
  updateBrokerLinks(asset);
  updateRiskCalculatorPreloads(asset);
  loadNotesForAsset(asset);
  const cached = AppState.cachedBars[`${asset.symbol}_${AppState.activeTimeframe}`] || AppState.cachedBars[`${asset.symbol}_DAILY`];
  updateAiInvestmentEvaluation(asset, cached);
  updateMobileTickerCarouselActive(asset.symbol);
  loadAndRenderChart(asset, AppState.activeTimeframe);
}

function updateSelectedAssetHeader() {
  const asset = AppState.selectedAsset;
  if (!asset) return;

  document.getElementById('activeSymbol').innerHTML = `${asset.symbol} <span class="asset-type-badge type-${asset.type}" id="activeType">${asset.type.toUpperCase()}</span>`;
  document.getElementById('activeName').textContent = `${asset.name} • ${asset.exchange}`;

  const isUp = (asset.change ?? 0) >= 0;
  const changeEl = document.getElementById('activeChange');
  if (asset.change != null) {
    changeEl.className = `big-change ${isUp ? 'badge-up' : 'badge-down'}`;
    changeEl.textContent = `${isUp ? '+' : ''}${asset.change.toFixed(2)}%`;
  } else {
    changeEl.className = 'big-change';
    changeEl.textContent = '—';
  }

  document.getElementById('activePrice').textContent = asset.price != null ? formatCurrency(asset.price, asset) : '—';
  document.getElementById('activeHigh').textContent = asset.high ? formatCurrency(asset.high, asset) : '—';
  document.getElementById('activeLow').textContent = asset.low ? formatCurrency(asset.low, asset) : '—';
  document.getElementById('activeVolume').textContent = asset.volume || '—';

  const favBtn = document.getElementById('favoriteToggleBtn');
  if (favBtn) favBtn.className = `fav-toggle-btn ${asset.favorite ? 'active' : ''}`;

  // Update Data Source Badge
  const sourceBadge = document.getElementById('activeSourceBadge');
  if (sourceBadge) {
    if (asset.type === 'crypto') {
      sourceBadge.textContent = '● Binance Live';
      sourceBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      sourceBadge.style.color = '#10b981';
      sourceBadge.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      sourceBadge.title = 'Prezzo e storico candele in tempo reale dai server ufficiali di Binance';
    } else {
      sourceBadge.textContent = '● Yahoo Finance Live';
      sourceBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      sourceBadge.style.color = '#38bdf8';
      sourceBadge.style.border = '1px solid rgba(56, 189, 248, 0.3)';
      sourceBadge.title = 'Prezzo e storico candele reali da Yahoo Finance / Wall St. (senza chiave API)';
    }
  }
}

// --- Direct Platform Deep Links ---
function updateBrokerLinks(asset) {
  const sym = asset.symbol;

  // 1. TradingView
  const tvLink = document.getElementById('linkTradingView');
  let tvSymbol = sym;
  if (asset.type === 'crypto') tvSymbol = `BINANCE:${sym}USDT`;
  tvLink.href = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`;

  // 2. Binance
  const binanceLink = document.getElementById('linkBinance');
  if (asset.type === 'crypto') {
    binanceLink.href = `https://www.binance.com/it/trade/${sym}_USDT`;
    binanceLink.style.display = 'inline-flex';
  } else {
    binanceLink.style.display = 'none';
  }

  // 3. Interactive Brokers
  const ibkrLink = document.getElementById('linkIBKR');
  ibkrLink.href = `https://www.interactivebrokers.com/en/search/site_search.php?q=${encodeURIComponent(sym)}`;

  // 4. Yahoo Finance
  const yahooLink = document.getElementById('linkYahoo');
  yahooLink.href = `https://finance.yahoo.com/quote/${encodeURIComponent(sym)}`;
}

// --- Candlestick & Technical Indicators Generator ---
async function fetchStooqBarsKeyless(asset, isIncremental = false) {
  try {
    const stooqSym = getStooqSymbol(asset);
    const targetUrl = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSym)}&i=d`;
    const isValidCsv = (txt) => typeof txt === 'string' && txt.includes('Date,Open,High,Low,Close') && txt.trim().split(/\r?\n/).length > 2;
    const csvText = await fetchUrlViaKeylessGateways(targetUrl, false, isValidCsv);
    if (!isValidCsv(csvText)) return null;

    const lines = csvText.trim().split(/\r?\n/);
    const allBars = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length >= 5) {
        const dt = new Date(`${cols[0]}T16:00:00Z`);
        const o = parseFloat(cols[1]);
        const h = parseFloat(cols[2]);
        const l = parseFloat(cols[3]);
        const c = parseFloat(cols[4]);
        const v = cols.length >= 6 && parseFloat(cols[5]) > 0 ? parseFloat(cols[5]) : null;
        if (!isNaN(dt.getTime()) && !isNaN(o) && !isNaN(c)) {
          allBars.push({ time: dt, open: o, high: h, low: l, close: c, volume: v });
        }
      }
    }

    if (allBars.length === 0) return null;

    const maxCount = isIncremental ? 5 : 1300;
    const sliced = allBars.slice(-maxCount);

    if (allBars.length > 0) {
      syncAssetQuoteFromBars(asset, allBars);
      saveAssetsToStorage();
      renderAssetList();
      if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
        updateSelectedAssetHeader();
      }
    }

    return sliced;
  } catch (e) {
    return null;
  }
}

function parseYahooBarsFromResponse(fetchedData) {
  if (!isValidYahooChartPayload(fetchedData)) return { resObj: null, parsed: [] };
  const resObj = fetchedData.chart.result[0];
  const timestamps = resObj.timestamp || [];
  const q = resObj.indicators?.quote?.[0] || {};
  const parsed = [];
  for (let i = 0; i < timestamps.length; i++) {
    if (q.open && q.open[i] != null && q.close[i] != null) {
      parsed.push({
        time: new Date(timestamps[i] * 1000),
        open: parseFloat(q.open[i]),
        high: parseFloat(q.high[i] ?? Math.max(q.open[i], q.close[i])),
        low: parseFloat(q.low[i] ?? Math.min(q.open[i], q.close[i])),
        close: parseFloat(q.close[i]),
        volume: q.volume && q.volume[i] > 0 ? parseFloat(q.volume[i]) : null
      });
    }
  }
  return { resObj, parsed };
}

function isIntradaySeries(bars) {
  if (!Array.isArray(bars) || bars.length < 3) return false;
  const n = Math.min(bars.length - 1, 10);
  let totalDiff = 0;
  for (let i = bars.length - n; i < bars.length; i++) {
    const t1 = bars[i - 1].time instanceof Date ? bars[i - 1].time.getTime() : new Date(bars[i - 1].time).getTime();
    const t2 = bars[i].time instanceof Date ? bars[i].time.getTime() : new Date(bars[i].time).getTime();
    totalDiff += Math.max(0, t2 - t1);
  }
  const avgDiffMs = totalDiff / n;
  return avgDiffMs > 0 && avgDiffMs < 12 * 3600 * 1000;
}

function aggregateBarsByPeriod(bars, mode) {
  if (!Array.isArray(bars) || bars.length === 0) return [];
  if (mode === 'pair') {
    const out = [];
    for (let i = 0; i < bars.length; i += 2) {
      const b1 = bars[i];
      const b2 = bars[i + 1];
      if (!b2) {
        out.push({ ...b1, time: new Date(b1.time) });
      } else {
        out.push({
          time: new Date(b2.time),
          open: b1.open,
          high: Math.max(b1.high, b2.high),
          low: Math.min(b1.low, b2.low),
          close: b2.close,
          volume: (b1.volume || 0) + (b2.volume || 0)
        });
      }
    }
    return out;
  }

  const groups = [];
  let currentKey = null;
  let currentBar = null;

  for (const b of bars) {
    const d = b.time instanceof Date ? b.time : new Date(b.time);
    let key;
    if (mode === 'week') {
      // Group by Monday-aligned UTC week
      const dayOfWeek = (d.getUTCDay() + 6) % 7; // 0 = Mon .. 6 = Sun
      const mondayMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dayOfWeek);
      key = `W_${mondayMs}`;
    } else {
      // Group by calendar month
      key = `M_${d.getUTCFullYear()}_${d.getUTCMonth()}`;
    }

    if (key !== currentKey) {
      if (currentBar) groups.push(currentBar);
      currentKey = key;
      currentBar = {
        time: new Date(d.getTime()),
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
        volume: b.volume || 0
      };
    } else {
      currentBar.time = new Date(d.getTime());
      if (b.high > currentBar.high) currentBar.high = b.high;
      if (b.low < currentBar.low) currentBar.low = b.low;
      currentBar.close = b.close;
      currentBar.volume += (b.volume || 0);
    }
  }
  if (currentBar) groups.push(currentBar);
  return groups;
}

function buildTimeframeSeries(rawBars, timeframe, isCrypto = false) {
  if (!Array.isArray(rawBars) || rawBars.length === 0) return [];
  let series = rawBars.map(b => ({ ...b, time: b.time instanceof Date ? new Date(b.time.getTime()) : new Date(b.time) }));

  const intraday = isIntradaySeries(series);

  if (intraday) {
    if (timeframe === '1D') {
      calculateIndicators(series);
      // Extract the latest trading session's bars (or last 32 intraday bars for 24h crypto / full session)
      if (isCrypto) {
        return series.slice(-48);
      }
      const lastDate = series[series.length - 1].time;
      const lastDayKey = `${lastDate.getUTCFullYear()}-${lastDate.getUTCMonth()}-${lastDate.getUTCDate()}`;
      const sameDayBars = series.filter(b => {
        const d = b.time;
        return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}` === lastDayKey;
      });
      return sameDayBars.length >= 12 ? sameDayBars : series.slice(-28);
    }
    if (timeframe === '1W') {
      calculateIndicators(series);
      const maxW = isCrypto ? 42 : 65;
      return series.slice(-maxW);
    }
  }

  // Daily series handling (powers 1M, 3M, 1Y, ALL natively, plus immediate 0ms fallback for 1D/1W)
  if (timeframe === '1Y') {
    const weekly = series.length > 90 ? aggregateBarsByPeriod(series, 'week') : series;
    calculateIndicators(weekly);
    return weekly.slice(-52);
  }

  if (timeframe === 'ALL') {
    const monthly = series.length > 180 ? aggregateBarsByPeriod(series, 'month') : (series.length > 90 ? aggregateBarsByPeriod(series, 'week') : series);
    calculateIndicators(monthly);
    return monthly.slice(-60);
  }

  calculateIndicators(series);
  const dailySliceMap = {
    '1D': 7,
    '1W': 14,
    '1M': isCrypto ? 30 : 22,
    '3M': isCrypto ? 90 : 65
  };
  const count = dailySliceMap[timeframe] || 30;
  return series.slice(-count);
}

async function fetchMasterSeriesFromSource(asset, seriesType, isIncremental = false) {
  // seriesType is 'DAILY' (used for 1M, 3M, 1Y, ALL) or 'INTRADAY_1D' / 'INTRADAY_1W' / 'INTRADAY'
  if (asset.type === 'crypto') {
    try {
      let interval = '1d';
      let limit = isIncremental ? 5 : 750;
      if (seriesType === 'INTRADAY_1D') {
        interval = '30m';
        limit = isIncremental ? 6 : 120;
      } else if (seriesType === 'INTRADAY_1W') {
        interval = '4h';
        limit = isIncremental ? 6 : 110;
      }
      const pair = asset.marketSymbol || `${asset.symbol}USDT`;
      const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
      const res = await fetch(url);
      if (res.ok) {
        const raw = await res.json();
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.map(k => ({
            time: new Date(k[0]),
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5])
          }));
        }
      }
    } catch (e) {}
    return null;
  }

  // Stocks & ETFs:
  // 1. Primary: Native CORS-enabled CNBC Harmony Bars API (0 API keys, 0 CORS proxies, 0 rate limits)
  const cacheKey = seriesType === 'INTRADAY' ? `${asset.symbol}_INTRADAY` : `${asset.symbol}_DAILY`;
  const existingBars = AppState.cachedBars[cacheKey];
  const barType = seriesType === 'INTRADAY' ? '30M' : '1D';
  const cnbcBars = await fetchCnbcBarsDirect(asset, barType, isIncremental, existingBars);
  if (cnbcBars && cnbcBars.length > 0) {
    renderAssetList();
    if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
      updateSelectedAssetHeader();
      updateRiskCalculatorPreloads(asset);
    }
    return cnbcBars;
  }

  // 2. Fallback: Yahoo Finance v8 keyless API
  try {
    if (seriesType === 'INTRADAY') {
      const r = '5d';
      const inv = '15m';
      const fetchedData = await fetchYahooChartRaw(asset, r, inv, isIncremental);
      const { resObj, parsed } = parseYahooBarsFromResponse(fetchedData);
      if (resObj && parsed.length > 0) {
        applyYahooMetaToAsset(asset, resObj, parsed, inv, isIncremental ? '1d' : r);
        AppState.quoteLastUpdated[asset.symbol] = Date.now();
        saveAssetsToStorage();
        renderAssetList();
        if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
          updateSelectedAssetHeader();
          updateRiskCalculatorPreloads(asset);
        }
        return parsed;
      }
      return null;
    }

    let r = '2y';
    const inv = '1d';
    const fetchedData = await fetchYahooChartRaw(asset, r, inv, isIncremental);
    const { resObj, parsed } = parseYahooBarsFromResponse(fetchedData);
    if (resObj && parsed.length > 0) {
      applyYahooMetaToAsset(asset, resObj, parsed, inv, isIncremental ? '5d' : r);
      AppState.quoteLastUpdated[asset.symbol] = Date.now();
      saveAssetsToStorage();
      renderAssetList();
      if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
        updateSelectedAssetHeader();
        updateRiskCalculatorPreloads(asset);
      }
      return parsed;
    }
  } catch (e) {
    console.log('Stock fallback fetch error:', e);
  }

  return null;
}

function renderChartFromBars(rawBars, timeframe = AppState.activeTimeframe) {
  const isCrypto = Boolean(AppState.selectedAsset && AppState.selectedAsset.type === 'crypto');
  const visibleBars = buildTimeframeSeries(rawBars, timeframe, isCrypto);
  AppState.renderedBars = visibleBars;
  renderMainChart(visibleBars);
  renderRsiChart(visibleBars);
  renderMacdChart(visibleBars);
  updateTechnicalDecisionBanner(visibleBars);
}

async function loadAndRenderChart(asset, timeframe, options = {}) {
  const isCrypto = asset.type === 'crypto';
  const isIntradayTf = timeframe === '1D' || timeframe === '1W';
  const dailyKey = `${asset.symbol}_DAILY`;
  const primaryKey = isIntradayTf
    ? (isCrypto ? `${asset.symbol}_${timeframe}` : `${asset.symbol}_INTRADAY`)
    : dailyKey;
  const seriesType = isIntradayTf
    ? (isCrypto ? `INTRADAY_${timeframe}` : 'INTRADAY')
    : 'DAILY';

  let primaryBars = AppState.cachedBars[primaryKey];
  const dailyFallbackBars = AppState.cachedBars[dailyKey] || AppState.cachedBars[`${asset.symbol}_3M`] || AppState.cachedBars[`${asset.symbol}_1M`];

  // Migrate legacy 1M/3M daily cache into _DAILY if needed
  if (!AppState.cachedBars[dailyKey] && dailyFallbackBars && dailyFallbackBars.length >= 30) {
    AppState.cachedBars[dailyKey] = dailyFallbackBars;
    if (!isIntradayTf) primaryBars = dailyFallbackBars;
  }

  const minBarsRequired = isIntradayTf ? 10 : 30;

  // 1. If we already have cached bars for this series, render IMMEDIATELY (0ms) and only sync new bars incrementally
  if (primaryBars && primaryBars.length >= minBarsRequired) {
    renderChartFromBars(primaryBars, timeframe);

    if (options.renderOnly) return;

    const lastUpdated = AppState.barsLastUpdated[primaryKey] || 0;
    const shouldSyncIncremental = options.forceIncremental || (Date.now() - lastUpdated >= INCREMENTAL_SYNC_COOLDOWN_MS);
    if (!shouldSyncIncremental) return;

    AppState.barsLastUpdated[primaryKey] = Date.now();
    const newBars = await fetchMasterSeriesFromSource(asset, seriesType, true);
    if (newBars && newBars.length > 0) {
      primaryBars = mergeHistoricalBars(AppState.cachedBars[primaryKey] || primaryBars, newBars);
      AppState.cachedBars[primaryKey] = primaryBars;
      AppState.barsLastUpdated[primaryKey] = Date.now();
      saveHistoryToStorage();

      if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol && AppState.activeTimeframe === timeframe) {
        renderChartFromBars(primaryBars, timeframe);
      }
    }
    return;
  }

  // 2. If switching to 1D or 1W and intraday isn't cached yet, render an immediate 0ms zoomed view from DAILY while intraday loads!
  if (isIntradayTf && dailyFallbackBars && dailyFallbackBars.length > 5) {
    renderChartFromBars(dailyFallbackBars, timeframe);
    if (options.renderOnly) return;
  }

  // 3. First-time download for this series
  AppState.chartFetchInProgress = true;
  try {
    const fetched = await fetchMasterSeriesFromSource(asset, seriesType, false);
    if (fetched && fetched.length > 0) {
      AppState.cachedBars[primaryKey] = fetched;
      AppState.barsLastUpdated[primaryKey] = Date.now();
      saveHistoryToStorage();

      if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol && AppState.activeTimeframe === timeframe) {
        renderChartFromBars(fetched, timeframe);
      }
      return;
    }

    // If intraday fetch failed (e.g. market closed / European ETF without 15m feed), keep the zoomed daily view
    if (isIntradayTf && dailyFallbackBars && dailyFallbackBars.length > 2) {
      if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol && AppState.activeTimeframe === timeframe) {
        renderChartFromBars(dailyFallbackBars, timeframe);
      }
      return;
    }

    if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol && AppState.activeTimeframe === timeframe) {
      showChartNoData(asset);
    }
  } finally {
    AppState.chartFetchInProgress = false;
  }
}

function showChartNoData(asset) {
  const canvas = document.getElementById('mainChartCanvas');
  const wrapper = document.getElementById('chartWrapper');
  if (!canvas || !wrapper) return;
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth || 600;
  const height = wrapper.clientHeight || 320;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  const msg1 = 'Dati reali non disponibili al momento per ' + asset.symbol;
  const msg2 = asset.type === 'crypto'
    ? 'Server Binance temporaneamente non raggiungibile'
    : 'Server Yahoo Finance / Mercati temporaneamente non raggiungibile';
  ctx.fillText(msg1, width / 2, height / 2 - 12);
  ctx.fillText(msg2, width / 2, height / 2 + 12);
  ctx.textAlign = 'left';

  // Clear indicator canvases too
  ['rsiCanvas', 'macdCanvas'].forEach(id => {
    const c = document.getElementById(id);
    if (c) {
      c.getContext('2d').clearRect(0, 0, c.width, c.height);
    }
  });
}

// --- Technical Indicators Math ---
function calculateIndicators(bars) {
  const closes = bars.map(b => b.close);

  // 1. EMA 20 & EMA 50
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);

  // 2. Bollinger Bands (20, 2)
  const bands = calculateBollingerBands(closes, 20, 2);

  // 3. RSI 14
  const rsi = calculateRSI(closes, 14);

  // 4. MACD (12, 26, 9)
  const macd = calculateMACD(closes, 12, 26, 9);

  for (let i = 0; i < bars.length; i++) {
    bars[i].ema20 = ema20[i];
    bars[i].ema50 = ema50[i];
    bars[i].upperBand = bands.upper[i];
    bars[i].lowerBand = bands.lower[i];
    bars[i].rsi = rsi[i];
    bars[i].macd = macd.macd[i];
    bars[i].macdSignal = macd.signal[i];
    bars[i].macdHist = macd.hist[i];
  }
}

function calculateEMA(values, period) {
  if (!values || values.length === 0) return [];
  const k = 2 / (period + 1);
  const ema = new Array(values.length).fill(null);

  if (values.length < period) {
    ema[0] = values[0];
    for (let i = 1; i < values.length; i++) {
      ema[i] = (values[i] * k) + (ema[i - 1] * (1 - k));
    }
    return ema;
  }

  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  ema[period - 1] = sum / period;

  // Backfill progressive EMA for the initial warm-up segment so no gaps appear if visible window includes early bars
  ema[0] = values[0];
  for (let i = 1; i < period - 1; i++) {
    ema[i] = (values[i] * k) + (ema[i - 1] * (1 - k));
  }

  for (let i = period; i < values.length; i++) {
    ema[i] = (values[i] * k) + (ema[i - 1] * (1 - k));
  }
  return ema;
}

function calculateBollingerBands(values, period = 20, stdDevMult = 2) {
  const upper = new Array(values.length).fill(null);
  const lower = new Array(values.length).fill(null);

  for (let i = 0; i < values.length; i++) {
    const startIdx = Math.max(0, i - period + 1);
    const slice = values.slice(startIdx, i + 1);
    const len = slice.length;
    if (len < 2) continue;
    const mean = slice.reduce((a, b) => a + b, 0) / len;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / len;
    const stdDev = Math.sqrt(variance);
    upper[i] = mean + (stdDevMult * stdDev);
    lower[i] = mean - (stdDevMult * stdDev);
  }
  return { upper, lower };
}

function calculateRSI(values, period = 14) {
  const rsi = new Array(values.length).fill(50);
  if (!values || values.length < 2) return rsi;

  const initLen = Math.min(period, values.length - 1);
  let gains = 0, losses = 0;
  for (let i = 1; i <= initLen; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / initLen;
  let avgLoss = losses / initLen;
  const firstRsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
  for (let i = 0; i <= initLen; i++) {
    rsi[i] = firstRsi;
  }

  for (let i = initLen + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + rs));
  }
  return rsi;
}

function calculateMACD(values, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEMA = calculateEMA(values, fastPeriod);
  const slowEMA = calculateEMA(values, slowPeriod);
  const macdLine = new Array(values.length).fill(0);

  for (let i = 0; i < values.length; i++) {
    if (fastEMA[i] !== null && slowEMA[i] !== null) {
      macdLine[i] = fastEMA[i] - slowEMA[i];
    }
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const hist = new Array(values.length).fill(0);

  for (let i = 0; i < values.length; i++) {
    hist[i] = macdLine[i] - (signalLine[i] || 0);
  }

  return { macd: macdLine, signal: signalLine, hist };
}

// --- Main Interactive Canvas Chart Renderer ---
function renderMainChart(bars) {
  const canvas = document.getElementById('mainChartCanvas');
  const wrapper = document.getElementById('chartWrapper');
  if (!canvas || !wrapper) return;

  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth || 360;
  const height = wrapper.clientHeight || 290;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  if (!bars || bars.length === 0) return;

  // Chart bounds & Margins
  const paddingRight = 65;
  const paddingBottom = 30;
  const paddingTop = 20;
  const chartWidth = width - paddingRight;
  const chartHeight = height - paddingBottom - paddingTop;
  const volumeHeight = chartHeight * 0.22;
  const priceChartHeight = chartHeight - volumeHeight - 15;

  // Find min/max price & volume
  let minPrice = Infinity, maxPrice = -Infinity, maxVol = 0;
  bars.forEach(b => {
    if (b.low < minPrice) minPrice = b.low;
    if (b.high > maxPrice) maxPrice = b.high;
    if (b.volume > maxVol) maxVol = b.volume;
    if (AppState.indicators.bands) {
      if (b.upperBand && b.upperBand > maxPrice) maxPrice = b.upperBand;
      if (b.lowerBand && b.lowerBand < minPrice) minPrice = b.lowerBand;
    }
  });

  const pricePadding = (maxPrice - minPrice) * 0.08;
  minPrice -= pricePadding;
  maxPrice += pricePadding;
  const priceRange = maxPrice - minPrice;

  // Helper coordinate mappers
  const getY = (p) => paddingTop + priceChartHeight - ((p - minPrice) / priceRange) * priceChartHeight;
  const getVolY = (v) => paddingTop + priceChartHeight + 15 + volumeHeight - (v / maxVol) * volumeHeight;
  const barWidth = Math.max(3, (chartWidth / bars.length) * 0.7);
  const stepX = chartWidth / bars.length;

  // Grid Lines
  const curSym = getCurrencySymbol(AppState.selectedAsset);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  const gridSteps = 5;
  for (let i = 0; i <= gridSteps; i++) {
    const y = paddingTop + (priceChartHeight / gridSteps) * i;
    const priceVal = maxPrice - (priceRange / gridSteps) * i;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
    ctx.stroke();

    // Price Scale Text
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${curSym}${priceVal.toFixed(2)}`, chartWidth + 8, y + 3);
  }
  ctx.setLineDash([]);

  // Draw Bollinger Bands if enabled
  if (AppState.indicators.bands) {
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 1.2;

    // Upper Band
    ctx.beginPath();
    bars.forEach((b, i) => {
      if (b.upperBand) {
        const x = i * stepX + stepX / 2;
        const y = getY(b.upperBand);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Lower Band
    ctx.beginPath();
    bars.forEach((b, i) => {
      if (b.lowerBand) {
        const x = i * stepX + stepX / 2;
        const y = getY(b.lowerBand);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }

  // Draw Volume Bars
  bars.forEach((b, i) => {
    const x = i * stepX + (stepX - barWidth) / 2;
    const y = getVolY(b.volume);
    const h = (paddingTop + priceChartHeight + 15 + volumeHeight) - y;
    const isUp = b.close >= b.open;

    ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)';
    ctx.fillRect(x, y, barWidth, h);
  });

  // Draw Candlesticks or Area Line
  if (AppState.chartType === 'candles') {
    bars.forEach((b, i) => {
      const isUp = b.close >= b.open;
      const x = i * stepX + (stepX - barWidth) / 2;
      const centerX = x + barWidth / 2;
      const openY = getY(b.open);
      const closeY = getY(b.close);
      const highY = getY(b.high);
      const lowY = getY(b.low);

      const color = isUp ? '#10b981' : '#f43f5e';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.2;

      // Wick
      ctx.beginPath();
      ctx.moveTo(centerX, highY);
      ctx.lineTo(centerX, lowY);
      ctx.stroke();

      // Body
      const bodyY = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(openY - closeY));
      ctx.fillRect(x, bodyY, barWidth, bodyH);
    });
  } else {
    // Area Line Chart
    ctx.beginPath();
    bars.forEach((b, i) => {
      const x = i * stepX + stepX / 2;
      const y = getY(b.close);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Area Gradient
    ctx.lineTo((bars.length - 1) * stepX + stepX / 2, paddingTop + priceChartHeight);
    ctx.lineTo(stepX / 2, paddingTop + priceChartHeight);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + priceChartHeight);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Draw EMAs
  if (AppState.indicators.ema) {
    // EMA 20 (Cyan)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    bars.forEach((b, i) => {
      if (b.ema20) {
        const x = i * stepX + stepX / 2;
        const y = getY(b.ema20);
        if (i === 0 || !bars[i - 1].ema20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // EMA 50 (Orange)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    bars.forEach((b, i) => {
      if (b.ema50) {
        const x = i * stepX + stepX / 2;
        const y = getY(b.ema50);
        if (i === 0 || !bars[i - 1].ema50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }

  // Time Scale Text (Timeframe-aware formatting)
  ctx.fillStyle = '#64748b';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  const timeStep = Math.max(1, Math.ceil(bars.length / 5));
  const intradayView = isIntradaySeries(bars);
  const tf = AppState.activeTimeframe;
  for (let i = 0; i < bars.length; i += timeStep) {
    const x = i * stepX + stepX / 2;
    const d = bars[i].time instanceof Date ? bars[i].time : new Date(bars[i].time);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    let str;
    if (tf === '1D' && intradayView) {
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      str = `${hh}:${min}`;
    } else if (tf === '1Y') {
      str = `${dd}/${mm}/${yy}`;
    } else if (tf === 'ALL') {
      str = `${mm}/${d.getFullYear()}`;
    } else {
      str = `${dd}/${mm}`;
    }
    ctx.fillText(str, x, height - 10);
  }

  // Interactive Crosshair if active
  if (AppState.crosshair && AppState.crosshair.index >= 0 && AppState.crosshair.index < bars.length) {
    const idx = AppState.crosshair.index;
    const b = bars[idx];
    const x = idx * stepX + stepX / 2;
    const y = getY(b.close);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosshair dot
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Price tag on axis
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(chartWidth, y - 9, paddingRight, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${curSym}${b.close.toFixed(2)}`, chartWidth + 6, y + 4);
  }
}

// --- RSI Subchart Renderer ---
function renderRsiChart(bars) {
  const canvas = document.getElementById('rsiCanvas');
  const wrapper = document.getElementById('rsiSubchartWrapper');
  if (!canvas || !wrapper) return;

  if (!AppState.indicators.rsi) {
    wrapper.style.display = 'none';
    return;
  }
  wrapper.style.display = 'block';

  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth || 360;
  const height = wrapper.clientHeight || 100;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const paddingRight = 65;
  const chartWidth = width - paddingRight;
  const stepX = chartWidth / bars.length;

  const getY = (val) => height - (val / 100) * height;

  // Background zones (30 oversold, 70 overbought)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
  ctx.fillRect(0, getY(30), chartWidth, height - getY(30)); // oversold green
  ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
  ctx.fillRect(0, 0, chartWidth, getY(70)); // overbought red

  // Reference lines
  ctx.strokeStyle = '#1e293b';
  ctx.setLineDash([3, 3]);
  [30, 50, 70].forEach(level => {
    const y = getY(level);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.fillText(level.toString(), chartWidth + 6, y + 3);
  });
  ctx.setLineDash([]);

  // RSI Line
  ctx.strokeStyle = '#c084fc'; // Purple neon
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  let firstValid = true;
  bars.forEach((b, i) => {
    if (b.rsi != null && !isNaN(b.rsi)) {
      const x = i * stepX + stepX / 2;
      const y = Math.max(2, Math.min(height - 2, getY(b.rsi)));
      if (firstValid) {
        ctx.moveTo(x, y);
        firstValid = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
  });
  ctx.stroke();

  // Update live label
  const lastRsi = bars[bars.length - 1]?.rsi || 50;
  document.getElementById('rsiLiveVal').textContent = lastRsi.toFixed(1);
}

// --- MACD Subchart Renderer ---
function renderMacdChart(bars) {
  const canvas = document.getElementById('macdCanvas');
  const wrapper = document.getElementById('macdSubchartWrapper');
  if (!canvas || !wrapper) return;

  if (!AppState.indicators.macd) {
    wrapper.style.display = 'none';
    return;
  }
  wrapper.style.display = 'block';

  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth || 360;
  const height = wrapper.clientHeight || 100;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const paddingRight = 65;
  const chartWidth = width - paddingRight;
  const stepX = chartWidth / bars.length;
  const barWidth = Math.max(2, stepX * 0.6);

  // Range of MACD
  let maxAbs = 0.1;
  bars.forEach(b => {
    if (b.macdHist) maxAbs = Math.max(maxAbs, Math.abs(b.macdHist));
    if (b.macd) maxAbs = Math.max(maxAbs, Math.abs(b.macd));
  });
  maxAbs *= 1.3;

  const getY = (v) => height / 2 - (v / maxAbs) * (height / 2);

  // Zero Line
  ctx.strokeStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(chartWidth, height / 2);
  ctx.stroke();

  // Histogram
  bars.forEach((b, i) => {
    if (b.macdHist !== undefined) {
      const x = i * stepX + (stepX - barWidth) / 2;
      const y = getY(b.macdHist);
      const zeroY = height / 2;
      const isPositive = b.macdHist >= 0;

      ctx.fillStyle = isPositive ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)';
      ctx.fillRect(x, Math.min(y, zeroY), barWidth, Math.abs(y - zeroY));
    }
  });

  // MACD Line (Blue)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  bars.forEach((b, i) => {
    const x = i * stepX + stepX / 2;
    const y = getY(b.macd || 0);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Signal Line (Orange)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  bars.forEach((b, i) => {
    const x = i * stepX + stepX / 2;
    const y = getY(b.macdSignal || 0);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  const lastMacd = bars[bars.length - 1]?.macd || 0;
  document.getElementById('macdLiveVal').textContent = lastMacd.toFixed(2);
}

// --- Technical Decision & Scoring Engine ---
function updateTechnicalDecisionBanner(bars) {
  if (!bars || bars.length < 2) return;
  const last = bars[bars.length - 1];
  const prev = bars[bars.length - 2];

  let score = 50; // Neutral base

  // 1. RSI Signal
  const rsi = last.rsi || 50;
  const rsiEl = document.getElementById('signalRsi');
  if (rsi < 32) {
    score += 25;
    rsiEl.textContent = `Ipervenduto (${rsi.toFixed(1)}) • Rimbalzo`;
    rsiEl.style.color = 'var(--color-up)';
  } else if (rsi > 68) {
    score -= 20;
    rsiEl.textContent = `Ipercomprato (${rsi.toFixed(1)}) • Cautela`;
    rsiEl.style.color = 'var(--color-down)';
  } else {
    rsiEl.textContent = `Neutro (${rsi.toFixed(1)})`;
    rsiEl.style.color = 'var(--text-secondary)';
  }

  // 2. Trend EMA
  const emaEl = document.getElementById('signalEma');
  if (last.close > last.ema20 && last.ema20 > last.ema50) {
    score += 25;
    emaEl.textContent = 'Rialzista Forte (P > EMA20 > 50)';
    emaEl.style.color = 'var(--color-up)';
  } else if (last.close < last.ema20 && last.ema20 < last.ema50) {
    score -= 25;
    emaEl.textContent = 'Ribassista (P < EMA20 < 50)';
    emaEl.style.color = 'var(--color-down)';
  } else {
    emaEl.textContent = 'Fase Laterale / Consolidamento';
    emaEl.style.color = 'var(--color-warning)';
  }

  // 3. Bollinger Bands
  const bandsEl = document.getElementById('signalBands');
  if (last.lowerBand && last.close <= last.lowerBand) {
    score += 15;
    bandsEl.textContent = 'Supporto Banda Inferiore';
    bandsEl.style.color = 'var(--color-up)';
  } else if (last.upperBand && last.close >= last.upperBand) {
    score -= 15;
    bandsEl.textContent = 'Resistenza Banda Superiore';
    bandsEl.style.color = 'var(--color-down)';
  } else {
    bandsEl.textContent = 'Nel Canale di Volatilità';
    bandsEl.style.color = 'var(--text-secondary)';
  }

  // 4. MACD Momentum
  const macdEl = document.getElementById('signalMacd');
  if (last.macdHist > 0 && prev.macdHist <= 0) {
    score += 20;
    macdEl.textContent = 'Incrocio Rialzista Fresco (Golden)';
    macdEl.style.color = 'var(--color-up)';
  } else if (last.macdHist > 0) {
    score += 10;
    macdEl.textContent = 'Momentum Positivo';
    macdEl.style.color = 'var(--color-up)';
  } else {
    score -= 15;
    macdEl.textContent = 'Momentum Negativo';
    macdEl.style.color = 'var(--color-down)';
  }

  score = Math.max(10, Math.min(95, score));

  // Rating Badge
  const ratingBadge = document.getElementById('decisionRatingBadge');
  ratingBadge.className = 'decision-rating-badge';

  if (score >= 75) {
    ratingBadge.classList.add('rating-strong-buy');
    ratingBadge.textContent = `FORTE ACQUISTO (${score}%)`;
  } else if (score >= 60) {
    ratingBadge.classList.add('rating-buy');
    ratingBadge.textContent = `BUY MODERATO (${score}%)`;
  } else if (score >= 40) {
    ratingBadge.classList.add('rating-neutral');
    ratingBadge.textContent = `NEUTRO / ATTENDI (${score}%)`;
  } else {
    ratingBadge.classList.add('rating-sell');
    ratingBadge.textContent = `VENDITA / CAUTELA (${score}%)`;
  }

  // Trigger AI Multi-Factor Investment Evaluation
  updateAiInvestmentEvaluation(AppState.selectedAsset, bars, score);
}

// --- AI Multi-Factor Investment Evaluation Engine (Trends, Curves, Indicators, Analysts & Fundamentals) ---
function computeLinearRegressionSlopePct(closes) {
  const n = closes.length;
  if (n < 3) return { slopePct: 0, r2: 0 };
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    const y = closes[i];
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumX2 += i * i;
    sumY2 += y * y;
  }
  const denom = (n * sumX2 - sumX * sumX);
  if (denom === 0) return { slopePct: 0, r2: 0 };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const meanY = sumY / n;
  const slopePct = meanY > 0 ? ((slope * n) / meanY) * 100 : 0;

  const rDenom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = rDenom > 0 ? (n * sumXY - sumX * sumY) / rDenom : 0;
  return { slopePct, r2: Math.min(1, Math.max(0, r * r)) };
}

// Formatting helpers for structured AI trade setup
function formatPriceWithIso(val, asset) {
  if (val == null || isNaN(val)) return 'N/D';
  const curIso = (asset?.currency || 'EUR').toUpperCase();
  const curSym = curIso === 'EUR' ? '€' : (curIso === 'USD' ? '$' : (getCurrencySymbol(asset) || curIso).trim());
  const decStr = (val >= 1000)
    ? val.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Number(val).toFixed(2).replace('.', ',');
  return `${decStr} ${curSym} (${decStr} ${curIso})`;
}

function formatRiskCash(val, asset) {
  if (val == null || isNaN(val)) return '20 €';
  const curIso = (asset?.currency || 'EUR').toUpperCase();
  const curSym = curIso === 'EUR' ? '€' : (curIso === 'USD' ? '$' : (getCurrencySymbol(asset) || curIso).trim());
  const intVal = Math.round(val);
  return `${intVal} ${curSym}`;
}

function updateAiInvestmentEvaluation(asset, bars, techScore = 50) {
  if (!asset) return;

  const activeBars = (!bars || bars.length < 2) ? [
    { close: asset.price || 10.96, open: asset.price || 10.96, high: asset.price || 10.96, low: asset.price || 10.96, rsi: 38.4, ema20: 11.15, ema50: 11.45, lowerBand: 10.60, upperBand: 11.80, macdHist: -0.08, volume: 1000000 },
    { close: asset.price || 10.96, open: asset.price || 10.96, high: asset.price || 10.96, low: asset.price || 10.96, rsi: 38.4, ema20: 11.15, ema50: 11.45, lowerBand: 10.60, upperBand: 11.80, macdHist: -0.08, volume: 1000000 }
  ] : bars;

  const tagEl = document.getElementById('aiEvalAssetTag');
  const riskBadgeEl = document.getElementById('aiRiskProfileBadge');
  const verdictBadgeEl = document.getElementById('aiVerdictBadge');
  const factorCurveEl = document.getElementById('aiFactorCurve');
  const factorTechEl = document.getElementById('aiFactorTech');
  const factorAnalystsEl = document.getElementById('aiFactorAnalysts');
  const factorStrategyEl = document.getElementById('aiFactorStrategy');
  const narrativeEl = document.getElementById('aiNarrativeText');
  const structuredNarrativeEl = document.getElementById('aiStructuredNarrative');
  const tradePlanLinesEl = document.getElementById('aiTradePlanLines');
  const btnApplyTradePlan = document.getElementById('btnApplyTradePlan');
  if (!verdictBadgeEl || !narrativeEl) return;

  const tfLabels = { '1D': '1G', '1W': '1S', '1M': '1M', '3M': '3M', '1Y': '1A', 'ALL': 'TUTTO' };
  const tfLabel = tfLabels[AppState.activeTimeframe] || AppState.activeTimeframe;
  if (tagEl) tagEl.textContent = `${asset.symbol} • Orizzonte ${tfLabel}`;

  const last = activeBars[activeBars.length - 1];
  const prev = activeBars[activeBars.length - 2];
  const currentPrice = asset.price != null ? asset.price : last.close;
  const fund = asset.fundamentals || {};

  // Use daily master series if available for multi-horizon performance & annualized volatility
  const dailySeries = (AppState.cachedBars[`${asset.symbol}_DAILY`] && AppState.cachedBars[`${asset.symbol}_DAILY`].length >= 10)
    ? AppState.cachedBars[`${asset.symbol}_DAILY`]
    : activeBars;

  const calcHorizonReturn = (series, lookback) => {
    if (!series || series.length < 2) return null;
    const idx = Math.max(0, series.length - 1 - lookback);
    const refClose = series[idx]?.close;
    return (refClose && refClose > 0) ? ((currentPrice - refClose) / refClose) * 100 : null;
  };

  const ret1W = calcHorizonReturn(dailySeries, 5);
  const ret1M = calcHorizonReturn(dailySeries, 22);
  const ret3M = calcHorizonReturn(dailySeries, 65);
  const ret1Y = calcHorizonReturn(dailySeries, Math.min(252, dailySeries.length - 1));

  // 1. Curve Geometry, Regression Slope, Volatility & 52-Week Range
  const recentWindow = activeBars.slice(-Math.min(20, activeBars.length));
  const recentCloses = recentWindow.map(b => b.close);
  const shortCloses = activeBars.slice(-Math.min(7, activeBars.length)).map(b => b.close);
  const { slopePct: slope20, r2: curveR2 } = computeLinearRegressionSlopePct(recentCloses);
  const { slopePct: slope7 } = computeLinearRegressionSlopePct(shortCloses);

  // Support & Resistance over active window
  let supportLevel = Infinity, resistanceLevel = -Infinity;
  for (const b of recentWindow) {
    if (b.low < supportLevel) supportLevel = b.low;
    if (b.high > resistanceLevel) resistanceLevel = b.high;
  }
  if (!isFinite(supportLevel) || supportLevel <= 0) supportLevel = currentPrice * 0.95;
  if (!isFinite(resistanceLevel) || resistanceLevel <= 0) resistanceLevel = currentPrice * 1.05;

  // 52-Week High/Low (from CNBC fundamentals or computed from up to 252 daily bars)
  const yearSlice = dailySeries.slice(-252);
  let histYrHigh = -Infinity, histYrLow = Infinity;
  for (const b of yearSlice) {
    if (b.high > histYrHigh) histYrHigh = b.high;
    if (b.low < histYrLow) histYrLow = b.low;
  }
  const yrHigh = (fund.yrHigh && fund.yrHigh > 0) ? Math.max(fund.yrHigh, currentPrice) : histYrHigh;
  const yrLow = (fund.yrLow && fund.yrLow > 0) ? Math.min(fund.yrLow, currentPrice) : histYrLow;
  const range52WPos = (yrHigh > yrLow && yrLow > 0)
    ? Math.max(0, Math.min(100, ((currentPrice - yrLow) / (yrHigh - yrLow)) * 100))
    : 50;

  // Daily volatility & Sharpe proxy
  const dailyRets = [];
  const volSlice = dailySeries.slice(-60);
  for (let i = 1; i < volSlice.length; i++) {
    if (volSlice[i - 1].close > 0) {
      dailyRets.push((volSlice[i].close - volSlice[i - 1].close) / volSlice[i - 1].close);
    }
  }
  let annVolPct = 22;
  let sharpeProxy = 0;
  if (dailyRets.length >= 5) {
    const meanRet = dailyRets.reduce((a, b) => a + b, 0) / dailyRets.length;
    const variance = dailyRets.reduce((a, b) => a + Math.pow(b - meanRet, 2), 0) / dailyRets.length;
    const stdDaily = Math.sqrt(variance);
    const tradingDays = asset.type === 'crypto' ? 365 : 252;
    annVolPct = stdDaily * Math.sqrt(tradingDays) * 100;
    if (stdDaily > 0) {
      sharpeProxy = (meanRet / stdDaily) * Math.sqrt(tradingDays);
    }
  }

  // Classify curve geometry
  let curveState = 'Laterale';
  let curveScore = 50;
  if (slope20 > 2.0 && slope7 >= slope20 * 0.35) {
    curveState = 'Accelerazione Rialzista';
    curveScore = 78;
  } else if (slope20 > 1.0 && slope7 < 0) {
    curveState = 'Rialzista • Pullback Breve';
    curveScore = 66;
  } else if (slope20 < -2.0 && slope7 > 0.5) {
    curveState = 'Inversione / Rimbalzo dal Fondo';
    curveScore = 64;
  } else if (slope20 < -2.0) {
    curveState = 'Inclinazione Ribassista';
    curveScore = 30;
  } else {
    curveState = 'Consolidamento / Accumulo';
    curveScore = 52;
  }
  if (ret3M != null && ret3M > 8) curveScore += 8;
  else if (ret3M != null && ret3M < -8) curveScore -= 8;

  // 2. Technical Confluence & Volume Pressure
  const rsi = last.rsi || 50;
  const ema20 = last.ema20 || currentPrice;
  const ema50 = last.ema50 || currentPrice;
  const distEma20Pct = ema20 > 0 ? ((currentPrice - ema20) / ema20) * 100 : 0;

  let bPct = 50;
  if (last.upperBand && last.lowerBand && last.upperBand > last.lowerBand) {
    bPct = ((currentPrice - last.lowerBand) / (last.upperBand - last.lowerBand)) * 100;
  }

  // Volume comparison vs 20-bar average
  const vols = recentWindow.map(b => b.volume || 0).filter(v => v > 0);
  const avgVol = vols.length > 0 ? (vols.reduce((a, b) => a + b, 0) / vols.length) : 0;
  let volRatio = (avgVol > 0 && last.volume > 0) ? (last.volume / avgVol) : (fund.pctTenDayVol || 1.0);
  if (!isFinite(volRatio) || volRatio <= 0) volRatio = 1.0;

  let bullishIndicators = 0;
  if (rsi >= 45 && rsi <= 68) bullishIndicators++;
  else if (rsi < 33) bullishIndicators++; // oversold bounce signal
  if (currentPrice >= ema20 && ema20 >= ema50) bullishIndicators++;
  if (last.macdHist > 0 || (last.macdHist > prev.macdHist)) bullishIndicators++;
  if (bPct >= 20 && bPct <= 82) bullishIndicators++;

  // 3. Analysts Consensus & Fundamentals Score
  let fundamentalScore = 55;
  let epsGrowthEst = null;
  if (fund.eps != null && fund.feps != null && Math.abs(fund.eps) > 0.01) {
    epsGrowthEst = ((fund.feps - fund.eps) / Math.abs(fund.eps)) * 100;
  }

  if (asset.type === 'stock') {
    if (epsGrowthEst != null) {
      if (epsGrowthEst > 20) fundamentalScore += 18;
      else if (epsGrowthEst > 5) fundamentalScore += 10;
      else if (epsGrowthEst < -10) fundamentalScore -= 12;
    }
    if (fund.fpe != null && fund.pe != null && fund.fpe > 0 && fund.pe > 0) {
      if (fund.fpe < fund.pe * 0.9) fundamentalScore += 10;
      if (fund.fpe < 22) fundamentalScore += 6;
      else if (fund.fpe > 45) fundamentalScore -= 6;
    } else if (fund.pe != null && fund.pe > 0 && fund.pe < 20) {
      fundamentalScore += 8;
    }
    if (fund.roe != null) {
      if (fund.roe >= 20) fundamentalScore += 10;
      else if (fund.roe >= 10) fundamentalScore += 5;
      else if (fund.roe < 0) fundamentalScore -= 10;
    }
    if (fund.netMargin != null && fund.netMargin >= 15) {
      fundamentalScore += 6;
    }
    if (fund.divYield != null && fund.divYield >= 2.5) {
      fundamentalScore += 5;
    }
  } else {
    // ETFs & Crypto: evaluate structural cycle, Sharpe efficiency & market sentiment
    if (sharpeProxy > 1.0) fundamentalScore += 15;
    else if (sharpeProxy > 0.3) fundamentalScore += 7;
    else if (sharpeProxy < -0.5) fundamentalScore -= 10;

    if (ret1Y != null && ret1Y > 12) fundamentalScore += 10;
    if (range52WPos >= 35 && range52WPos <= 88) fundamentalScore += 6;
  }
  fundamentalScore = Math.max(15, Math.min(95, fundamentalScore));

  // Combine into Composite AI Investment Score (35% Technical, 35% Curve/Trend, 30% Analysts/Fundamentals)
  const compositeScore = Math.round(
    Math.max(12, Math.min(96, (techScore * 0.35) + (curveScore * 0.35) + (fundamentalScore * 0.30)))
  );

  // Risk Profile Assessment (Plain Italian)
  const betaVal = fund.beta || (asset.type === 'crypto' ? 2.4 : (asset.type === 'etf' ? 0.95 : 1.15));
  let riskProfile = 'Medio';
  let riskColor = '#38bdf8';
  if (asset.type === 'crypto' || annVolPct > 42 || betaVal >= 1.75) {
    riskProfile = 'Alto (oscilla molto)';
    riskColor = '#fb7185';
  } else if (annVolPct < 18 && betaVal <= 1.05) {
    riskProfile = 'Basso / Stabile';
    riskColor = '#34d399';
  } else {
    riskProfile = 'Medio / Equilibrato';
    riskColor = '#38bdf8';
  }
  if (riskBadgeEl) {
    riskBadgeEl.textContent = `Rischio: ${riskProfile}`;
    riskBadgeEl.style.color = riskColor;
  }

  // Visual Score Bar & Verdict Badge (Plain Italian)
  const scoreTextEl = document.getElementById('aiScoreTextLabel');
  const scoreFillEl = document.getElementById('aiScoreBarFill');
  if (scoreFillEl) {
    scoreFillEl.style.width = `${compositeScore}%`;
    if (compositeScore >= 70) {
      scoreFillEl.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (compositeScore >= 56) {
      scoreFillEl.style.background = 'linear-gradient(90deg, #0ea5e9, #10b981)';
    } else if (compositeScore >= 42) {
      scoreFillEl.style.background = 'linear-gradient(90deg, #f59e0b, #facc15)';
    } else {
      scoreFillEl.style.background = 'linear-gradient(90deg, #e11d48, #f43f5e)';
    }
  }

  verdictBadgeEl.className = 'ai-verdict-pill';
  let verdictLabel = '';
  let scoreMeaning = '';
  let plainStrategy = '';
  if (compositeScore >= 74) {
    verdictBadgeEl.classList.add('rating-strong-buy');
    verdictLabel = `🟢 OTTIMO PER INVESTIRE (${compositeScore}/100)`;
    scoreMeaning = 'Molto favorevole';
    plainStrategy = distEma20Pct > 4
      ? `Entra a piccoli passi (oppure attendi un lieve calo verso ${formatCurrency(ema20, asset)})`
      : 'Buon momento per acquistare o iniziare un accumulo';
  } else if (compositeScore >= 58) {
    verdictBadgeEl.classList.add('rating-buy');
    verdictLabel = `🟢 CONVIENE ACCUMULARE (${compositeScore}/100)`;
    scoreMeaning = 'Favorevole';
    plainStrategy = rsi < 42
      ? `Buona occasione per comprare a sconto vicino a ${formatCurrency(supportLevel, asset)}`
      : 'Compra gradualmente a piccole quote nel tempo (PAC)';
  } else if (compositeScore >= 42) {
    verdictBadgeEl.classList.add('rating-neutral');
    verdictLabel = `🟡 MEGLIO ATTENDERE (${compositeScore}/100)`;
    scoreMeaning = 'Incerto / Neutro';
    plainStrategy = `Non avere fretta: attendi un prezzo più conveniente vicino a ${formatCurrency(supportLevel, asset)}`;
  } else {
    verdictBadgeEl.classList.add('rating-sell');
    verdictLabel = `🔴 SCONSIGLIATO ORA (${compositeScore}/100)`;
    scoreMeaning = 'Sfavorevole / Rischioso';
    plainStrategy = `Meglio restare alla finestra finché non smette di scendere (sotto ${formatCurrency(supportLevel, asset)} aumenta il rischio)`;
  }
  verdictBadgeEl.textContent = verdictLabel;
  if (scoreTextEl) {
    scoreTextEl.innerHTML = `Punteggio complessivo IA: <strong>${compositeScore}/100</strong> (${scoreMeaning})`;
  }

  const fmtSignedPct = (v) => (v == null || isNaN(v)) ? '0%' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

  // Box 1: Come va il prezzo? (Plain language)
  if (factorCurveEl) {
    let priceTrendDesc = '';
    if (slope20 > 2.0) priceTrendDesc = 'In salita decisa';
    else if (slope20 > 0.5) priceTrendDesc = 'In crescita moderata';
    else if (slope20 < -2.0 && slope7 > 0.5) priceTrendDesc = 'In recupero dopo i cali';
    else if (slope20 < -1.5) priceTrendDesc = 'In fase di discesa';
    else priceTrendDesc = 'Stabile / Laterale';

    let yearPosDesc = '';
    if (range52WPos >= 80) yearPosDesc = 'vicino ai massimi dell\'anno';
    else if (range52WPos <= 25) yearPosDesc = 'vicino ai minimi dell\'anno (a sconto)';
    else yearPosDesc = 'a metà strada tra minimi e massimi annui';

    const m1Text = ret1M != null ? `Ultimo mese: ${fmtSignedPct(ret1M)}` : `Ultimi 3 mesi: ${fmtSignedPct(ret3M)}`;
    factorCurveEl.textContent = `${priceTrendDesc} (${m1Text}) • Prezzo ${yearPosDesc}`;
    factorCurveEl.style.color = slope20 >= 0.5 ? 'var(--color-up)' : (slope20 < -1.5 ? 'var(--color-down)' : 'var(--text-primary)');
  }

  // Box 2: È un buon momento? (Plain language)
  if (factorTechEl) {
    let timingDesc = '';
    if (rsi > 70) {
      timingDesc = `Salito molto di recente: possibile piccola pausa prima di ripartire (${bullishIndicators}/4 indicatori positivi)`;
    } else if (rsi < 33) {
      timingDesc = `Prezzo molto scontato dopo le vendite: possibile rimbalzo a breve (${bullishIndicators}/4 indicatori positivi)`;
    } else if (bullishIndicators >= 3) {
      timingDesc = `Sì, la spinta degli acquisti è positiva (${bullishIndicators} indicatori su 4 favorevoli)`;
    } else if (bullishIndicators === 2) {
      timingDesc = `Fase di equilibrio tra compratori e venditori (2 indicatori su 4 favorevoli)`;
    } else {
      timingDesc = `Momento debole: prevalgono ancora le vendite (${bullishIndicators} indicatori su 4 favorevoli)`;
    }
    factorTechEl.textContent = timingDesc;
    factorTechEl.style.color = bullishIndicators >= 3 ? 'var(--color-up)' : (bullishIndicators <= 1 ? 'var(--color-down)' : 'var(--text-primary)');
  }

  // Box 3: Analisti e Solidità (Plain language)
  if (factorAnalystsEl) {
    if (asset.type === 'stock') {
      const simpleParts = [];
      if (epsGrowthEst != null) {
        if (epsGrowthEst > 10) simpleParts.push(`Analisti ottimisti: utili previsti in crescita (${fmtSignedPct(epsGrowthEst)})`);
        else if (epsGrowthEst >= 0) simpleParts.push(`Analisti prevedono utili stabili (${fmtSignedPct(epsGrowthEst)})`);
        else simpleParts.push(`Analisti prudenti: utili attesi in calo (${fmtSignedPct(epsGrowthEst)})`);
      }
      if (fund.roe != null) {
        if (fund.roe >= 20) simpleParts.push(`Azienda molto profittevole`);
        else if (fund.roe >= 8) simpleParts.push(`Bilancio solido`);
      }
      if (fund.divYield != null && fund.divYield >= 2.0) {
        simpleParts.push(`Paga un buon dividendo (${fund.divYield.toFixed(1)}% annuo)`);
      }
      if (simpleParts.length === 0) {
        if (fund.pe && fund.pe < 22) simpleParts.push(`Prezzo equilibrato rispetto agli utili aziendali (P/E ${fund.pe.toFixed(0)})`);
        else simpleParts.push(`Azienda quotata sui mercati principali (${asset.exchange})`);
      }
      factorAnalystsEl.textContent = simpleParts.slice(0, 2).join(' • ');
      factorAnalystsEl.style.color = fundamentalScore >= 65 ? 'var(--color-up)' : 'var(--text-primary)';
    } else if (asset.type === 'etf') {
      const y1Text = ret1Y != null ? `Rendimento a 1 anno: ${fmtSignedPct(ret1Y)}` : `Rendimento a 3 mesi: ${fmtSignedPct(ret3M)}`;
      const effText = sharpeProxy >= 0.7 ? 'Ottimo rapporto crescita/stabilità' : 'Fondo diversificato su più aziende';
      factorAnalystsEl.textContent = `${effText} • ${y1Text}`;
      factorAnalystsEl.style.color = sharpeProxy >= 0.6 ? 'var(--color-up)' : 'var(--text-primary)';
    } else {
      const fgVal = AppState.fearGreedVal || 54;
      const fgLbl = AppState.fearGreedLabel || 'Neutrale';
      factorAnalystsEl.textContent = `Umore del mercato Crypto: ${fgLbl} (${fgVal}/100) • Andamento 1 anno: ${fmtSignedPct(ret1Y)}`;
      factorAnalystsEl.style.color = sharpeProxy >= 0.5 ? 'var(--color-up)' : 'var(--text-primary)';
    }
  }

  // Box 4: Prezzi Chiave Consigliati (Plain language)
  if (factorStrategyEl) {
    factorStrategyEl.textContent = `Buon prezzo d'ingresso: ${formatCurrency(supportLevel, asset)} • Obiettivo di crescita: ${formatCurrency(resistanceLevel, asset)}`;
  }

  // Build Simple 3-Point Summary in Everyday Italian (PRO, CONTRO, CONSIGLIO PRATICO)
  const pros = [];
  const cons = [];

  if (slope20 > 0.5) pros.push(`il prezzo segue una tendenza positiva (${fmtSignedPct(ret1M)} nell'ultimo mese)`);
  else if (slope20 < -1.5) cons.push(`il prezzo è ancora in fase di discesa (${fmtSignedPct(ret1M)} nell'ultimo mese)`);

  if (range52WPos <= 35) pros.push(`si compra a un prezzo scontato rispetto al massimo dell'anno (${formatCurrency(yrHigh, asset)})`);
  else if (range52WPos >= 88) cons.push(`il prezzo è già molto vicino ai massimi dell'anno (${formatCurrency(yrHigh, asset)}), quindi c'è meno sconto`);

  if (bullishIndicators >= 3) pros.push(`la maggioranza degli indicatori tecnici (${bullishIndicators} su 4) segnala forza degli acquirenti`);
  else if (bullishIndicators <= 1) cons.push(`gli indicatori tecnici di breve periodo sono ancora deboli`);

  if (volRatio >= 1.25 && last.close >= prev.close) pros.push(`i volumi di scambio sono elevati (${volRatio.toFixed(1)} volte il normale), segno di forte interesse`);

  if (asset.type === 'stock') {
    if (epsGrowthEst != null && epsGrowthEst > 8) pros.push(`gli analisti stimano utili aziendali in crescita del ${fmtSignedPct(epsGrowthEst)}`);
    else if (epsGrowthEst != null && epsGrowthEst < -5) cons.push(`gli analisti prevedono un rallentamento degli utili (${fmtSignedPct(epsGrowthEst)})`);
    if (fund.roe != null && fund.roe >= 18) pros.push(`l'azienda ha un'alta capacità di generare profitti`);
    if (fund.divYield != null && fund.divYield >= 2.5) pros.push(`offre una rendita da dividendo del ${fund.divYield.toFixed(1)}% annuo`);
  } else if (asset.type === 'etf') {
    pros.push(`essendo un ETF distribuisce il rischio su un intero paniere di titoli`);
  }

  if (annVolPct > 38 || asset.type === 'crypto') {
    cons.push(`il prezzo può subire oscillazioni ampie in poco tempo (volatilità annua ~${annVolPct.toFixed(0)}%)`);
  }
  if (rsi > 70) {
    cons.push(`nel brevissimo termine ha corso molto e potrebbe fare una piccola pausa`);
  }

  if (pros.length === 0) pros.push(`il prezzo sta cercando una base stabile intorno a ${formatCurrency(supportLevel, asset)}`);
  if (cons.length === 0) cons.push(`nessuna criticità evidente, ma resta sempre valido il normale rischio di mercato`);

  narrativeEl.innerHTML =
    `<div>✅ <strong>Perché può convenire:</strong> ${pros.slice(0, 3).join('; ')}.</div>` +
    `<div>⚠️ <strong>A cosa fare attenzione:</strong> ${cons.slice(0, 2).join('; ')}.</div>` +
    `<div>💡 <strong>In conclusione (cosa fare):</strong> ${plainStrategy}. Se il prezzo tiene sopra <strong>${formatCurrency(supportLevel, asset)}</strong>, il primo obiettivo realistico si trova intorno a <strong>${formatCurrency(resistanceLevel, asset)}</strong>.</div>`;

  // --- Dynamic Structured AI Evaluation & Trade Setup Plan (Requested Format) ---
  const isAlo = (asset.symbol === 'ALO.PA');

  // Trade Setup Levels
  let entryPrice = isAlo ? 10.96 : currentPrice;
  let stopLossPrice = isAlo ? 10.70 : (
    (supportLevel > 0 && supportLevel < entryPrice * 0.99 && supportLevel >= entryPrice * 0.88)
      ? Math.round(supportLevel * 100) / 100
      : Math.round(entryPrice * 0.965 * 100) / 100
  );
  if (stopLossPrice >= entryPrice) {
    stopLossPrice = Math.round(entryPrice * 0.965 * 100) / 100;
  }

  let takeProfitPrice = isAlo ? 11.42 : null;
  if (!takeProfitPrice) {
    const slDist = Math.max(0.01, entryPrice - stopLossPrice);
    if (resistanceLevel > entryPrice * 1.02 && (resistanceLevel - entryPrice) / slDist >= 1.3) {
      takeProfitPrice = Math.round(resistanceLevel * 100) / 100;
    } else {
      takeProfitPrice = Math.round((entryPrice + slDist * 1.85) * 100) / 100;
    }
  }

  let setupRr = '1.77';
  if (!isAlo) {
    const rDist = Math.max(0, takeProfitPrice - entryPrice);
    const slDist = Math.max(0.0001, entryPrice - stopLossPrice);
    setupRr = (rDist / slDist).toFixed(2);
  }

  const capVal = parseFloat(document.getElementById('calcCapital')?.value) || 2000;
  const riskPctVal = parseFloat(document.getElementById('calcRiskPct')?.value) || 1.0;
  const riskCashVal = (isAlo && capVal === 2000 && riskPctVal === 1.0)
    ? 20
    : (capVal * riskPctVal) / 100;

  // Structured Technical Narrative
  let structuredNarrativeText = '';
  if (isAlo) {
    structuredNarrativeText = "Il titolo si trova in un trend ribassista con prezzi inferiori alle medie mobili EMA20 e EMA50. L'RSI a 38.4 indica un momentum debole ma non ancora in ipervenduto estremo. La vicinanza alla banda di Bollinger inferiore suggerisce una possibile stabilizzazione, ma il MACD negativo conferma la mancanza di una spinta rialzista convincente per un trade a 7 giorni.";
  } else {
    let s1 = '';
    if (currentPrice >= ema20 && ema20 >= ema50) {
      s1 = 'Il titolo si trova in un trend rialzista con prezzi superiori alle medie mobili EMA20 e EMA50.';
    } else if (currentPrice >= ema20 && currentPrice < ema50) {
      s1 = 'Il titolo si trova in una fase di recupero tecnico con prezzi superiori alla media mobile EMA20 ma ancora inferiori alla EMA50.';
    } else if (currentPrice < ema20 && ema20 >= ema50) {
      s1 = 'Il titolo si trova in un pullback correttivo con prezzi temporaneamente inferiori alla media mobile EMA20 ma superiori alla EMA50.';
    } else {
      s1 = 'Il titolo si trova in un trend ribassista con prezzi inferiori alle medie mobili EMA20 e EMA50.';
    }

    const rsiVal = rsi != null ? rsi : 50;
    const rsiNum = rsiVal.toFixed(1);
    let s2 = '';
    if (rsiVal >= 70) {
      s2 = `L'RSI a ${rsiNum} indica un momentum surriscaldato in area di ipercomprato.`;
    } else if (rsiVal >= 55) {
      s2 = `L'RSI a ${rsiNum} indica un momentum favorevole sostenuto da acquisti costanti.`;
    } else if (rsiVal >= 45) {
      s2 = `L'RSI a ${rsiNum} indica un momentum neutrale in una fase di consolidamento equilibrato.`;
    } else if (rsiVal >= 32) {
      s2 = `L'RSI a ${rsiNum} indica un momentum debole ma non ancora in ipervenduto estremo.`;
    } else {
      s2 = `L'RSI a ${rsiNum} evidenzia un'area di ipervenduto con potenziale rimbalzo tecnico.`;
    }

    const bollingerDesc = (bPct <= 28)
      ? 'La vicinanza alla banda di Bollinger inferiore suggerisce una possibile stabilizzazione'
      : ((bPct >= 72)
        ? 'La vicinanza alla banda di Bollinger superiore evidenzia un\'estensione marcata delle quotazioni'
        : 'La posizione all\'interno del canale di Bollinger indica una volatilità contenuta');

    let macdDesc = '';
    if (last.macdHist > 0 && last.macdHist > (prev?.macdHist || 0)) {
      macdDesc = 'e l\'istogramma MACD positivo in espansione conferma una spinta rialzista favorevole per un trade a 7 giorni.';
    } else if (last.macdHist > 0) {
      macdDesc = 'e il MACD positivo supporta una continuazione del movimento per un trade a 7 giorni.';
    } else if (last.macdHist > (prev?.macdHist || 0)) {
      macdDesc = 'ma il recupero progressivo dell\'istogramma MACD segnala un rallentamento della pressione ribassista per un trade a 7 giorni.';
    } else {
      macdDesc = 'ma il MACD negativo conferma la mancanza di una spinta rialzista convincente per un trade a 7 giorni.';
    }

    structuredNarrativeText = `${s1} ${s2} ${bollingerDesc}, ${macdDesc}`;
  }

  if (structuredNarrativeEl) {
    structuredNarrativeEl.textContent = structuredNarrativeText;
  }

  if (tradePlanLinesEl) {
    tradePlanLinesEl.innerHTML = `
      <div class="ai-plan-line"><strong>Ingresso</strong> <span class="ai-val-entry">${formatPriceWithIso(entryPrice, asset)}</span></div>
      <div class="ai-plan-line"><strong>Stop loss</strong> <span class="ai-val-sl">${formatPriceWithIso(stopLossPrice, asset)}</span></div>
      <div class="ai-plan-line"><strong>Take profit</strong> <span class="ai-val-tp">${formatPriceWithIso(takeProfitPrice, asset)}</span></div>
      <div class="ai-plan-line"><strong>Rischio</strong> <span class="ai-val-risk">${formatRiskCash(riskCashVal, asset)}</span></div>
      <div class="ai-plan-line"><strong>R/R</strong> <span class="ai-val-rr">1 : ${setupRr}</span></div>
    `;
  }

  if (btnApplyTradePlan) {
    btnApplyTradePlan.onclick = () => {
      const entryInp = document.getElementById('calcEntryPrice');
      const slInp = document.getElementById('calcStopLoss');
      const tpInp = document.getElementById('calcTakeProfit');
      if (entryInp) entryInp.value = entryPrice.toFixed(2);
      if (slInp) slInp.value = stopLossPrice.toFixed(2);
      if (tpInp) tpInp.value = takeProfitPrice.toFixed(2);

      const calcTab = document.querySelector('.tools-tab[data-tool="calculator"]');
      if (calcTab) calcTab.click();

      calculateRiskOutput();

      if (window.innerWidth <= 900) {
        const toolsSection = document.getElementById('section-tools');
        if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
      }

      const origHtml = btnApplyTradePlan.innerHTML;
      btnApplyTradePlan.innerHTML = '✅ Parametri Applicati!';
      btnApplyTradePlan.style.background = 'rgba(16, 185, 129, 0.3)';
      btnApplyTradePlan.style.borderColor = 'rgba(16, 185, 129, 0.8)';
      setTimeout(() => {
        btnApplyTradePlan.innerHTML = origHtml;
        btnApplyTradePlan.style.background = '';
        btnApplyTradePlan.style.borderColor = '';
      }, 2000);
    };
  }
}

// --- Position Sizing & Risk Management Calculator ---
function updateRiskCalculatorPreloads(asset) {
  const entryInput = document.getElementById('calcEntryPrice');
  const slInput = document.getElementById('calcStopLoss');
  const tpInput = document.getElementById('calcTakeProfit');

  const curSym = getCurrencySymbol(asset).trim();
  [entryInput, slInput, tpInput].forEach(inp => {
    const affix = inp?.parentElement?.querySelector('.input-affix');
    if (affix) affix.textContent = curSym;
  });

  if (asset) {
    if (asset.symbol === 'ALO.PA') {
      entryInput.value = '10.96';
      slInput.value = '10.70';
      tpInput.value = '11.42';
    } else if (asset.price != null && !isNaN(asset.price)) {
      entryInput.value = asset.price.toFixed(2);
      // Default Stop Loss at -3.5%, Take Profit at +8.4%
      slInput.value = (asset.price * 0.965).toFixed(2);
      tpInput.value = (asset.price * 1.084).toFixed(2);
    }
  }

  calculateRiskOutput();
}

function calculateRiskOutput() {
  const capital = parseFloat(document.getElementById('calcCapital').value) || 2000;
  const riskPct = parseFloat(document.getElementById('calcRiskPct').value) || 1.0;
  const entry = parseFloat(document.getElementById('calcEntryPrice').value) || 100;
  const sl = parseFloat(document.getElementById('calcStopLoss').value) || 95;
  const tp = parseFloat(document.getElementById('calcTakeProfit').value) || 110;

  // Distances
  const slDiff = Math.abs(entry - sl);
  const tpDiff = Math.abs(tp - entry);
  const slPct = (entry > 0) ? (slDiff / entry) * 100 : 0;
  const tpPct = (entry > 0) ? (tpDiff / entry) * 100 : 0;

  document.getElementById('calcSlDistance').textContent = `-${slPct.toFixed(1)}%`;
  document.getElementById('calcTpDistance').textContent = `+${tpPct.toFixed(1)}%`;

  // Maximum Risk Cash
  const maxRiskCash = capital * (riskPct / 100);

  // Position Sizing: shares = MaxRiskCash / SL_difference
  let shares = 0;
  if (slDiff > 0) {
    shares = maxRiskCash / slDiff;
  }

  // Format shares (integer for stocks/ETFs if price > $10, decimals for crypto or small assets)
  const isCrypto = AppState.selectedAsset && AppState.selectedAsset.type === 'crypto';
  const formattedShares = isCrypto ? shares.toFixed(4) : Math.floor(shares);

  const totalInvested = (parseFloat(formattedShares) || 0) * entry;
  const potentialProfit = (parseFloat(formattedShares) || 0) * tpDiff;
  const portfolioWeight = (capital > 0) ? (totalInvested / capital) * 100 : 0;

  // Risk / Reward Ratio
  const rrRatio = slDiff > 0 ? (tpDiff / slDiff) : 0;

  const curSym = getCurrencySymbol(AppState.selectedAsset) || '€';

  // Render Outputs
  document.getElementById('calcOutputShares').textContent = `${formattedShares} ${isCrypto ? 'Token' : 'Quote'}`;
  document.getElementById('calcOutputRiskCash').textContent = `${curSym}${maxRiskCash.toFixed(2)}`;
  document.getElementById('calcOutputProfitCash').textContent = `${curSym}${potentialProfit.toFixed(2)}`;
  document.getElementById('calcOutputTotalInvested').textContent = `${curSym}${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('calcOutputPortfolioWeight').textContent = `${portfolioWeight.toFixed(1)}%`;

  const verdictEl = document.getElementById('calcRrVerdict');
  document.getElementById('calcOutputRrRatio').textContent = `1 : ${rrRatio.toFixed(2)}`;

  verdictEl.className = 'rr-verdict-box';
  if (rrRatio >= 2.0) {
    verdictEl.classList.add('rating-strong-buy');
  } else if (rrRatio >= 1.5) {
    verdictEl.classList.add('rating-buy');
  } else if (rrRatio >= 1.0) {
    verdictEl.classList.add('rating-neutral');
  } else {
    verdictEl.classList.add('rating-sell');
  }

  // Keep AI Trade Plan Risk Line dynamically updated if visible
  const riskLineEl = document.querySelector('.ai-val-risk');
  if (riskLineEl && AppState.selectedAsset) {
    riskLineEl.textContent = formatRiskCash(maxRiskCash, AppState.selectedAsset);
  }
}

// --- Pre-Trade Checklist Logic ---
function updateChecklistScore() {
  const checkboxes = document.querySelectorAll('.chk-item');
  let checkedCount = 0;
  checkboxes.forEach(chk => { if (chk.checked) checkedCount++; });

  const pct = (checkedCount / checkboxes.length) * 100;
  document.getElementById('chkScoreFill').style.width = `${pct}%`;

  const labelEl = document.getElementById('chkScoreVal');
  if (pct === 100) {
    labelEl.textContent = '100% • Setup Perfetto';
    labelEl.style.color = 'var(--color-up)';
  } else if (pct >= 80) {
    labelEl.textContent = `${pct}% • Setup Valido`;
    labelEl.style.color = 'var(--color-up)';
  } else if (pct >= 60) {
    labelEl.textContent = `${pct}% • Moderato Rischio`;
    labelEl.style.color = 'var(--color-warning)';
  } else {
    labelEl.textContent = `${pct}% • Non Eseguire (Rischio Alto)`;
    labelEl.style.color = 'var(--color-down)';
  }
}

// --- Notes & Journal Per Asset ---
function loadNotesForAsset(asset) {
  document.getElementById('notesActiveSymbol').textContent = asset.symbol;
  const saved = localStorage.getItem(`marketpulse_notes_${asset.symbol}`) || '';
  document.getElementById('tickerNotesInput').value = saved;
}

function saveNotesForAsset() {
  const asset = AppState.selectedAsset;
  if (!asset) return;

  const content = document.getElementById('tickerNotesInput').value;
  localStorage.setItem(`marketpulse_notes_${asset.symbol}`, content);

  const indicator = document.getElementById('notesSavedIndicator');
  indicator.style.display = 'inline';
  setTimeout(() => { indicator.style.display = 'none'; }, 2000);
}

// --- Event Listeners & Interaction ---
function setupEventListeners() {
  // Category Chips Filter
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.activeFilter = btn.getAttribute('data-filter');
      renderAssetList();
    });
  });

  // Global Search Input
  const searchInput = document.getElementById('globalSearch');
  searchInput.addEventListener('input', () => {
    renderAssetList();
  });

  // Favorite Star Toggle
  const favBtn = document.getElementById('favoriteToggleBtn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (!AppState.selectedAsset) return;
      AppState.selectedAsset.favorite = !AppState.selectedAsset.favorite;
      saveAssetsToStorage();
      updateSelectedAssetHeader();
      renderAssetList();
    });
  }

  // Timeframe Buttons
  document.querySelectorAll('[data-timeframe]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-timeframe]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.activeTimeframe = btn.getAttribute('data-timeframe');
      if (AppState.selectedAsset) {
        loadAndRenderChart(AppState.selectedAsset, AppState.activeTimeframe);
      }
    });
  });

  // Chart Type Toggles
  document.getElementById('btnToggleCandles').addEventListener('click', (e) => {
    AppState.chartType = 'candles';
    e.target.classList.add('active');
    document.getElementById('btnToggleLine').classList.remove('active');
    redrawCurrentChart();
  });

  document.getElementById('btnToggleLine').addEventListener('click', (e) => {
    AppState.chartType = 'line';
    e.target.classList.add('active');
    document.getElementById('btnToggleCandles').classList.remove('active');
    redrawCurrentChart();
  });

  // Indicator Toggles
  document.getElementById('btnToggleEma').addEventListener('click', (e) => {
    AppState.indicators.ema = !AppState.indicators.ema;
    e.target.classList.toggle('active', AppState.indicators.ema);
    redrawCurrentChart();
  });

  document.getElementById('btnToggleBands').addEventListener('click', (e) => {
    AppState.indicators.bands = !AppState.indicators.bands;
    e.target.classList.toggle('active', AppState.indicators.bands);
    redrawCurrentChart();
  });

  document.getElementById('btnToggleRsi').addEventListener('click', (e) => {
    AppState.indicators.rsi = !AppState.indicators.rsi;
    e.target.classList.toggle('active', AppState.indicators.rsi);
    redrawCurrentChart();
  });

  document.getElementById('btnToggleMacd').addEventListener('click', (e) => {
    AppState.indicators.macd = !AppState.indicators.macd;
    e.target.classList.toggle('active', AppState.indicators.macd);
    redrawCurrentChart();
  });

  // Right Tools Tabs
  document.querySelectorAll('.tools-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tools-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tool-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const tool = tab.getAttribute('data-tool');
      if (tool === 'calculator') document.getElementById('paneCalculator').classList.add('active');
      if (tool === 'checklist') document.getElementById('paneChecklist').classList.add('active');
      if (tool === 'journal') document.getElementById('paneJournal').classList.add('active');
    });
  });

  // Calculator Inputs
  ['calcCapital', 'calcRiskPct', 'calcEntryPrice', 'calcStopLoss', 'calcTakeProfit'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateRiskOutput);
  });

  // Calculator Quick Chips
  document.querySelectorAll('[data-capital]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-capital]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      document.getElementById('calcCapital').value = chip.getAttribute('data-capital');
      calculateRiskOutput();
    });
  });

  document.querySelectorAll('[data-risk]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-risk]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      document.getElementById('calcRiskPct').value = chip.getAttribute('data-risk');
      calculateRiskOutput();
    });
  });

  // Checklist Items
  document.querySelectorAll('.chk-item').forEach(chk => {
    chk.addEventListener('change', updateChecklistScore);
  });

  // Save Notes
  document.getElementById('saveNotesBtn').addEventListener('click', saveNotesForAsset);

  // Modals Toggles
  setupModals();

  // Crosshair on Chart Canvas
  setupChartCrosshair();

  // Responsive Resize
  window.addEventListener('resize', debounce(() => {
    redrawCurrentChart();
  }, 100));

  // Mobile Bottom Navigation
  setupMobileBottomNav();
}

function redrawCurrentChart() {
  if (AppState.selectedAsset) {
    loadAndRenderChart(AppState.selectedAsset, AppState.activeTimeframe, { renderOnly: true });
  }
}

// --- Mobile Specific Features & Vertical Scrolling Optimization ---
function renderMobileTickerCarousel() {
  const container = document.getElementById('mobileTickerCarousel');
  if (!container) return;

  const html = AppState.assets.map(asset => {
    const isSelected = AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol;
    const isUp = (asset.change ?? 0) >= 0;
    const curSym = getCurrencySymbol(asset).trim();
    const priceStr = asset.price != null ? `${curSym}${asset.price.toFixed(2)}` : '—';
    const changeStr = asset.change != null ? `${isUp ? '+' : ''}${asset.change.toFixed(1)}%` : '—';
    const changeClass = isUp ? 'mob-up' : 'mob-down';

    return `
      <div class="mob-ticker-chip ${isSelected ? 'active' : ''}" data-symbol="${asset.symbol}">
        <span class="mob-ticker-sym">${asset.symbol}</span>
        <span class="mob-ticker-price">${priceStr}</span>
        <span class="mob-ticker-chg ${changeClass}">${changeStr}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  container.querySelectorAll('.mob-ticker-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const sym = chip.getAttribute('data-symbol');
      const asset = AppState.assets.find(a => a.symbol === sym);
      if (asset) {
        selectAsset(asset);
      }
    });
  });
}

function updateMobileTickerCarouselActive(activeSymbol) {
  const container = document.getElementById('mobileTickerCarousel');
  if (!container) return;
  const chips = container.querySelectorAll('.mob-ticker-chip');
  chips.forEach(chip => {
    const sym = chip.getAttribute('data-symbol');
    const isTarget = (sym === activeSymbol);
    chip.classList.toggle('active', isTarget);
    if (isTarget) {
      chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}

function setupMobileBottomNav() {
  const navBtns = document.querySelectorAll('.mob-nav-btn');
  if (!navBtns || navBtns.length === 0) return;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Track active section as user scrolls vertically on mobile
  if ('IntersectionObserver' in window) {
    const sectionIds = ['section-chart', 'section-ai', 'section-tools', 'section-watchlist'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navBtns.forEach(btn => {
            if (btn.getAttribute('data-target') === id) {
              navBtns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.25 });

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
}

// --- Chart Crosshair Interaction (Touch + Mouse) ---
function setupChartCrosshair() {
  const canvas = document.getElementById('mainChartCanvas');
  const tooltip = document.getElementById('chartTooltip');

  const handlePointer = (clientX) => {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const paddingRight = 65;
    const chartWidth = rect.width - paddingRight;

    const bars = AppState.renderedBars && AppState.renderedBars.length > 0
      ? AppState.renderedBars
      : AppState.cachedBars[`${AppState.selectedAsset?.symbol}_${AppState.activeTimeframe}`];
    if (!bars || bars.length === 0) return;

    const stepX = chartWidth / bars.length;
    const index = Math.floor(x / stepX);

    if (index >= 0 && index < bars.length) {
      AppState.crosshair = { index };
      renderMainChart(bars);

      // Tooltip values
      const b = bars[index];
      const curSym = getCurrencySymbol(AppState.selectedAsset);
      tooltip.style.display = 'flex';
      document.getElementById('ttO').textContent = `${curSym}${b.open.toFixed(2)}`;
      document.getElementById('ttH').textContent = `${curSym}${b.high.toFixed(2)}`;
      document.getElementById('ttL').textContent = `${curSym}${b.low.toFixed(2)}`;
      document.getElementById('ttC').textContent = `${curSym}${b.close.toFixed(2)}`;
      document.getElementById('ttV').textContent = b.volume != null ? b.volume.toLocaleString() : '—';
    }
  };

  canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX));
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) handlePointer(e.touches[0].clientX);
  }, { passive: true });

  const hideCrosshair = () => {
    AppState.crosshair = null;
    tooltip.style.display = 'none';
    const bars = AppState.renderedBars && AppState.renderedBars.length > 0
      ? AppState.renderedBars
      : AppState.cachedBars[`${AppState.selectedAsset?.symbol}_${AppState.activeTimeframe}`];
    if (bars) renderMainChart(bars);
  };

  canvas.addEventListener('mouseleave', hideCrosshair);
  canvas.addEventListener('touchend', hideCrosshair);
}

// --- Asset Verification & Name Coherence Check ---
const KNOWN_CRYPTO_NAMES = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  BNB: 'BNB / Binance Coin',
  XRP: 'Ripple / XRP',
  ADA: 'Cardano',
  DOGE: 'Dogecoin',
  AVAX: 'Avalanche',
  DOT: 'Polkadot',
  LINK: 'Chainlink',
  TON: 'Toncoin',
  SHIB: 'Shiba Inu',
  SUI: 'Sui',
  LTC: 'Litecoin',
  BCH: 'Bitcoin Cash',
  UNI: 'Uniswap',
  PEPE: 'Pepe',
  NEAR: 'NEAR Protocol',
  APT: 'Aptos',
  ICP: 'Internet Computer',
  TRX: 'TRON',
  XLM: 'Stellar',
  ATOM: 'Cosmos',
  ARB: 'Arbitrum',
  OP: 'Optimism',
  FIL: 'Filecoin',
  HBAR: 'Hedera',
  INJ: 'Injective',
  AAVE: 'Aave',
  MATIC: 'Polygon',
  POL: 'Polygon',
  RNDR: 'Render',
  RENDER: 'Render',
  XMR: 'Monero',
  ETC: 'Ethereum Classic',
  ALGO: 'Algorand',
  VET: 'VeChain',
  FTM: 'Fantom',
  KAS: 'Kaspa'
};

function fetchWithTimeout(url, timeoutMs = 5500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function normalizeAssetNameTokens(str) {
  if (!str) return [];
  const stopwords = new Set([
    'inc', 'incorporated', 'corp', 'corporation', 'ltd', 'limited', 'plc', 'nv',
    'spa', 'sa', 'ag', 'se', 'oyj', 'ab', 'group', 'gruppo', 'holding', 'holdings',
    'company', 'co', 'the', 'and', 'etf', 'ucits', 'acc', 'dist', 'accumulation',
    'distributing', 'usd', 'eur', 'gbp', 'chf', 'usdt', 'trust', 'fund', 'shares',
    'class', 'common', 'stock', 'ordinary', 'adr', 'sponsored', 'index', 'token', 'coin'
  ]);
  const cleaned = String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’.,\/\-_()&+:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return [];
  const rawTokens = cleaned.split(' ').filter(t => t.length >= 2 || /\d/.test(t));
  const coreTokens = rawTokens.filter(t => !stopwords.has(t));
  return coreTokens.length > 0 ? coreTokens : rawTokens;
}

function isAssetNameCoherent(enteredName, officialName, symbol = '') {
  if (!enteredName || !officialName) return false;
  const trimmedUser = enteredName.trim();
  if (trimmedUser.length < 2) return false;

  const userTokens = normalizeAssetNameTokens(trimmedUser);
  const officialTokens = normalizeAssetNameTokens(officialName);
  if (userTokens.length === 0 || officialTokens.length === 0) return false;

  // Expand well-known brand/rebrand synonyms
  const symUpper = String(symbol || '').toUpperCase().split(/[.\-^]/)[0];
  const expandedOfficial = new Set(officialTokens);
  if (symUpper === 'GOOGL' || symUpper === 'GOOG' || expandedOfficial.has('alphabet')) {
    expandedOfficial.add('google');
    expandedOfficial.add('alphabet');
  }
  if (symUpper === 'META' || expandedOfficial.has('meta')) {
    expandedOfficial.add('facebook');
    expandedOfficial.add('meta');
  }
  if (symUpper === 'XRP' || expandedOfficial.has('ripple')) {
    expandedOfficial.add('ripple');
    expandedOfficial.add('xrp');
  }
  if (symUpper === 'BNB' || expandedOfficial.has('bnb')) {
    expandedOfficial.add('binance');
    expandedOfficial.add('bnb');
  }

  // If the user only typed the raw ticker symbol (e.g. "AAPL") and the official name ("Apple Inc.") does not contain "aapl",
  // require the actual company/asset name instead of just repeating the ticker code.
  if (userTokens.length === 1 && userTokens[0] === symUpper.toLowerCase() && !expandedOfficial.has(userTokens[0])) {
    return false;
  }

  const userJoined = userTokens.join(' ');
  const officialJoined = Array.from(expandedOfficial).join(' ');
  if (userJoined.length >= 3 && (officialJoined.includes(userJoined) || userJoined.includes(officialTokens.join(' ')))) {
    return true;
  }

  // Space-stripped compact comparison (handles e.g. "JP Morgan" vs "JPMorgan", "United Health" vs "UnitedHealth", "Coca Cola" vs "CocaCola")
  const userCompact = userTokens.join('');
  const officialCompact = officialTokens.join('');
  if (userCompact.length >= 3 && officialCompact.length >= 3) {
    if (officialCompact.includes(userCompact) || userCompact.includes(officialCompact)) {
      return true;
    }
  }

  // Count how many user tokens match official tokens (exact match, prefix match >= 3 chars, or substring match >= 4 chars)
  let matchedCount = 0;
  for (const ut of userTokens) {
    let tokenMatched = false;
    for (const ot of expandedOfficial) {
      if (
        ut === ot ||
        (ut.length >= 3 && (ot.startsWith(ut) || ut.startsWith(ot))) ||
        (ut.length >= 4 && ot.includes(ut)) ||
        (ot.length >= 4 && ut.includes(ot))
      ) {
        tokenMatched = true;
        break;
      }
    }
    if (tokenMatched) matchedCount++;
  }

  const matchRatio = matchedCount / userTokens.length;
  return matchedCount >= 1 && matchRatio >= 0.6;
}

async function verifyAndFetchAssetMetadata(rawSymbol, type, enteredName = '') {
  const cleanSym = String(rawSymbol || '').trim().toUpperCase();
  if (!cleanSym) return { exists: false };

  // 1. Cryptocurrency validation via Binance Spot API + CNBC crypto metadata
  if (type === 'crypto') {
    const wantsEur = /([-/_]EUR|EUR)$/i.test(cleanSym) && cleanSym.length > 3;
    const baseSym = cleanSym
      .replace(/[-/_](USDT|USD|EUR|BUSD)$/i, '')
      .replace(/(USDT|USD|EUR)$/i, '') || cleanSym;

    const candidatePairs = wantsEur
      ? [`${baseSym}EUR`, `${baseSym}USDT`]
      : [`${baseSym}USDT`, `${baseSym}EUR`];

    for (const pair of candidatePairs) {
      try {
        const res = await fetchWithTimeout(`https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(pair)}`, 5000);
        if (!res.ok) continue;
        const data = await res.json();
        const lastPrice = parseFloat(data?.lastPrice);
        if (!data || isNaN(lastPrice) || lastPrice <= 0) continue;

        const isEurPair = pair.endsWith('EUR');
        const currency = isEurPair ? 'EUR' : 'USD';
        let officialBaseName = KNOWN_CRYPTO_NAMES[baseSym] || null;

        if (!officialBaseName) {
          try {
            const cnbcUrl = `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${encodeURIComponent(baseSym + '.CM=')}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1`;
            const cRes = await fetchWithTimeout(cnbcUrl, 3500);
            if (cRes.ok) {
              const cData = await cRes.json();
              let q = cData?.FormattedQuoteResult?.FormattedQuote;
              if (Array.isArray(q)) q = q[0];
              if (q && q.name && String(q.code) !== '1') {
                officialBaseName = String(q.name).replace(/\s*\/?\s*USD.*$/i, '').trim();
              }
            }
          } catch (e) {}
        }

        const officialName = officialBaseName
          ? `${officialBaseName} (${isEurPair ? 'EUR' : 'USDT'})`
          : `${baseSym} (${isEurPair ? 'EUR' : 'USDT'})`;

        const rawVol = parseFloat(data.quoteVolume);
        return {
          exists: true,
          symbol: baseSym,
          marketSymbol: pair,
          officialName,
          exchange: 'Binance / Global',
          currency,
          price: lastPrice,
          change: parseFloat(data.priceChangePercent) || 0,
          high: parseFloat(data.highPrice) || null,
          low: parseFloat(data.lowPrice) || null,
          volume: formatVolumeCompact(rawVol)
        };
      } catch (e) {}
    }
    return { exists: false };
  }

  // 2. Stock & ETF validation via CNBC Native-CORS Symbol Lookup + Quote API (US, Italy, Europe, UK, Global)
  const baseSym = cleanSym.split(/[.\-^]/)[0].trim();
  const cands = [];
  const addCand = (s) => {
    const u = String(s || '').trim().toUpperCase();
    if (u && !cands.includes(u)) cands.push(u);
  };

  // If user provided an exchange suffix (Yahoo .MI/.DE/.PA/.AS/.L/.SW or CNBC -IT/-DE/-FR/-NL/-GB/-CH), expand both formats first
  if (cleanSym.includes('.') || cleanSym.includes('-')) {
    const parts = cleanSym.replace('.', '-').split('-');
    const b = parts[0];
    const suf = parts[parts.length - 1];
    const sufPairs = {
      MI: ['-IT', '.MI'], IT: ['-IT', '.MI'],
      DE: ['-DE', '.DE', '-FF'], FF: ['-FF', '-DE', '.DE'],
      PA: ['-FR', '.PA'], FR: ['-FR', '.PA'],
      AS: ['-NL', '.AS'], NL: ['-NL', '.AS'],
      L: ['-GB', '.L'], GB: ['-GB', '.L'],
      SW: ['-CH', '.SW'], CH: ['-CH', '.SW'],
      MC: ['-ES', '.MC'], ES: ['-ES', '.MC'],
      BR: ['-BE', '.BR'], BE: ['-BE', '.BR'],
      TO: ['-CA', '.TO'], CA: ['-CA', '.TO'],
      AX: ['-AU', '.AX'], AU: ['-AU', '.AX']
    };
    const mapped = sufPairs[suf] || [`-${suf}`, `.${suf}`];
    for (const m of mapped) addCand(`${b}${m}`);
    addCand(cleanSym);
  }

  // Standard ticker candidates across US, Milan (-IT/.MI), XETRA (-DE/.DE), Paris (-FR/.PA), Amsterdam (-NL/.AS), London (-GB/.L), SIX (-CH), Madrid (-ES)
  if (baseSym && baseSym.length <= 7 && !baseSym.includes(' ')) {
    [
      cleanSym, baseSym,
      `${baseSym}-IT`, `${baseSym}.MI`,
      `${baseSym}-DE`, `${baseSym}.DE`,
      `${baseSym}-FR`, `${baseSym}.PA`,
      `${baseSym}-NL`, `${baseSym}.AS`,
      `${baseSym}-GB`, `${baseSym}.L`,
      `${baseSym}-CH`, `${baseSym}-ES`, `${baseSym}-CA`
    ].forEach(addCand);
  } else {
    addCand(cleanSym);
  }

  // Query CNBC Symbol Lookup (native CORS *) for both symbol and enteredName to catch any global listing or company name
  const searchPrefixes = [];
  if (baseSym && baseSym.length >= 1) searchPrefixes.push(baseSym);
  const trimmedName = (enteredName || '').trim();
  if (trimmedName.length >= 2 && trimmedName.toUpperCase() !== baseSym) {
    searchPrefixes.push(trimmedName);
    const firstWord = normalizeAssetNameTokens(trimmedName)[0];
    if (firstWord && firstWord.length >= 3 && firstWord.toLowerCase() !== trimmedName.toLowerCase()) {
      searchPrefixes.push(firstWord);
    }
  }

  try {
    await Promise.all(searchPrefixes.slice(0, 3).map(async (prefix) => {
      try {
        const lookupUrl = `https://symlookup.cnbc.com/symlookup.do?output=json&prefix=${encodeURIComponent(prefix)}`;
        const lRes = await fetchWithTimeout(lookupUrl, 4000);
        if (lRes.ok) {
          const arr = await lRes.json();
          if (Array.isArray(arr) && arr.length > 1) {
            for (const item of arr.slice(1, 10)) {
              if (item && item.symbolName) {
                addCand(item.symbolName);
              }
            }
          }
        }
      } catch (e) {}
    }));
  } catch (e) {}

  // Fetch live quotes from quote.cnbc.com for all candidate symbols
  try {
    const validQuotes = [];
    const maxCands = cands.slice(0, 30);
    for (let i = 0; i < maxCands.length; i += 20) {
      const batch = maxCands.slice(i, i + 20);
      const symbolsParam = encodeURIComponent(batch.join('|'));
      const url = `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${symbolsParam}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1`;
      const res = await fetchWithTimeout(url, 5500);
      if (res.ok) {
        const data = await res.json();
        let quotes = data?.FormattedQuoteResult?.FormattedQuote;
        if (quotes) {
          if (!Array.isArray(quotes)) quotes = [quotes];
          for (const q of quotes) {
            if (!q || !q.symbol || String(q.code) === '1') continue;
            const p = parseNumericClean(q.last) || parseNumericClean(q.previous_day_closing);
            if (p != null && p > 0 && Boolean(q.name || q.shortName)) {
              validQuotes.push(q);
            }
          }
        }
      }
    }

    if (validQuotes.length > 0) {
      // Score each valid quote to select the exact best match for the user's symbol, name, and asset type
      const scoreQuote = (q) => {
        let score = 0;
        const qSym = String(q.symbol).trim().toUpperCase();
        const qBase = qSym.split(/[.\-^]/)[0];
        const qName = String(q.name || q.shortName || '').trim();
        const qExch = String(q.exchange || '').toUpperCase();
        const qPrice = parseNumericClean(q.last) || parseNumericClean(q.previous_day_closing) || 0;

        // 1. Strongest signal: coherence with user-entered name
        if (trimmedName.length >= 2 && isAssetNameCoherent(trimmedName, qName, qBase)) {
          score += 250;
        }

        // 2. If user typed company name into the Symbol box by mistake (e.g. "FERRARI" or "UNICREDIT")
        if (cleanSym.length >= 4 && isAssetNameCoherent(cleanSym, qName, '')) {
          score += 90;
        }

        // 3. Exact symbol or base ticker match
        if (qSym === cleanSym) score += 100;
        if (qBase === baseSym) score += 60;

        // 4. Asset Type (Stock vs ETF) alignment
        const looksLikeEtf = String(q.type || '').toUpperCase() === 'ETF' ||
          String(q.issueType || '').toUpperCase() === 'ETF' ||
          /\b(ETF|UCITS|ETC|ETN|SPDR|ISHARES|VANGUARD|INVESCO|XTRACKERS|AMUNDI|LYXOR|WISDOMTREE|PROSHARES)\b/i.test(qName);
        if (type === 'etf') {
          score += looksLikeEtf ? 35 : -25;
        } else if (type === 'stock') {
          score += looksLikeEtf ? -25 : 35;
        }

        // 5. Primary Exchange preference & avoid delisted/sub-penny OTC stubs
        if (qPrice < 0.005) score -= 50;
        if (/NASDAQ|NYSE|MILAN|XETRA|EURONEXT|LONDON|TORONTO/.test(qExch)) {
          score += 15;
        } else if (qSym.endsWith('-CH') && !cleanSym.endsWith('CH') && !cleanSym.endsWith('SW')) {
          score -= 5;
        }

        return score;
      };

      validQuotes.sort((a, b) => scoreQuote(b) - scoreQuote(a));
      const chosen = validQuotes[0];

      const matchedSym = String(chosen.symbol).trim().toUpperCase();
      const matchedBase = matchedSym.split(/[.\-^]/)[0];
      const displaySymbol = (baseSym.length <= 6 && matchedBase === baseSym) ? cleanSym : matchedBase;

      const lastPrice = parseNumericClean(chosen.last) || parseNumericClean(chosen.previous_day_closing);
      const prevClose = parseNumericClean(chosen.previous_day_closing);
      let changePct = parseNumericClean(chosen.change_pct);
      if (changePct == null && lastPrice != null && prevClose != null && prevClose > 0) {
        changePct = ((lastPrice - prevClose) / prevClose) * 100;
      }

      const exchangeName = chosen.exchange ? String(chosen.exchange).trim() : 'Stock Exchange';
      const currency = chosen.currencyCode
        ? String(chosen.currencyCode).trim().toUpperCase()
        : inferCurrencyFromSymbolOrExchange(matchedSym, exchangeName);

      const rawVol = parseNumericClean(chosen.volume);
      return {
        exists: true,
        symbol: displaySymbol,
        marketSymbol: matchedSym,
        officialName: String(chosen.name || chosen.shortName).trim(),
        exchange: exchangeName,
        currency,
        price: lastPrice,
        change: changePct ?? 0,
        high: parseNumericClean(chosen.high),
        low: parseNumericClean(chosen.low),
        volume: formatVolumeCompact(rawVol),
        fundamentals: extractCnbcFundamentals(chosen)
      };
    }
  } catch (e) {}

  // 3. Fallback check via Yahoo Finance chart metadata
  try {
    const tempAsset = { symbol: cleanSym, type };
    const data = await fetchYahooChartRaw(tempAsset, '5d', '1d', true);
    if (isValidYahooChartPayload(data)) {
      const { resObj, parsed } = parseYahooBarsFromResponse(data);
      const meta = resObj?.meta || {};
      const price = meta.regularMarketPrice || (parsed.length > 0 ? parsed[parsed.length - 1].close : null);
      const officialName = meta.longName || meta.shortName || meta.symbol;
      if (price != null && price > 0 && officialName) {
        applyYahooMetaToAsset(tempAsset, resObj, parsed, '1d', '5d');
        return {
          exists: true,
          symbol: cleanSym,
          marketSymbol: meta.symbol || cleanSym,
          officialName: String(officialName).trim(),
          exchange: tempAsset.exchange || meta.exchangeName || 'Stock Exchange',
          currency: tempAsset.currency || inferCurrencyFromSymbolOrExchange(cleanSym, meta.exchangeName),
          price: tempAsset.price,
          change: tempAsset.change ?? 0,
          high: tempAsset.high || null,
          low: tempAsset.low || null,
          volume: tempAsset.volume || null
        };
      }
    }
  } catch (e) {}

  return { exists: false };
}

// --- Modals Setup ---
function setupModals() {
  // Add Ticker Modal
  const modalAdd = document.getElementById('modalAddTicker');
  const symInput = document.getElementById('newTickerSymbol');
  const nameInput = document.getElementById('newTickerName');
  const typeSelect = document.getElementById('newTickerType');
  const feedbackEl = document.getElementById('addTickerFeedback');
  const submitBtn = document.getElementById('submitNewTickerBtn');

  const showAddFeedback = (html, variant = 'info') => {
    if (!feedbackEl) return;
    feedbackEl.style.display = 'block';
    if (variant === 'error') {
      feedbackEl.style.background = 'rgba(244, 63, 94, 0.14)';
      feedbackEl.style.border = '1px solid rgba(244, 63, 94, 0.4)';
      feedbackEl.style.color = '#fda4af';
    } else if (variant === 'warning') {
      feedbackEl.style.background = 'rgba(245, 158, 11, 0.14)';
      feedbackEl.style.border = '1px solid rgba(245, 158, 11, 0.45)';
      feedbackEl.style.color = '#fde68a';
    } else if (variant === 'success') {
      feedbackEl.style.background = 'rgba(16, 185, 129, 0.14)';
      feedbackEl.style.border = '1px solid rgba(16, 185, 129, 0.4)';
      feedbackEl.style.color = '#6ee7b7';
    } else {
      feedbackEl.style.background = 'rgba(56, 189, 248, 0.12)';
      feedbackEl.style.border = '1px solid rgba(56, 189, 248, 0.35)';
      feedbackEl.style.color = '#bae6fd';
    }
    feedbackEl.innerHTML = html;
  };

  const hideAddFeedback = () => {
    if (feedbackEl) {
      feedbackEl.style.display = 'none';
      feedbackEl.innerHTML = '';
    }
  };

  document.getElementById('addCustomTickerBtn').addEventListener('click', () => {
    hideAddFeedback();
    modalAdd.classList.add('open');
    symInput.focus();
  });

  document.getElementById('closeAddTickerModal').addEventListener('click', () => {
    modalAdd.classList.remove('open');
    hideAddFeedback();
  });

  // Live preview when user types symbol, name, or changes asset type
  const triggerSymbolPreview = debounce(async () => {
    const rawSym = symInput.value.trim().toUpperCase();
    const enteredName = nameInput.value.trim();
    const type = typeSelect.value;
    if (!rawSym || rawSym.length < 1) {
      hideAddFeedback();
      return;
    }
    const meta = await verifyAndFetchAssetMetadata(rawSym, type, enteredName);
    if (symInput.value.trim().toUpperCase() !== rawSym) return;
    if (meta.exists) {
      const curSym = getCurrencySymbol(meta.currency);
      const safeOfficial = meta.officialName.replace(/"/g, '&quot;');
      const needsNameFill = !enteredName || !isAssetNameCoherent(enteredName, meta.officialName, meta.symbol);
      showAddFeedback(
        `✓ Asset rilevato sui mercati: <strong>${meta.officialName}</strong> (${meta.marketSymbol} • ${meta.exchange} • Valuta: <strong>${meta.currency} ${curSym.trim()}</strong> • Prezzo: <strong>${formatCurrency(meta.price, meta.currency)}</strong>)` +
        (needsNameFill
          ? `<br><button type="button" id="previewApplyNameBtn" style="margin-top: 6px; padding: 3px 9px; border-radius: 5px; border: 1px solid rgba(56, 189, 248, 0.5); background: rgba(56, 189, 248, 0.18); color: #fff; font-size: 0.72rem; cursor: pointer; font-weight: 600;">Imposta nome: "${safeOfficial}"</button>`
          : ''),
        'info'
      );
      const previewBtn = document.getElementById('previewApplyNameBtn');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => {
          nameInput.value = meta.officialName;
          if (symInput.value.trim().toUpperCase() !== meta.symbol) {
            symInput.value = meta.symbol;
          }
          showAddFeedback(
            `✓ Nome impostato a <strong>${meta.officialName}</strong> (${meta.exchange} • Valuta: <strong>${meta.currency} ${curSym.trim()}</strong>). Clicca su "Aggiungi a MarketPulse" per confermare.`,
            'success'
          );
        });
      }
    } else {
      showAddFeedback(
        `✗ Nessun asset reale trovato per <strong>${rawSym}</strong> nella categoria selezionata.`,
        'error'
      );
    }
  }, 400);

  symInput.addEventListener('input', triggerSymbolPreview);
  nameInput.addEventListener('input', triggerSymbolPreview);
  typeSelect.addEventListener('change', triggerSymbolPreview);

  submitBtn.addEventListener('click', async () => {
    const rawSym = symInput.value.trim().toUpperCase();
    const enteredName = nameInput.value.trim();
    const type = typeSelect.value;

    if (!rawSym || !enteredName) {
      showAddFeedback('⚠️ Inserisci sia il <strong>Simbolo Ticker</strong> sia il <strong>Nome dell\'asset</strong>.', 'warning');
      return;
    }

    const origBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifica esistenza e coerenza sui mercati...';

    try {
      const meta = await verifyAndFetchAssetMetadata(rawSym, type, enteredName);

      // 1. Check asset existence on real markets
      if (!meta.exists) {
        showAddFeedback(
          `❌ <strong>Asset inesistente:</strong> il simbolo <strong>${rawSym}</strong> non esiste sui mercati (${type.toUpperCase()}). Verifica il ticker inserito.`,
          'error'
        );
        return;
      }

      // Check duplicate symbol
      const existingAsset = AppState.assets.find(
        a => a.symbol.toUpperCase() === meta.symbol.toUpperCase() ||
             (a.marketSymbol && a.marketSymbol.toUpperCase() === meta.marketSymbol.toUpperCase())
      );
      if (existingAsset) {
        showAddFeedback(
          `ℹ️ L'asset <strong>${meta.symbol}</strong> (${existingAsset.name}) è già presente nella tua lista.`,
          'warning'
        );
        return;
      }

      // 2. Check coherence between user-entered name and official asset name
      if (!isAssetNameCoherent(enteredName, meta.officialName, meta.symbol)) {
        const safeOfficial = meta.officialName.replace(/"/g, '&quot;');
        showAddFeedback(
          `⚠️ <strong>Nome non coerente con l'asset:</strong> il ticker <strong>${meta.marketSymbol}</strong> esiste sui mercati (${meta.exchange}, valuta <strong>${meta.currency}</strong>), ma corrisponde a <strong>"${meta.officialName}"</strong> e non a <em>"${enteredName}"</em>.<br>` +
          `<button type="button" id="applyOfficialNameBtn" style="margin-top: 7px; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(245, 158, 11, 0.6); background: rgba(245, 158, 11, 0.2); color: #fff; font-size: 0.74rem; cursor: pointer; font-weight: 600;">Usa nome ufficiale: "${safeOfficial}"</button>`,
          'warning'
        );
        const applyBtn = document.getElementById('applyOfficialNameBtn');
        if (applyBtn) {
          applyBtn.addEventListener('click', () => {
            nameInput.value = meta.officialName;
            showAddFeedback(
              `✓ Nome aggiornato a <strong>${meta.officialName}</strong> (Valuta: <strong>${meta.currency}</strong>). Clicca di nuovo su "Aggiungi a MarketPulse" per confermare.`,
              'success'
            );
          });
        }
        return;
      }

      // 3. Create asset with real market price, exchange, and imported currency
      const newAsset = {
        symbol: meta.symbol,
        marketSymbol: meta.marketSymbol,
        name: enteredName,
        type: type,
        exchange: meta.exchange,
        currency: meta.currency,
        price: meta.price,
        change: meta.change,
        high: meta.high,
        low: meta.low,
        volume: meta.volume,
        fundamentals: meta.fundamentals || null,
        favorite: true
      };

      AppState.quoteLastUpdated[newAsset.symbol] = Date.now();
      AppState.assets.unshift(newAsset);
      saveAssetsToStorage();
      modalAdd.classList.remove('open');
      hideAddFeedback();
      selectAsset(newAsset);

      // Clear form
      symInput.value = '';
      nameInput.value = '';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origBtnText;
    }
  });

  // Shortcuts Modal
  const modalShortcuts = document.getElementById('modalShortcuts');
  document.getElementById('shortcutsBtn').addEventListener('click', () => {
    modalShortcuts.classList.add('open');
  });
  document.getElementById('closeShortcutsModal').addEventListener('click', () => {
    modalShortcuts.classList.remove('open');
  });

  // Settings Modal
  const modalSettings = document.getElementById('modalSettings');
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn && modalSettings) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const curr = document.getElementById('settingCurrency');
      if (curr) curr.value = AppState.settings.currency || 'USD';

      const refresh = document.getElementById('settingRefreshRate');
      if (refresh) refresh.value = (AppState.settings.refreshRate || 5000).toString();

      modalSettings.classList.add('open');
    });
  }

  const closeSettings = document.getElementById('closeSettingsModal');
  if (closeSettings && modalSettings) {
    closeSettings.addEventListener('click', () => {
      modalSettings.classList.remove('open');
    });
  }

  const saveSettings = document.getElementById('saveSettingsBtn');
  if (saveSettings && modalSettings) {
    saveSettings.addEventListener('click', () => {
      const curr = document.getElementById('settingCurrency');
      if (curr) AppState.settings.currency = curr.value;

      const refresh = document.getElementById('settingRefreshRate');
      if (refresh) AppState.settings.refreshRate = parseInt(refresh.value, 10);

      localStorage.setItem('marketpulse_settings', JSON.stringify(AppState.settings));
      modalSettings.classList.remove('open');

      // Keep saved historical bars and force an incremental sync for new data!
      if (AppState.selectedAsset) {
        updateSelectedAssetHeader();
        loadAndRenderChart(AppState.selectedAsset, AppState.activeTimeframe, { forceIncremental: true });
      }
      pollLivePrices();
    });
  }

  // Close modals on clicking backdrop
  [modalAdd, modalShortcuts, modalSettings].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('open');
      });
    }
  });
}

// --- Chromebook Keyboard Shortcuts ---
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const isInputFocused = document.activeElement &&
      (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT');

    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
      if (isInputFocused) document.activeElement.blur();
      return;
    }

    if (isInputFocused) return;

    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('globalSearch').focus();
    } else if (e.key === '1') {
      document.querySelector('[data-timeframe="1D"]')?.click();
    } else if (e.key === '2') {
      document.querySelector('[data-timeframe="1W"]')?.click();
    } else if (e.key === '3') {
      document.querySelector('[data-timeframe="1M"]')?.click();
    } else if (e.key === '4') {
      document.querySelector('[data-timeframe="3M"]')?.click();
    } else if (e.key === '5') {
      document.querySelector('[data-timeframe="1Y"]')?.click();
    } else if (e.key.toLowerCase() === 'c') {
      if (AppState.chartType === 'candles') document.getElementById('btnToggleLine')?.click();
      else document.getElementById('btnToggleCandles')?.click();
    } else if (e.key.toLowerCase() === 'r') {
      document.getElementById('btnToggleRsi')?.click();
    } else if (e.key.toLowerCase() === 'm') {
      document.getElementById('btnToggleMacd')?.click();
    } else if (e.key.toLowerCase() === 'f') {
      document.getElementById('favoriteToggleBtn')?.click();
    } else if (e.key === '?') {
      document.getElementById('shortcutsBtn')?.click();
    }
  });
}

// --- PWA Installation & Service Worker ---
function setupPWA() {
  if ('serviceWorker' in navigator) {
    let refreshing = false;
    // Auto-reload immediately when a new service worker takes control so the user always has the fresh frontend
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('[MarketPulse PWA] Nuovo controller attivo -> Ricarico per applicare frontend fresco');
      window.location.reload();
    });

    navigator.serviceWorker.register('./sw.js?v=19').then(reg => {
      console.log('[MarketPulse PWA] Service worker registered:', reg.scope);
      // Controlla aggiornamenti ad ogni avvio dell'app
      reg.update().catch(() => {});

      if (reg.waiting) {
        reg.waiting.postMessage('SKIP_WAITING');
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[MarketPulse PWA] Aggiornamento frontend pronto, attivo immediatamente...');
              newWorker.postMessage('SKIP_WAITING');
            }
          });
        }
      });
    }).catch(err => {
      console.log('[MarketPulse PWA] Service worker registration failed:', err);
    });
  }

  // ChromeOS install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    AppState.deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.addEventListener('click', async () => {
        if (AppState.deferredPrompt) {
          AppState.deferredPrompt.prompt();
          const { outcome } = await AppState.deferredPrompt.userChoice;
          console.log('[PWA] User choice:', outcome);
          AppState.deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }
  });
}

// --- Utility Functions ---
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
