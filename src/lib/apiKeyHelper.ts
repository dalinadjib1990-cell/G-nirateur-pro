import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkqsGPlm3rbVXzhbqas7qxDDk060Y3cc4",
  authDomain: "gen-lang-client-0694864679.firebaseapp.com",
  projectId: "gen-lang-client-0694864679",
  storageBucket: "gen-lang-client-0694864679.firebasestorage.app",
  messagingSenderId: "233520604904",
  appId: "1:233520604904:web:eec44d74b8d9b147094b5d"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-d43b3ba5-e913-4101-8012-f9c30198ee36");

export interface ApiKeyInfo {
  id: string;
  key: string;
  maskedKey: string;
  provider: string;
  envVarName: string;
  source: 'env' | 'firestore';
  isActive: boolean;
  status: 'active' | 'rate_limited' | 'error' | 'disabled';
  usageCount: number;
  errorCount: number;
  lastUsedAt: string | null;
  lastErrorAt: string | null;
  lastError: string | null;
  usagePercentage: number;
}

// Utility to create a safe document ID from key string
export function getKeyDocId(keyStr: string): string {
  let hash = 0;
  for (let i = 0; i < keyStr.length; i++) {
    hash = ((hash << 5) - hash) + keyStr.charCodeAt(i);
    hash |= 0;
  }
  return 'k_' + Math.abs(hash).toString(36) + '_' + keyStr.slice(-4);
}

// Mask key string for security display
export function maskKey(keyStr: string): string {
  if (!keyStr) return '';
  if (keyStr.length <= 12) return keyStr.substring(0, 4) + '...' + keyStr.slice(-2);
  return keyStr.substring(0, 8) + '...' + keyStr.slice(-4);
}

// Helper to discover all environment keys and Firestore keys
export async function getAllApiKeysInfo(): Promise<{
  keys: ApiKeyInfo[];
  totalGenerations: number;
  activeCount: number;
  totalKeysCount: number;
}> {
  const keysMap = new Map<string, { keyStr: string; envVarName: string; source: 'env' | 'firestore'; dbDocId?: string; isActiveInDb?: boolean }>();

  // 1. Discover Environment Keys
  if (process.env.GEMINI_API_KEY) {
    keysMap.set(process.env.GEMINI_API_KEY, {
      keyStr: process.env.GEMINI_API_KEY,
      envVarName: 'GEMINI_API_KEY',
      source: 'env'
    });
  }

  // GEMINI_API_KEYS (comma or newline separated string of multiple keys)
  if (process.env.GEMINI_API_KEYS) {
    const splitKeys = process.env.GEMINI_API_KEYS.split(/[\n,;\s]+/).map(k => k.trim()).filter(k => k.length > 10);
    splitKeys.forEach((k, idx) => {
      if (!keysMap.has(k)) {
        keysMap.set(k, {
          keyStr: k,
          envVarName: `GEMINI_API_KEYS[${idx + 1}]`,
          source: 'env'
        });
      }
    });
  }

  // GEMINI_API_KEY_1, GEMINI_API_KEY_2, ..., GEMINI_API_KEY_100
  Object.keys(process.env).forEach(envKey => {
    if ((envKey.startsWith('GEMINI_API_KEY_') || envKey.startsWith('GEMINI_KEY_')) && process.env[envKey]) {
      const val = process.env[envKey] as string;
      if (val && val.length > 10 && !keysMap.has(val)) {
        keysMap.set(val, {
          keyStr: val,
          envVarName: envKey,
          source: 'env'
        });
      }
    }
  });

  // 2. Discover Firestore keys from 'api_keys' collection
  try {
    const snapshot = await getDocs(collection(db, 'api_keys'));
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.key && typeof data.key === 'string' && data.key.length > 10) {
        if (!keysMap.has(data.key)) {
          keysMap.set(data.key, {
            keyStr: data.key,
            envVarName: 'مفتاح مخصص (Firestore)',
            source: 'firestore',
            dbDocId: docSnap.id,
            isActiveInDb: data.isActive !== false
          });
        } else {
          const existing = keysMap.get(data.key)!;
          existing.dbDocId = docSnap.id;
          if (data.isActive === false) existing.isActiveInDb = false;
        }
      }
    });
  } catch (err) {
    console.error('Error fetching Firestore keys:', err);
  }

  // 3. Fetch all stats from 'api_key_stats' collection
  const statsMap = new Map<string, any>();
  try {
    const statsSnapshot = await getDocs(collection(db, 'api_key_stats'));
    statsSnapshot.forEach(docSnap => {
      statsMap.set(docSnap.id, docSnap.data());
    });
  } catch (err) {
    console.error('Error fetching api_key_stats:', err);
  }

  // 4. Calculate total generations across all keys
  let totalGenerations = 0;
  for (const [keyStr] of keysMap.entries()) {
    const docId = getKeyDocId(keyStr);
    const statData = statsMap.get(docId) || {};
    const usageCount = Number(statData.usageCount || 0);
    totalGenerations += usageCount;
  }

  // 5. Build ApiKeyInfo array
  const resultKeys: ApiKeyInfo[] = [];

  for (const [keyStr, meta] of keysMap.entries()) {
    const docId = getKeyDocId(keyStr);
    const statData = statsMap.get(docId) || {};

    const usageCount = Number(statData.usageCount || 0);
    const errorCount = Number(statData.errorCount || 0);
    const isExplicitlyDisabled = meta.isActiveInDb === false || statData.disabled === true;

    let status: 'active' | 'rate_limited' | 'error' | 'disabled' = 'active';
    if (isExplicitlyDisabled) {
      status = 'disabled';
    } else if (statData.status === 'rate_limited') {
      const lastErrTime = statData.lastErrorAt ? new Date(statData.lastErrorAt).getTime() : 0;
      if (Date.now() - lastErrTime < 600000) {
        status = 'rate_limited';
      } else {
        status = 'active';
      }
    } else if (statData.status === 'error') {
      status = 'error';
    }

    const usagePercentage = totalGenerations > 0 ? parseFloat(((usageCount / totalGenerations) * 100).toFixed(1)) : 0;

    resultKeys.push({
      id: docId,
      key: keyStr,
      maskedKey: maskKey(keyStr),
      provider: 'Gemini AI',
      envVarName: meta.envVarName,
      source: meta.source,
      isActive: !isExplicitlyDisabled,
      status,
      usageCount,
      errorCount,
      lastUsedAt: statData.lastUsedAt || null,
      lastErrorAt: statData.lastErrorAt || null,
      lastError: statData.lastError || null,
      usagePercentage
    });
  }

  // Sort keys: highest usage first, then by envVarName
  resultKeys.sort((a, b) => b.usageCount - a.usageCount);

  const activeCount = resultKeys.filter(k => k.isActive && k.status !== 'error').length;

  return {
    keys: resultKeys,
    totalGenerations,
    activeCount,
    totalKeysCount: resultKeys.length
  };
}

// Function to log successful usage of a key
export async function recordKeyUsage(keyStr: string) {
  try {
    const docId = getKeyDocId(keyStr);
    const docRef = doc(db, 'api_key_stats', docId);
    const nowIso = new Date().toISOString();

    await setDoc(docRef, {
      usageCount: increment(1),
      lastUsedAt: nowIso,
      status: 'active',
      keyPreview: maskKey(keyStr)
    }, { merge: true });
  } catch (err) {
    console.error('Error recording key usage:', err);
  }
}

// Function to log rate limit or error of a key
export async function recordKeyError(keyStr: string, errorMessage: string, isRateLimit: boolean) {
  try {
    const docId = getKeyDocId(keyStr);
    const docRef = doc(db, 'api_key_stats', docId);
    const nowIso = new Date().toISOString();

    await setDoc(docRef, {
      errorCount: increment(1),
      lastErrorAt: nowIso,
      lastError: errorMessage.substring(0, 150),
      status: isRateLimit ? 'rate_limited' : 'error',
      keyPreview: maskKey(keyStr)
    }, { merge: true });
  } catch (err) {
    console.error('Error recording key error:', err);
  }
}
