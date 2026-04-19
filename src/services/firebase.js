import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9JNshyo_dBctvndICSeVfSeRkcHWQhy8",
  authDomain: "autorizacao-saida.firebaseapp.com",
  projectId: "autorizacao-saida",
  storageBucket: "autorizacao-saida.firebasestorage.app",
  messagingSenderId: "298449592978",
  appId: "1:298449592978:web:aeeaccb7f4b0b1c06bfc4b"
};

// ✅ 1. Inicializa o app PRIMEIRO
const app = initializeApp(firebaseConfig);

// ✅ 2. Auth com persistência (React Native)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// ✅ 3. Firestore
export const db = getFirestore(app);