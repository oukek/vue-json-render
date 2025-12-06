<script setup lang="ts">
import { provide } from 'vue';
import { dataCenter } from '@vue-json-render/shared';

provide('GlobalState', dataCenter.state);
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
:root {
  --primary-color: #007aff;
  --bg-color: #f5f5f7;
  --text-color: #1d1d1f;
  --card-bg: #ffffff;
  --border-radius: 12px;
  --input-bg: #f2f2f7;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.5;
}

.app-container {
  max-width: 480px; /* Mobile container limit */
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg-color);
  position: relative;
  overflow-x: hidden;
}

/* Common Mobile Components */
.page {
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

h1, h2, h3 {
  font-weight: 600;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 14px;
  color: #86868b;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: var(--input-bg);
  border-radius: var(--border-radius);
  font-size: 16px;
  outline: none;
  transition: background 0.2s;
}

input:focus {
  background: #e5e5ea;
}

button.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

button.btn-primary:active {
  opacity: 0.8;
}

button.btn-secondary {
    width: 100%;
    padding: 14px;
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
