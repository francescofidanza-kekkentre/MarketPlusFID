/**
 * MarketPulse Pro - Core Application Logic
 * Optimized for Chromebook (ChromeOS), Responsive Touch & Keyboard shortcuts.
 */

// --- Default Asset Database ---
const DEFAULT_ASSETS = [
  // Stocks
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', exchange: 'NASDAQ', price: 142.60, change: 3.45, high: 144.10, low: 138.80, volume: '48.2M', favorite: true },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ', price: 234.80, change: 1.12, high: 236.00, low: 232.50, volume: '32.1M', favorite: true },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', exchange: 'NASDAQ', price: 431.20, change: 0.85, high: 433.50, low: 428.10, volume: '18.4M', favorite: false },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', exchange: 'NASDAQ', price: 252.10, change: -2.15, high: 258.40, low: 249.20, volume: '62.7M', favorite: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', exchange: 'NASDAQ', price: 171.40, change: 1.34, high: 172.90, low: 169.80, volume: '22.9M', favorite: false },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', exchange: 'NASDAQ', price: 194.50, change: -0.45, high: 196.20, low: 193.10, volume: '25.6M', favorite: false },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock', exchange: 'NASDAQ', price: 582.00, change: 2.20, high: 586.50, low: 574.00, volume: '14.8M', favorite: false },
  { symbol: 'ASML', name: 'ASML Holding N.V.', type: 'stock', exchange: 'EURONEXT', price: 712.50, change: -1.05, high: 722.00, low: 708.00, volume: '3.1M', favorite: false },

  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'etf', exchange: 'NYSE Arca', price: 582.40, change: 0.72, high: 583.50, low: 579.80, volume: '54.2M', favorite: true },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100)', type: 'etf', exchange: 'NASDAQ', price: 496.10, change: 1.25, high: 498.20, low: 492.40, volume: '38.6M', favorite: true },
  { symbol: 'VWCE', name: 'Vanguard FTSE All-World UCITS', type: 'etf', exchange: 'XETRA', price: 124.80, change: 0.40, high: 125.10, low: 124.20, volume: '4.5M', favorite: true },
  { symbol: 'SOXX', name: 'iShares Semiconductor ETF', type: 'etf', exchange: 'NASDAQ', price: 228.30, change: 2.80, high: 231.00, low: 224.50, volume: '12.4M', favorite: false },
  { symbol: 'GLD', name: 'SPDR Gold Shares ETF', type: 'etf', exchange: 'NYSE Arca', price: 254.90, change: 0.35, high: 256.20, low: 253.80, volume: '7.8M', favorite: false },
  { symbol: 'URTH', name: 'iShares MSCI World ETF', type: 'etf', exchange: 'NYSE Arca', price: 158.20, change: 0.65, high: 158.90, low: 157.40, volume: '2.1M', favorite: false },

  // Crypto
  { symbol: 'BTC', name: 'Bitcoin (USDT)', type: 'crypto', exchange: 'Binance / Global', price: 69450.00, change: 2.65, high: 70100.00, low: 68200.00, volume: '$32.4B', favorite: true },
  { symbol: 'ETH', name: 'Ethereum (USDT)', type: 'crypto', exchange: 'Binance / Global', price: 2540.00, change: 1.80, high: 2580.00, low: 2490.00, volume: '$16.1B', favorite: true },
  { symbol: 'SOL', name: 'Solana (USDT)', type: 'crypto', exchange: 'Binance / Global', price: 178.20, change: 4.85, high: 181.50, low: 171.20, volume: '$4.2B', favorite: true },
  { symbol: 'BNB', name: 'BNB (USDT)', type: 'crypto', exchange: 'Binance / Global', price: 592.10, change: 0.95, high: 598.00, low: 587.00, volume: '$1.1B', favorite: false },
  { symbol: 'XRP', name: 'Ripple (USDT)', type: 'crypto', exchange: 'Binance / Global', price: 0.528, change: -1.20, high: 0.542, low: 0.521, volume: '$840M', favorite: false },
  { symbol: 'ADA', name: 'Cardano (USDT)', type: 'crypto', exchange: 'Binance / Global', price: 0.354, change: 1.15, high: 0.362, low: 0.348, volume: '$310M', favorite: false }
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
    refreshRate: 5000,
    finnhubKey: ''
  },
  cachedBars: {}, // symbol_timeframe -> []
  crosshair: null,
  deferredPrompt: null
};

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

  const storedSettings = localStorage.getItem('marketpulse_settings');
  if (storedSettings) {
    try {
      AppState.settings = Object.assign(AppState.settings, JSON.parse(storedSettings));
    } catch (e) {}
  }
}

function saveAssetsToStorage() {
  localStorage.setItem('marketpulse_assets', JSON.stringify(AppState.assets));
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
  const el = document.getElementById('fearGreedValue');
  if (!el) return;
  el.className = 'fear-greed-meter';

  if (val <= 25) {
    el.classList.add('fg-extreme-fear');
    el.textContent = `${val} • Paura Estrema`;
  } else if (val <= 45) {
    el.classList.add('fg-fear');
    el.textContent = `${val} • Paura`;
  } else if (val <= 55) {
    el.classList.add('fg-neutral');
    el.textContent = `${val} • Neutrale`;
  } else if (val <= 75) {
    el.classList.add('fg-greed');
    el.textContent = `${val} • Avidità`;
  } else {
    el.classList.add('fg-extreme-greed');
    el.textContent = `${val} • Avidità Estrema`;
  }
}

// --- Polling Live Prices (Binance for Crypto + Simulation for Stocks) ---
async function pollLivePrices() {
  // 1. Fetch real crypto tickers from Binance API (CORS friendly)
  try {
    const cryptoSymbols = AppState.assets.filter(a => a.type === 'crypto');
    for (const asset of cryptoSymbols) {
      const pair = `${asset.symbol}USDT`;
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.lastPrice) {
            asset.price = parseFloat(data.lastPrice);
            asset.change = parseFloat(data.priceChangePercent);
            asset.high = parseFloat(data.highPrice);
            asset.low = parseFloat(data.lowPrice);
            renderAssetList();
            if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
              updateSelectedAssetHeader();
            }
          }
        }).catch(() => {});
    }
  } catch (e) {}

  // 2. Fetch real Stock/ETF quotes from Finnhub if key is configured, or realistic micro-ticks as fallback
  if (AppState.settings.finnhubKey) {
    const stockSymbols = AppState.assets.filter(a => a.type !== 'crypto');
    // Poll the active selected asset first, and other assets progressively
    for (const asset of stockSymbols) {
      fetch(`https://finnhub.io/api/v1/quote?symbol=${asset.symbol}&token=${AppState.settings.finnhubKey}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.c && data.c > 0) {
            asset.price = parseFloat(data.c);
            asset.change = parseFloat(data.dp || 0);
            asset.high = parseFloat(data.h || data.c);
            asset.low = parseFloat(data.l || data.c);
            renderAssetList();
            if (AppState.selectedAsset && AppState.selectedAsset.symbol === asset.symbol) {
              updateSelectedAssetHeader();
            }
          }
        }).catch(() => {});
    }
  } else {
    // Micro-fluctuations for Stocks/ETFs when offline/no key
    AppState.assets.forEach(asset => {
      if (asset.type !== 'crypto') {
        const deltaPercent = (Math.random() - 0.495) * 0.15; // slight tick
        asset.price = +(asset.price * (1 + deltaPercent / 100)).toFixed(2);
      }
    });
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
    const isUp = asset.change >= 0;
    const changeBadgeClass = isUp ? 'badge-up' : 'badge-down';
    const changeSign = isUp ? '+' : '';
    const formattedPrice = formatCurrency(asset.price, asset.type);

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
          <span class="asset-change ${changeBadgeClass}">${changeSign}${asset.change.toFixed(2)}%</span>
        </div>
      </div>
    `;
  }).join('');

  // Attach click events
  container.querySelectorAll('.asset-item').forEach(el => {
      el.addEventListener('click', () => {
        const sym = el.getAttribute('data-symbol');
        const found = AppState.assets.find(a => a.symbol === sym);
        if (found) selectAsset(found);
      });
      // Delete button handler
      const deleteBtn = el.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent row selection
          const sym = el.getAttribute('data-symbol');
          AppState.assets = AppState.assets.filter(a => a.symbol !== sym);
          saveAssetsToStorage();
          renderAssetList();
        });
      }
  });
}

function formatCurrency(val, type) {
  if (val === undefined || isNaN(val)) return '-';
  if (val < 1) return `$${val.toFixed(4)}`;
  if (val > 1000) return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${val.toFixed(2)}`;
}

// --- Select Asset ---
function selectAsset(asset) {
  AppState.selectedAsset = asset;
  renderAssetList();
  updateSelectedAssetHeader();
  updateBrokerLinks(asset);
  updateRiskCalculatorPreloads(asset);
  loadNotesForAsset(asset);
  loadAndRenderChart(asset, AppState.activeTimeframe);
}

function updateSelectedAssetHeader() {
  const asset = AppState.selectedAsset;
  if (!asset) return;

  document.getElementById('activeSymbol').innerHTML = `${asset.symbol} <span class="asset-type-badge type-${asset.type}" id="activeType">${asset.type.toUpperCase()}</span>`;
  document.getElementById('activeName').textContent = `${asset.name} • ${asset.exchange}`;

  const isUp = asset.change >= 0;
  const changeEl = document.getElementById('activeChange');
  changeEl.className = `big-change ${isUp ? 'badge-up' : 'badge-down'}`;
  changeEl.textContent = `${isUp ? '+' : ''}${asset.change.toFixed(2)}%`;

  document.getElementById('activePrice').textContent = formatCurrency(asset.price, asset.type);
  document.getElementById('activeHigh').textContent = formatCurrency(asset.high || asset.price * 1.02, asset.type);
  document.getElementById('activeLow').textContent = formatCurrency(asset.low || asset.price * 0.98, asset.type);
  document.getElementById('activeVolume').textContent = asset.volume || '12.5M';

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
    } else if (AppState.settings.finnhubKey) {
      sourceBadge.textContent = '● Finnhub Live (Wall St.)';
      sourceBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      sourceBadge.style.color = '#38bdf8';
      sourceBadge.style.border = '1px solid rgba(56, 189, 248, 0.3)';
      sourceBadge.title = 'Prezzo e storico candele ufficiali in tempo reale da Finnhub.io';
    } else {
      sourceBadge.textContent = '● Sim / Offline';
      sourceBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      sourceBadge.style.color = '#fbbf24';
      sourceBadge.style.border = '1px solid rgba(245, 158, 11, 0.3)';
      sourceBadge.title = 'Nessuna chiave API Finnhub configurata nelle impostazioni';
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
async function loadAndRenderChart(asset, timeframe) {
  const cacheKey = `${asset.symbol}_${timeframe}`;
  let bars = AppState.cachedBars[cacheKey];

  if (!bars) {
    // 1. If crypto, fetch real Binance klines directly (CORS supported natively)
    if (asset.type === 'crypto') {
      try {
        const intervalMap = { '1D': '1h', '1W': '4h', '1M': '1d', '3M': '1d', '1Y': '1w', 'ALL': '1M' };
        const interval = intervalMap[timeframe] || '1d';
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${asset.symbol}USDT&interval=${interval}&limit=60`);
        if (res.ok) {
          const raw = await res.json();
          bars = raw.map(k => ({
            time: new Date(k[0]),
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5])
          }));
        }
      } catch (e) {}
    } else {
      // 2. If Finnhub key is configured, fetch official Wall Street candlestick history!
      if (AppState.settings.finnhubKey) {
        try {
          const resMap = { '1D': '5', '1W': '30', '1M': 'D', '3M': 'D', '1Y': 'W', 'ALL': 'M' };
          const resolution = resMap[timeframe] || 'D';
          const to = Math.floor(Date.now() / 1000);
          const secondsMap = { '1D': 86400 * 2, '1W': 86400 * 7, '1M': 86400 * 35, '3M': 86400 * 100, '1Y': 86400 * 370, 'ALL': 86400 * 365 * 5 };
          const from = to - (secondsMap[timeframe] || 86400 * 35);

          const fhRes = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${asset.symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${AppState.settings.finnhubKey}`);
          if (fhRes.ok) {
            const fhData = await fhRes.json();
            if (fhData && fhData.s === 'ok' && fhData.c && fhData.c.length > 0) {
              bars = fhData.t.map((ts, i) => ({
                time: new Date(ts * 1000),
                open: parseFloat(fhData.o[i]),
                high: parseFloat(fhData.h[i]),
                low: parseFloat(fhData.l[i]),
                close: parseFloat(fhData.c[i]),
                volume: parseFloat(fhData.v[i] || 50000)
              }));
              if (bars.length > 0) {
                asset.price = bars[bars.length - 1].close;
              }
            }
          }
        } catch (fhErr) {
          console.log('Finnhub candle fetch error:', fhErr);
        }
      }

      // If Finnhub not configured or failed, try local server or public CORS proxy
      if (!bars || bars.length === 0) {
        try {
          const rangeMap = { '1D': '1d', '1W': '5d', '1M': '1mo', '3M': '3mo', '1Y': '1y', 'ALL': '5y' };
          const intervalMap = { '1D': '5m', '1W': '15m', '1M': '1d', '3M': '1d', '1Y': '1wk', 'ALL': '1mo' };
          const r = rangeMap[timeframe] || '1mo';
          const inv = intervalMap[timeframe] || '1d';

          // Check if local proxy is active
          let fetchedData = null;
          try {
            const localRes = await fetch(`/api/history?symbol=${asset.symbol}&range=${r}&interval=${inv}`, { signal: AbortSignal.timeout(1500) });
            if (localRes.ok) fetchedData = await localRes.json();
          } catch (err) {}

          // Fallback to client-side CORS proxy when hosted on GitHub/Firebase/Netlify
          if (!fetchedData || fetchedData.error) {
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${asset.symbol}?range=${r}&interval=${inv}`;
            const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`, { signal: AbortSignal.timeout(3000) });
            if (proxyRes.ok) fetchedData = await proxyRes.json();
          }

          if (fetchedData && fetchedData.chart && fetchedData.chart.result && fetchedData.chart.result[0]) {
            const resObj = fetchedData.chart.result[0];
            const timestamps = resObj.timestamp || [];
            const q = resObj.indicators?.quote?.[0] || {};
            const parsed = [];
            for (let i = 0; i < timestamps.length; i++) {
              if (q.open && q.open[i] != null && q.close[i] != null) {
                parsed.push({
                  time: new Date(timestamps[i] * 1000),
                  open: parseFloat(q.open[i]),
                  high: parseFloat(q.high[i]),
                  low: parseFloat(q.low[i]),
                  close: parseFloat(q.close[i]),
                  volume: parseFloat(q.volume?.[i] || 50000)
                });
              }
            }
            if (parsed.length > 5) bars = parsed;
          }
        } catch (e) {
          console.log('Online stock fetch fallback:', e);
        }
      }
    }

    // 3. Graceful realistic generator if offline or rate-limited
    if (!bars || bars.length === 0) {
      bars = generateHistoricalBars(asset.price, timeframe, asset.change);
    }

    AppState.cachedBars[cacheKey] = bars;
  }

  // Calculate Indicators
  calculateIndicators(bars);

  // Render Canvas Charts
  renderMainChart(bars);
  renderRsiChart(bars);
  renderMacdChart(bars);

  // Update Technical Decision Banner
  updateTechnicalDecisionBanner(bars);
}

function generateHistoricalBars(currentPrice, timeframe, assetChange = 0) {
  const count = 55;
  const bars = new Array(count);
  const now = new Date();
  const stepHours = timeframe === '1D' ? 0.5 : (timeframe === '1W' ? 3 : 24);

  // The last candle (current session) reflects the actual daily % change of the asset
  const changePct = (assetChange || 0) / 100;
  const currentClose = currentPrice;
  // If change is +2%, open was close / 1.02. If change is -2%, open was close / 0.98.
  const currentOpen = changePct !== 0 ? +(currentClose / (1 + changePct)).toFixed(2) : +(currentClose * 0.998).toFixed(2);
  const dailyRange = Math.max(0.006, Math.abs(changePct) * 0.4) * currentPrice;

  bars[count - 1] = {
    time: now,
    open: currentOpen,
    close: currentClose,
    high: +(Math.max(currentOpen, currentClose) + Math.random() * dailyRange * 0.5).toFixed(2),
    low: +(Math.min(currentOpen, currentClose) - Math.random() * dailyRange * 0.5).toFixed(2),
    volume: Math.round(75000 + Math.random() * 120000)
  };

  // Generate previous historical candles backwards smoothly so there is no gap
  let prevClose = currentOpen;
  for (let i = count - 2; i >= 0; i--) {
    const time = new Date(now.getTime() - (count - 1 - i) * stepHours * 3600 * 1000);
    const volatility = prevClose * 0.012;
    const candleChange = (Math.random() - 0.49) * volatility;
    const close = prevClose;
    const open = +(close - candleChange).toFixed(2);
    const high = +(Math.max(open, close) + Math.random() * volatility * 0.6).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * volatility * 0.6).toFixed(2);
    const volume = Math.round(40000 + Math.random() * 140000);

    bars[i] = { time, open, high, low, close, volume };
    prevClose = open;
  }

  return bars;
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
  const k = 2 / (period + 1);
  const ema = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  ema[period - 1] = sum / period;

  for (let i = period; i < values.length; i++) {
    ema[i] = (values[i] * k) + (ema[i - 1] * (1 - k));
  }
  return ema;
}

function calculateBollingerBands(values, period = 20, stdDevMult = 2) {
  const upper = new Array(values.length).fill(null);
  const lower = new Array(values.length).fill(null);

  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    upper[i] = mean + (stdDevMult * stdDev);
    lower[i] = mean - (stdDevMult * stdDev);
  }
  return { upper, lower };
}

function calculateRSI(values, period = 14) {
  const rsi = new Array(values.length).fill(50);
  if (values.length <= period) return rsi;

  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  rsi[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));

  for (let i = period + 1; i < values.length; i++) {
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
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
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
    ctx.fillText(`$${priceVal.toFixed(2)}`, chartWidth + 8, y + 3);
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

  // Time Scale Text
  ctx.fillStyle = '#64748b';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  const timeStep = Math.ceil(bars.length / 5);
  for (let i = 0; i < bars.length; i += timeStep) {
    const x = i * stepX + stepX / 2;
    const d = bars[i].time;
    const str = `${d.getDate()}/${d.getMonth() + 1}`;
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
    ctx.fillText(`$${b.close.toFixed(2)}`, chartWidth + 6, y + 4);
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
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
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
  bars.forEach((b, i) => {
    const x = i * stepX + stepX / 2;
    const y = getY(b.rsi || 50);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
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
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
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
}

// --- Position Sizing & Risk Management Calculator ---
function updateRiskCalculatorPreloads(asset) {
  const entryInput = document.getElementById('calcEntryPrice');
  const slInput = document.getElementById('calcStopLoss');
  const tpInput = document.getElementById('calcTakeProfit');

  entryInput.value = asset.price.toFixed(2);
  // Default Stop Loss at -3.5%, Take Profit at +8.4%
  slInput.value = (asset.price * 0.965).toFixed(2);
  tpInput.value = (asset.price * 1.084).toFixed(2);

  calculateRiskOutput();
}

function calculateRiskOutput() {
  const capital = parseFloat(document.getElementById('calcCapital').value) || 10000;
  const riskPct = parseFloat(document.getElementById('calcRiskPct').value) || 1.5;
  const entry = parseFloat(document.getElementById('calcEntryPrice').value) || 100;
  const sl = parseFloat(document.getElementById('calcStopLoss').value) || 95;
  const tp = parseFloat(document.getElementById('calcTakeProfit').value) || 110;

  // Distances
  const slDiff = Math.abs(entry - sl);
  const tpDiff = Math.abs(tp - entry);
  const slPct = (slDiff / entry) * 100;
  const tpPct = (tpDiff / entry) * 100;

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
  const portfolioWeight = (totalInvested / capital) * 100;

  // Risk / Reward Ratio
  const rrRatio = slDiff > 0 ? (tpDiff / slDiff) : 0;

  // Render Outputs
  document.getElementById('calcOutputShares').textContent = `${formattedShares} ${isCrypto ? 'Token' : 'Quote'}`;
  document.getElementById('calcOutputRiskCash').textContent = `€${maxRiskCash.toFixed(2)}`;
  document.getElementById('calcOutputProfitCash').textContent = `€${potentialProfit.toFixed(2)}`;
  document.getElementById('calcOutputTotalInvested').textContent = `€${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
}

function redrawCurrentChart() {
  if (AppState.selectedAsset) {
    loadAndRenderChart(AppState.selectedAsset, AppState.activeTimeframe);
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

    const cacheKey = `${AppState.selectedAsset?.symbol}_${AppState.activeTimeframe}`;
    const bars = AppState.cachedBars[cacheKey];
    if (!bars || bars.length === 0) return;

    const stepX = chartWidth / bars.length;
    const index = Math.floor(x / stepX);

    if (index >= 0 && index < bars.length) {
      AppState.crosshair = { index };
      renderMainChart(bars);

      // Tooltip values
      const b = bars[index];
      tooltip.style.display = 'flex';
      document.getElementById('ttO').textContent = `$${b.open.toFixed(2)}`;
      document.getElementById('ttH').textContent = `$${b.high.toFixed(2)}`;
      document.getElementById('ttL').textContent = `$${b.low.toFixed(2)}`;
      document.getElementById('ttC').textContent = `$${b.close.toFixed(2)}`;
      document.getElementById('ttV').textContent = b.volume.toLocaleString();
    }
  };

  canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX));
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) handlePointer(e.touches[0].clientX);
  }, { passive: true });

  const hideCrosshair = () => {
    AppState.crosshair = null;
    tooltip.style.display = 'none';
    const cacheKey = `${AppState.selectedAsset?.symbol}_${AppState.activeTimeframe}`;
    const bars = AppState.cachedBars[cacheKey];
    if (bars) renderMainChart(bars);
  };

  canvas.addEventListener('mouseleave', hideCrosshair);
  canvas.addEventListener('touchend', hideCrosshair);
}

// --- Modals Setup ---
function setupModals() {
  // Add Ticker Modal
  const modalAdd = document.getElementById('modalAddTicker');
  document.getElementById('addCustomTickerBtn').addEventListener('click', () => {
    modalAdd.classList.add('open');
    document.getElementById('newTickerSymbol').focus();
  });
  document.getElementById('closeAddTickerModal').addEventListener('click', () => {
    modalAdd.classList.remove('open');
  });

  document.getElementById('submitNewTickerBtn').addEventListener('click', () => {
    const sym = document.getElementById('newTickerSymbol').value.trim().toUpperCase();
    const name = document.getElementById('newTickerName').value.trim();
    const type = document.getElementById('newTickerType').value;
    const price = parseFloat(document.getElementById('newTickerPrice').value) || 100.0;

    if (!sym || !name) {
      alert('Inserisci il simbolo e il nome del ticker.');
      return;
    }

    const newAsset = {
      symbol: sym,
      name: name,
      type: type,
      exchange: type === 'crypto' ? 'Crypto' : 'Stock Exchange',
      price: price,
      change: 0.0,
      high: price * 1.02,
      low: price * 0.98,
      volume: '1.0M',
      favorite: true
    };

    AppState.assets.unshift(newAsset);
    saveAssetsToStorage();
    modalAdd.classList.remove('open');
    selectAsset(newAsset);

    // Clear form
    document.getElementById('newTickerSymbol').value = '';
    document.getElementById('newTickerName').value = '';
    document.getElementById('newTickerPrice').value = '';
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

      const fh = document.getElementById('settingFinnhubKey');
      if (fh) fh.value = AppState.settings.finnhubKey || '';

      const statusEl = document.getElementById('finnhubStatusText');
      if (statusEl) {
        if (AppState.settings.finnhubKey) {
          statusEl.innerHTML = '<span style="color: #38bdf8;">🔄 Verifica chiave Finnhub in corso...</span>';
          fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${AppState.settings.finnhubKey}`)
            .then(res => res.json())
            .then(d => {
              if (d && d.c && d.c > 0) {
                statusEl.innerHTML = `<span style="color: #10b981;">🟢 Finnhub Connesso con successo! (Test AAPL: $${d.c})</span>`;
              } else {
                statusEl.innerHTML = '<span style="color: #ef4444;">🔴 Chiave non valida o limite superato</span>';
              }
            })
            .catch(() => {
              statusEl.innerHTML = '<span style="color: #f59e0b;">🟡 Connessione di rete non disponibile</span>';
            });
        } else {
          statusEl.innerHTML = '<span style="color: var(--text-muted);">⚪ Nessuna chiave inserita (usa dati stimati/offline)</span>';
        }
      }

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

      const fh = document.getElementById('settingFinnhubKey');
      if (fh) AppState.settings.finnhubKey = fh.value.trim();

      localStorage.setItem('marketpulse_settings', JSON.stringify(AppState.settings));
      modalSettings.classList.remove('open');

      // Invalidate cached bars so real Finnhub data loads immediately!
      AppState.cachedBars = {};
      if (AppState.selectedAsset) {
        updateSelectedAssetHeader();
        loadAndRenderChart(AppState.selectedAsset, AppState.activeTimeframe);
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
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('[MarketPulse PWA] Service worker registered:', reg.scope);
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
