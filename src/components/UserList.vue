<template>
  <section class="user-list">
    <div v-if="!users.length" class="user-list__empty">
      Список пользователей пуст.
    </div>

    <TransitionGroup
      v-else
      name="user-list"
      tag="div"
      class="user-list__grid"
    >
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @updatePhoto="handleUpdatePhoto"
        @hover="handleHover"
        @delete="handleDelete"
      />

      <UserAddCard
        key="add-user-card"
        @click="handleAddUserClick"
      />
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import type { UserModel } from '../models/User';
import UserCard from './UserCard.vue';
import UserAddCard from './UserAddCard.vue';

defineProps<{
  users: UserModel[];
}>();

const emit = defineEmits<{
  (e: 'updatePhoto', payload: { id: number; photoDataUrl: string }): void;
  (e: 'hoverUser', user: UserModel | null): void;
  (e: 'addUserClick'): void;
  (e: 'deleteUser', id: number): void;
}>();

function handleUpdatePhoto(payload: { id: number; photoDataUrl: string }) {
  emit('updatePhoto', payload);
}

function handleHover(user: UserModel | null) {
  emit('hoverUser', user);
}

function handleAddUserClick() {
  emit('addUserClick');
}

function handleDelete(id: number) {
  emit('deleteUser', id);
}
</script>

<style scoped>
.user-list__empty {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.user-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

/* анимации TransitionGroup */
.user-list-enter-active,
.user-list-leave-active {
  transition: all 0.18s ease-out;
}

.user-list-enter-from,
.user-list-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

.user-list-move {
  transition: transform 0.18s ease-out;
}

@media (max-width: 480px) {
  .user-list__grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
