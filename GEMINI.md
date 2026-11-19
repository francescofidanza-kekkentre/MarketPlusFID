# Regole di Workspace — MarketPulse Pro

## Cache-Busting e Deploy su Firebase Hosting

1. **Cache-busting prima del commit**: quando modifichi `style.css`, `app.js` o `firebase-sync.js`, aggiorna sempre la query string di versione (`?v=...`) in `index.html` e `app.js` (perché `firebase.json` imposta `max-age=604800` sui file `.js` e `.css`).
2. **Nessun monitoraggio o task in background**: non avviare mai script o watcher in background per monitorare Git o `origin/main`.
3. **Deploy su Firebase Hosting solo su richiesta esplicita**: esegui il deploy su Firebase Hosting (`https://marketpulsepro-682ff.web.app/`) **esclusivamente** quando è l'utente a chiederlo in chat, tramite:
   `npx --yes firebase-tools deploy --only hosting --project marketpulsepro-682ff`
