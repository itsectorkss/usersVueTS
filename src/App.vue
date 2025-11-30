<template>
  <div class="app">
    <header class="app__header">
      <!-- Фоновое видео -->
      <div class="app__header-video">
        <video
          autoplay
          muted
          loop
          playsinline
        >
          <source :src="tokyoVideo" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <div class="app__header-video-overlay"></div>
      </div>

      <div class="app__header-inner">
        <div class="app__header-main">
          <h1>Список пользователей</h1>

          <p v-if="!hoveredUser">
            Приложение на Vue 3 + TypeScript
          </p>
          <p v-else class="app__header-subtitle">
            <strong>{{ hoveredUser.fullName }}</strong>
            <span class="app__header-dot">•</span>
            Количество полных лет: {{ hoveredUser.age }}
          </p>

          <a
            class="app__header-tg"
            href="https://t.me/const_DEV"
            target="_blank"
            rel="noopener"
          >
            @const_DEV
          </a>
        </div>

        <div v-if="hoveredUser" class="app__header-user">
          <div class="app__header-avatar">
            <img
              v-if="hoveredUser.photoUrl"
              :src="hoveredUser.photoUrl"
              :alt="`Фото пользователя ${hoveredUser.fullName}`"
            />
            <div v-else class="app__header-avatar-placeholder">
              {{ hoveredInitials }}
            </div>
          </div>
          <div class="app__header-user-info">
            <div class="app__header-user-name">
              {{ hoveredUser.fullName }}
            </div>
            <div class="app__header-user-meta">
              {{ hoveredUser.age }} лет · {{ hoveredUser.email }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="app__content">
      <UserFilters
        v-model:onlyAdults="onlyAdults"
        v-model:sortBy="sortBy"
        v-model:sortDirection="sortDirection"
      />

      <UserList
        :users="filteredUsers"
        @updatePhoto="handleUpdatePhoto"
        @hoverUser="handleHoverUser"
        @addUserClick="openAddForm"
        @deleteUser="handleDeleteUser"
      />


      <!-- МОДАЛКА ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ -->
      <div
        v-if="isAddModalOpen"
        class="modal-backdrop"
        @click.self="closeAddForm"
      >
        <div class="modal">
          <h2 class="modal__title">Добавить пользователя</h2>

          <form class="modal__form" @submit.prevent="submitAddUser">
            <div class="modal__field">
              <label>Имя</label>
              <input
                v-model="newUserForm.firstName"
                type="text"
                placeholder="Иван"
              />
            </div>

            <div class="modal__field">
              <label>Фамилия</label>
              <input
                v-model="newUserForm.lastName"
                type="text"
                placeholder="Иванов"
              />
            </div>

            <div class="modal__field">
              <label>Возраст</label>
              <input
                v-model="newUserForm.age"
                type="number"
                min="1"
                placeholder="25"
              />
            </div>

            <div class="modal__field">
              <label>Email</label>
              <input
                v-model="newUserForm.email"
                type="email"
                placeholder="ivan.ivanov@example.com"
              />
            </div>

            <p v-if="addFormError" class="modal__error">
              {{ addFormError }}
            </p>

            <div class="modal__buttons">
              <button type="button" class="btn btn--ghost" @click="closeAddForm">
                Отмена
              </button>
              <button type="submit" class="btn btn--primary">
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue';
import tokyoVideo from './assets/tokyo.mp4';
import UserList from './components/UserList.vue';
import UserFilters from './components/UserFilters.vue';

import { mockUsers } from './mock/users';
import { UserModel, type IUser } from './models/User';
import { fetchUsers } from './services/userService';

const STORAGE_KEY = 'users-data-v1';

const users = ref<UserModel[]>([]);

// фильтр 18+
const onlyAdults = ref(false);

// сортировка
const sortBy = ref<'none' | 'name' | 'age'>('none');
const sortDirection = ref<'asc' | 'desc'>('asc');

// hovered-пользователь для header
const hoveredUser = ref<UserModel | null>(null);

const hoveredInitials = computed(() => {
  if (!hoveredUser.value) return '';
  const first = hoveredUser.value.firstName?.[0] ?? '';
  const last = hoveredUser.value.lastName?.[0] ?? '';
  return (first + last).toUpperCase();
});

// ---- Добавление пользователя ----
const isAddModalOpen = ref(false);

const newUserForm = reactive({
  firstName: '',
  lastName: '',
  age: '',
  email: '',
});

const addFormError = ref<string | null>(null);

function openAddForm() {
  addFormError.value = null;
  newUserForm.firstName = '';
  newUserForm.lastName = '';
  newUserForm.age = '';
  newUserForm.email = '';
  isAddModalOpen.value = true;
}

function closeAddForm() {
  isAddModalOpen.value = false;
}

function submitAddUser() {
  addFormError.value = null;

  const firstName = newUserForm.firstName.trim();
  const lastName = newUserForm.lastName.trim();
  const email = newUserForm.email.trim();
  const ageNum = Number(newUserForm.age);

  if (!firstName || !lastName || !email || !newUserForm.age) {
    addFormError.value = 'Заполните все поля.';
    return;
  }

  if (Number.isNaN(ageNum) || ageNum <= 0) {
    addFormError.value = 'Возраст должен быть положительным числом.';
    return;
  }

  if (!email.includes('@')) {
    addFormError.value = 'Некорректный email.';
    return;
  }

  const existingIds = users.value.map((u) => u.id);
  const newId = existingIds.length ? Math.max(...existingIds) + 1 : 1;

  const newUser = new UserModel({
    id: newId,
    firstName,
    lastName,
    age: ageNum,
    email,
  });

  users.value.push(newUser);
  closeAddForm();
}

// ------------------ Инициализация данных ------------------
onMounted(async () => {
  // 1. localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as IUser[];
      users.value = parsed.map((u) => UserModel.fromPlain(u));
      return;
    }
  } catch (e) {
    console.error('Ошибка загрузки из localStorage, пробуем fetch', e);
  }

  // 2. AJAX
  try {
    const loadedUsers = await fetchUsers();
    users.value = loadedUsers;
    return;
  } catch (e) {
    console.error('Ошибка загрузки users.json, используем mockUsers', e);
  }

  users.value = [...mockUsers];
});

// сохранение в localStorage
watch(
  users,
  (value) => {
    try {
      const plain: IUser[] = value.map((u) => u.toPlain());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
    } catch (e) {
      console.error('Ошибка сохранения в localStorage', e);
    }
  },
  { deep: true }
);

// фильтрация + сортировка
const filteredUsers = computed<UserModel[]>(() => {
  let result = [...users.value];

  if (onlyAdults.value) {
    result = result.filter((user) => user.isAdult);
  }

  if (sortBy.value !== 'none') {
    result.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortBy.value === 'name') {
        valA = a.fullName.toLowerCase();
        valB = b.fullName.toLowerCase();
      } else {
        valA = a.age;
        valB = b.age;
      }

      if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
});

// обновление фото
function handleUpdatePhoto(payload: { id: number; photoDataUrl: string }) {
  const user = users.value.find((u) => u.id === payload.id);
  if (!user) return;
  user.photoUrl = payload.photoDataUrl;
}

function handleDeleteUser(id: number) {
  // Если в header сейчас этот пользователь — очистим hover
  if (hoveredUser.value && hoveredUser.value.id === id) {
    hoveredUser.value = null;
  }

  users.value = users.value.filter((u) => u.id !== id);
}

// hover пользователя
function handleHoverUser(user: UserModel | null) {
  hoveredUser.value = user;
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.app__header {
  position: relative;
  height: 260px;
  color: #ffffff;
  margin-bottom: 0;
  overflow: hidden;
}

/* обёртка видео */
.app__header-video {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.app__header-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 77%;
  filter: saturate(1.1) contrast(1.05);
}

/* затемняющий слой поверх видео */

.app__header-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
}

.app__header-main h1 {
  margin: 0 0 0.4rem;
  font-size: 1.9rem;
  font-weight: 700;
  opacity: 0.9;
}

.app__header-main p {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.app__header-subtitle strong {
  font-weight: 600;
}

.app__header-dot {
  opacity: 0.8;
  padding: 0 0.25rem;
}

/* блок hovered-пользователя в header */
.app__header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(16px);
}

.app__header-avatar img,
.app__header-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app__header-avatar-placeholder {
  background: rgba(191, 219, 254, 0.85);
  color: #1e3a8a;
  font-weight: 600;
  font-size: 0.95rem;
}

.app__header-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.app__header-user-name {
  font-size: 0.95rem;
  font-weight: 600;
}

.app__header-user-meta {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* CONTENT */
.app__content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
}

/* Адаптив */
@media (max-width: 768px) {
  .app__header {
    height: 220px;
  }

  .app__header-inner {
    padding: 1.25rem 1rem 1.5rem;
    align-items: flex-end;
  }

  .app__header-main h1 {
    font-size: 1.5rem;
  }

  .app__content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .app__header {
    height: 200px;
  }

  .app__header-main h1 {
    font-size: 1.3rem;
  }

  .app__header-main p {
    font-size: 0.85rem;
  }

  .app__content {
    padding: 0.75rem;
  }
}
/* Модалка */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.modal {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem 1.5rem 1.25rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.35);
  animation: modal-pop 0.18s ease-out;
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal__title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
}

.modal__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal__field label {
  font-size: 0.85rem;
  color: #4b5563;
}

.modal__field input {
  border-radius: 0.55rem;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.6rem;
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

.modal__field input:focus-visible {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
  background: #eff6ff;
}

.modal__error {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #b91c1c;
}

.modal__buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* buttons */
.btn {
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.btn--primary {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.btn--primary:hover {
  background: #1d4ed8;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.btn--ghost {
  background: #ffffff;
  color: #374151;
  border-color: #d1d5db;
}

.btn--ghost:hover {
  background: #f3f4f6;
}

/* адаптив */
@media (max-width: 480px) {
  .modal {
    margin: 0 1rem;
    padding: 1.25rem 1.25rem 1rem;
  }
}

.app__header-tg {
  margin-top: 0.4rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(191, 219, 254, 0.9);
  background: rgba(15, 23, 42, 0.4);
  font-size: 0.8rem;
  color: #e5edff;
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.app__header-tg::before {
  content: 'Автор:';
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.9;
}

.app__header-tg:hover {
  background: rgba(37, 99, 235, 0.9);
  border-color: rgba(191, 219, 254, 1);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.5);
  transform: translateY(-1px);
}
</style>
