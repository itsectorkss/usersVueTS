<template>
  <article class="user-add-card" @click="$emit('click')">
    <div class="user-add-card__circle">
      <span class="user-add-card__plus">+</span>
    </div>
    <div class="user-add-card__text">
      <div class="user-add-card__title">Добавить пользователя</div>
      <div class="user-add-card__subtitle">Нажмите, чтобы заполнить данные</div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.user-add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 2px dashed #cbd5f5;
  background: #f9fafb;
  cursor: pointer;
  text-align: center;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.user-add-card__circle {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 2px solid #93c5fd;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
}

.user-add-card__plus {
  font-size: 2rem;
  line-height: 1;
  color: #2563eb;
}

.user-add-card__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
}

.user-add-card__subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

.user-add-card:hover {
  background: #eef2ff;
  border-color: #60a5fa;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.15);
}
</style>
