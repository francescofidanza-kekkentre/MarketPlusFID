// MarketPulse Pro - Firebase Authentication & Cloud Firestore Sync Engine
// Modular SDK integration using official Google gstatic CDN

import { getFirebaseConfig } from './firebase-config.js';

let app = null;
let auth = null;
let db = null;
let currentUser = null;
let unsubscribeSnapshot = null;
let syncTimeout = null;
let isApplyingRemoteData = false;

// Dynamic imports for Firebase Modular SDK
let initializeApp, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, sendPasswordResetEmail,
    getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp;

/**
 * Carica dinamicamente gli SDK Firebase da CDN ufficiale
 */
async function loadFirebaseModules() {
  if (initializeApp) return true;
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const firestoreMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    initializeApp = appMod.initializeApp;
    getAuth = authMod.getAuth;
    signInWithEmailAndPassword = authMod.signInWithEmailAndPassword;
    createUserWithEmailAndPassword = authMod.createUserWithEmailAndPassword;
    signInWithPopup = authMod.signInWithPopup;
    GoogleAuthProvider = authMod.GoogleAuthProvider;
    signOut = authMod.signOut;
    onAuthStateChanged = authMod.onAuthStateChanged;
    sendPasswordResetEmail = authMod.sendPasswordResetEmail;

    getFirestore = firestoreMod.getFirestore;
    doc = firestoreMod.doc;
    getDoc = firestoreMod.getDoc;
    setDoc = firestoreMod.setDoc;
    onSnapshot = firestoreMod.onSnapshot;
    serverTimestamp = firestoreMod.serverTimestamp;
    return true;
  } catch (err) {
    console.error('[Firebase] Errore caricamento SDK da CDN:', err);
    return false;
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
    auth = getAuth(app);
    db = getFirestore(app);

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
        // Primo accesso dell'utente: migriamo i dati locali correnti sul Cloud
        console.log('[Firebase Cloud] Documento utente non trovato. Primo salvataggio dati locali sul Cloud...');
        if (getLocalState) {
          const localData = getLocalState();
          await saveUserDataToCloud(localData, true);
        }
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
  if (!currentUser || !db || isApplyingRemoteData) return;

  const performSave = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const payload = {
        settings: data.settings || {},
        portfolio: data.portfolio || [],
        portfolioSort: data.portfolioSort || 'best',
        assets: data.assets || [],
        notes: data.notes || {},
        lastDevice: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
        updatedAt: Date.now()
      };
      await setDoc(userDocRef, payload, { merge: true });
      console.log('[Firebase Cloud] Salvataggio completato con successo!');
    } catch (err) {
      console.error('[Firebase Cloud] Errore salvataggio su Firestore:', err);
    }
  };

  if (immediate) {
    await performSave();
  } else {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(performSave, 600);
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
 */
export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase non configurato');
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
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

