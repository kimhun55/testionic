<script setup lang="ts">

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import TodoList from './components/TodoList.vue';
import Writer from './components/Writer.vue';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';



// Firebase Web Push (เฉพาะ web)
let messaging: any = null;
const firebaseConfig = {
  apiKey: "AIzaSyBBPQ1izPfK30SD8ywN0yVQEi5eGxqHxH8",
  authDomain: "ionic-bffbd.firebaseapp.com",
  projectId: "ionic-bffbd",
  storageBucket: "ionic-bffbd.appspot.com",
  messagingSenderId: "651004615091",
  appId: "1:651004615091:web:caebdea76aa4769a7fd3c6",
  measurementId: "G-KCP03ZF3QW"
};

const page = ref('home');
function goTo(p: string) { page.value = p; }

onMounted(() => {
  console.log('App mounted');
  if (Capacitor.getPlatform() !== 'web') {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    const db = getFirestore();
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    PushNotifications.addListener('registration', async token => {
      console.log('Push App registration success, token: ' + token.value);
      //save token to Firestore
      const userId = 'mobile_' + token.value.slice(0, 10); // หรือใช้ user id จริงถ้ามี
      console.log('Saving token to Firestore for userId:', userId);
      await setDoc(doc(db, 'mobile_push_tokens', userId), {
        token: token.value,
        createdAt: new Date()
      });
      console.log('Token saved to Firestore');
    });
    PushNotifications.addListener('registrationError', err => {
      console.error('Push registration error: ', err.error);
    PushNotifications.addListener('pushNotificationReceived', async notification => {
      console.log('Push mobile main received: ', notification);
      });
    });
    PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push mobile action performed: ', notification);
    });
  } else {
    // Web: Firebase Messaging (v9 modular)
    import('firebase/app').then(firebase => {
      import('firebase/messaging').then(firebaseMessaging => {
        const { getMessaging, getToken, onMessage } = firebaseMessaging;
        // ใช้ getApps() จาก modular SDK
        const getApps = firebase.getApps || firebase.default.getApps;
        const initializeApp = firebase.initializeApp || firebase.default.initializeApp;
        if (!getApps().length) {
          initializeApp(firebaseConfig);
        }
        messaging = getMessaging();
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            getToken(messaging, { vapidKey: 'BBuGWuPqCu7O5TNLH6wO-a2AQl5c89LEDZy1Gj7LBnEYjleMKKMtnkaH_4S7I-vgnOuWvjVU-0Ta-6R2meEx3vk' })
              .then(async (token: string | null) => {
                if (token) {
                  console.log('Web Push token:', token);
                  const db = getFirestore();
                  const userId = 'web_' + token.slice(0, 10); // หรือใช้ user id จริงถ้ามี
                  await setDoc(doc(db, 'web_push_tokens', userId), {
                    token: token,
                    createdAt: new Date()
                  });
                  console.log('Token saved to Firestore');

                } else {
                  console.warn('No registration token available. Request permission to generate one.');
                }
              })
              .catch((err: any) => {
                console.error('An error occurred while retrieving token. ', err);
              });
            onMessage(messaging, (payload: any) => {
              console.log('Web push received:', payload);
              // ปรับให้แสดงการแจ้งเตือน
              if (Notification.permission === 'granted') {
                const notificationTitle = payload.notification?.title || 'Notification';
                const notificationOptions = {
                  body: payload.notification?.body || '',
                  icon: payload.notification?.icon || 'https://placekitten.com/120/120'
                };
                // ต้องแน่ใจว่าอยู่ใน context ของ window
                window.focus();
                new Notification(notificationTitle, notificationOptions);
              } else {
                console.warn('Notification permission is not granted.');
              }
            });
          }
        });
      });
    });
  }
});
</script>

<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="goTo('home')">
        <ion-icon name="home-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Test app</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="page === 'home'" style="padding: 2em; text-align: center;">
        <ion-button expand="block" color="secondary" @click="goTo('todo')">
          <ion-icon slot="start" name="list-outline"></ion-icon>
          Todo List local
        </ion-button>
        <ion-button expand="block" color="tertiary" @click="goTo('writer')">
          <ion-icon slot="start" name="create-outline"></ion-icon>
          Writer
        </ion-button>
      </div>
      <div v-else-if="page === 'todo'">
        <TodoList />
      </div>
      <div v-else-if="page === 'writer'">
        <Writer />
      </div>
    </ion-content>
  </ion-app>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
