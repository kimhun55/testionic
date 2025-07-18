<script setup lang="ts">
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import TodoList from './components/TodoList.vue';
</script>

<template>
  <ion-app>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Todo List</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <TodoList />
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
