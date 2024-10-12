import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from './app.json';
import googleProvider from './google-services.json';

const firebaseConfig = {
  apiKey: googleProvider.client[0].api_key,
  authDomain: "gs-app-e02f5.firebaseapp.com",
  projectId: googleProvider.project_info.project_id,
  storageBucket: googleProvider.project_info.storage_bucket,
  messagingSenderId: "182722180520",
  appId: googleProvider.project_info.project_id,
  measurementId: "5988339001"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);