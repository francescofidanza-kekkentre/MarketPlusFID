# 📈 MarketPulse Pro • Chromebook Trading & Portfolio PWA

**MarketPulse Pro** è un'applicazione moderna, veloce e reattiva progettata specificamente per **Chromebook (ChromeOS)**. Permette di monitorare in tempo reale **Azioni, ETF e Criptovalute**, analizzare i grafici tecnici professionali con indicatori chiave e supportare le decisioni di trading attraverso il calcolo matematico della posizione (Position Sizing) e la gestione del rischio.

---

## 🌟 Caratteristiche Principali

### 1. Esperienza Nativa per Chromebook (PWA)
- **Installabile con 1 Clic**: Grazie al manifest PWA e al Service Worker integrato, l'app può essere installata come finestra nativa autonoma (`display: standalone`) sulla barra/dock di ChromeOS.
- **Supporto Touch e Tastiera Fisica**: Navigazione ottimizzata sia per l'uso laptop con touchpad/tastiera sia per Chromebook convertibili touch.
- **Scorciatoie da Tastiera Veloci**:
  - `/` : Focus immediato sulla barra di ricerca del ticker
  - `1`, `2`, `3`, `4`, `5` : Cambio timeframe rapido (1G, 1S, 1M, 3M, 1A)
  - `C` : Alterna tra Candele giapponesi e Grafico a Linea/Area
  - `R` : Mostra / Nascondi oscillatore RSI (14)
  - `M` : Mostra / Nascondi oscillatore MACD con istogramma
  - `F` : Aggiungi o rimuovi l'asset attivo dalla Watchlist preferiti
  - `?` : Apri il pannello scorciatoie
  - `Esc` : Chiudi modali e finestre

### 2. Monitoraggio Multi-Asset (Azioni, ETF, Crypto)
- **Azioni**: NVIDIA (NVDA), Apple (AAPL), Microsoft (MSFT), Tesla (TSLA), Google (GOOGL), Amazon (AMZN), Meta (META), ASML.
- **ETF Globali**: S&P 500 (SPY), Nasdaq 100 (QQQ), Vanguard FTSE All-World (VWCE), Semiconductor (SOXX), Oro (GLD), MSCI World (URTH).
- **Criptovalute con Prezzi Live**: Bitcoin (BTC), Ethereum (ETH), Solana (SOL), BNB, XRP, Cardano (ADA) collegati all'API live pubblica di Binance.
- **Aggiunta Ticker Personalizzati**: Aggiungi qualsiasi titolo o fondo preferito tramite il pulsante `+ Aggiungi` con persistenza in LocalStorage.
- **Sentiment di Mercato**: Indicatore Fear & Greed globale in tempo reale da *alternative.me* e stato orari di borsa Wall Street (NYSE).

### 3. Grafici Avanzati & Indicatori Tecnici
- **Engine Canvas ad Alte Prestazioni**: Rendering fluido a 60 FPS con supporto schermi ad alta densità (HiDPI / Retina).
- **Crosshair Interattivo**: Sposta il cursore o tocca lo schermo per leggere Open, High, Low, Close e Volume istantanei.
- **Indicatori Integrati**:
  - **EMA 20 & EMA 50**: Rilevamento automatico di Golden Cross e trend primario.
  - **Bande di Bollinger (20, 2)**: Visualizzazione immediata di eccessi e volatilità.
  - **RSI (14)**: Sotto-grafico con fasce di ipervenduto (<30) e ipercomprato (>70).
  - **MACD (12, 26, 9)**: Linea MACD, Linea Signal e Istogramma di momentum.
- **Decision Support Banner**: Valutazione algoritmica automatica del setup con punteggio di confidenza (es. *BUY Moderato 74%*, *Neutro*, o *Vendita / Cautela*).

### 4. Gestione del Rischio & Decision Support
- **Calcolatore Position Sizing Professionale**:
  - Inserisci il tuo **Capitale Totale** e la tua **% di rischio massimo per trade** (es. 1.5%).
  - Inserisci **Prezzo d'ingresso**, **Stop Loss** e **Take Profit**.
  - Calcola istantaneamente:
    - Numero esatto di quote/token da comprare (senza rischiare più di quanto stabilito).
    - Rischio monetario massimo esatto (€).
    - Guadagno potenziale al target (€).
    - Rapporto Rischio/Rendimento (**R:R Ratio**, es. `1 : 2.40`), evidenziando in verde i setup ottimali.
- **Checklist Disciplinare Pre-Trade**:
  - Checklist interattiva con calcolo automatico del *Discipline Score* prima di piazzare l'ordine.
- **Diario e Note di Trading**:
  - Salva appunti operativi, motivazioni d'ingresso e livelli di retest specifici per ciascun asset.

### 5. Ponti Rapidi verso le Piattaforme di Trading (Broker Links)
Pulsanti one-click dedicati per aprire direttamente il titolo selezionato su:
- **TradingView**: Analisi tecnica avanzata a pieno schermo con layout multi-chart.
- **Binance**: Book ordini spot/futures per le coppie crypto.
- **Interactive Brokers**: Scheda di ricerca e negoziazione per azioni ed ETF.
- **Yahoo Finance**: Notizie, dati di bilancio e comunicati earnings.

---

## 🚀 Come Avviare l'Applicazione su Chromebook

### Opzione A: Tramite il server locale Python (Consigliato)
Apri il terminale del tuo Chromebook (Linux / Crostini) ed esegui:

```bash
cd /home/francescofidanza/.gemini/antigravity/scratch/chromebook-trader-pwa
python3 server.py
```

Poi apri **Google Chrome** e vai su:
👉 `http://localhost:8080`

### Opzione B: Apertura diretta
Puoi anche aprire direttamente il file `index.html` con il browser Chrome. Tutte le funzionalità, i grafici e le API Binance/Fear & Greed funzioneranno direttamente nel client!

---

## 📲 Come Installarla su ChromeOS come App Autonoma

1. Quando sei su `http://localhost:8080` in Chrome, noterai:
   - Il pulsante **"Installa App"** nella barra superiore dell'applicazione, oppure
   - L'icona del monitor/freccia nella **barra degli indirizzi di Chrome** (a destra).
2. Clicca su **Installa**.
3. L'app si aprirà in una propria finestra senza barre del browser e l'icona apparirà nel **Launcher** e nella **Shelf (Dock)** del Chromebook.

---

## 🛠️ Personalizzazione e Workspace

Per continuare a personalizzare l'applicazione, impostare questa cartella come spazio di lavoro attivo:
```
/home/francescofidanza/.gemini/antigravity/scratch/chromebook-trader-pwa
```
