// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth"; //getAuth is the authentication object
import { getFirestore } from "firebase/firestore"; //Get Cloud Firestore database


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "inside .env file",
  authDomain: "react-firebase-learning-92b43.firebaseapp.com",
  projectId: "react-firebase-learning-92b43",
  storageBucket: "react-firebase-learning-92b43.appspot.com",
  messagingSenderId: "917676277919",
  appId: "1:917676277919:web:443014a034c34e57af62aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);//auth is the authentication object
export const googleProvider = new GoogleAuthProvider(); //googleProvider is the google authentication object
export const db = getFirestore(app); //db is the database object