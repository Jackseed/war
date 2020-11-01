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
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
    icon:
      "https://firebasestorage.googleapis.com/v0/b/war-prod.appspot.com/o/icon.png?alt=media&token=6671ddf6-568e-4fbc-8f55-27a562bbc8b5"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
