import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9JNshyo_dBctvndICSeVfSeRkcHWQhy8",
  authDomain: "autorizacao-saida.firebaseapp.com",
  projectId: "autorizacao-saida",
  storageBucket: "autorizacao-saida.firebasestorage.app",
  messagingSenderId: "298449592978",
  appId: "1:298449592978:web:aeeaccb7f4b0b1c06bfc4b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);