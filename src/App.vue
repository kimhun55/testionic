<script setup lang="ts">
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import TodoList from './components/TodoList.vue';
// Make sure Writer.vue exists at src/components/Writer.vue
import Writer from './components/Writer.vue';

const page = ref('home');
function goTo(p: string) { page.value = p; }
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
