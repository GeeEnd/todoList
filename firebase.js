// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJKEd0LjOqSO9AHK_OwqBrXD1ivfCxZaY",
    authDomain: "crud-master-3013d.firebaseapp.com",
    databaseURL: "https://crud-master-3013d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "crud-master-3013d",
    storageBucket: "crud-master-3013d.appspot.com",
    messagingSenderId: "267781587938",
    appId: "1:267781587938:web:15f6f798dd6b296f5a6fbb"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
