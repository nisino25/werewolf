import firebase from "firebase/app";
import "firebase/database";

const config = {
	apiKey: "AIzaSyCq6YHpvSEFewCEG7r-NkmIVi9JDVryhxQ",
  authDomain: "shiritori-7c72d.firebaseapp.com",
  projectId: "shiritori-7c72d",
  storageBucket: "shiritori-7c72d.appspot.com",
  messagingSenderId: "897743408372",
  appId: "1:897743408372:web:b2e62d66331c44714da2a1",
  measurementId: "G-FHEK2T9W1Y"
}

const db = firebase.initializeApp(config);
export default db;
