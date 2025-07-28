<script setup lang="ts">

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { onMounted } from 'vue';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { useRouter } from 'vue-router';

const router = useRouter();

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


  // Deep Link handler (Universal/App Links)
  App.addListener('appUrlOpen', (data: any) => {
    // data.url คือ url ที่เปิดแอป เช่น myapp://some/path หรือ https://your.domain/path
    if (data && data.url) {
      try {
        const url = new URL(data.url);
        alert('Deep link URL: ' + url.pathname);
        //url.pathname แสดงเป็น alert box ขึ้นมาที่หน้าจอ
        if (url.pathname) {
          router.push(url.pathname);
        }
      } catch (e) {
        console.warn('Invalid deeplink url:', data.url);
      }
    }
  }
);


//end mounted
});
</script>

<template>
  <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>Menu Content</ion-title>
      </ion-toolbar>
      <ion-list>
         <ion-item button @click="$router.push('/')" style="--background: #fff7e6;">
          <ion-label style="color: #ff8800;">home</ion-label>
        </ion-item>
        <ion-item button @click="$router.push('/todo')" style="--background: #fff7e6;">
          <ion-label style="color: #ff8800;">Todo</ion-label>
        </ion-item>
        <ion-item button @click="$router.push('/writer')" style="--background: #fff7e6;">
          <ion-label style="color: #ff8800;">Writer</ion-label>
        </ion-item>
        <ion-item button @click="$router.push('/user')" style="--background: #fff7e6;">
          <ion-label style="color: #ff8800;">User</ion-label>
        </ion-item>
      </ion-list>
    </ion-header>
    <ion-content class="ion-padding" style="--background: #fff7e6; color: #ff8800;">
      This is the menu content.
    </ion-content>
  </ion-menu>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar color="warning">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          {{
            $route.path === '/todo' ? 'todolist'
            : $route.path === '/writer' ? 'writer'
            : $route.path === '/user' ? 'ผู้ใช้งาน'
            : $route.path === '/' ? 'home'
            : 'Menu'
          }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" style="--background: #fff7e6;">
      <router-view />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      IonButtons,
      IonContent,
      IonHeader,
      IonMenu,
      IonMenuButton,
      IonPage,
      IonTitle,
      IonToolbar,
    },
  });
</script>

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
