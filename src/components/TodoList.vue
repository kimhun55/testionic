<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar color="primary">
        <ion-title>ToDo List</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content class="ion-padding">
      <form @submit.prevent="addTodo">
        <ion-item>
          <ion-label position="stacked">หัวเรื่อง</ion-label>
          <ion-input v-model="title" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">เนื้อหา</ion-label>
          <ion-textarea v-model="content" required></ion-textarea>
        </ion-item>
        <ion-item @click="showDatePicker = true" button>
          <ion-label position="stacked">กำหนดวันเสร็จ</ion-label>
          <ion-input :value="dueDate ? formatDate(dueDate) : ''" readonly placeholder="เลือกวันที่"></ion-input>
        </ion-item>
        <ion-modal :is-open="showDatePicker" @didDismiss="showDatePicker = false">
          <ion-content class="ion-padding">
            <ion-datetime v-model="dueDate" presentation="date" @ionChange="showDatePicker = false"></ion-datetime>
            <ion-button expand="block" @click="showDatePicker = false">ตกลง</ion-button>
          </ion-content>
        </ion-modal>
        <ion-item @click="getLocation" button>
          <ion-label position="stacked">ตำแหน่ง (Location)</ion-label>
          <ion-input :value="locationText" readonly placeholder="กดเพื่อบันทึกตำแหน่ง"></ion-input>
        </ion-item>
        <ion-button expand="block" type="submit" class="ion-margin-top">บันทึก</ion-button>
      </form>
      <ion-list class="ion-margin-top">
        <ion-item v-for="(todo, idx) in todos" :key="idx">
          <ion-label>
            <h2>{{ todo.title }}</h2>
            <p>{{ todo.content }}</p>
            <p v-if="todo.dueDate">กำหนดเสร็จ: {{ formatDate(todo.dueDate) }}</p>
            <p v-if="todo.location">ตำแหน่ง: {{ todo.location.lat }}, {{ todo.location.lng }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonList, IonModal, IonDatetime } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';

const title = ref('');
const content = ref('');
const dueDate = ref('');
const location = ref<{ lat: number; lng: number } | null>(null);
const locationText = ref('');
const showDatePicker = ref(false);
const todos = ref<{ title: string; content: string; dueDate?: string; location?: { lat: number; lng: number } }[]>([]);

const STORAGE_KEY = 'my_todos';

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    todos.value = JSON.parse(saved);
  }
});

async function getLocation() {
  try {
    const pos = await Geolocation.getCurrentPosition();
    location.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    locationText.value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
  } catch (e) {
    locationText.value = 'ไม่สามารถดึงตำแหน่งได้';
  }
}

function addTodo() {
  if (!title.value || !content.value) return;
  todos.value.push({ title: title.value, content: content.value, dueDate: dueDate.value, location: location.value });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
  title.value = '';
  content.value = '';
  dueDate.value = '';
  location.value = null;
  locationText.value = '';
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}
</script>

<style scoped>
ion-item h2 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}
ion-item p {
  margin: 0;
  color: #666;
}
</style>