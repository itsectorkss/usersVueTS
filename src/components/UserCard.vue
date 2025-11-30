<template>
  <article
    class="user-card"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <button
      class="user-card__delete"
      type="button"
      @click.stop="onDeleteClick"
      aria-label="Удалить пользователя"
    >
      ×
    </button>

    <!-- Аватар = зона загрузки -->
    <label class="user-card__avatar">
      <input
        class="user-card__avatar-input"
        type="file"
        accept="image/*"
        @change="onFileChange"
      />

      <img
        v-if="user.photoUrl"
        :src="user.photoUrl"
        :alt="`Фото пользователя ${user.fullName}`"
      />
      <div v-else class="user-card__avatar--placeholder">
        {{ initials }}
      </div>

      <div class="user-card__avatar-overlay">
        <span>{{ overlayText }}</span>
      </div>
    </label>

    <div class="user-card__info">
      <h2 class="user-card__name">
        {{ user.fullName }}
        <span v-if="user.isAdult" class="user-card__badge user-card__badge--adult">
          18+
        </span>
        <span v-else class="user-card__badge user-card__badge--minor">
          &lt;18
        </span>
      </h2>

      <p class="user-card__meta">
        <span class="user-card__age">{{ user.age }} лет</span>
        <span class="user-card__email">{{ user.email }}</span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserModel } from '../models/User';

const props = defineProps<{
  user: UserModel;
}>();

const emit = defineEmits<{
  (e: 'updatePhoto', payload: { id: number; photoDataUrl: string }): void;
  (e: 'hover', user: UserModel | null): void;
  (e: 'delete', id: number): void;
}>();

const initials = computed(() => {
  const first = props.user.firstName?.[0] ?? '';
  const last = props.user.lastName?.[0] ?? '';
  return (first + last).toUpperCase();
});

const overlayText = computed(() =>
  props.user.photoUrl ? 'Изменить фото' : 'Добавить фото'
);

// hover-события
function onMouseEnter() {
  emit('hover', props.user);
}

function onMouseLeave() {
  emit('hover', null);
}

// выбор файла
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  const file = target.files[0];
  if (!file.type.startsWith('image/')) return;

  const reader = new FileReader();

  reader.onload = () => {
    const result = reader.result;
    if (typeof result === 'string') {
      emit('updatePhoto', { id: props.user.id, photoDataUrl: result });
    }
  };

  reader.readAsDataURL(file);
  target.value = '';
}

// клик по крестику
function onDeleteClick() {
  emit('delete', props.user.id);
}
</script>

<style scoped>
.user-card {
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  align-items: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
}

/* Кнопка удаления */
.user-card__delete {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: rgba(248, 250, 252, 0.9);
  color: #9ca3af;
  font-size: 1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.6);
  transition:
    background 0.12s ease,
    color 0.12s ease,
    box-shadow 0.12s ease,
    transform 0.1s ease;
}

.user-card__delete:hover {
  background: #fee2e2;
  color: #b91c1c;
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.9);
  transform: translateY(-1px);
}

/* Аватар = кликабельная зона */
.user-card__avatar {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-card__avatar-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.user-card__avatar img,
.user-card__avatar--placeholder {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  object-fit: cover;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.user-card__avatar--placeholder {
  background: #e0e7ff;
  color: #312e81;
  font-weight: 600;
  font-size: 1.1rem;
}

/* overlay при hover */
.user-card__avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.55));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

.user-card__avatar-overlay span {
  font-size: 0.7rem;
  color: #f9fafb;
  text-align: center;
  padding: 0 0.4rem;
}

.user-card__avatar:hover .user-card__avatar-overlay {
  opacity: 1;
  transform: scale(1);
}

/* Инфо */
.user-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-card__badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.user-card__badge--adult {
  background: #e3f9e5;
  color: #166534;
}

.user-card__badge--minor {
  background: #fee2e2;
  color: #b91c1c;
}

.user-card__meta {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.user-card__email {
  word-break: break-all;
}

@media (max-width: 480px) {
  .user-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-card__name {
    font-size: 1rem;
  }

  .user-card__meta {
    font-size: 0.85rem;
  }
}
</style>
