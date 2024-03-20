// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD03q0Qzhi0Ie7vaqn9tcoE1kojRdCMlkQ",
    authDomain: "expense-tra-75288.firebaseapp.com",
    projectId: "expense-tra-75288",
    storageBucket: "expense-tra-75288.appspot.com",
    messagingSenderId: "28559687911",
    appId: "1:28559687911:web:bfb1e44e92f379add2e242",
    // measurementId: "G-4QD222NQPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

