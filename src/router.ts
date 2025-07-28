import { createRouter, createWebHistory } from 'vue-router';
import TodoList from './components/TodoList.vue';
import UserDemo from './components/UserDemo.vue';
import Writer from './components/Writer.vue';
import Home from './components/Home.vue';
// ตัวอย่าง: เพิ่มหน้า TodoDetail รองรับ deep link เช่น /todo/123
// (สร้างไฟล์ TodoDetail.vue ถ้ายังไม่มี)
// import TodoDetail from './components/TodoDetail.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/todo', component: TodoList },
  { path: '/user', component: UserDemo },
  { path: '/writer', component: Writer }, // ตัวอย่าง path ที่ใช้สำหรับ deep link
  // เพิ่ม path รองรับ deep link เช่น myapp://todo/123 หรือ https://your.domain/todo/123
  // { path: '/todo/:id', component: TodoDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
