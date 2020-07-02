import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyALTZN-GQwqTsZjxrTBHjzE9p8_bJdj-ug",
  authDomain: "isthebookbetter-c445d.firebaseapp.com",
  databaseURL: "https://isthebookbetter-c445d.firebaseio.com",
  projectId: "isthebookbetter-c445d",
  storageBucket: "isthebookbetter-c445d.appspot.com",
  messagingSenderId: "1021177297585",
  appId: "1:1021177297585:web:643c46359e5e6afbdb4090",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
