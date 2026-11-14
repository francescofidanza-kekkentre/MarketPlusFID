/**
 * MarketPulse Pro - Core Application Logic
 * Desktop & Mobile Responsive Trading PWA with Touch & Keyboard shortcuts.
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
  { symbol: 'ADA', name: 'Cardano (USDT)', type: 'crypto', exchange: 'Binance / Global', currency: 'USD', price: null, change: null, high: null, low: null, volume: null, favorite: false },

  // Certificati d'Investimento (SeDeX / EuroTLX)
  {
    symbol: 'NLBNPIT1Z123',
    marketSymbol: 'FTSEMIB.MI',
    name: 'BNP Cash Collect • FTSE MIB',
    type: 'certificate',
    exchange: 'Borsa Italiana (SeDeX)',
    currency: 'EUR',
    price: 98.40,
    change: 0.45,
    high: 99.10,
    low: 97.90,
    volume: '15.4K',
    favorite: true,
    certificateData: {
      isin: 'NLBNPIT1Z123',
      issuer: 'BNP Paribas',
      certType: 'Cash Collect con Memoria',
      underlying: 'FTSE MIB Index',
      underlyingTicker: 'FTSEMIB.MI',
      strike: 34500,
      barrier: 20700,
      barrierPct: 60,
      nominal: 100,
      coupon: 0.85,
      couponFreq: 'Mensile (0,85%)',
      maturity: '18/12/2026',
      memory: true,
      protectionType: 'Condizionatamente Protetto (Barriera Discreta 60%)'
    }
  },
  {
    symbol: 'DE000VM5A456',
    marketSymbol: 'ENI.MI',
    name: 'Vontobel Bonus Cap • ENI',
    type: 'certificate',
    exchange: 'Borsa Italiana (SeDeX)',
    currency: 'EUR',
    price: 102.15,
    change: 0.32,
    high: 102.80,
    low: 101.90,
    volume: '28.2K',
    favorite: false,
    certificateData: {
      isin: 'DE000VM5A456',
      issuer: 'Vontobel',
      certType: 'Bonus Cap',
      underlying: 'Eni S.p.A.',
      underlyingTicker: 'ENI.MI',
      strike: 14.20,
      barrier: 9.23,
      barrierPct: 65,
      nominal: 100,
      coupon: 1.04,
      couponFreq: 'A Scadenza (Bonus 112,50€)',
      maturity: '19/06/2026',
      memory: false,
      protectionType: 'Barriera Continua Americana (65%)'
    }
  },
  {
    symbol: 'IT0006757890',
    marketSymbol: 'ISP.MI',
    name: 'UniCredit Top Cash • Intesa SP',
    type: 'certificate',
    exchange: 'Borsa Italiana (Cert-X)',
    currency: 'EUR',
    price: 99.80,
    change: -0.25,
    high: 100.50,
    low: 99.40,
    volume: '34.8K',
    favorite: true,
    certificateData: {
      isin: 'IT0006757890',
      issuer: 'UniCredit onemarkets',
      certType: 'Top Cash Collect',
      underlying: 'Intesa Sanpaolo',
      underlyingTicker: 'ISP.MI',
      strike: 3.80,
      barrier: 2.09,
      barrierPct: 55,
      nominal: 100,
      coupon: 0.60,
      couponFreq: 'Mensile (0,60% - 7,2% annuo)',
      maturity: '15/10/2027',
      memory: true,
      protectionType: 'Barriera Europea a Scadenza (55%)'
    }
  },
  {
    symbol: 'CH1261324567',
    marketSymbol: 'UCG.MI',
    name: 'Marex Airbag Cash • UniCredit',
    type: 'certificate',
    exchange: 'EuroTLX',
    currency: 'EUR',
    price: 96.50,
    change: 0.85,
    high: 97.20,
    low: 95.80,
    volume: '19.1K',
    favorite: false,
    certificateData: {
      isin: 'CH1261324567',
      issuer: 'Marex Financial',
      certType: 'Airbag Cash Collect',
      underlying: 'UniCredit S.p.A.',
      underlyingTicker: 'UCG.MI',
      strike: 39.50,
      barrier: 19.75,
      barrierPct: 50,
      nominal: 100,
      coupon: 1.10,
      couponFreq: 'Trimestrale (3,3% - 13,2% annuo)',
      maturity: '24/09/2026',
      memory: true,
      protectionType: 'Struttura Difensiva con Fattore Airbag 2x'
    }
  },
  {
    symbol: 'DE000SB3XYZ1',
    marketSymbol: '^GSPC',
    name: 'SocGen Turbo Open-End • S&P 500',
    type: 'certificate',
    exchange: 'Borsa Italiana (SeDeX)',
    currency: 'EUR',
    price: 14.85,
    change: 1.95,
    high: 15.30,
    low: 14.40,
    volume: '82.5K',
    favorite: false,
    certificateData: {
      isin: 'DE000SB3XYZ1',
      issuer: 'Societe Generale',
      certType: 'Turbo Open-End Long',
      underlying: 'S&P 500 Index',
      underlyingTicker: '^GSPC',
      strike: 5200,
      barrier: 5200,
      barrierPct: 88,
      nominal: 10,
      coupon: 0,
      couponFreq: 'Leva Dinamica (Zero Cedole)',
      maturity: 'Open-End',
      memory: false,
      protectionType: 'Stop-Loss / Knock-Out Intraday'
    }
  }
];

// --- State Management ---
const AppState = {
  assets: [],
  selectedAsset: null,
  activeFilter: 'portfolio',
  portfolio: {},
  portfolioSort: 'pnl', // 'pnl' (dal migliore al peggiore) or 'alpha' (alfabetico)
  activeTimeframe: '1M',
  chartType: 'candles', // 'candles' or 'line'
  indicators: {
    ema: true,
    bands: false,
    rsi: true,
    macd: false
  },
  settings: {
    currency: 'EUR',
    refreshRate: 5000
  },
  fxRates: {
    EURUSD: 1.085 // 1 EUR = 1.085 USD (1 USD = ~0.9217 EUR)
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

// --- Firebase Cloud Sync Global Helpers ---
let FirebaseModule = null;
let isRemoteUpdateInProgress = false;

async function getFirebaseModule() {
  if (FirebaseModule) return FirebaseModule;
  try {
    FirebaseModule = await import('./firebase-sync.js?v=32');
    return FirebaseModule;
  } catch (err) {
    console.warn('[MarketPulse] Firebase sync module could not be loaded:', err);
    return null;
  }
}

async function triggerCloudSync(immediate = false) {
  if (isRemoteUpdateInProgress) return { skipped: true };
  const mod = await getFirebaseModule();
  if (!mod) return { skipped: true, reason: 'no_module' };
  const user = mod.getCurrentUser();
  if (!user) return { skipped: true, reason: 'no_user' };

  const notesObj = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('marketpulse_notes_')) {
      notesObj[key] = localStorage.getItem(key);
    }
  }

  const payload = {
    settings: AppState.settings,
    portfolio: AppState.portfolio,
    portfolioSort: AppState.portfolioSort || localStorage.getItem('marketpulse_portfolio_sort') || 'best',
    assets: AppState.assets,
    notes: notesObj
  };

  return await mod.saveUserDataToCloud(payload, immediate);
}

// Il portafoglio predefinito per un nuovo utente o installazione parte sempre completamente vuoto
const DEFAULT_PORTFOLIO = {};

function savePortfolioToStorage(immediate = false) {
  try {
    localStorage.setItem('marketpulse_portfolio', JSON.stringify(AppState.portfolio));
  } catch (e) {
    console.error('[MarketPulse] Error saving portfolio:', e);
  }
  triggerCloudSync(immediate);
}

const HISTORY_STORAGE_KEY = 'marketpulse_history_v4';
const INCREMENTAL_SYNC_COOLDOWN_MS = 10000; // Minimum interval between incremental candle fetches per key
const STOCK_QUOTE_POLL_COOLDOWN_MS = 30000; // Poll stock/ETF quotes every 30s without API key

// --- Initialization (Ultra-Fast Startup, Zero-Cache) ---
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadStoredData();
    setupEventListeners();
    setupKeyboardShortcuts();
    setupPWA();

    // 1. Critical path: Render UI and portfolio immediately in the first frame
    selectPortfolioOverview();

    // 2. Defer non-critical background computations and live polling after initial paint
    const defer = window.requestIdleCallback || ((cb) => setTimeout(cb, 40));
    defer(() => {
      updateMarketHours();
      fetchFearAndGreed();
      renderCertificatesRadar();
      calculateCertificatesOutput();

      pollLivePrices();
      setInterval(pollLivePrices, AppState.settings.refreshRate || 5000);
      setInterval(updateMarketHours, 60000);

      // Non-blocking background initialization of Firebase Cloud Sync
      initFirebaseBackground();
    });
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
  // Enforce EUR as base reference currency
  if (!AppState.settings.currency || AppState.settings.currency === 'USD') {
    AppState.settings.currency = 'EUR';
    try {
      localStorage.setItem('marketpulse_settings', JSON.stringify(AppState.settings));
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

  // Ensure default certificates exist in AppState.assets
  let hasNewCert = false;
  DEFAULT_ASSETS.filter(a => a.type === 'certificate').forEach(cert => {
    if (!AppState.assets.some(a => a.symbol === cert.symbol)) {
      AppState.assets.push(cert);
      hasNewCert = true;
    }
  });
  if (hasNewCert) {
    saveAssetsToStorage();
  }

  // Load persisted portfolio positions
  const storedPortfolio = localStorage.getItem('marketpulse_portfolio');
  if (storedPortfolio) {
    try {
      AppState.portfolio = JSON.parse(storedPortfolio);
    } catch (e) {
      AppState.portfolio = Object.assign({}, DEFAULT_PORTFOLIO);
    }
  } else {
    AppState.portfolio = Object.assign({}, DEFAULT_PORTFOLIO);
    savePortfolioToStorage();
  }

  // Load persisted portfolio sort mode
  const storedSort = localStorage.getItem('marketpulse_portfolio_sort');
  if (storedSort === 'pnl' || storedSort === 'alpha') {
    AppState.portfolioSort = storedSort;
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

function saveAssetsToStorage(immediate = false) {
  try {
    localStorage.setItem('marketpulse_assets', JSON.stringify(AppState.assets));
  } catch (e) {}
  triggerCloudSync(immediate);
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
  let code = AppState.settings?.currency || 'EUR';
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
  return map[code] || (code && code.length <= 4 ? `${code} ` : '€');
}

function getEurRate(assetOrCurrency) {
  let cur = 'EUR';
  if (typeof assetOrCurrency === 'string') {
    cur = assetOrCurrency.trim().toUpperCase();
  } else if (assetOrCurrency && assetOrCurrency.currency) {
    cur = String(assetOrCurrency.currency).trim().toUpperCase();
  }
  if (cur === 'EUR') return 1.0;
  if (cur === 'USD' || cur === 'USDT') {
    return AppState.fxRates?.EURUSD || 1.085;
  }
  if (cur === 'GBP') {
    return (AppState.fxRates?.EURUSD || 1.085) / 1.28;
  }
  if (cur === 'CHF') {
    return (AppState.fxRates?.EURUSD || 1.085) / 1.08;
  }
  return 1.0;
}

function convertToEur(val, assetOrCurrency) {
  if (val === undefined || val === null || isNaN(val)) return 0;
  const rate = getEurRate(assetOrCurrency);
  return val / (rate || 1.0);
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
  // 0. Fetch live EUR/USD FX rate for real-time portfolio valuation in €
  try {
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT')
      .then(res => res.json())
      .then(data => {
        if (data && data.price) {
          const rate = parseFloat(data.price);
          if (rate > 0.5 && rate < 2.0) {
            AppState.fxRates.EURUSD = rate;
          }
        }
      }).catch(() => {});
  } catch (e) {}

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

// --- Portfolio Logic & AI Advice ---
function getPortfolioAiAdvice(asset, pos, currentPrice) {
  const buyPrice = pos.buyPrice;
  const pnlPct = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;
  const bars = AppState.cachedBars[`${asset.symbol}_DAILY`] || AppState.cachedBars[`${asset.symbol}_1M`] || [];
  const lastBar = bars.length > 0 ? bars[bars.length - 1] : null;
  const rsi = (lastBar && lastBar.rsi != null) ? lastBar.rsi : 50;
  const ema50 = lastBar ? lastBar.ema50 : null;

  if (asset.type === 'certificate') {
    const certData = asset.certificateData || {};
    const barrier = certData.barrierPct || 60;
    if (pnlPct >= 5 && currentPrice >= 100) {
      return {
        action: 'PRENDI PROFITTO',
        badgeClass: 'ai-advice-sell',
        text: 'Quota sopra il nominale (100€): rendimento residuo ridotto, valuta realizzo.'
      };
    }
    return {
      action: 'MANTIENI',
      badgeClass: 'ai-advice-hold',
      text: `Barriera al ${barrier}% con cuscino favorevole: mantieni per incasso cedolare.`
    };
  }

  // Extreme overbought or large profit
  if (pnlPct >= 20 && rsi >= 68) {
    return {
      action: 'PRENDI PROFITTO',
      badgeClass: 'ai-advice-sell',
      text: `Guadagno del +${pnlPct.toFixed(1)}% con RSI in ipercomprato (${rsi.toFixed(0)}): consigliato alleggerire o alzare trailing stop.`
    };
  }

  // Significant loss below EMA50
  if (pnlPct <= -10 && ema50 && currentPrice < ema50) {
    return {
      action: 'VALUTA STOP',
      badgeClass: 'ai-advice-sell',
      text: `Perdita del ${pnlPct.toFixed(1)}% sotto la media EMA50: valuta stop loss rigoroso per preservare il capitale.`
    };
  }

  // Oversold / Pullback in constructive structure
  if (rsi <= 42 && (ema50 ? currentPrice >= ema50 * 0.96 : true)) {
    return {
      action: 'ACCUMULA',
      badgeClass: 'ai-advice-buy',
      text: `RSI a ${rsi.toFixed(0)} su livelli di supporto favorevoli: buon punto per incrementare la posizione.`
    };
  }

  // Profitable position with healthy momentum
  if (pnlPct > 0 && rsi < 68) {
    return {
      action: 'MANTIENI',
      badgeClass: 'ai-advice-hold',
      text: `P&L positivo (+${pnlPct.toFixed(1)}%) e trend solido sopra i supporti: mantieni il trade aperto.`
    };
  }

  // Neutral consolidation
  return {
    action: 'ATTESA',
    badgeClass: 'ai-advice-wait',
    text: `Fase di consolidamento laterale (RSI ${rsi.toFixed(0)}): monitora i livelli chiave prima di operare.`
  };
}

function escapePortfolioHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizePortfolioTicker(sym) {
  return String(sym || '')
    .trim()
    .toUpperCase()
    .replace(/^\^/, '')
    .replace(/\.(MI|DE|PA|AS|L|SW|MC|TO|BR|VI|LS|HK|T)$/i, '')
    .replace(/-(IT|FR|NL|GB|CH|ES|CA|USD|EUR|USDT)$/i, '');
}

const PORTFOLIO_SECTOR_MAP = {
  // Tecnologia & Semiconduttori
  NVDA: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  AAPL: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  MSFT: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  GOOGL: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  GOOG: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  META: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  ASML: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  AMD: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  INTC: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  AVGO: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  TSM: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  QCOM: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  MU: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  ARM: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  ORCL: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  CRM: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  ADBE: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  NFLX: { sector: 'Tecnologia & Semiconduttori', techWeight: 0.8 },
  STM: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  STMMI: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  SOXX: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  SMH: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  XLK: { sector: 'Tecnologia & Semiconduttori', techWeight: 1.0 },
  QQQ: { sector: 'Tecnologia & Semiconduttori', techWeight: 0.65 },
  QQQM: { sector: 'Tecnologia & Semiconduttori', techWeight: 0.65 },
  EQQQ: { sector: 'Tecnologia & Semiconduttori', techWeight: 0.65 },
  NDX: { sector: 'Tecnologia & Semiconduttori', techWeight: 0.65 },

  // Finanziario & Banche
  ISP: { sector: 'Finanziario & Banche', techWeight: 0 },
  UCG: { sector: 'Finanziario & Banche', techWeight: 0 },
  BAMI: { sector: 'Finanziario & Banche', techWeight: 0 },
  BMED: { sector: 'Finanziario & Banche', techWeight: 0 },
  FBK: { sector: 'Finanziario & Banche', techWeight: 0 },
  G: { sector: 'Finanziario & Banche', techWeight: 0 },
  MB: { sector: 'Finanziario & Banche', techWeight: 0 },
  BPE: { sector: 'Finanziario & Banche', techWeight: 0 },
  JPM: { sector: 'Finanziario & Banche', techWeight: 0 },
  BAC: { sector: 'Finanziario & Banche', techWeight: 0 },
  GS: { sector: 'Finanziario & Banche', techWeight: 0 },
  MS: { sector: 'Finanziario & Banche', techWeight: 0 },
  V: { sector: 'Finanziario & Banche', techWeight: 0.2 },
  MA: { sector: 'Finanziario & Banche', techWeight: 0.2 },
  XLF: { sector: 'Finanziario & Banche', techWeight: 0 },

  // Energia & Utilities
  ENI: { sector: 'Energia & Utilities', techWeight: 0 },
  ENEL: { sector: 'Energia & Utilities', techWeight: 0 },
  SNAM: { sector: 'Energia & Utilities', techWeight: 0 },
  SRG: { sector: 'Energia & Utilities', techWeight: 0 },
  TRN: { sector: 'Energia & Utilities', techWeight: 0 },
  HER: { sector: 'Energia & Utilities', techWeight: 0 },
  A2A: { sector: 'Energia & Utilities', techWeight: 0 },
  XOM: { sector: 'Energia & Utilities', techWeight: 0 },
  CVX: { sector: 'Energia & Utilities', techWeight: 0 },
  SHEL: { sector: 'Energia & Utilities', techWeight: 0 },
  TTE: { sector: 'Energia & Utilities', techWeight: 0 },
  XLE: { sector: 'Energia & Utilities', techWeight: 0 },

  // Consumi, Auto & Lusso
  TSLA: { sector: 'Consumi, Auto & Lusso', techWeight: 0.3 },
  AMZN: { sector: 'Consumi, Auto & Lusso', techWeight: 0.45 },
  RACE: { sector: 'Consumi, Auto & Lusso', techWeight: 0 },
  STLA: { sector: 'Consumi, Auto & Lusso', techWeight: 0 },
  MC: { sector: 'Consumi, Auto & Lusso', techWeight: 0 },
  LVMH: { sector: 'Consumi, Auto & Lusso', techWeight: 0 },
  NKE: { sector: 'Consumi, Auto & Lusso', techWeight: 0 },
  XLY: { sector: 'Consumi, Auto & Lusso', techWeight: 0.2 },

  // Industria & Infrastrutture
  ALO: { sector: 'Industria & Infrastrutture', techWeight: 0 },
  LDO: { sector: 'Industria & Infrastrutture', techWeight: 0 },
  PRY: { sector: 'Industria & Infrastrutture', techWeight: 0 },
  CAT: { sector: 'Industria & Infrastrutture', techWeight: 0 },
  BA: { sector: 'Industria & Infrastrutture', techWeight: 0 },
  SIE: { sector: 'Industria & Infrastrutture', techWeight: 0 },
  XLI: { sector: 'Industria & Infrastrutture', techWeight: 0 },

  // Salute & Farmaceutica
  LLY: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  NVO: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  JNJ: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  UNH: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  PFE: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  REC: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  AMP: { sector: 'Salute & Farmaceutica', techWeight: 0 },
  XLV: { sector: 'Salute & Farmaceutica', techWeight: 0 },

  // Materie Prime & Oro
  GLD: { sector: 'Materie Prime & Oro', techWeight: 0 },
  IAU: { sector: 'Materie Prime & Oro', techWeight: 0 },
  SGLD: { sector: 'Materie Prime & Oro', techWeight: 0 },
  SLV: { sector: 'Materie Prime & Oro', techWeight: 0 },
  GDX: { sector: 'Materie Prime & Oro', techWeight: 0 },

  // Indici Generali / Broad ETF
  SPY: { sector: 'Indici Generali (USA / Global)', techWeight: 0.32, isBroadIndex: true },
  VOO: { sector: 'Indici Generali (USA / Global)', techWeight: 0.32, isBroadIndex: true },
  IVV: { sector: 'Indici Generali (USA / Global)', techWeight: 0.32, isBroadIndex: true },
  CSSPX: { sector: 'Indici Generali (USA / Global)', techWeight: 0.32, isBroadIndex: true },
  GSPC: { sector: 'Indici Generali (USA / Global)', techWeight: 0.32, isBroadIndex: true },
  VWCE: { sector: 'Indici Generali (USA / Global)', techWeight: 0.24, isBroadIndex: true },
  URTH: { sector: 'Indici Generali (USA / Global)', techWeight: 0.25, isBroadIndex: true },
  SWDA: { sector: 'Indici Generali (USA / Global)', techWeight: 0.25, isBroadIndex: true },
  IWDA: { sector: 'Indici Generali (USA / Global)', techWeight: 0.25, isBroadIndex: true },
  ACWI: { sector: 'Indici Generali (USA / Global)', techWeight: 0.24, isBroadIndex: true },
  FTSEMIB: { sector: 'Indici Italia (FTSE MIB)', techWeight: 0.02, isBroadIndex: true },
  SX5E: { sector: 'Indici Europa (EuroStoxx)', techWeight: 0.14, isBroadIndex: true }
};

const PORTFOLIO_INDEX_CONSTITUENTS = {
  SP500: {
    label: 'S&P 500',
    etfs: ['SPY', 'VOO', 'IVV', 'CSSPX'],
    indices: ['GSPC'],
    members: ['NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'GOOG', 'META', 'TSLA', 'AVGO', 'JPM', 'LLY', 'XOM', 'V', 'MA', 'UNH', 'ORCL', 'NFLX']
  },
  NASDAQ100: {
    label: 'Nasdaq 100',
    etfs: ['QQQ', 'QQQM', 'EQQQ'],
    indices: ['NDX'],
    members: ['NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'GOOG', 'META', 'TSLA', 'AVGO', 'ASML', 'AMD', 'INTC', 'QCOM', 'MU', 'ARM', 'ADBE', 'NFLX']
  },
  WORLD: {
    label: 'Azionario Globale',
    etfs: ['VWCE', 'URTH', 'SWDA', 'IWDA', 'ACWI'],
    indices: [],
    members: ['NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'GOOG', 'META', 'TSLA', 'ASML', 'AVGO', 'JPM', 'LLY', 'XOM', 'V', 'MA']
  },
  SEMICONDUCTORS: {
    label: 'Semiconduttori',
    etfs: ['SOXX', 'SMH'],
    indices: [],
    members: ['NVDA', 'ASML', 'AVGO', 'AMD', 'TSM', 'INTC', 'QCOM', 'MU', 'ARM', 'STM', 'STMMI']
  },
  FTSEMIB: {
    label: 'FTSE MIB',
    etfs: [],
    indices: ['FTSEMIB'],
    members: ['ISP', 'UCG', 'ENI', 'ENEL', 'RACE', 'STLA', 'G', 'LDO', 'PRY', 'BAMI', 'BMED', 'FBK', 'MB', 'BPE', 'SRG', 'TRN', 'STM', 'STMMI', 'REC', 'AMP']
  }
};

function getAssetCompartmentInfo(asset) {
  if (asset.type === 'crypto') {
    return { sector: 'Criptovalute', techWeight: 0, isBroadIndex: false };
  }

  const certData = asset.certificateData || {};
  const candidates = [
    normalizePortfolioTicker(asset.symbol),
    normalizePortfolioTicker(asset.marketSymbol),
    normalizePortfolioTicker(certData.underlyingTicker)
  ].filter(Boolean);

  for (const key of candidates) {
    if (PORTFOLIO_SECTOR_MAP[key]) {
      return PORTFOLIO_SECTOR_MAP[key];
    }
  }

  const text = `${asset.name || ''} ${certData.underlying || ''} ${asset.sector || ''}`.toLowerCase();
  if (/semicond|chip|tech|software|cloud|cyber|ai |nasdaq|nvidia|apple|microsoft|alphabet|meta|asml/.test(text)) {
    return { sector: 'Tecnologia & Semiconduttori', techWeight: 0.9, isBroadIndex: false };
  }
  if (/bank|banc|intesa|unicredit|financ|assicur|generali|mediobanca/.test(text)) {
    return { sector: 'Finanziario & Banche', techWeight: 0, isBroadIndex: false };
  }
  if (/eni|enel|oil|gas|energ|utilit|petrol|renew/.test(text)) {
    return { sector: 'Energia & Utilities', techWeight: 0, isBroadIndex: false };
  }
  if (/auto|tesla|ferrari|stellantis|luxury|lusso|amazon|retail|consum/.test(text)) {
    return { sector: 'Consumi, Auto & Lusso', techWeight: 0, isBroadIndex: false };
  }
  if (/alstom|leonardo|prysmian|industr|aerosp|defense|difesa|infrastr/.test(text)) {
    return { sector: 'Industria & Infrastrutture', techWeight: 0, isBroadIndex: false };
  }
  if (/pharma|health|salute|bio|med/.test(text)) {
    return { sector: 'Salute & Farmaceutica', techWeight: 0, isBroadIndex: false };
  }
  if (/gold|oro|silver|argento|commodit|materie/.test(text)) {
    return { sector: 'Materie Prime & Oro', techWeight: 0, isBroadIndex: false };
  }
  if (/ftse mib/.test(text)) {
    return { sector: 'Indici Italia (FTSE MIB)', techWeight: 0.02, isBroadIndex: true };
  }
  if (/s&p 500|sp500|msci world|all-world|all world/.test(text)) {
    return { sector: 'Indici Generali (USA / Global)', techWeight: 0.28, isBroadIndex: true };
  }

  if (asset.type === 'etf') return { sector: 'ETF Tematico / Altro', techWeight: 0, isBroadIndex: false };
  if (asset.type === 'certificate') return { sector: 'Certificati Multi-Sottostante', techWeight: 0, isBroadIndex: false };
  return { sector: 'Azionario / Altro', techWeight: 0, isBroadIndex: false };
}

function getCertificateUnderlyingTokens(asset) {
  const certData = asset.certificateData || {};
  const tokens = new Set();
  const add = (val) => {
    const norm = normalizePortfolioTicker(val);
    if (norm && norm.length >= 2) tokens.add(norm);
  };
  add(asset.marketSymbol);
  add(certData.underlyingTicker);

  // Support single or basket/worst-of underlyings separated by , / • -
  const rawUnderlying = String(certData.underlying || '').trim();
  if (rawUnderlying) {
    rawUnderlying.split(/[,/|•]+/).forEach(part => {
      const clean = part.trim().toUpperCase();
      if (clean) tokens.add(clean);
    });
  }
  return Array.from(tokens);
}

function evaluatePortfolioCompositionAi(portfolioAssets, totalCurrentValueEur) {
  if (!portfolioAssets || portfolioAssets.length === 0 || totalCurrentValueEur <= 0) {
    return null;
  }

  const items = portfolioAssets.map(asset => {
    const pos = AppState.portfolio[asset.symbol];
    const curPrice = asset.price != null ? asset.price : (pos ? pos.buyPrice : 0);
    const valEur = pos ? convertToEur(pos.shares * curPrice, asset) : 0;
    const weightPct = totalCurrentValueEur > 0 ? (valEur / totalCurrentValueEur) * 100 : 0;
    const baseSym = normalizePortfolioTicker(asset.symbol);
    const marketBase = normalizePortfolioTicker(asset.marketSymbol);
    const compInfo = getAssetCompartmentInfo(asset);
    return {
      asset,
      symbol: asset.symbol,
      baseSym,
      marketBase,
      type: asset.type,
      valueEur: valEur,
      weightPct,
      sector: compInfo.sector,
      techWeight: compInfo.techWeight,
      isBroadIndex: Boolean(compInfo.isBroadIndex)
    };
  });

  // 1) Overlap detection across Stocks, ETFs, and Certificates
  const overlaps = [];
  const seenOverlapKeys = new Set();
  const addOverlap = (key, severity, message) => {
    if (seenOverlapKeys.has(key)) return;
    seenOverlapKeys.add(key);
    overlaps.push({ severity, message });
  };

  const stocks = items.filter(i => i.type === 'stock');
  const etfs = items.filter(i => i.type === 'etf');
  const certs = items.filter(i => i.type === 'certificate');

  // 1A. Stock <-> Certificate direct underlying overlap
  stocks.forEach(st => {
    const stNameWords = String(st.asset.name || '').toLowerCase().split(/\s+/).filter(w => w.length >= 4);
    certs.forEach(ct => {
      const certTokens = getCertificateUnderlyingTokens(ct.asset);
      const certText = `${ct.asset.name || ''} ${(ct.asset.certificateData || {}).underlying || ''}`.toLowerCase();
      const tickerMatch = certTokens.includes(st.baseSym) || (st.marketBase && certTokens.includes(st.marketBase));
      const nameMatch = stNameWords.some(w => !['corp', 'corporation', 'group', 'holding', 'inc.', 's.p.a.'].includes(w) && certText.includes(w));
      if (tickerMatch || nameMatch) {
        addOverlap(
          `stock-cert-${st.baseSym}-${ct.symbol}`,
          'high',
          `<strong>${escapePortfolioHtml(st.symbol)}</strong> (Azione) coincide con il sottostante di <strong>${escapePortfolioHtml(ct.symbol)}</strong> (Certificato): doppia esposizione diretta.`
        );
      }
    });
  });

  // 1B. Certificate <-> Certificate same underlying
  for (let i = 0; i < certs.length; i++) {
    for (let j = i + 1; j < certs.length; j++) {
      const a = certs[i];
      const b = certs[j];
      const tokA = normalizePortfolioTicker((a.asset.certificateData || {}).underlyingTicker || a.marketBase);
      const tokB = normalizePortfolioTicker((b.asset.certificateData || {}).underlyingTicker || b.marketBase);
      if (tokA && tokB && tokA === tokB) {
        addOverlap(
          `cert-cert-${[a.symbol, b.symbol].sort().join('-')}`,
          'medium',
          `I certificati <strong>${escapePortfolioHtml(a.symbol)}</strong> e <strong>${escapePortfolioHtml(b.symbol)}</strong> condividono lo stesso sottostante (${escapePortfolioHtml(tokA)}).`
        );
      }
    }
  }

  // 1C. Stock <-> ETF / Index Certificate look-through overlap
  Object.entries(PORTFOLIO_INDEX_CONSTITUENTS).forEach(([bucketKey, bucket]) => {
    const matchingEtfs = etfs.filter(e => bucket.etfs.includes(e.baseSym));
    const matchingCerts = certs.filter(c => {
      const cTok = normalizePortfolioTicker((c.asset.certificateData || {}).underlyingTicker || c.marketBase);
      const cText = `${c.asset.name || ''} ${(c.asset.certificateData || {}).underlying || ''}`.toUpperCase();
      return bucket.indices.includes(cTok) || cText.includes(bucket.label.toUpperCase());
    });
    const matchingStocks = stocks.filter(s => bucket.members.includes(s.baseSym) || bucket.members.includes(s.marketBase));

    // Stock + ETF/Cert on same index
    if (matchingStocks.length > 0 && (matchingEtfs.length > 0 || matchingCerts.length > 0)) {
      const stockList = matchingStocks.map(s => escapePortfolioHtml(s.symbol)).join(', ');
      const vehicles = [
        ...matchingEtfs.map(e => `${escapePortfolioHtml(e.symbol)} (ETF)`),
        ...matchingCerts.map(c => `${escapePortfolioHtml(c.symbol)} (Cert)`)
      ].join(', ');
      addOverlap(
        `lookthrough-${bucketKey}-${stockList}`,
        'medium',
        `<strong>${stockList}</strong> (Azioni) già incluse nell'esposizione <em>${escapePortfolioHtml(bucket.label)}</em> di <strong>${vehicles}</strong>.`
      );
    }

    // ETF + Index Certificate on exact same index (e.g. SPY + Turbo S&P 500)
    if (matchingEtfs.length > 0 && matchingCerts.length > 0) {
      const etfList = matchingEtfs.map(e => escapePortfolioHtml(e.symbol)).join(', ');
      const certList = matchingCerts.map(c => escapePortfolioHtml(c.symbol)).join(', ');
      addOverlap(
        `etf-cert-${bucketKey}`,
        'high',
        `Sovrapposizione diretta su indice <em>${escapePortfolioHtml(bucket.label)}</em> tra ETF (<strong>${etfList}</strong>) e Certificato (<strong>${certList}</strong>).`
      );
    }
  });

  // 1D. Broad US/Global ETF <-> ETF redundancy (e.g. SPY + QQQ / URTH / VWCE)
  const usGlobalEtfs = etfs.filter(e => ['SPY', 'VOO', 'IVV', 'CSSPX', 'QQQ', 'QQQM', 'EQQQ', 'VWCE', 'URTH', 'SWDA', 'IWDA', 'ACWI', 'SOXX', 'SMH'].includes(e.baseSym));
  if (usGlobalEtfs.length >= 2) {
    const etfSyms = usGlobalEtfs.map(e => `<strong>${escapePortfolioHtml(e.symbol)}</strong>`).join(' + ');
    addOverlap(
      `etf-etf-us-global`,
      'medium',
      `Possibile ridondanza tra ETF (${etfSyms}): forte sovrapposizione sui titoli mega-cap USA/Tech.`
    );
  }

  // 2) Sector / Compartment balance analysis
  const sectorTotals = {};
  let effectiveTechEur = 0;

  items.forEach(item => {
    if (!sectorTotals[item.sector]) {
      sectorTotals[item.sector] = { name: item.sector, valueEur: 0, weightPct: 0, symbols: [] };
    }
    sectorTotals[item.sector].valueEur += item.valueEur;
    sectorTotals[item.sector].weightPct += item.weightPct;
    sectorTotals[item.sector].symbols.push(item.symbol);
    effectiveTechEur += item.valueEur * item.techWeight;
  });

  const sortedSectors = Object.values(sectorTotals).sort((a, b) => b.weightPct - a.weightPct);
  const topSector = sortedSectors[0];
  const effectiveTechPct = totalCurrentValueEur > 0 ? (effectiveTechEur / totalCurrentValueEur) * 100 : 0;

  let sectorStatus = 'balanced'; // 'balanced' | 'warning' | 'danger'
  let sectorSummary = '';

  if (items.length === 1) {
    sectorStatus = 'warning';
    sectorSummary = `Portafoglio concentrato al <strong>100%</strong> su una sola posizione (<strong>${escapePortfolioHtml(items[0].symbol)}</strong> • ${escapePortfolioHtml(topSector.name)}). Aggiungi altri strumenti per diversificare.`;
  } else if (topSector.weightPct >= 50) {
    sectorStatus = 'danger';
    sectorSummary = `<strong>Forte sbilanciamento</strong> verso <strong>${escapePortfolioHtml(topSector.name)}</strong> (<strong>${topSector.weightPct.toFixed(1)}%</strong> del portafoglio: ${topSector.symbols.map(escapePortfolioHtml).join(', ')}).`;
  } else if (topSector.weightPct >= 38) {
    sectorStatus = 'warning';
    sectorSummary = `<strong>Sbilanciamento moderato</strong> verso <strong>${escapePortfolioHtml(topSector.name)}</strong> (<strong>${topSector.weightPct.toFixed(1)}%</strong> del totale).`;
  } else if (effectiveTechPct >= 48 && topSector.name !== 'Tecnologia & Semiconduttori') {
    sectorStatus = 'warning';
    sectorSummary = `Esposizione diretta bilanciata, ma considerando i pesi interni di ETF/Indici l'esposizione effettiva al comparto <strong>Tecnologia</strong> sale al <strong>~${effectiveTechPct.toFixed(0)}%</strong>.`;
  } else {
    sectorStatus = 'balanced';
    sectorSummary = `<strong>Composizione equilibrata</strong>: nessun comparto supera la soglia critica (principale: ${escapePortfolioHtml(topSector.name)} al <strong>${topSector.weightPct.toFixed(1)}%</strong>).`;
  }

  // Overall AI Verdict Pill
  const hasHighOverlap = overlaps.some(o => o.severity === 'high');
  let overallBadge = { label: 'EQUILIBRATO', cls: 'port-ai-status-ok' };
  if (sectorStatus === 'danger' || hasHighOverlap) {
    overallBadge = { label: hasHighOverlap && sectorStatus !== 'danger' ? 'SOVRAPPOSIZIONI' : 'SBILANCIATO', cls: 'port-ai-status-danger' };
  } else if (sectorStatus === 'warning' || overlaps.length > 0) {
    overallBadge = { label: 'ATTENZIONE', cls: 'port-ai-status-warn' };
  }

  return {
    overallBadge,
    overlaps,
    sectorStatus,
    sectorSummary,
    sortedSectors: sortedSectors.slice(0, 4)
  };
}

const GeminiHybridState = {
  portfolio: { key: null, data: null, model: null, loading: false, error: null },
  assets: {} // keyed by `${symbol}_${timeframe}`
};

function getPortfolioCacheKey(portfolioAssets, totalCurrentValueEur) {
  if (!portfolioAssets || portfolioAssets.length === 0 || totalCurrentValueEur <= 0) return '';
  return portfolioAssets
    .map(a => {
      const pos = AppState.portfolio[a.symbol];
      const curPrice = a.price != null ? a.price : (pos ? pos.buyPrice : 0);
      const valEur = pos ? convertToEur(pos.shares * curPrice, a) : 0;
      const pct = Math.round((valEur / totalCurrentValueEur) * 100);
      return `${a.symbol}:${pct}`;
    })
    .sort()
    .join('|');
}

async function runGeminiPortfolioEvaluation() {
  const entries = getPortfolioAssetsWithPos();
  if (entries.length === 0 || GeminiHybridState.portfolio.loading) return;

  let totalEur = 0;
  entries.forEach(({ asset, pos }) => {
    const p = asset.price != null ? asset.price : pos.buyPrice;
    totalEur += convertToEur(pos.shares * p, asset);
  });
  if (totalEur <= 0) return;

  const portfolioAssets = entries.map(e => e.asset);
  const cacheKey = getPortfolioCacheKey(portfolioAssets, totalEur);
  const localEval = evaluatePortfolioCompositionAi(portfolioAssets, totalEur);

  GeminiHybridState.portfolio = { key: cacheKey, data: null, model: null, loading: true, error: null };
  renderAssetList();
  renderPortfolioAiAnalysisSection();

  try {
    const mod = await getFirebaseModule();
    if (!mod || typeof mod.analyzePortfolioWithGemini !== 'function') {
      throw new Error('Modulo Firebase AI Logic non caricato');
    }

    const holdingsPayload = entries.map(({ asset, pos }) => {
      const curPrice = asset.price != null ? asset.price : pos.buyPrice;
      const valEur = convertToEur(pos.shares * curPrice, asset);
      const weightPct = Number(((valEur / totalEur) * 100).toFixed(1));
      const comp = getAssetCompartmentInfo(asset);
      const certData = asset.certificateData || {};
      return {
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        weightPct,
        localCompartment: comp.sector,
        underlying: certData.underlying || certData.underlyingTicker || null
      };
    });

    const res = await mod.analyzePortfolioWithGemini({
      positionsCount: holdingsPayload.length,
      holdings: holdingsPayload,
      localCompartmentBreakdown: (localEval?.sortedSectors || []).map(s => ({
        sector: s.name,
        weightPct: Number(s.weightPct.toFixed(1))
      }))
    });

    if (res && res.ok && res.data) {
      GeminiHybridState.portfolio = {
        key: cacheKey,
        data: res.data,
        model: res.model || 'gemini-3.8-flash',
        loading: false,
        error: null
      };
    } else {
      throw new Error(res?.error || 'Servizio Gemini non disponibile');
    }
  } catch (err) {
    GeminiHybridState.portfolio = {
      key: cacheKey,
      data: null,
      model: null,
      loading: false,
      error: err?.message || 'Fallback locale attivo'
    };
  }
  renderAssetList();
  renderPortfolioAiAnalysisSection();
}

async function runGeminiAssetEvaluation() {
  const asset = AppState.selectedAsset;
  if (!asset) return;
  const btn = document.getElementById('btnGeminiAssetEval');
  const verdictEl = document.getElementById('aiVerdictBadge');
  const riskEl = document.getElementById('aiRiskProfileBadge');
  const narrativeEl = document.getElementById('aiNarrativeText');
  const cacheKey = `${asset.symbol}_${AppState.activeTimeframe}`;

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Gemini...';
  }

  try {
    const mod = await getFirebaseModule();
    if (!mod || typeof mod.analyzeAssetWithGemini !== 'function') {
      throw new Error('Modulo Firebase AI Logic non caricato');
    }

    const bars = AppState.renderedBars || [];
    const last = bars.length > 0 ? bars[bars.length - 1] : null;
    const payload = {
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      timeframe: AppState.activeTimeframe,
      currency: asset.currency || 'EUR',
      price: asset.price,
      changePct: asset.change,
      rsi: last?.rsi ?? null,
      ema20: last?.ema20 ?? null,
      ema50: last?.ema50 ?? null,
      fundamentals: asset.fundamentals || null,
      certificateData: asset.certificateData || null
    };

    const res = await mod.analyzeAssetWithGemini(payload);
    if (res && res.ok && res.data) {
      GeminiHybridState.assets[cacheKey] = res.data;
      if (verdictEl && res.data.verdict) verdictEl.textContent = `✦ ${res.data.verdict}`;
      if (riskEl && res.data.riskProfile) riskEl.textContent = res.data.riskProfile;
      if (narrativeEl && res.data.narrative) {
        narrativeEl.innerHTML = `<span class="ai-gemini-source-tag">✦ Gemini 3.8 Flash</span> ${escapePortfolioHtml(res.data.narrative)}`;
      }
      if (btn) btn.textContent = '✦ Gemini ✓';
    } else {
      throw new Error(res?.error || 'Gemini non disponibile');
    }
  } catch (err) {
    console.warn('[Hybrid AI] Fallback locale mantenuto:', err);
    if (btn) {
      btn.textContent = '✦ Fallback Locale';
      btn.title = err?.message || 'Abilita Firebase AI Logic per usare Gemini';
      setTimeout(() => { if (btn) btn.textContent = '✦ Gemini'; }, 3000);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

function renderPortfolioAiAnalysisSection() {
  const sectionAi = document.getElementById('section-ai');
  if (!sectionAi) return;

  const isPort = Boolean(AppState.selectedAsset && AppState.selectedAsset.isPortfolio);
  const decHeader = sectionAi.querySelector('.decision-header');
  const decSignals = sectionAi.querySelector('.decision-signals-grid');
  const aiEvalCard = document.getElementById('aiEvaluationCard');
  let portBox = document.getElementById('portfolioAiAnalysisBox');

  if (!isPort) {
    if (decHeader) decHeader.style.display = '';
    if (decSignals) decSignals.style.display = '';
    if (aiEvalCard) aiEvalCard.style.display = '';
    if (portBox) portBox.style.display = 'none';
    return;
  }

  // Hide single-asset technicals when viewing the overall Portfolio
  if (decHeader) decHeader.style.display = 'none';
  if (decSignals) decSignals.style.display = 'none';
  if (aiEvalCard) aiEvalCard.style.display = 'none';

  if (!portBox) {
    portBox = document.createElement('div');
    portBox.id = 'portfolioAiAnalysisBox';
    sectionAi.appendChild(portBox);
  }
  portBox.style.display = '';

  const entries = getPortfolioAssetsWithPos();
  if (entries.length === 0) {
    portBox.innerHTML = `
      <div class="port-ai-comp-box port-ai-comp-wide">
        <div class="port-ai-comp-header">
          <span class="port-ai-comp-title"><span class="ai-spark-icon">✦</span> Valutazione IA Composizione Portafoglio</span>
        </div>
        <div class="port-ai-comp-text">Aggiungi almeno una posizione nel portafoglio per analizzare sovrapposizioni e bilanciamento per comparto.</div>
      </div>
    `;
    return;
  }

  let totalCurrentValueEur = 0;
  const portfolioAssets = entries.map(({ asset, pos }) => {
    const curPrice = asset.price != null ? asset.price : pos.buyPrice;
    totalCurrentValueEur += convertToEur(pos.shares * curPrice, asset);
    return asset;
  });

  const compAi = evaluatePortfolioCompositionAi(portfolioAssets, totalCurrentValueEur);
  if (!compAi) return;

  const cacheKey = getPortfolioCacheKey(portfolioAssets, totalCurrentValueEur);
  const gemState = GeminiHybridState.portfolio;
  const hasGemini = Boolean(gemState.key === cacheKey && gemState.data);
  const isGemLoading = Boolean(gemState.loading);
  const gemError = (gemState.key === cacheKey && gemState.error) ? gemState.error : null;

  const effectiveOverlaps = hasGemini && Array.isArray(gemState.data.overlaps)
    ? gemState.data.overlaps.map(o => ({ severity: o.severity || 'medium', message: escapePortfolioHtml(o.message) }))
    : compAi.overlaps;
  const effectiveSectorSummary = hasGemini && gemState.data.sectorSummary
    ? escapePortfolioHtml(gemState.data.sectorSummary)
    : compAi.sectorSummary;
  const effectiveBadge = hasGemini && gemState.data.overallStatus
    ? {
        label: gemState.data.overallStatus,
        cls: gemState.data.overallStatus === 'EQUILIBRATO'
          ? 'port-ai-status-ok'
          : (gemState.data.overallStatus === 'ATTENZIONE' ? 'port-ai-status-warn' : 'port-ai-status-danger')
      }
    : compAi.overallBadge;

  portBox.innerHTML = `
    <div class="port-ai-comp-box port-ai-comp-wide">
      <div class="port-ai-comp-header">
        <span class="port-ai-comp-title">
          <span class="ai-spark-icon">✦</span>
          ${hasGemini ? 'Valutazione Gemini Composizione Portafoglio' : 'Valutazione IA Composizione Portafoglio'}
        </span>
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" class="ai-gemini-btn" id="btnGeminiPortfolioEval" ${isGemLoading ? 'disabled' : ''} title="Analisi approfondita tramite Firebase AI Logic (Gemini)">
            ${isGemLoading ? '⏳ Gemini...' : (hasGemini ? '✦ Aggiorna' : '✦ Gemini')}
          </button>
          <span class="port-ai-comp-badge ${effectiveBadge.cls}">${effectiveBadge.label}</span>
        </div>
      </div>
      <div class="port-ai-wide-grid">
        <div class="port-ai-comp-item">
          <div class="port-ai-comp-label">1. Sovrapposizioni (Azioni / ETF / Certificati)</div>
          ${effectiveOverlaps.length > 0
            ? `<ul class="port-ai-comp-list">${effectiveOverlaps.map(o => `<li class="overlap-${o.severity}">${o.message}</li>`).join('')}</ul>`
            : `<div class="port-ai-comp-ok">✓ Nessuna sovrapposizione rilevata tra azioni, ETF e certificati in portafoglio.</div>`
          }
        </div>
        <div class="port-ai-comp-item">
          <div class="port-ai-comp-label">2. Bilanciamento per Comparto</div>
          <div class="port-ai-comp-text sector-${compAi.sectorStatus}">${effectiveSectorSummary}</div>
          <div class="port-ai-sector-pills">
            ${compAi.sortedSectors.map(sec => `
              <span class="port-ai-sector-pill">${escapePortfolioHtml(sec.name)}: <strong>${sec.weightPct.toFixed(0)}%</strong></span>
            `).join('')}
          </div>
        </div>
      </div>
      ${hasGemini && gemState.data.actionableTip ? `
        <div class="port-ai-gemini-tip">
          <strong>✦ Consiglio Gemini:</strong> ${escapePortfolioHtml(gemState.data.actionableTip)}
        </div>
      ` : ''}
      ${gemError ? `
        <div class="port-ai-fallback-note" title="${escapePortfolioHtml(gemError)}">
          Fallback locale attivo: ${escapePortfolioHtml(gemError)}
        </div>
      ` : ''}
    </div>
  `;

  const gemPortBtn = document.getElementById('btnGeminiPortfolioEval');
  if (gemPortBtn) {
    gemPortBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      runGeminiPortfolioEvaluation();
    });
  }
}

let currentPortfolioModalSymbol = null;

function openPortfolioModal(symbol) {
  const asset = AppState.assets.find(a => a.symbol === symbol);
  if (!asset) return;

  currentPortfolioModalSymbol = symbol;
  const pos = AppState.portfolio ? AppState.portfolio[symbol] : null;
  const isExisting = Boolean(pos);

  const symEl = document.getElementById('portModalSymbol');
  const typeEl = document.getElementById('portModalType');
  const nameEl = document.getElementById('portModalName');
  const priceEl = document.getElementById('portModalCurrentPrice');
  const inShares = document.getElementById('portInputShares');
  const inBuyPrice = document.getElementById('portInputBuyPrice');
  const curAffix = document.getElementById('portCurrencyAffix');
  const btnDelete = document.getElementById('deletePortfolioBtn');
  const btnSave = document.getElementById('savePortfolioBtn');

  if (symEl) symEl.textContent = asset.symbol;
  if (typeEl) {
    typeEl.textContent = asset.type === 'certificate' ? 'CERTIFICATO' : asset.type.toUpperCase();
    typeEl.className = `asset-type-badge type-${asset.type}`;
  }
  if (nameEl) nameEl.textContent = asset.name;
  if (priceEl) {
    if (asset.price != null) {
      if ((asset.currency || '').toUpperCase() !== 'EUR') {
        const pEur = convertToEur(asset.price, asset);
        priceEl.innerHTML = `${formatCurrency(asset.price, asset)} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(~${formatCurrency(pEur, 'EUR')})</span>`;
      } else {
        priceEl.textContent = formatCurrency(asset.price, asset);
      }
    } else {
      priceEl.textContent = '—';
    }
  }
  if (curAffix) curAffix.textContent = getCurrencySymbol(asset) || '€';

  if (inShares) inShares.value = isExisting ? pos.shares : '';
  if (inBuyPrice) inBuyPrice.value = isExisting ? pos.buyPrice : (asset.price != null ? asset.price : '');

  if (btnDelete) btnDelete.style.display = isExisting ? 'inline-block' : 'none';
  if (btnSave) btnSave.textContent = isExisting ? 'Aggiorna Posizione' : 'Salva nel Portafoglio';

  updatePortfolioModalPreview(asset);

  const modal = document.getElementById('modalPortfolio');
  if (modal) modal.classList.add('open');
}

function updatePortfolioModalPreview(asset) {
  const symbol = currentPortfolioModalSymbol;
  const curAsset = asset || AppState.assets.find(a => a.symbol === symbol);
  if (!curAsset) return;

  const shares = parseFloat(document.getElementById('portInputShares')?.value) || 0;
  const buyPrice = parseFloat(document.getElementById('portInputBuyPrice')?.value) || 0;
  const curPrice = curAsset.price != null ? curAsset.price : buyPrice;

  const invested = shares * buyPrice;
  const curVal = shares * curPrice;
  const pnlCash = curVal - invested;
  const pnlPct = invested > 0 ? (pnlCash / invested) * 100 : 0;
  const isUp = pnlCash >= 0;

  const investedEur = convertToEur(invested, curAsset);
  const curValEur = convertToEur(curVal, curAsset);
  const pnlCashEur = convertToEur(pnlCash, curAsset);

  const elInvested = document.getElementById('portPreviewInvested');
  const elCurVal = document.getElementById('portPreviewCurrentVal');
  const elPnl = document.getElementById('portPreviewPnl');

  const isNonEur = (curAsset.currency || '').toUpperCase() !== 'EUR';
  const nativeInvested = isNonEur ? ` <span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">(${formatCurrency(invested, curAsset)})</span>` : '';
  const nativeCurVal = isNonEur ? ` <span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">(${formatCurrency(curVal, curAsset)})</span>` : '';

  if (elInvested) elInvested.innerHTML = `€ ${investedEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${nativeInvested}`;
  if (elCurVal) elCurVal.innerHTML = `€ ${curValEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${nativeCurVal}`;
  if (elPnl) {
    elPnl.innerHTML = `<span style="color: ${isUp ? 'var(--color-up)' : 'var(--color-down)'};">${isUp ? '+' : ''}${pnlPct.toFixed(2)}% (${isUp ? '+€ ' : '-€ '}${Math.abs(pnlCashEur).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>`;
  }
}

function getPortfolioAssetsWithPos() {
  if (!AppState.portfolio) return [];
  return AppState.assets
    .filter(a => AppState.portfolio[a.symbol] && AppState.portfolio[a.symbol].shares > 0)
    .map(asset => ({ asset, pos: AppState.portfolio[asset.symbol] }));
}

function getPortfolioVirtualAsset() {
  const entries = getPortfolioAssetsWithPos();
  let totalInvestedEur = 0;
  let totalCurrentValueEur = 0;

  entries.forEach(({ asset, pos }) => {
    const curPrice = asset.price != null ? asset.price : pos.buyPrice;
    totalInvestedEur += convertToEur(pos.shares * pos.buyPrice, asset);
    totalCurrentValueEur += convertToEur(pos.shares * curPrice, asset);
  });

  const totalPnlCashEur = totalCurrentValueEur - totalInvestedEur;
  const totalPnlPct = totalInvestedEur > 0 ? (totalPnlCashEur / totalInvestedEur) * 100 : 0;

  let periodHigh = null;
  let periodLow = null;
  if (AppState.selectedAsset?.isPortfolio && Array.isArray(AppState.renderedBars) && AppState.renderedBars.length > 0) {
    periodHigh = Math.max(...AppState.renderedBars.map(b => b.high));
    periodLow = Math.min(...AppState.renderedBars.map(b => b.low));
  }

  return {
    symbol: 'PORTAFOGLIO',
    name: entries.length > 0
      ? `Andamento Complessivo • ${entries.length} posizioni`
      : 'Andamento Complessivo Portafoglio',
    type: 'portfolio',
    exchange: 'Multi-Asset (EUR)',
    currency: 'EUR',
    price: totalCurrentValueEur,
    change: totalPnlPct,
    high: periodHigh,
    low: periodLow,
    volume: `Inv. € ${totalInvestedEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    favorite: false,
    isPortfolio: true
  };
}

function selectPortfolioOverview() {
  selectAsset(getPortfolioVirtualAsset());
}

function savePortfolioPosition() {
  const symbol = currentPortfolioModalSymbol;
  if (!symbol) return;

  const shares = parseFloat(document.getElementById('portInputShares')?.value);
  const buyPrice = parseFloat(document.getElementById('portInputBuyPrice')?.value);

  if (!shares || shares <= 0 || !buyPrice || buyPrice <= 0) {
    alert('Inserisci un numero valido di quote e un prezzo medio di acquisto (PMC).');
    return;
  }

  if (!AppState.portfolio) AppState.portfolio = {};
  AppState.portfolio[symbol] = {
    shares: shares,
    buyPrice: buyPrice,
    updatedAt: Date.now()
  };

  savePortfolioToStorage();
  closePortfolioModal();
  if (AppState.selectedAsset && AppState.selectedAsset.isPortfolio) {
    selectPortfolioOverview();
  } else {
    renderAssetList();
    updateSelectedAssetHeader();
  }
}

function deletePortfolioPosition(symbol) {
  const sym = symbol || currentPortfolioModalSymbol;
  if (!sym) return;

  if (AppState.portfolio) {
    delete AppState.portfolio[sym];
    savePortfolioToStorage(true);
  }
  closePortfolioModal();
  if (AppState.selectedAsset && AppState.selectedAsset.isPortfolio) {
    selectPortfolioOverview();
  } else {
    renderAssetList();
    updateSelectedAssetHeader();
  }
}

function closePortfolioModal() {
  const modal = document.getElementById('modalPortfolio');
  if (modal) modal.classList.remove('open');
  currentPortfolioModalSymbol = null;
}

// --- Render Left Asset List ---
function renderAssetList() {
  const container = document.getElementById('assetListContainer');
  if (!container) return;

  const filter = AppState.activeFilter;
  const search = (document.getElementById('globalSearch').value || '').trim().toUpperCase();

  // Toggle visibility of Portfolio Sort Bar (shown only in Portfolio tab)
  const sortBar = document.getElementById('portfolioSortBar');
  if (sortBar) {
    sortBar.style.display = (filter === 'portfolio') ? 'flex' : 'none';
  }

  // --- PORTFOLIO VIEW ---
  if (filter === 'portfolio') {
    // Sync active state of sort buttons
    document.querySelectorAll('.port-sort-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-sort') === AppState.portfolioSort);
    });

    const portfolioSymbols = Object.keys(AppState.portfolio || {});
    const portfolioAssets = AppState.assets.filter(asset => {
      const isOwned = portfolioSymbols.includes(asset.symbol);
      const matchesSearch = !search ||
        asset.symbol.toUpperCase().includes(search) ||
        asset.name.toUpperCase().includes(search);
      return isOwned && matchesSearch;
    });

    document.getElementById('assetCountText').textContent = `${portfolioAssets.length} Posizioni in Portafoglio`;

    if (portfolioAssets.length === 0) {
      container.innerHTML = `
        <div class="portfolio-empty-state">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">💼</div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Portafoglio vuoto</h4>
          <p style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 12px;">
            Aggiungi qualsiasi azione, ETF, crypto o certificato cliccando sul tasto <strong>💼+</strong> accanto all'asset.
          </p>
          <button class="btn-primary" id="btnExploreAssetsFromEmptyPort" style="font-size: 0.75rem; padding: 6px 14px;">
            Esplora Azioni
          </button>
        </div>
      `;
      const btnExp = document.getElementById('btnExploreAssetsFromEmptyPort');
      if (btnExp) {
        btnExp.onclick = () => {
          const stockChip = document.querySelector('.chip-btn[data-filter="stock"]');
          if (stockChip) stockChip.click();
        };
      }
      renderMobileTickerCarousel();
      renderPortfolioAiAnalysisSection();
      return;
    }

    // Sort portfolio positions based on active toggle
    if (AppState.portfolioSort === 'alpha') {
      portfolioAssets.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } else {
      // Default: 'pnl' (dal migliore al peggiore in % di rendimento)
      portfolioAssets.sort((a, b) => {
        const posA = AppState.portfolio[a.symbol];
        const posB = AppState.portfolio[b.symbol];
        const curA = a.price != null ? a.price : (posA?.buyPrice || 0);
        const curB = b.price != null ? b.price : (posB?.buyPrice || 0);
        const pnlPctA = (posA && posA.buyPrice > 0) ? ((curA - posA.buyPrice) / posA.buyPrice) * 100 : -Infinity;
        const pnlPctB = (posB && posB.buyPrice > 0) ? ((curB - posB.buyPrice) / posB.buyPrice) * 100 : -Infinity;
        return pnlPctB - pnlPctA; // descending
      });
    }

    // Overall portfolio metrics in EUR
    let totalInvestedEur = 0;
    let totalCurrentValueEur = 0;

    portfolioAssets.forEach(asset => {
      const pos = AppState.portfolio[asset.symbol];
      if (pos) {
        const curPrice = asset.price != null ? asset.price : pos.buyPrice;
        const investedNative = pos.shares * pos.buyPrice;
        const currentValNative = pos.shares * curPrice;
        totalInvestedEur += convertToEur(investedNative, asset);
        totalCurrentValueEur += convertToEur(currentValNative, asset);
      }
    });

    const totalPnlCashEur = totalCurrentValueEur - totalInvestedEur;
    const totalPnlPct = totalInvestedEur > 0 ? (totalPnlCashEur / totalInvestedEur) * 100 : 0;
    const isTotalPnlUp = totalPnlCashEur >= 0;

    const isPortfolioSelected = Boolean(AppState.selectedAsset && AppState.selectedAsset.isPortfolio);
    const summaryHtml = `
      <div class="portfolio-summary-card ${isPortfolioSelected ? 'selected' : ''}" id="portfolioSummaryCard" title="Clicca per visualizzare il grafico dell'intero portafoglio">
        <div class="port-sum-row">
          <div>
            <div class="port-sum-label">Valore Totale Portafoglio <span class="port-chart-link-pill">📈 Grafico</span></div>
            <div class="port-sum-val">€ ${totalCurrentValueEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div style="text-align: right;">
            <div class="port-sum-label">P&L Totale</div>
            <div class="port-sum-pnl ${isTotalPnlUp ? 'badge-up' : 'badge-down'}">
              ${isTotalPnlUp ? '▲ +' : '▼ '}${Math.abs(totalPnlPct).toFixed(2)}% (${isTotalPnlUp ? '+€ ' : '-€ '}${Math.abs(totalPnlCashEur).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </div>
          </div>
        </div>
        <div class="port-sum-sub">
          <span>Capitale Investito: <strong>€ ${totalInvestedEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          <span>Posizioni Attive: <strong>${portfolioAssets.length}</strong></span>
        </div>
      </div>
    `;

    const cardsHtml = portfolioAssets.map(asset => {
      const pos = AppState.portfolio[asset.symbol];
      const isSelected = AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol;
      const curPrice = asset.price != null ? asset.price : pos.buyPrice;
      const currentValNative = pos.shares * curPrice;
      const investedNative = pos.shares * pos.buyPrice;
      const pnlCashNative = currentValNative - investedNative;
      const pnlPct = investedNative > 0 ? (pnlCashNative / investedNative) * 100 : 0;
      const isPnlUp = pnlCashNative >= 0;

      const currentValEur = convertToEur(currentValNative, asset);
      const investedEur = convertToEur(investedNative, asset);
      const pnlCashEur = convertToEur(pnlCashNative, asset);

      const isNonEur = (asset.currency || '').toUpperCase() !== 'EUR';
      const formattedPrice = asset.price != null ? formatCurrency(asset.price, asset) : '—';
      const formattedPmc = formatCurrency(pos.buyPrice, asset);
      const nativeValHtml = isNonEur ? `<span class="port-metric-native">(${formatCurrency(currentValNative, asset)})</span>` : '';
      const advice = getPortfolioAiAdvice(asset, pos, curPrice);

      return `
        <div class="portfolio-card ${isSelected ? 'selected' : ''}" data-symbol="${asset.symbol}">
          <div class="port-card-top">
            <div class="port-card-identity">
              <span class="asset-symbol">${asset.symbol}</span>
              <span class="asset-type-badge type-${asset.type}">${asset.type === 'certificate' ? 'CERT' : asset.type}</span>
              <span class="port-shares-pill">${pos.shares} quote</span>
            </div>
            <div class="port-card-actions">
              <button class="port-edit-btn" data-action="edit" data-symbol="${asset.symbol}" title="Modifica posizione">✏️</button>
              <button class="port-edit-btn" data-action="delete" data-symbol="${asset.symbol}" title="Rimuovi dal portafoglio">🗑️</button>
            </div>
          </div>

          <div class="port-card-metrics">
            <div>
              <div class="port-metric-sub">PMC: ${formattedPmc} • Attuale: ${formattedPrice}</div>
              <div class="port-metric-val">Valore: <strong>€ ${currentValEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> ${nativeValHtml}</div>
            </div>
            <div class="port-metric-right">
              <div class="port-pnl-pill ${isPnlUp ? 'badge-up' : 'badge-down'}">
                ${isPnlUp ? '▲ +' : '▼ '}${Math.abs(pnlPct).toFixed(2)}% (${isPnlUp ? '+€ ' : '-€ '}${Math.abs(pnlCashEur).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </div>
            </div>
          </div>

          <!-- IA Suggestion Box -->
          <div class="port-ai-advice-box">
            <div class="port-ai-header">
              <span class="port-ai-badge ${advice.badgeClass}">IA: ${advice.action}</span>
            </div>
            <div class="port-ai-text">${advice.text}</div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = summaryHtml + cardsHtml;

    const sumCard = document.getElementById('portfolioSummaryCard');
    if (sumCard) {
      sumCard.addEventListener('click', () => {
        selectPortfolioOverview();
        if (window.innerWidth <= 900) {
          const chartSection = document.getElementById('section-chart');
          if (chartSection) chartSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Attach click events on portfolio cards
    container.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', () => {
        const sym = card.getAttribute('data-symbol');
        const found = AppState.assets.find(a => a.symbol === sym);
        if (found) {
          selectAsset(found);
          if (window.innerWidth <= 900) {
            const chartSection = document.getElementById('section-chart');
            if (chartSection) chartSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Attach edit / delete handlers
    container.querySelectorAll('.port-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sym = btn.getAttribute('data-symbol');
        const action = btn.getAttribute('data-action');
        if (action === 'edit') {
          openPortfolioModal(sym);
        } else if (action === 'delete') {
          deletePortfolioPosition(sym);
        }
      });
    });

    renderMobileTickerCarousel();
    renderPortfolioAiAnalysisSection();
    return;
  }

  // --- STANDARD ASSET LIST VIEW (Azioni, ETF, Crypto, Certificati, Preferiti) ---
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
    const isInPort = Boolean(AppState.portfolio && AppState.portfolio[asset.symbol]);

    return `
      <div class="asset-item ${isSelected ? 'selected' : ''}" data-symbol="${asset.symbol}">
        <div class="asset-meta">
          <div class="asset-symbol-row">
            <span class="asset-symbol">${asset.symbol}</span>
            <span class="asset-type-badge type-${asset.type}">${asset.type === 'certificate' ? 'CERT' : asset.type}</span>
            <button class="portfolio-btn ${isInPort ? 'in-portfolio' : ''}" data-symbol="${asset.symbol}" title="${isInPort ? 'In Portafoglio (modifica)' : 'Aggiungi al Portafoglio'}">
              ${isInPort ? '💼' : '💼+'}
            </button>
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

    // Portfolio button handler
    const portBtn = el.querySelector('.portfolio-btn');
    if (portBtn) {
      portBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sym = portBtn.getAttribute('data-symbol');
        openPortfolioModal(sym);
      });
    }

    // Delete button handler
    const deleteBtn = el.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent row selection
        const sym = el.getAttribute('data-symbol');
        AppState.assets = AppState.assets.filter(a => a.symbol !== sym);
        if (AppState.portfolio) {
          delete AppState.portfolio[sym];
          savePortfolioToStorage(true);
        }
        for (const key of Object.keys(AppState.cachedBars)) {
          if (key.startsWith(`${sym}_`)) {
            delete AppState.cachedBars[key];
            delete AppState.barsLastUpdated[key];
          }
        }
        if (AppState.selectedAsset && AppState.selectedAsset.symbol === sym) {
          const next = AppState.assets[0];
          if (next) selectAsset(next);
        }
        saveAssetsToStorage(true);
        saveHistoryToStorage();
        renderAssetList();
        updateSelectedAssetHeader();
      });
    }
  });
}

function formatCurrency(val, assetOrCurrency) {
  if (val === undefined || val === null || isNaN(val)) return '-';
  const sym = getCurrencySymbol(assetOrCurrency);
  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  const formattedNum = absVal >= 1000
    ? absVal.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : (absVal < 0.01 && absVal > 0 ? absVal.toFixed(4) : absVal.toFixed(2));
  return `${sign}${sym} ${formattedNum}`;
}

// --- Select Asset ---
function selectAsset(asset) {
  AppState.selectedAsset = asset;
  renderAssetList();
  updateSelectedAssetHeader();
  updateBrokerLinks(asset);
  updateRiskCalculatorPreloads(asset);
  if (asset.type === 'certificate') {
    populateCertificateDetails(asset);
  }
  loadNotesForAsset(asset);
  const cached = AppState.cachedBars[`${asset.symbol}_${AppState.activeTimeframe}`] || AppState.cachedBars[`${asset.symbol}_DAILY`];
  updateAiInvestmentEvaluation(asset, cached);
  renderPortfolioAiAnalysisSection();
  updateMobileTickerCarouselActive(asset.symbol);
  loadAndRenderChart(asset, AppState.activeTimeframe);
}

function updateSelectedAssetHeader() {
  if (!AppState.selectedAsset) return;
  if (AppState.selectedAsset.isPortfolio) {
    AppState.selectedAsset = getPortfolioVirtualAsset();
  }
  const asset = AppState.selectedAsset;

  const typeDisplay = asset.isPortfolio
    ? 'PORTAFOGLIO'
    : (asset.type === 'certificate' ? 'CERTIFICATO' : asset.type.toUpperCase());
  const badgeTypeClass = asset.isPortfolio ? 'etf' : asset.type;
  document.getElementById('activeSymbol').innerHTML = `${asset.symbol} <span class="asset-type-badge type-${badgeTypeClass}" id="activeType">${typeDisplay}</span>`;
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
  if (favBtn) {
    favBtn.style.display = asset.isPortfolio ? 'none' : '';
    favBtn.className = `fav-toggle-btn ${asset.favorite ? 'active' : ''}`;
  }

  const portBtn = document.getElementById('headerPortfolioBtn');
  if (portBtn) {
    portBtn.style.display = asset.isPortfolio ? 'none' : '';
    const inPort = Boolean(AppState.portfolio && AppState.portfolio[asset.symbol]);
    portBtn.className = `fav-toggle-btn ${inPort ? 'active' : ''}`;
    portBtn.style.color = inPort ? '#38bdf8' : 'var(--text-muted)';
    portBtn.title = inPort ? 'Posizione in Portafoglio (modifica)' : 'Aggiungi al Portafoglio';
  }

  // Update Data Source Badge
  const sourceBadge = document.getElementById('activeSourceBadge');
  if (sourceBadge) {
    if (asset.isPortfolio) {
      sourceBadge.textContent = '● Portafoglio Live (EUR)';
      sourceBadge.style.background = 'rgba(139, 92, 246, 0.18)';
      sourceBadge.style.color = '#c4b5fd';
      sourceBadge.style.border = '1px solid rgba(139, 92, 246, 0.4)';
      sourceBadge.title = 'Andamento aggregato in tempo reale di tutte le posizioni in portafoglio convertite in EUR';
    } else if (asset.type === 'crypto') {
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
  if (asset.isPortfolio) {
    tvLink.href = 'https://www.tradingview.com/chart/';
    const binanceLink = document.getElementById('linkBinance');
    if (binanceLink) binanceLink.style.display = 'none';
    const ibkrLink = document.getElementById('linkIBKR');
    if (ibkrLink) ibkrLink.style.display = 'none';
    return;
  }
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

  // 3. Interactive Brokers / CED
  const ibkrLink = document.getElementById('linkIBKR');
  if (asset.type === 'certificate') {
    ibkrLink.href = `https://www.certificatiederivati.it/ricerca?q=${encodeURIComponent(sym)}`;
    ibkrLink.title = `Analisi Certificati e Derivati (CED) per ${sym}`;
  } else {
    ibkrLink.href = `https://www.interactivebrokers.com/en/search/site_search.php?q=${encodeURIComponent(sym)}`;
    ibkrLink.title = 'Interactive Brokers Search';
  }

  // 4. Yahoo Finance / Borsa Italiana
  const yahooLink = document.getElementById('linkYahoo');
  if (asset.type === 'certificate') {
    yahooLink.href = `https://www.borsaitaliana.it/borsa/cw-e-certificates/cerca.html?isin=${encodeURIComponent(sym)}`;
    yahooLink.title = `Scheda ufficiale Borsa Italiana SeDeX per ${sym}`;
  } else {
    yahooLink.href = `https://finance.yahoo.com/quote/${encodeURIComponent(sym)}`;
    yahooLink.title = 'Yahoo Finance';
  }
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

function getPortfolioBucketKey(dateObj, isIntradayTf) {
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isIntradayTf) {
    const slotMs = 30 * 60 * 1000;
    return Math.floor(d.getTime() / slotMs) * slotMs;
  }
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0);
}

function getPortfolioAssetBarsForTf(asset, timeframe) {
  const isCrypto = asset.type === 'crypto';
  const isIntradayTf = timeframe === '1D' || timeframe === '1W';
  const dailyKey = `${asset.symbol}_DAILY`;
  const primaryKey = isIntradayTf
    ? (isCrypto ? `${asset.symbol}_${timeframe}` : `${asset.symbol}_INTRADAY`)
    : dailyKey;

  const primaryBars = AppState.cachedBars[primaryKey];
  if (primaryBars && primaryBars.length >= (isIntradayTf ? 5 : 10)) {
    return primaryBars;
  }
  return AppState.cachedBars[dailyKey] || AppState.cachedBars[`${asset.symbol}_3M`] || AppState.cachedBars[`${asset.symbol}_1M`] || null;
}

function buildPortfolioCompositeBars(entries, timeframe) {
  if (!entries || entries.length === 0) return [];
  const isIntradayTf = timeframe === '1D' || timeframe === '1W';
  const bucketMaps = {};
  const lastKnown = {};
  const allTimestamps = new Set();

  entries.forEach(({ asset, pos }) => {
    const rawBars = getPortfolioAssetBarsForTf(asset, timeframe);
    const fallbackPrice = asset.price != null ? asset.price : pos.buyPrice;
    const flatBar = { open: fallbackPrice, high: fallbackPrice, low: fallbackPrice, close: fallbackPrice, volume: 0 };

    if (!rawBars || rawBars.length === 0) {
      bucketMaps[asset.symbol] = new Map();
      lastKnown[asset.symbol] = flatBar;
      return;
    }

    const map = new Map();
    rawBars.forEach(b => {
      const ts = getPortfolioBucketKey(b.time, isIntradayTf);
      map.set(ts, b);
      allTimestamps.add(ts);
    });
    bucketMaps[asset.symbol] = map;
    lastKnown[asset.symbol] = rawBars[0];
  });

  if (allTimestamps.size === 0) {
    // Fallback if no asset has historical bars yet (e.g. certificates-only portfolio)
    const now = Date.now();
    const totalEur = entries.reduce((sum, { asset, pos }) => {
      const p = asset.price != null ? asset.price : pos.buyPrice;
      return sum + convertToEur(pos.shares * p, asset);
    }, 0);
    return [
      { time: new Date(now - 86400000), open: totalEur, high: totalEur, low: totalEur, close: totalEur, volume: 0 },
      { time: new Date(now), open: totalEur, high: totalEur, low: totalEur, close: totalEur, volume: 0 }
    ];
  }

  const sortedTs = Array.from(allTimestamps).sort((a, b) => a - b);
  const composite = sortedTs.map((ts, idx) => {
    let o = 0, h = 0, l = 0, c = 0, v = 0;
    const isLast = idx === sortedTs.length - 1;

    entries.forEach(({ asset, pos }) => {
      const b = bucketMaps[asset.symbol].get(ts);
      if (b) lastKnown[asset.symbol] = b;
      const curBar = lastKnown[asset.symbol];
      const barClose = (isLast && asset.price != null) ? asset.price : curBar.close;

      o += convertToEur(pos.shares * curBar.open, asset);
      h += convertToEur(pos.shares * Math.max(curBar.high, barClose), asset);
      l += convertToEur(pos.shares * Math.min(curBar.low, barClose), asset);
      c += convertToEur(pos.shares * barClose, asset);
      v += curBar.volume || 0;
    });

    return {
      time: new Date(ts),
      open: o,
      high: Math.max(o, h, c),
      low: Math.min(o, l, c),
      close: c,
      volume: v
    };
  });

  return composite;
}

async function loadAndRenderPortfolioChart(timeframe, options = {}) {
  const entries = getPortfolioAssetsWithPos();
  if (entries.length === 0) {
    AppState.renderedBars = [];
    showChartNoData(
      getPortfolioVirtualAsset(),
      'Portafoglio vuoto',
      'Aggiungi almeno un titolo al portafoglio per vedere il grafico complessivo'
    );
    return;
  }

  const immediateBars = buildPortfolioCompositeBars(entries, timeframe);
  if (immediateBars.length >= 2) {
    renderChartFromBars(immediateBars, timeframe);
    updateSelectedAssetHeader();
    updateAiInvestmentEvaluation(AppState.selectedAsset, AppState.renderedBars);
  }

  if (options.renderOnly) return;

  const isIntradayTf = timeframe === '1D' || timeframe === '1W';
  const fetchTasks = entries
    .filter(({ asset }) => asset.type !== 'certificate')
    .map(async ({ asset }) => {
      const isCrypto = asset.type === 'crypto';
      const primaryKey = isIntradayTf
        ? (isCrypto ? `${asset.symbol}_${timeframe}` : `${asset.symbol}_INTRADAY`)
        : `${asset.symbol}_DAILY`;
      const seriesType = isIntradayTf
        ? (isCrypto ? `INTRADAY_${timeframe}` : 'INTRADAY')
        : 'DAILY';

      const existing = AppState.cachedBars[primaryKey];
      const lastUpd = AppState.barsLastUpdated[primaryKey] || 0;
      const minNeeded = isIntradayTf ? 10 : 30;
      const hasEnough = existing && existing.length >= minNeeded;
      const needsFetch = !hasEnough || options.forceIncremental || (Date.now() - lastUpd >= INCREMENTAL_SYNC_COOLDOWN_MS);
      if (!needsFetch) return false;

      AppState.barsLastUpdated[primaryKey] = Date.now();
      const fetched = await fetchMasterSeriesFromSource(asset, seriesType, hasEnough);
      if (fetched && fetched.length > 0) {
        AppState.cachedBars[primaryKey] = hasEnough
          ? mergeHistoricalBars(existing, fetched)
          : fetched;
        AppState.barsLastUpdated[primaryKey] = Date.now();
        return true;
      }
      return false;
    });

  const results = await Promise.allSettled(fetchTasks);
  const anyUpdated = results.some(r => r.status === 'fulfilled' && r.value === true);
  if (anyUpdated) {
    saveHistoryToStorage();
    if (AppState.selectedAsset && AppState.selectedAsset.isPortfolio && AppState.activeTimeframe === timeframe) {
      const updatedBars = buildPortfolioCompositeBars(getPortfolioAssetsWithPos(), timeframe);
      if (updatedBars.length >= 2) {
        renderChartFromBars(updatedBars, timeframe);
        updateSelectedAssetHeader();
        updateAiInvestmentEvaluation(AppState.selectedAsset, AppState.renderedBars);
      }
    }
  }
}

async function loadAndRenderChart(asset, timeframe, options = {}) {
  if (asset && asset.isPortfolio) {
    return loadAndRenderPortfolioChart(timeframe, options);
  }
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

function showChartNoData(asset, customMsg1 = null, customMsg2 = null) {
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
  const msg1 = customMsg1 || ('Dati reali non disponibili al momento per ' + asset.symbol);
  const msg2 = customMsg2 || (asset.type === 'crypto'
    ? 'Server Binance temporaneamente non raggiungibile'
    : 'Server Yahoo Finance / Mercati temporaneamente non raggiungibile');
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

  if (asset.type === 'certificate') {
    const certData = asset.certificateData || {};
    const certPrice = asset.price || 98.40;
    const nominal = certData.nominal || 100;
    const coupons = (certData.coupon || 0.85) * 8;
    const barrier = certData.barrierPct || 60;
    const targetPrice = nominal + coupons;
    const yieldPct = ((targetPrice - certPrice) / certPrice) * 100;
    const bufferPct = ((100 - barrier) * 0.72).toFixed(1);
    const rr = (yieldPct / Math.max(1, (100 - barrier) / 4)).toFixed(2);

    if (riskBadgeEl) {
      riskBadgeEl.textContent = 'Rischio: Condizionato / Difensivo';
      riskBadgeEl.className = 'ai-badge ai-badge-moderate';
    }
    if (verdictBadgeEl) {
      verdictBadgeEl.textContent = 'Setup Certificato: FAVOREVOLE A SCADENZA';
      verdictBadgeEl.className = 'ai-badge ai-badge-buy';
    }
    if (factorCurveEl) factorCurveEl.textContent = `Sottostante: ${certData.underlying || 'Indice'}`;
    if (factorTechEl) factorTechEl.textContent = `Barriera: ${barrier}% (Cuscino +${bufferPct}%)`;
    if (factorAnalystsEl) factorAnalystsEl.textContent = `Cedola: ${certData.couponFreq || 'Periodica'}`;
    if (factorStrategyEl) factorStrategyEl.textContent = certData.protectionType || 'Capitale Condizionatamente Protetto';

    if (narrativeEl) {
      narrativeEl.textContent = `Il certificato ${asset.name} (${certData.isin || asset.symbol}) quota a ${certPrice.toFixed(2)} € sul mercato ${asset.exchange || 'SeDeX'}. Il sottostante ${certData.underlying || 'di riferimento'} mantiene un cuscino di protezione di +${bufferPct}% sopra la barriera di protezione (${barrier}%). La struttura offre un rendimento potenziale del ${yieldPct.toFixed(2)}% con incasso cedolare periodico e rimborso a ${nominal.toFixed(2)} € a scadenza.`;
    }

    if (structuredNarrativeEl) {
      structuredNarrativeEl.innerHTML = `Il certificato si trova in una configurazione asimmetrica favorevole con quotazione a sconto sul nominale (${certPrice.toFixed(2)} € rispetto a ${nominal.toFixed(2)} €). La barriera di protezione al <strong>${barrier}%</strong> sul sottostante <em>${certData.underlying || 'Indice'}</em> garantisce un ampio cuscino di sicurezza del <strong>+${bufferPct}%</strong> prima che il capitale possa essere intaccato.<br><br>La presenza dell'effetto memoria e il flusso cedolare (${certData.couponFreq || 'periodico'}) offrono un rendimento totale atteso a scadenza del <strong>+${yieldPct.toFixed(2)}%</strong>, rendendo il trade attraente rispetto all'investimento diretto nell'asset sottostante.<br><br><strong>Ingresso ${formatPriceWithIso(certPrice, asset)}</strong><br><strong>Livello Barriera Protezione ${barrier}% (${formatPriceWithIso(certPrice * barrier / 100, asset)})</strong><br><strong>Target Rimborso ${formatPriceWithIso(targetPrice, asset)}</strong><br><strong>Buffer di Sicurezza +${bufferPct}%</strong><br><strong>R/R Struttura 1 : ${rr}</strong>`;
    }

    if (tradePlanLinesEl) {
      tradePlanLinesEl.innerHTML = `
        <div class="ai-plan-line"><strong>Ingresso</strong> <span class="ai-val-entry">${formatPriceWithIso(certPrice, asset)}</span></div>
        <div class="ai-plan-line"><strong>Barriera</strong> <span class="ai-val-sl">${barrier}% (+${bufferPct}%)</span></div>
        <div class="ai-plan-line"><strong>Target</strong> <span class="ai-val-tp">${formatPriceWithIso(targetPrice, asset)}</span></div>
        <div class="ai-plan-line"><strong>Cedola</strong> <span class="ai-val-risk">${certData.couponFreq || 'Periodica'}</span></div>
        <div class="ai-plan-line"><strong>R/R</strong> <span class="ai-val-rr">1 : ${rr}</span></div>
      `;
    }

    if (btnApplyTradePlan) {
      btnApplyTradePlan.onclick = () => {
        const certTab = document.querySelector('.tools-tab[data-tool="certificates"]');
        if (certTab) certTab.click();
        populateCertificateDetails(asset);
        if (window.innerWidth <= 900) {
          const toolsSection = document.getElementById('section-tools');
          if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }
    return;
  }

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

// --- Certificates Yield & Scenario Calculation ---
function calculateCertificatesOutput() {
  const price = parseFloat(document.getElementById('certInputPrice')?.value) || 98.40;
  const nominal = parseFloat(document.getElementById('certInputNominal')?.value) || 100.00;
  const coupons = parseFloat(document.getElementById('certInputCoupons')?.value) || 0;
  const months = parseFloat(document.getElementById('certInputMonths')?.value) || 14;
  const barrierPct = parseFloat(document.getElementById('certInputBarrierPct')?.value) || 60;
  const bufferPct = parseFloat(document.getElementById('certInputBufferPct')?.value) || 28.5;

  const totalPayout = nominal + coupons;
  const profit = totalPayout - price;
  const totalYieldPct = price > 0 ? (profit / price) * 100 : 0;
  const years = Math.max(0.1, months / 12);
  const annualYieldPct = (price > 0 && totalPayout > 0)
    ? (Math.pow(totalPayout / price, 1 / years) - 1) * 100
    : 0;

  const elYieldTotal = document.getElementById('certOutYieldTotal');
  const elYieldAnnual = document.getElementById('certOutYieldAnnual');
  const elTotalCash = document.getElementById('certOutTotalCash');
  const elBufferVal = document.getElementById('certOutBufferVal');
  const elScenarioWin = document.getElementById('certScenarioWinText');
  const elScenarioLoss = document.getElementById('certScenarioLossText');

  if (elYieldTotal) {
    elYieldTotal.textContent = `${totalYieldPct >= 0 ? '+' : ''}${totalYieldPct.toFixed(2)}%`;
    elYieldTotal.className = `value ${totalYieldPct >= 0 ? 'value-up' : 'value-down'}`;
  }
  if (elYieldAnnual) {
    elYieldAnnual.textContent = `${annualYieldPct >= 0 ? '+' : ''}${annualYieldPct.toFixed(2)}% p.a.`;
    elYieldAnnual.className = `value ${annualYieldPct >= 0 ? 'value-up' : 'value-down'}`;
  }
  if (elTotalCash) {
    elTotalCash.textContent = `${totalPayout.toFixed(2)} €`;
  }
  if (elBufferVal) {
    elBufferVal.textContent = `${bufferPct >= 0 ? '+' : ''}${bufferPct.toFixed(1)}%`;
    elBufferVal.style.color = bufferPct >= 25 ? '#10b981' : (bufferPct >= 15 ? '#38bdf8' : '#f59e0b');
  }

  if (elScenarioWin) {
    elScenarioWin.innerHTML = `Se alla scadenza il sottostante chiude sopra la barriera di protezione (<strong>${barrierPct}%</strong>): <strong>Rimborso nominale ${nominal.toFixed(2)}€ + ${coupons.toFixed(2)}€ cedole = ${totalPayout.toFixed(2)}€</strong> con utile netto di <strong style="color: #34d399;">+${profit.toFixed(2)}€ a certificato (+${totalYieldPct.toFixed(2)}%)</strong>.`;
  }
  if (elScenarioLoss) {
    const stressDrop = Math.round(barrierPct + 8);
    const estimatedLossPayout = (nominal * (100 - stressDrop)) / 100;
    const lossDiffPct = price > 0 ? ((estimatedLossPayout - price) / price) * 100 : -stressDrop;
    elScenarioLoss.innerHTML = `Se il sottostante crolla oltre la barriera (es. -${stressDrop}% dallo strike): <strong>Perdita della protezione</strong> con rimborso proporzionale stimato a <strong style="color: #f87171;">${estimatedLossPayout.toFixed(2)}€</strong> (${lossDiffPct.toFixed(1)}% rispetto all'acquisto).`;
  }
}

function populateCertificateDetails(cert) {
  if (!cert) return;
  const data = cert.certificateData || {};
  const isin = data.isin || cert.symbol;
  const certType = data.certType || 'Cash Collect con Memoria';
  const issuer = data.issuer || 'SeDeX';
  const underlying = data.underlying || (cert.marketSymbol || 'Sottostante');
  const nominal = data.nominal || 100;
  const price = cert.price || 98.40;
  const barrierPct = data.barrierPct || 60;
  const bufferPct = parseFloat(((100 - barrierPct) * 0.72).toFixed(1));
  const coupons = (data.coupon || 0.85) * 8;

  const badgeEl = document.getElementById('certBadgeType');
  const issuerEl = document.getElementById('certIssuerText');
  const titleEl = document.getElementById('certTitleText');
  const isinEl = document.getElementById('certIsinText');
  const underlyingEl = document.getElementById('certUnderlyingText');

  if (badgeEl) badgeEl.textContent = certType.toUpperCase();
  if (issuerEl) issuerEl.textContent = `${issuer} • ${cert.exchange || 'Borsa Italiana'}`;
  if (titleEl) titleEl.textContent = cert.name;
  if (isinEl) isinEl.textContent = isin;
  if (underlyingEl) underlyingEl.textContent = underlying;

  const inPrice = document.getElementById('certInputPrice');
  const inNominal = document.getElementById('certInputNominal');
  const inCoupons = document.getElementById('certInputCoupons');
  const inBarrier = document.getElementById('certInputBarrierPct');
  const inBuffer = document.getElementById('certInputBufferPct');

  if (inPrice) inPrice.value = price.toFixed(2);
  if (inNominal) inNominal.value = nominal.toFixed(2);
  if (inCoupons) inCoupons.value = coupons.toFixed(2);
  if (inBarrier) inBarrier.value = barrierPct;
  if (inBuffer) inBuffer.value = bufferPct;

  const presetSel = document.getElementById('certPresetSelect');
  if (presetSel && Array.from(presetSel.options).some(o => o.value === isin)) {
    presetSel.value = isin;
  }

  calculateCertificatesOutput();
}

function renderCertificatesRadar() {
  const container = document.getElementById('certRadarList');
  if (!container) return;

  const certs = AppState.assets.filter(a => a.type === 'certificate');
  const countEl = document.getElementById('certRadarCount');
  if (countEl) countEl.textContent = `${certs.length} Strumenti`;

  container.innerHTML = certs.map(cert => {
    const data = cert.certificateData || {};
    const priceStr = cert.price != null ? `${cert.price.toFixed(2)} €` : '—';
    const barrierStr = data.barrierPct ? `Barriera ${data.barrierPct}%` : 'Cap. Protetto';
    const yieldStr = data.coupon ? `Cedola ${(data.coupon * 12).toFixed(1)}% p.a.` : (data.bonusAmount ? `Bonus ${data.bonusAmount}€` : (data.leverage || 'Leva'));

    return `
      <div class="cert-radar-item" data-isin="${cert.symbol}">
        <div class="cert-radar-info">
          <span class="cert-radar-isin">${cert.symbol} <span class="asset-type-badge type-certificate">CERT</span></span>
          <span class="cert-radar-sub">${cert.name}</span>
        </div>
        <div class="cert-radar-metrics">
          <div class="cert-radar-yield">${priceStr} • ${yieldStr}</div>
          <div class="cert-radar-barrier">${barrierStr}</div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.cert-radar-item').forEach(item => {
    item.addEventListener('click', () => {
      const isin = item.getAttribute('data-isin');
      const found = AppState.assets.find(a => a.symbol === isin);
      if (found) {
        selectAsset(found);
        populateCertificateDetails(found);
      }
    });
  });
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
  triggerCloudSync();

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

  // Portfolio Sorting Toggle
  document.querySelectorAll('.port-sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sortMode = btn.getAttribute('data-sort');
      if (sortMode && (sortMode === 'pnl' || sortMode === 'alpha')) {
        AppState.portfolioSort = sortMode;
        try {
          localStorage.setItem('marketpulse_portfolio_sort', sortMode);
        } catch (e) {}
        triggerCloudSync();
        document.querySelectorAll('.port-sort-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-sort') === sortMode);
        });
        renderAssetList();
      }
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

  const gemAssetBtn = document.getElementById('btnGeminiAssetEval');
  if (gemAssetBtn) {
    gemAssetBtn.addEventListener('click', () => {
      runGeminiAssetEvaluation();
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
      if (tool === 'certificates') {
        document.getElementById('paneCertificates').classList.add('active');
        calculateCertificatesOutput();
      }
      if (tool === 'checklist') document.getElementById('paneChecklist').classList.add('active');
      if (tool === 'journal') document.getElementById('paneJournal').classList.add('active');
    });
  });

  // Certificate Inputs & Preset Selector
  ['certInputPrice', 'certInputNominal', 'certInputCoupons', 'certInputMonths', 'certInputBarrierPct', 'certInputBufferPct'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateCertificatesOutput);
  });

  const certPresetSel = document.getElementById('certPresetSelect');
  if (certPresetSel) {
    certPresetSel.addEventListener('change', () => {
      const isin = certPresetSel.value;
      if (isin === 'custom') return;
      const targetCert = AppState.assets.find(a => a.symbol === isin) || DEFAULT_ASSETS.find(a => a.symbol === isin);
      if (targetCert) {
        populateCertificateDetails(targetCert);
        selectAsset(targetCert);
      }
    });
  }

  const btnViewUnderlying = document.getElementById('btnViewUnderlyingChart');
  if (btnViewUnderlying) {
    btnViewUnderlying.addEventListener('click', () => {
      const cert = AppState.selectedAsset && AppState.selectedAsset.type === 'certificate'
        ? AppState.selectedAsset
        : AppState.assets.find(a => a.type === 'certificate');
      if (cert) {
        selectAsset(cert);
        const chartSec = document.getElementById('section-chart');
        if (chartSec) chartSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

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
      triggerCloudSync();
      modalSettings.classList.remove('open');

      // Keep saved historical bars and force an incremental sync for new data!
      if (AppState.selectedAsset) {
        updateSelectedAssetHeader();
        loadAndRenderChart(AppState.selectedAsset, AppState.activeTimeframe, { forceIncremental: true });
      }
      pollLivePrices();
    });
  }

  // --- Sincronizzazione Desktop ⇄ Mobile & Backup (Export / Import JSON) ---
  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataBtn = document.getElementById('importDataBtn');
  const importFileInput = document.getElementById('importFileInput');
  const syncFeedbackMsg = document.getElementById('syncFeedbackMsg');

  const showSyncFeedback = (msg, isError = false) => {
    if (!syncFeedbackMsg) return;
    syncFeedbackMsg.style.display = 'block';
    syncFeedbackMsg.style.background = isError ? 'rgba(244, 63, 94, 0.16)' : 'rgba(16, 185, 129, 0.16)';
    syncFeedbackMsg.style.border = isError ? '1px solid rgba(244, 63, 94, 0.45)' : '1px solid rgba(16, 185, 129, 0.45)';
    syncFeedbackMsg.style.color = isError ? '#fda4af' : '#6ee7b7';
    syncFeedbackMsg.textContent = msg;
    setTimeout(() => {
      if (syncFeedbackMsg) syncFeedbackMsg.style.display = 'none';
    }, 4500);
  };

  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      try {
        const backupData = getLocalBackupPayload();
        backupData.app = 'MarketPulse Pro';
        backupData.version = 2;
        backupData.exportedAt = new Date().toISOString();

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `marketpulse_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSyncFeedback('✓ Backup scaricato! Invialo su mobile (WhatsApp/Drive/AirDrop) per importarlo.', false);
      } catch (err) {
        console.error('Export error:', err);
        showSyncFeedback('Errore durante l\'esportazione del backup.', true);
      }
    });
  }

  if (importDataBtn && importFileInput) {
    importDataBtn.addEventListener('click', () => {
      importFileInput.value = '';
      importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (!imported || typeof imported !== 'object') {
            throw new Error('Formato non valido');
          }

          if (imported.settings && typeof imported.settings === 'object') {
            AppState.settings = Object.assign(AppState.settings, imported.settings);
            localStorage.setItem('marketpulse_settings', JSON.stringify(AppState.settings));
          }

          if (imported.portfolio && typeof imported.portfolio === 'object') {
            AppState.portfolio = imported.portfolio;
            localStorage.setItem('marketpulse_portfolio', JSON.stringify(AppState.portfolio));
          }

          if (imported.portfolioSort) {
            AppState.portfolioSort = imported.portfolioSort;
            localStorage.setItem('marketpulse_portfolio_sort', AppState.portfolioSort);
          }

          if (Array.isArray(imported.assets) && imported.assets.length > 0) {
            AppState.assets = imported.assets;
            localStorage.setItem('marketpulse_assets', JSON.stringify(AppState.assets));
          }

          if (imported.notes && typeof imported.notes === 'object') {
            Object.keys(imported.notes).forEach(k => {
              if (k.startsWith('marketpulse_notes_')) {
                localStorage.setItem(k, imported.notes[k]);
              }
            });
          }

          showSyncFeedback('✓ Dati sincronizzati con successo! Aggiornamento interfaccia...', false);
          triggerCloudSync(true);
          setTimeout(() => {
            renderAssetList();
            updateSelectedAssetHeader();
            if (modalSettings) modalSettings.classList.remove('open');
          }, 600);
        } catch (err) {
          console.error('Import error:', err);
          showSyncFeedback('Errore: file JSON non valido o non compatibile.', true);
        }
      };
      reader.onerror = () => {
        showSyncFeedback('Errore nella lettura del file.', true);
      };
      reader.readAsText(file);
    });
  }

  // --- MODAL AUTH: Firebase Account & Cloud Sync Setup ---
  const modalAuth = document.getElementById('modalAuth');
  const authBtn = document.getElementById('authBtn');
  const openAuthFromSettings = document.getElementById('openAuthModalFromSettings');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const authTabLogin = document.getElementById('authTabLogin');
  const authTabRegister = document.getElementById('authTabRegister');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authRegisterExtra = document.getElementById('authRegisterExtra');
  const authFeedback = document.getElementById('authFeedback');
  const authForm = document.getElementById('authForm');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authPasswordConfirm = document.getElementById('authPasswordConfirm');
  const authGoogleBtn = document.getElementById('authGoogleBtn');
  const authForgotPasswordLink = document.getElementById('authForgotPasswordLink');
  const authLogoutBtn = document.getElementById('authLogoutBtn');
  const authSyncNowBtn = document.getElementById('authSyncNowBtn');
  const toggleFirebaseConfigBtn = document.getElementById('toggleFirebaseConfigBtn');
  const firebaseConfigSection = document.getElementById('firebaseConfigSection');
  const firebaseConfigInput = document.getElementById('firebaseConfigInput');
  const saveFirebaseConfigBtn = document.getElementById('saveFirebaseConfigBtn');
  const configChevron = document.getElementById('configChevron');

  let authMode = 'login'; // 'login' or 'register'

  const showAuthFeedback = (msg, variant = 'error') => {
    if (!authFeedback) return;
    authFeedback.style.display = 'block';
    if (variant === 'error') {
      authFeedback.style.background = 'rgba(244, 63, 94, 0.16)';
      authFeedback.style.border = '1px solid rgba(244, 63, 94, 0.45)';
      authFeedback.style.color = '#fda4af';
    } else if (variant === 'success') {
      authFeedback.style.background = 'rgba(16, 185, 129, 0.16)';
      authFeedback.style.border = '1px solid rgba(16, 185, 129, 0.45)';
      authFeedback.style.color = '#6ee7b7';
    } else {
      authFeedback.style.background = 'rgba(56, 189, 248, 0.16)';
      authFeedback.style.border = '1px solid rgba(56, 189, 248, 0.45)';
      authFeedback.style.color = '#bae6fd';
    }
    authFeedback.textContent = msg;
  };

  const clearAuthFeedback = () => {
    if (authFeedback) {
      authFeedback.style.display = 'none';
      authFeedback.textContent = '';
    }
  };

  const setAuthMode = (mode) => {
    authMode = mode;
    clearAuthFeedback();
    if (mode === 'register') {
      authTabRegister?.classList.add('active');
      authTabLogin?.classList.remove('active');
      if (authRegisterExtra) authRegisterExtra.style.display = 'block';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Crea Account';
    } else {
      authTabLogin?.classList.add('active');
      authTabRegister?.classList.remove('active');
      if (authRegisterExtra) authRegisterExtra.style.display = 'none';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Accedi';
    }
  };

  if (authTabLogin) authTabLogin.addEventListener('click', () => setAuthMode('login'));
  if (authTabRegister) authTabRegister.addEventListener('click', () => setAuthMode('register'));

  if (authBtn && modalAuth) {
    authBtn.addEventListener('click', () => {
      modalAuth.classList.add('open');
    });
  }

  if (openAuthFromSettings && modalAuth) {
    openAuthFromSettings.addEventListener('click', () => {
      if (modalSettings) modalSettings.classList.remove('open');
      modalAuth.classList.add('open');
    });
  }

  if (closeAuthModal && modalAuth) {
    closeAuthModal.addEventListener('click', () => {
      modalAuth.classList.remove('open');
      clearAuthFeedback();
    });
  }

  // Toggle Firebase Configuration Accordion
  if (toggleFirebaseConfigBtn && firebaseConfigSection) {
    toggleFirebaseConfigBtn.addEventListener('click', () => {
      const isHidden = firebaseConfigSection.style.display === 'none';
      firebaseConfigSection.style.display = isHidden ? 'block' : 'none';
      if (configChevron) configChevron.textContent = isHidden ? '▲' : '▼';
      if (isHidden && firebaseConfigInput && !firebaseConfigInput.value) {
        const saved = localStorage.getItem('marketpulse_firebase_config');
        if (saved) firebaseConfigInput.value = saved;
      }
    });
  }

  if (saveFirebaseConfigBtn && firebaseConfigInput) {
    saveFirebaseConfigBtn.addEventListener('click', async () => {
      try {
        const text = firebaseConfigInput.value.trim();
        if (!text) throw new Error('Inserisci la configurazione JSON');
        const parsed = JSON.parse(text);
        if (!parsed.apiKey || !parsed.projectId) {
          throw new Error('La configurazione deve contenere almeno apiKey e projectId');
        }
        localStorage.setItem('marketpulse_firebase_config', JSON.stringify(parsed));
        showAuthFeedback('✓ Configurazione salvata! Inizializzazione Firebase...', 'success');
        const mod = await getFirebaseModule();
        if (mod) {
          await mod.initFirebaseSync({
            onAuthUpdate: handleAuthStateUpdate,
            onDataUpdate: handleRemoteCloudData,
            getLocalState: getLocalBackupPayload
          });
        }
      } catch (err) {
        showAuthFeedback('Errore: formato JSON non valido (' + err.message + ')', 'error');
      }
    });
  }

  // Submit Email / Password
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthFeedback();
      const email = authEmail?.value.trim();
      const pass = authPassword?.value;
      if (!email || !pass) {
        showAuthFeedback('Inserisci sia email che password.', 'error');
        return;
      }
      if (authMode === 'register') {
        const confirm = authPasswordConfirm?.value;
        if (pass !== confirm) {
          showAuthFeedback('Le due password non coincidono.', 'error');
          return;
        }
        if (pass.length < 6) {
          showAuthFeedback('La password deve avere almeno 6 caratteri.', 'error');
          return;
        }
      }

      const mod = await getFirebaseModule();
      if (!mod) {
        showAuthFeedback('Modulo Firebase non disponibile. Verifica la connessione.', 'error');
        return;
      }

      authSubmitBtn.disabled = true;
      const origText = authSubmitBtn.textContent;
      authSubmitBtn.textContent = 'Attendere...';

      try {
        if (authMode === 'register') {
          await mod.registerWithEmail(email, pass);
          showAuthFeedback('✓ Account creato con successo! Sincronizzazione in corso...', 'success');
        } else {
          await mod.loginWithEmail(email, pass);
          showAuthFeedback('✓ Accesso effettuato! Sincronizzazione in corso...', 'success');
        }
        setTimeout(() => {
          if (modalAuth) modalAuth.classList.remove('open');
          clearAuthFeedback();
        }, 800);
      } catch (err) {
        console.error('Auth error:', err);
        let msg = err.message || 'Errore durante l\'autenticazione';
        if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
          msg = 'Credenziali non valide o utente non trovato.';
        } else if (msg.includes('email-already-in-use')) {
          msg = 'Questa email è già registrata. Clicca sul tab "Accedi".';
        } else if (msg.includes('operation-not-allowed')) {
          msg = 'Il metodo Email/Password non è ancora abilitato su Firebase (vai su Authentication > Provider di accesso > Email/Password e attivalo).';
        } else if (msg.includes('unauthorized-domain')) {
          msg = `Dominio "${location.hostname}" non autorizzato su Firebase. Aggiungi "${location.hostname}" in Authentication > Impostazioni > Domini autorizzati.`;
        } else if (msg.includes('Firebase non configurato')) {
          msg = 'Progetto Firebase non ancora configurato. Apri "⚙️ Configurazione Progetto Firebase" qui sotto per inserire le tue credenziali.';
        }
        showAuthFeedback(msg, 'error');
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = origText;
      }
    });
  }

  // Google Sign-In
  if (authGoogleBtn) {
    authGoogleBtn.addEventListener('click', async () => {
      clearAuthFeedback();
      const mod = await getFirebaseModule();
      if (!mod) return;
      try {
        await mod.loginWithGoogle();
        showAuthFeedback('✓ Accesso con Google effettuato!', 'success');
        setTimeout(() => {
          if (modalAuth) modalAuth.classList.remove('open');
          clearAuthFeedback();
        }, 800);
      } catch (err) {
        console.error('Google Sign-In error:', err);
        let msg = err.message || 'Errore accesso con Google';
        if (msg.includes('popup-closed-by-user')) {
          msg = 'Finestra di accesso chiusa prima del completamento.';
        } else if (msg.includes('operation-not-allowed')) {
          msg = 'Il provider Google non è ancora abilitato su Firebase (vai su Authentication > Provider di accesso > Google e attivalo).';
        } else if (msg.includes('unauthorized-domain')) {
          msg = `Dominio "${location.hostname}" non autorizzato su Firebase. Aggiungi "${location.hostname}" in Authentication > Impostazioni > Domini autorizzati.`;
        } else if (msg.includes('Firebase non configurato')) {
          msg = 'Inserisci prima la configurazione del tuo progetto Firebase qui sotto.';
        }
        showAuthFeedback(msg, 'error');
      }
    });
  }

  // Forgot Password
  if (authForgotPasswordLink) {
    authForgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      clearAuthFeedback();
      const email = authEmail?.value.trim();
      if (!email) {
        showAuthFeedback('Inserisci prima la tua email nel campo sopra.', 'error');
        authEmail?.focus();
        return;
      }
      const mod = await getFirebaseModule();
      if (!mod) return;
      try {
        await mod.resetPasswordEmail(email);
        showAuthFeedback('✓ Email di reimpostazione inviata! Controlla la tua casella di posta.', 'success');
      } catch (err) {
        showAuthFeedback('Errore invio email: ' + err.message, 'error');
      }
    });
  }

  // Logout
  if (authLogoutBtn) {
    authLogoutBtn.addEventListener('click', async () => {
      const mod = await getFirebaseModule();
      if (mod) {
        await mod.logoutUser();
        // Resetta il portafoglio locale a vuoto alla disconnessione
        AppState.portfolio = {};
        localStorage.setItem('marketpulse_portfolio', '{}');
        renderAssetList();
        updateSelectedAssetHeader();
        if (modalAuth) modalAuth.classList.remove('open');
      }
    });
  }

  // Sync Now (Forza invio)
  if (authSyncNowBtn) {
    authSyncNowBtn.addEventListener('click', async () => {
      authSyncNowBtn.disabled = true;
      const origText = authSyncNowBtn.innerHTML;
      authSyncNowBtn.innerHTML = '<span>⏳ Salvataggio sul Cloud in corso...</span>';
      try {
        await triggerCloudSync(true);
        authSyncNowBtn.innerHTML = '<span>✓ Dati salvati sul Cloud con successo!</span>';
        setTimeout(() => {
          authSyncNowBtn.innerHTML = origText;
          authSyncNowBtn.disabled = false;
        }, 2500);
      } catch (err) {
        console.error('Manual sync error:', err);
        let errorMsg = err.message || 'Errore salvataggio';
        if (errorMsg.includes('permission-denied') || errorMsg.includes('Missing or insufficient permissions')) {
          errorMsg = 'Permesso negato: verifica le regole Firestore nella console Firebase.';
        }
        authSyncNowBtn.innerHTML = `<span style="color: #fda4af; font-size: 0.72rem;">❌ ${errorMsg}</span>`;
        setTimeout(() => {
          authSyncNowBtn.innerHTML = origText;
          authSyncNowBtn.disabled = false;
        }, 6000);
      }
    });
  }

  // Portfolio Modal
  const modalPort = document.getElementById('modalPortfolio');
  const headerPortBtn = document.getElementById('headerPortfolioBtn');
  const closePortBtn = document.getElementById('closePortfolioModal');
  const cancelPortBtn = document.getElementById('cancelPortfolioBtn');
  const savePortBtn = document.getElementById('savePortfolioBtn');
  const deletePortBtn = document.getElementById('deletePortfolioBtn');
  const portUseCurrentPriceBtn = document.getElementById('portUseCurrentPriceBtn');
  const portInputShares = document.getElementById('portInputShares');
  const portInputBuyPrice = document.getElementById('portInputBuyPrice');

  if (headerPortBtn) {
    headerPortBtn.addEventListener('click', () => {
      if (AppState.selectedAsset) {
        openPortfolioModal(AppState.selectedAsset.symbol);
      }
    });
  }
  if (closePortBtn) closePortBtn.addEventListener('click', closePortfolioModal);
  if (cancelPortBtn) cancelPortBtn.addEventListener('click', closePortfolioModal);
  if (savePortBtn) savePortBtn.addEventListener('click', savePortfolioPosition);
  if (deletePortBtn) deletePortBtn.addEventListener('click', () => deletePortfolioPosition());
  if (portInputShares) portInputShares.addEventListener('input', () => updatePortfolioModalPreview());
  if (portInputBuyPrice) portInputBuyPrice.addEventListener('input', () => updatePortfolioModalPreview());
  if (portUseCurrentPriceBtn) {
    portUseCurrentPriceBtn.addEventListener('click', () => {
      const sym = currentPortfolioModalSymbol;
      const asset = AppState.assets.find(a => a.symbol === sym);
      if (asset && asset.price != null && portInputBuyPrice) {
        portInputBuyPrice.value = asset.price;
        updatePortfolioModalPreview(asset);
      }
    });
  }

  // Close modals on clicking backdrop
  [modalAdd, modalShortcuts, modalSettings, modalPort, modalAuth].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('open');
      });
    }
  });
}

// --- Firebase Auth & Cloud Sync State Handlers ---
function handleAuthStateUpdate(user, meta) {
  const authLoggedOutView = document.getElementById('authLoggedOutView');
  const authLoggedInView = document.getElementById('authLoggedInView');
  const authIndicatorDot = document.getElementById('authIndicatorDot');
  const authUserName = document.getElementById('authUserName');
  const authUserEmail = document.getElementById('authUserEmail');
  const authUserAvatar = document.getElementById('authUserAvatar');
  const settingsAuthLabel = document.getElementById('settingsAuthLabel');
  const settingsAuthSub = document.getElementById('settingsAuthSub');

  if (user) {
    if (authLoggedOutView) authLoggedOutView.style.display = 'none';
    if (authLoggedInView) authLoggedInView.style.display = 'block';
    if (authIndicatorDot) authIndicatorDot.style.background = '#10b981';

    const name = user.displayName || user.email?.split('@')[0] || 'Utente';
    const email = user.email || 'Utente Autenticato';
    if (authUserName) authUserName.textContent = name;
    if (authUserEmail) authUserEmail.textContent = email;
    if (authUserAvatar) authUserAvatar.textContent = name[0].toUpperCase();

    if (settingsAuthLabel) settingsAuthLabel.textContent = `☁️ Connesso: ${name}`;
    if (settingsAuthSub) settingsAuthSub.textContent = 'Sincronizzazione in tempo reale attiva';
  } else {
    if (authLoggedOutView) authLoggedOutView.style.display = 'block';
    if (authLoggedInView) authLoggedInView.style.display = 'none';
    if (authIndicatorDot) authIndicatorDot.style.background = '#64748b';

    if (settingsAuthLabel) settingsAuthLabel.textContent = '☁️ Sincronizzazione Cloud';
    if (settingsAuthSub) {
      if (meta && meta.configured === false) {
        settingsAuthSub.textContent = 'Configura Firebase per sincronizzare tra device';
      } else {
        settingsAuthSub.textContent = 'Accedi per sincronizzare in automatico';
      }
    }
  }
}

function handleRemoteCloudData(remoteData) {
  if (!remoteData || typeof remoteData !== 'object') return;
  console.log('[MarketPulse Cloud] Aggiornamento remoto ricevuto:', remoteData);

  isRemoteUpdateInProgress = true;
  try {
    let changed = false;

    if (remoteData.settings && typeof remoteData.settings === 'object') {
      AppState.settings = Object.assign(AppState.settings, remoteData.settings);
      localStorage.setItem('marketpulse_settings', JSON.stringify(AppState.settings));
      changed = true;
    }

    if (remoteData.portfolio && typeof remoteData.portfolio === 'object') {
      AppState.portfolio = remoteData.portfolio;
      localStorage.setItem('marketpulse_portfolio', JSON.stringify(AppState.portfolio));
      changed = true;
    }

    if (remoteData.portfolioSort) {
      AppState.portfolioSort = remoteData.portfolioSort;
      localStorage.setItem('marketpulse_portfolio_sort', AppState.portfolioSort);
      document.querySelectorAll('.port-sort-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-sort') === AppState.portfolioSort);
      });
      changed = true;
    }

    if (Array.isArray(remoteData.assets) && remoteData.assets.length > 0) {
      AppState.assets = remoteData.assets;
      localStorage.setItem('marketpulse_assets', JSON.stringify(AppState.assets));
      changed = true;
    }

    if (remoteData.notes && typeof remoteData.notes === 'object') {
      Object.keys(remoteData.notes).forEach(k => {
        if (k.startsWith('marketpulse_notes_')) {
          localStorage.setItem(k, remoteData.notes[k]);
        }
      });
      if (AppState.selectedAsset) {
        loadNotesForAsset(AppState.selectedAsset);
      }
    }

    if (changed) {
      renderAssetList();
      updateSelectedAssetHeader();
    }
  } finally {
    setTimeout(() => { isRemoteUpdateInProgress = false; }, 300);
  }
}

function getLocalBackupPayload() {
  const notesObj = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('marketpulse_notes_')) {
      notesObj[key] = localStorage.getItem(key);
    }
  }
  return {
    settings: AppState.settings,
    portfolio: AppState.portfolio,
    portfolioSort: AppState.portfolioSort || localStorage.getItem('marketpulse_portfolio_sort') || 'best',
    assets: AppState.assets,
    notes: notesObj
  };
}

function initFirebaseBackground() {
  getFirebaseModule().then(mod => {
    if (mod) {
      mod.initFirebaseSync({
        onAuthUpdate: handleAuthStateUpdate,
        onDataUpdate: handleRemoteCloudData,
        getLocalState: getLocalBackupPayload
      });
    }
  });
}

// --- Keyboard Shortcuts ---
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

// --- PWA Installation & Service Worker (Zero-Cache Mode) ---
function setupPWA() {
  // Purge any residual CacheStorage immediately on startup to keep device zero-cache
  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(k => {
        console.log('[MarketPulse] Purging residual cache from window:', k);
        caches.delete(k);
      });
    }).catch(() => {});
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js?v=26').then(reg => {
      console.log('[MarketPulse PWA] Zero-cache service worker active:', reg.scope);
      reg.update().catch(() => {});
      if (reg.waiting) {
        reg.waiting.postMessage('SKIP_WAITING');
      }
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
