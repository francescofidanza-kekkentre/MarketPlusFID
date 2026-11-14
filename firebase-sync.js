// MarketPulse Pro - Firebase Authentication & Cloud Firestore Sync Engine
// Modular SDK integration using official Google gstatic CDN

import { getFirebaseConfig } from './firebase-config.js';

let app = null;
let auth = null;
let db = null;
let aiInstance = null;
let appCheckInitialized = false;
let currentUser = null;
let unsubscribeSnapshot = null;
let syncTimeout = null;
let isApplyingRemoteData = false;

// Dynamic imports for Firebase Modular SDK
let initializeApp, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut,
    onAuthStateChanged, sendPasswordResetEmail, getFirestore, doc, getDoc, setDoc,
    onSnapshot, serverTimestamp, setPersistence, indexedDBLocalPersistence, browserLocalPersistence,
    getAI, getGenerativeModel, GoogleAIBackend, Schema,
    initializeAppCheck, ReCaptchaEnterpriseProvider;

/**
 * Carica dinamicamente gli SDK Firebase da CDN ufficiale
 */
async function loadFirebaseModules() {
  if (initializeApp) return true;
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js');
    const firestoreMod = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js');
    const aiMod = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-ai.js');
    const appCheckMod = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-check.js');

    initializeApp = appMod.initializeApp;
    getAuth = authMod.getAuth;
    signInWithEmailAndPassword = authMod.signInWithEmailAndPassword;
    createUserWithEmailAndPassword = authMod.createUserWithEmailAndPassword;
    signInWithPopup = authMod.signInWithPopup;
    signInWithRedirect = authMod.signInWithRedirect;
    getRedirectResult = authMod.getRedirectResult;
    GoogleAuthProvider = authMod.GoogleAuthProvider;
    signOut = authMod.signOut;
    onAuthStateChanged = authMod.onAuthStateChanged;
    sendPasswordResetEmail = authMod.sendPasswordResetEmail;
    setPersistence = authMod.setPersistence;
    indexedDBLocalPersistence = authMod.indexedDBLocalPersistence;
    browserLocalPersistence = authMod.browserLocalPersistence;

    getFirestore = firestoreMod.getFirestore;
    doc = firestoreMod.doc;
    getDoc = firestoreMod.getDoc;
    setDoc = firestoreMod.setDoc;
    onSnapshot = firestoreMod.onSnapshot;
    serverTimestamp = firestoreMod.serverTimestamp;

    getAI = aiMod.getAI;
    getGenerativeModel = aiMod.getGenerativeModel;
    GoogleAIBackend = aiMod.GoogleAIBackend;
    Schema = aiMod.Schema;

    initializeAppCheck = appCheckMod.initializeAppCheck;
    ReCaptchaEnterpriseProvider = appCheckMod.ReCaptchaEnterpriseProvider;
    return true;
  } catch (err) {
    console.error('[Firebase] Errore caricamento SDK da CDN:', err);
    return false;
  }
}

function initAppCheckIfConfigured(config) {
  if (appCheckInitialized || !app || !initializeAppCheck || !ReCaptchaEnterpriseProvider) return;
  const siteKey = config?.recaptchaSiteKey;
  if (!siteKey) return;
  try {
    const host = typeof location !== 'undefined' ? location.hostname : '';
    if (host === 'localhost' || host === '127.0.0.1') {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
    appCheckInitialized = true;
  } catch (err) {
    console.warn('[Firebase App Check] Errore inizializzazione:', err);
  }
}

/**
 * Inizializza Firebase con la configurazione disponibile
 */
export async function initFirebaseSync({ onAuthUpdate, onDataUpdate, getLocalState }) {
  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    console.log('[Firebase] Nessuna configurazione Firebase rilevata. Modalità locale attiva.');
    if (onAuthUpdate) onAuthUpdate(null, { configured: false });
    return { initialized: false, configured: false };
  }

  const loaded = await loadFirebaseModules();
  if (!loaded) {
    if (onAuthUpdate) onAuthUpdate(null, { configured: true, error: 'Errore caricamento SDK' });
    return { initialized: false, configured: true };
  }

  try {
    app = initializeApp(config);
    initAppCheckIfConfigured(config);
    auth = getAuth(app);
    db = getFirestore(app);
    if (getAI && GoogleAIBackend) {
      try {
        aiInstance = getAI(app, { backend: new GoogleAIBackend() });
      } catch (aiErr) {
        console.warn('[Firebase AI Logic] Inizializzazione differita:', aiErr);
      }
    }

    // Configura persistenza di sessione persistente tra riaperture (IndexedDB / LocalStorage)
    if (setPersistence) {
      try {
        const persistence = indexedDBLocalPersistence || browserLocalPersistence;
        if (persistence) await setPersistence(auth, persistence);
      } catch (persistErr) {
        console.warn('[Firebase Auth] Errore configurazione persistenza iniziale:', persistErr);
      }
    }

    // Controlla se siamo tornati da un flusso di redirect OAuth (es. Google su mobile o PWA)
    if (getRedirectResult) {
      getRedirectResult(auth)
        .then((redirectResult) => {
          if (redirectResult && redirectResult.user) {
            console.log('[Firebase Auth] Login con redirect completato con successo per:', redirectResult.user.email);
          }
        })
        .catch((redirectErr) => {
          console.warn('[Firebase Auth] Info getRedirectResult:', redirectErr);
        });
    }

    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      if (user) {
        console.log('[Firebase Auth] Utente autenticato:', user.email || user.uid);
        if (onAuthUpdate) onAuthUpdate(user, { configured: true });

        // Ascolta in tempo reale le modifiche del documento utente da altri dispositivi
        setupRemoteListener(user.uid, onDataUpdate, getLocalState);
      } else {
        console.log('[Firebase Auth] Utente disconnesso.');
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        if (onAuthUpdate) onAuthUpdate(null, { configured: true });
      }
    });

    return { initialized: true, configured: true };
  } catch (err) {
    console.error('[Firebase] Errore inizializzazione:', err);
    if (onAuthUpdate) onAuthUpdate(null, { configured: true, error: err.message });
    return { initialized: false, configured: true, error: err };
  }
}

/**
 * Imposta l'ascoltatore in tempo reale per Firestore (users/{uid})
 */
function setupRemoteListener(uid, onDataUpdate, getLocalState) {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
      // Ignora snapshot locali generati dalla scrittura immediata corrente del client
      if (docSnap.metadata && docSnap.metadata.hasPendingWrites) {
        return;
      }

      if (docSnap.exists()) {
        const remoteData = docSnap.data();
        console.log('[Firebase Cloud] Ricevuti dati cloud aggiornati per utente:', uid);
        isApplyingRemoteData = true;
        try {
          if (onDataUpdate) onDataUpdate(remoteData);
        } finally {
          setTimeout(() => { isApplyingRemoteData = false; }, 300);
        }
      } else {
        // Primo accesso di un nuovo utente: inizializza il profilo sul Cloud con portafoglio rigorosamente VUOTO
        console.log('[Firebase Cloud] Nuovo utente: inizializzazione profilo sul Cloud con portafoglio vuoto...');
        const localData = (getLocalState ? getLocalState() : {}) || {};
        const initialPayload = {
          settings: localData.settings || {},
          portfolio: {}, // Sempre vuoto al primo accesso di un nuovo utente
          portfolioSort: 'best',
          assets: Array.isArray(localData.assets) ? localData.assets : [],
          notes: {}
        };
        await saveUserDataToCloud(initialPayload, true);
        if (onDataUpdate) onDataUpdate(initialPayload);
      }
    }, (error) => {
      console.warn('[Firebase Cloud] Errore ascolto Firestore:', error);
    });
  } catch (e) {
    console.warn('[Firebase Cloud] setupRemoteListener error:', e);
  }
}

/**
 * Salva i dati dell'utente sul Cloud Firestore
 */
export async function saveUserDataToCloud(data, immediate = false) {
  if (!currentUser || !db || isApplyingRemoteData) return { success: false, reason: 'not_ready' };

  const performSave = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      // Assicura che portfolio sia una mappa oggetto valida
      let portMap = {};
      if (data.portfolio && typeof data.portfolio === 'object' && !Array.isArray(data.portfolio)) {
        portMap = data.portfolio;
      }

      // Assicura che notes sia un oggetto valido
      let notesMap = {};
      if (data.notes && typeof data.notes === 'object') {
        notesMap = data.notes;
      }

      const payload = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        settings: (data.settings && typeof data.settings === 'object') ? data.settings : {},
        portfolio: portMap,
        portfolioSort: typeof data.portfolioSort === 'string' ? data.portfolioSort : 'best',
        assets: Array.isArray(data.assets) ? data.assets : [],
        notes: notesMap,
        lastDevice: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
        updatedAt: Date.now()
      };

      // Sostituisce il documento con lo stato completo aggiornato
      // (non usare { merge: true } altrimenti i ticker eliminati dalla mappa portfolio rimangono salvati su Firestore)
      await setDoc(userDocRef, payload);
      console.log('[Firebase Cloud] Salvataggio completato con successo!');
      return { success: true };
    } catch (err) {
      console.error('[Firebase Cloud] Errore salvataggio su Firestore:', err);
      throw err;
    }
  };

  if (immediate) {
    return await performSave();
  } else {
    clearTimeout(syncTimeout);
    return new Promise((resolve, reject) => {
      syncTimeout = setTimeout(() => {
        performSave().then(resolve).catch(reject);
      }, 500);
    });
  }
}

/**
 * Login con Email & Password
 */
export async function loginWithEmail(email, password) {
  if (!auth) throw new Error('Firebase non configurato');
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Registrazione con Email & Password
 */
export async function registerWithEmail(email, password) {
  if (!auth) throw new Error('Firebase non configurato');
  return await createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Login con account Google
 * Usa signInWithPopup come metodo principale (mantiene la sessione attiva ed evita la perdita di token su iOS/Safari)
 * Ripiega su signInWithRedirect solo se i popup sono esplicitamente bloccati.
 */
export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase non configurato');

  if (setPersistence) {
    try {
      const persistence = indexedDBLocalPersistence || browserLocalPersistence;
      if (persistence) await setPersistence(auth, persistence);
    } catch (persistErr) {
      console.warn('[Firebase Auth] Errore configurazione persistenza:', persistErr);
    }
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    console.log('[Firebase Auth] Apertura popup di accesso con Google...');
    const result = await signInWithPopup(auth, provider);
    console.log('[Firebase Auth] Login con Google completato con successo per:', result?.user?.email);
    return result;
  } catch (popupErr) {
    console.warn('[Firebase Auth] Errore signInWithPopup:', popupErr);
    // Se il popup è bloccato dal browser, ripiega su redirect
    if (popupErr.code === 'auth/popup-blocked' ||
        popupErr.code === 'auth/operation-not-supported-in-this-environment') {
      console.log('[Firebase Auth] Popup bloccato, tentativo con signInWithRedirect...');
      return await signInWithRedirect(auth, provider);
    }
    throw popupErr;
  }
}

/**
 * Logout
 */
export async function logoutUser() {
  if (!auth) return;
  return await signOut(auth);
}

/**
 * Invia email di recupero password
 */
export async function resetPasswordEmail(email) {
  if (!auth) throw new Error('Firebase non configurato');
  return await sendPasswordResetEmail(auth, email);
}

/**
 * Ritorna l'utente corrente
 */
export function getCurrentUser() {
  return currentUser;
}

const GEMINI_MODEL_NAME = 'gemini-3.8-flash';

async function ensureFirebaseAiReady() {
  if (aiInstance) return aiInstance;
  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    throw new Error('Configurazione Firebase mancante');
  }
  const loaded = await loadFirebaseModules();
  if (!loaded || !getAI || !GoogleAIBackend) {
    throw new Error('SDK Firebase AI Logic non disponibile');
  }
  if (!app) {
    app = initializeApp(config);
  }
  initAppCheckIfConfigured(config);
  aiInstance = getAI(app, { backend: new GoogleAIBackend() });
  return aiInstance;
}

/**
 * Valuta la composizione del portafoglio tramite Firebase AI Logic (Gemini Developer API)
 * con risposta JSON strutturata. In caso di errore restituisce { ok: false, error }.
 */
export async function analyzePortfolioWithGemini(portfolioContext) {
  try {
    const ai = await ensureFirebaseAiReady();
    const responseSchema = Schema.object({
      properties: {
        overallStatus: Schema.string({
          enum: ['EQUILIBRATO', 'ATTENZIONE', 'SOVRAPPOSIZIONI', 'SBILANCIATO']
        }),
        overlaps: Schema.array({
          items: Schema.object({
            severity: Schema.string({ enum: ['high', 'medium'] }),
            message: Schema.string()
          })
        }),
        sectorSummary: Schema.string(),
        actionableTip: Schema.string()
      }
    });

    const model = getGenerativeModel(ai, {
      model: GEMINI_MODEL_NAME,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
        responseSchema
      }
    });

    const prompt = [
      'Sei un analista finanziario quantitativo. Rispondi in italiano chiaro, conciso e professionale.',
      'Analizza questo portafoglio (pesi percentuali già calcolati, non inventare numeri diversi):',
      JSON.stringify(portfolioContext),
      'Valuta rigorosamente:',
      '1) Sovrapposizioni tra azioni singole, ETF (anche look-through su indici/settori come S&P 500, Nasdaq 100, MSCI World, Semiconduttori, FTSE MIB) e certificati (sottostante diretto o worst-of). Se non ci sono sovrapposizioni, restituisci overlaps: [].',
      '2) Sbilanciamento verso un comparto/settore o area geografica.',
      '3) Un breve consiglio operativo concreto (actionableTip, max 22 parole).'
    ].join('\n');

    const result = await model.generateContent(prompt);
    const text = result?.response?.text();
    if (!text) throw new Error('Risposta Gemini vuota');
    const parsed = JSON.parse(text);
    return { ok: true, model: GEMINI_MODEL_NAME, data: parsed };
  } catch (err) {
    console.warn('[Firebase AI Logic] Fallback locale portafoglio:', err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Analisi approfondita di un singolo titolo (o portafoglio) tramite Firebase AI Logic.
 */
export async function analyzeAssetWithGemini(assetContext) {
  try {
    const ai = await ensureFirebaseAiReady();
    const responseSchema = Schema.object({
      properties: {
        verdict: Schema.string(),
        riskProfile: Schema.string(),
        narrative: Schema.string()
      }
    });

    const model = getGenerativeModel(ai, {
      model: GEMINI_MODEL_NAME,
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 900,
        responseMimeType: 'application/json',
        responseSchema
      }
    });

    const prompt = [
      'Sei un analista finanziario. Rispondi in italiano sintetico e oggettivo (max 90 parole per narrative).',
      'Basati esclusivamente sui dati tecnici/fondamentali forniti (senza inventare prezzi):',
      JSON.stringify(assetContext),
      'Restituisci verdict (es. "ACQUISTO GRADUALE", "MANTENIMENTO", "CAUTELA"), riskProfile (es. "Rischio: Moderato") e narrative.'
    ].join('\n');

    const result = await model.generateContent(prompt);
    const text = result?.response?.text();
    if (!text) throw new Error('Risposta Gemini vuota');
    const parsed = JSON.parse(text);
    return { ok: true, model: GEMINI_MODEL_NAME, data: parsed };
  } catch (err) {
    console.warn('[Firebase AI Logic] Fallback locale asset:', err);
    return { ok: false, error: err?.message || String(err) };
  }
}

