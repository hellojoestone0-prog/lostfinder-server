import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let initialized = false;

const initFirebase = () => {
  if (initialized) return;
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || join(__dirname, '../firebase-service-account.json');
  if (existsSync(path)) {
    const serviceAccount = JSON.parse(readFileSync(path, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
  }
};

export const sendCommand = async (fcmToken, command) => {
  initFirebase();
  if (!initialized) {
    throw new Error('Firebase not initialized. Add firebase-service-account.json');
  }
  const message = {
    token: fcmToken,
    data: {
      command,
      timestamp: String(Date.now())
    },
    android: {
      priority: 'high'
    },
    apns: {
      payload: { aps: { contentAvailable: true } },
      fcmOptions: { contentAvailable: true }
    }
  };
  const result = await admin.messaging().send(message);
  return result;
};
