# Regole di Workspace — MarketPulse Pro

## Monitoraggio GitHub (`origin/main`) e Deploy su Firebase Hosting

1. **Cache-busting prima del commit**: quando modifichi `style.css`, `app.js` o `firebase-sync.js`, aggiorna sempre la query string di versione (`?v=...`) in `index.html` e `app.js` (perché `firebase.json` imposta `max-age=604800` sui file `.js` e `.css`).
2. **Nessun task permanente in background**:
   - **Non mantenere mai** un watcher sempre attivo quando non ci sono modifiche in attesa di commit/sync.
   - Avvia `.agents/scripts/watch_git_sync.py` **solo** subito dopo aver apportato modifiche ai file del progetto (quando l'utente sta per fare *Commit + Sync* su VS Code), con timeout automatico di 10 minuti (`600` secondi):
     1. Leggi lo SHA corrente con `git rev-parse origin/main`.
     2. Avvia in background (`WaitMsBeforeAsync: 500`):
        `python3 .agents/scripts/watch_git_sync.py /home/francescofidanza/projects/MarketPlusFID <SHA_CORRENTE> 600`
   - Se termina con `WATCH_TIMEOUT`, **non riavviarlo** (nessun processo resta attivo).
   - Non riavviare il watcher dopo un deploy completato finché non vengono fatte nuove modifiche al codice.
3. **Conferma obbligatoria in chat prima del deploy Firebase**:
   - **Non eseguire mai** il deploy su Firebase Hosting in autonomia.
   - Appena il watcher termina con `SYNC_DETECTED <commit>` (dopo un **Commit + Sync** su VS Code verso GitHub), **chiedi sempre esplicitamente conferma in chat** all'utente se vuole lanciare il deploy su Firebase Hosting (`https://marketpulsepro-682ff.web.app/`).
   - Solo dopo conferma esplicita dell'utente, esegui:
     `npx --yes firebase-tools deploy --only hosting --project marketpulsepro-682ff`
