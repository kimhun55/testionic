importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBBPQ1izPfK30SD8ywN0yVQEi5eGxqHxH8",
  authDomain: "ionic-bffbd.firebaseapp.com",
  projectId: "ionic-bffbd",
  storageBucket: "ionic-bffbd.appspot.com",
  messagingSenderId: "651004615091",
  appId: "1:651004615091:web:caebdea76aa4769a7fd3c6",
  measurementId: "G-KCP03ZF3QW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
