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
        <ion-item>
          <ion-label position="stacked">อัปโหลดรูปภาพ (กล้องหรือไฟล์)</ion-label>

            <ion-button v-if="isMobileApp()" expand="block" @click="handleSelectImage">เลือกภาพจากกล้อง/แกลเลอรี่</ion-button>
          <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" style="margin-top:8px;" />
        </ion-item>
        <ion-item v-if="imagePreview">
          <ion-label position="stacked">Preview</ion-label>
          <img :src="imagePreview" alt="Preview" style="max-width:100%;max-height:200px;" />
        </ion-item>
        <ion-item v-if="imageUrl">
          <ion-label position="stacked">Image URL</ion-label>
          <a :href="imageUrl" target="_blank">{{ imageUrl }}</a>
          <img :src="imageUrl" alt="Uploaded" style="max-width:100%;max-height:200px;" />
        </ion-item>
        <ion-button expand="block" type="submit" class="ion-margin-top">บันทึก</ion-button>
      </form>
      <ion-list class="ion-margin-top">
        <ion-item v-for="(todo, idx) in todos" :key="idx">
          <ion-label>
            <div style="display: flex; align-items: flex-start;">
              <div v-if="todo.imageUrl" style="flex: 0 0 110px; margin-right: 16px;">
                <a :href="todo.imageUrl" target="_blank">
                  <img :src="todo.imageUrl" alt="รูปภาพ" style="max-width:100px;max-height:100px;vertical-align:middle;" />
                </a>
              </div>
              <div style="flex: 1;">
                <h2>{{ todo.title }}</h2>
                <p>{{ todo.content }}</p>
                <p v-if="todo.dueDate">กำหนดเสร็จ: {{ formatDate(todo.dueDate) }}</p>
                <p v-if="todo.location">ตำแหน่ง: {{ todo.location.lat }}, {{ todo.location.lng }}</p>
              </div>
            </div>
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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

const title = ref('');
const content = ref('');
const dueDate = ref('');
const location = ref<{ lat: number; lng: number } | null>(null);
const locationText = ref('');
const showDatePicker = ref(false);
const todos = ref<{ title: string; content: string; dueDate?: string; location?: { lat: number; lng: number }; imageUrl?: string }[]>([]);
const imageFile = ref<File|null>(null);
const imagePreview = ref<string>('');
const imageUrl = ref<string>('');
const fileInput = ref<HTMLInputElement|null>(null);

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

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    imageFile.value = files[0];
    imagePreview.value = URL.createObjectURL(files[0]);
  } else {
    imageFile.value = null;
    imagePreview.value = '';
  }
}

async function selectImage() {
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt // ให้ผู้ใช้เลือกกล้องหรือไฟล์
    });
    imagePreview.value = photo.dataUrl || '';
    // แปลง dataUrl เป็นไฟล์เพื่อ upload
    if (photo.dataUrl) {
      const arr = photo.dataUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      imageFile.value = new File([u8arr], 'photo.jpg', { type: mime });
    }
  } catch (e) {
    alert('ไม่สามารถเลือกภาพได้: ' + e);
  }
}

async function uploadImage(): Promise<string> {
  if (!imageFile.value) return '';
  const formdata = new FormData();
  formdata.append('file', imageFile.value, imageFile.value.name);
  try {
    const response = await fetch('https://capa.kimhun55.com/upload', {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    });
    const result = await response.json();
    // ใช้ path จาก response
    if (!result.path) {
      alert('Upload ไม่สำเร็จ: ไม่พบ path ใน response');
      return '';
    }
    return result.path;
  } catch (error) {
    console.error(error);
    alert('เกิดข้อผิดพลาดขณะอัปโหลดรูปภาพ: ' + error);
    return '';
  }
}

async function addTodo() {
  if (!title.value || !content.value) return;
  let url = '';
  if (imageFile.value) {
    url = await uploadImage();
    imageUrl.value = url;
  }
  todos.value.push({ title: title.value, content: content.value, dueDate: dueDate.value, location: location.value ?? undefined, imageUrl: url });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
  title.value = '';
  content.value = '';
  dueDate.value = '';
  location.value = null;
  locationText.value = '';
  imageFile.value = null;
  imagePreview.value = '';
  imageUrl.value = '';
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function isMobileApp() {
  return Capacitor.isNativePlatform();
}

async function handleSelectImage() {
  if (isMobileApp()) {
    await selectImage();
  } else {
    fileInput.value?.click();
  }
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