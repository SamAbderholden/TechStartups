// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR3VRerrILkNa-9PdombecQ2EPfrUTmKs",
  authDomain: "snowdays-6446f.firebaseapp.com",
  projectId: "snowdays-6446f",
  storageBucket: "snowdays-6446f.appspot.com",
  messagingSenderId: "370532412007",
  appId: "1:370532412007:web:356c0f732693430aca42c2",
  measurementId: "G-56YP3XWX25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);