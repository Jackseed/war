import { environment } from "../environments/environment";

importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');
firebase.initializeApp({
  'messagingSenderId': environment.firebaseConfig.messagingSenderId
});
const messaging = firebase.messaging();
