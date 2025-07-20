<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item.title">
      <ion-label>
        <div style="display: flex; align-items: flex-start;">
          <img :src="item.image" alt="demo" style="max-width:100px;max-height:100px;margin-right:16px;" />
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </ion-label>
    </ion-item>
  </ion-list>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button @click="showForm = true" color="primary">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-modal :is-open="showForm" @didDismiss="showForm = false">
    <ion-content class="ion-padding">
      <form @submit.prevent="submitForm">
        <ion-item>
          <ion-label position="stacked">หัวเรื่อง</ion-label>
          <ion-input v-model="formTitle" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">เนื้อหา</ion-label>
          <ion-textarea v-model="formContent" required></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">รูปภาพ</ion-label>
          <ion-button v-if="isMobileApp()" expand="block" @click="handleSelectImage">เลือกภาพจากกล้อง/แกลเลอรี่</ion-button>
          <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" style="margin-top:8px;" />
        </ion-item>
        <ion-item v-if="imagePreview">
          <ion-label position="stacked">Preview</ion-label>
          <img :src="imagePreview" alt="Preview" style="max-width:100%;max-height:200px;" />
        </ion-item>
        <ion-button expand="block" type="submit" class="ion-margin-top">บันทึก</ion-button>
        <ion-button expand="block" color="medium" @click="showForm = false">ยกเลิก</ion-button>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonModal, IonContent, IonInput, IonTextarea, IonButton } from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

const items = ref([
  { title: 'หัวเรื่อง Demo', content: 'เนื้อหา demo สำหรับ writer page', image: 'https://placekitten.com/120/120' }
]);
const showForm = ref(false);
const formTitle = ref('');
const formContent = ref('');
const imageFile = ref<File|null>(null);
const imagePreview = ref<string>('');
const fileInput = ref<HTMLInputElement|null>(null);

function isMobileApp() {
  return Capacitor.isNativePlatform();
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
      source: CameraSource.Prompt
    });
    imagePreview.value = photo.dataUrl || '';
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

async function handleSelectImage() {
  if (isMobileApp()) {
    await selectImage();
  } else {
    fileInput.value?.click();
  }
}

async function submitForm() {
  if (!formTitle.value || !formContent.value) {
    alert('กรุณากรอกหัวเรื่องและเนื้อหา');
    return;
  }
  const formdata = new FormData();
  formdata.append('title', formTitle.value);
  formdata.append('content', formContent.value);
  if (imageFile.value) {
    formdata.append('image', imageFile.value, imageFile.value.name);
  }
  try {
    const response = await fetch('http://capa.kimhun55.com/add', {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    });
    const result = await response.text();
    alert('บันทึกสำเร็จ: ' + result);
    // เพิ่ม demo item
    items.value.push({ title: formTitle.value, content: formContent.value, image: imagePreview.value || 'https://placekitten.com/120/120' });
    showForm.value = false;
    formTitle.value = '';
    formContent.value = '';
    imageFile.value = null;
    imagePreview.value = '';
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error);
  }
}

onMounted(loadData);

async function loadData() {
  try {
    const response = await fetch('http://capa.kimhun55.com/get', {
      method: 'GET',
      redirect: 'follow'
    });
    const result = await response.json();
    // result = { status: true, data: [...] }
    if (result.status && Array.isArray(result.data)) {
      items.value = result.data;
    } else {
      alert('ข้อมูลที่ได้ไม่ถูกต้อง');
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาดขณะโหลดข้อมูล: ' + error);
  }
}
</script>

<style scoped>
h2 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}
p {
  margin: 0;
  color: #666;
}
ion-fab {
  z-index: 100;
}
</style>
