<template>
  <ion-list>
    <ion-item v-for="(todo, idx) in todos" :key="idx">
      <ion-label @click="editTodo(idx)">{{ todo.title }}</ion-label>
      <ion-button color="danger" @click="deleteTodo(idx)">ลบ</ion-button>
    </ion-item>
    <ion-item>
      <ion-input v-model="newTitle" placeholder="เรื่อง"></ion-input>
      <ion-input v-model="newContent" placeholder="เนื้อหา"></ion-input>
      <ion-button @click="saveTodo">บันทึก</ion-button>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonList, IonItem, IonLabel, IonButton, IonInput } from '@ionic/vue';

interface Todo {
  title: string;
  content: string;
}

const todos = ref<Todo[]>([]);
const newTitle = ref('');
const newContent = ref('');
const editIdx = ref<number|null>(null);

function loadTodos() {
  const data = localStorage.getItem('todos');
  todos.value = data ? JSON.parse(data) : [];
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos.value));
}

function saveTodo() {
  if (newTitle.value && newContent.value) {
    if (editIdx.value !== null) {
      todos.value[editIdx.value] = { title: newTitle.value, content: newContent.value };
      editIdx.value = null;
    } else {
      todos.value.push({ title: newTitle.value, content: newContent.value });
    }
    saveTodos();
    newTitle.value = '';
    newContent.value = '';
  }
}

function deleteTodo(idx: number) {
  todos.value.splice(idx, 1);
  saveTodos();
}

function editTodo(idx: number) {
  newTitle.value = todos.value[idx].title;
  newContent.value = todos.value[idx].content;
  editIdx.value = idx;
}

onMounted(loadTodos);
</script>
