# 📈 MarketPulse Pro • Trading & Portfolio PWA

**MarketPulse Pro** è un'applicazione moderna, veloce e reattiva per **Desktop e Mobile (iOS / Android / ChromeOS / PC / Mac)**. Permette di monitorare in tempo reale **Azioni, ETF e Criptovalute**, analizzare i grafici tecnici professionali con indicatori chiave, supportare le decisioni di trading attraverso il calcolo matematico della posizione (Position Sizing) e valutazioni basate su intelligenza artificiale.

---

## 🌟 Caratteristiche Principali

### 1. Esperienza Nativa Cross-Platform (PWA)
- **Installabile con 1 Clic**: Grazie al manifest PWA e al Service Worker integrato, l'app può essere installata come applicazione nativa sia su Desktop che su Mobile (iOS & Android).
- **Supporto Touch e Tastiera Fisica**: Navigazione ottimizzata sia per l'uso smartphone/tablet touch sia per PC, Mac e Chromebook con touchpad e tastiera fisica.
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
- **Criptovalute con Prezzi Live**: Bitcoin (BTC), Ethereum (ETH), Solana (SOL), BNB, XRP, Cardano (ADA) con aggiornamento prezzi in tempo reale.
- **Aggiunta Ticker Personalizzati**: Aggiungi qualsiasi titolo o fondo preferito tramite il pulsante `+ Aggiungi` con persistenza locale.
- **Sentiment di Mercato**: Indicatore Fear & Greed globale in tempo reale e stato degli orari di borsa.

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

## 📲 Installazione come App Autonoma (PWA)

1. Apri l'applicazione nel browser **Google Chrome**.
2. Utilizza il pulsante **"Installa App"** nella barra superiore dell'applicazione oppure l'icona di installazione nella **barra degli indirizzi di Chrome**.
3. L'app si aprirà in una propria finestra dedicata e l'icona apparirà tra le applicazioni del dispositivo.
