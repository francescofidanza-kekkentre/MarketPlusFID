// MarketPulse Pro - Firebase Configuration & Setup Helper
// Progetto Firebase: MarketPulse Pro
// È possibile configurare le chiavi direttamente in questo file o tramite la finestra "Account & Cloud Sync" nell'app.

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBo5bLDnASHqwEuuaot6iii6mq_bayL4g8",
  authDomain: "marketpulsepro-682ff.firebaseapp.com",
  projectId: "marketpulsepro-682ff",
  storageBucket: "marketpulsepro-682ff.firebasestorage.app",
  messagingSenderId: "802500095620",
  appId: "1:802500095620:web:7ca805e438b4a8c436dcd1",
  measurementId: "G-GPVTD25Z4L"
};

/**
 * Recupera la configurazione Firebase attuale (da localStorage o dai default)
 */
export function getFirebaseConfig() {
  try {
    const custom = localStorage.getItem('marketpulse_firebase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Firebase] Errore lettura configurazione salvata:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Salva una configurazione Firebase personalizzata in localStorage
 */
export function saveFirebaseConfig(configObj) {
  if (!configObj || typeof configObj !== 'object') {
    throw new Error('Configurazione non valida');
  }
  localStorage.setItem('marketpulse_firebase_config', JSON.stringify(configObj));
  return true;
}

