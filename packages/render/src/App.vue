<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue';
import { dataCenter } from '@vue-json-render/shared';

provide('GlobalState', dataCenter.state);

const isPC = ref(false);
// Check if currently running inside an iframe
const isIframe = window.self !== window.top;

const checkPC = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
  const isLargeScreen = window.innerWidth > 768;
  // Consider it PC if it's a large screen and not a mobile device
  isPC.value = !isMobile && isLargeScreen;
};

onMounted(() => {
  checkPC();
  window.addEventListener('resize', checkPC);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkPC);
});

const getIframeSrc = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('embedded', 'true');
    return url.toString();
};
</script>

<template>
  <div v-if="isPC && !isIframe" class="pc-wrapper">
    <div class="mobile-container">
        <iframe :src="getIframeSrc()" class="app-iframe"></iframe>
    </div>
  </div>
  <div v-else class="app-container">
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

/* PC Wrapper Styles */
.pc-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #e0e5ec;
    width: 100%;
}

.mobile-container {
    width: 375px;
    height: 85vh;
    max-height: 812px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,0.15);
    background: white;
    border: 8px solid #1c1c1e;
}

.app-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    background: #fff;
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
  background: var(--primary-color);
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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
