<template>
  <section class="filters">
    <div class="filters__row">
      <!-- Чекбокс 18+ -->
      <label class="filters__item filters__item--checkbox">
        <span class="filters__checkbox-wrap">
          <input
            type="checkbox"
            :checked="onlyAdults"
            @change="onToggleAdults"
          />
          <span class="filters__checkbox-custom"></span>
        </span>
        <span>Показывать только пользователей 18+</span>
      </label>
    </div>

    <div class="filters__row filters__row--sort">
      <!-- Сортировка по полю -->
      <label class="filters__item">
        <span class="filters__label">Сортировать по:</span>
        <div class="filters__select-wrap">
          <select :value="sortBy" @change="onChangeSortBy">
            <option value="none">без сортировки</option>
            <option value="name">Имени</option>
            <option value="age">Возрасту</option>
          </select>
        </div>
      </label>

      <!-- Порядок сортировки -->
      <label class="filters__item">
        <span class="filters__label">Порядок:</span>
        <div class="filters__select-wrap">
          <select :value="sortDirection" @change="onChangeSortDirection">
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </div>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  onlyAdults: boolean;
  sortBy: 'none' | 'name' | 'age';
  sortDirection: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'update:onlyAdults', value: boolean): void;
  (e: 'update:sortBy', value: 'none' | 'name' | 'age'): void;
  (e: 'update:sortDirection', value: 'asc' | 'desc'): void;
}>();

function onToggleAdults(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:onlyAdults', target.checked);
}

function onChangeSortBy(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:sortBy', target.value as 'none' | 'name' | 'age');
}

function onChangeSortDirection(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:sortDirection', target.value as 'asc' | 'desc');
}
</script>

<style scoped>
.filters {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.9rem;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  backdrop-filter: blur(4px);
  transform-origin: top;
  animation: filters-fade-in 0.22s ease-out;
}

@keyframes filters-fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.filters__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
}

.filters__row--sort {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
}

.filters__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #374151;
  transition: transform 0.12s ease, color 0.12s ease;
}

.filters__item--checkbox:hover {
  transform: translateY(-1px);
  color: #1d4ed8;
}

/* Кастомный чекбокс */
.filters__checkbox-wrap {
  position: relative;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.filters__checkbox-wrap input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.filters__checkbox-custom {
  width: 18px;
  height: 18px;
  border-radius: 0.4rem;
  border: 1.5px solid #9ca3af;
  background: #fff;
  box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.18s ease,
    transform 0.12s ease;
  position: relative;
}

.filters__checkbox-wrap input:checked + .filters__checkbox-custom {
  background: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}

.filters__checkbox-wrap input:focus-visible + .filters__checkbox-custom {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.filters__checkbox-custom::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 0.25rem;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) scale(0);
  transform-origin: center;
  transition: transform 0.12s ease-out;
}

.filters__checkbox-wrap input:checked + .filters__checkbox-custom::after {
  transform: rotate(45deg) scale(1);
}

/* Лейблы */
.filters__label {
  font-size: 0.9rem;
  color: #4b5563;
}

/* Стилизованный select */
.filters__select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filters__select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.35rem 2rem 0.35rem 0.6rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
  background-color: #f9fafb;
  color: #111827;
  outline: none;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease,
    transform 0.1s ease;
}

/* стрелочка */
.filters__select-wrap::after {
  content: '▾';
  position: absolute;
  right: 0.65rem;
  font-size: 0.7rem;
  pointer-events: none;
  color: #6b7280;
}

.filters__select-wrap select:hover {
  background-color: #eef2ff;
  border-color: #6366f1;
  transform: translateY(-1px);
}

.filters__select-wrap select:focus-visible {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

@media (max-width: 640px) {
  .filters {
    padding: 0.75rem;
  }

  .filters__row {
    flex-direction: column;
    align-items: flex-start;
  }

  .filters__item {
    width: 100%;
    justify-content: flex-start;
  }

  .filters__select-wrap select {
    width: 100%;
  }
}
</style>
