// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD2WF7dj_yfvbZ5MmEV9e53PdkA_2lMXIc",
  authDomain: "tickex-f9b27.firebaseapp.com",
  projectId: "tickex-f9b27",
  storageBucket: "tickex-f9b27.appspot.com",
  messagingSenderId: "681939280339",
  appId: "1:681939280339:web:7225852209c49cb9be0f26",
  measurementId: "G-1BM39HRHVK"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

export { db, firebase, storage };