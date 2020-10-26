importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAT7U1JZwZlf1RHIP184HFgJh7s7zVmVHI",
  authDomain: "war-prod.firebaseapp.com",
  databaseURL: "https://war-prod.firebaseio.com",
  projectId: "war-prod",
  storageBucket: "war-prod.appspot.com",
  messagingSenderId: "116993685114",
  appId: "1:116993685114:web:08d8985c03aff9cf2dedc3",
  measurementId: "G-NQQGTLNZVD"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
