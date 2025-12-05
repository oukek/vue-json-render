<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref<'success' | 'error' | 'info'>('info');
let timer: any = null;

const show = (msg: string, t: 'success' | 'error' | 'info' = 'info', duration = 2000) => {
  if (timer) clearTimeout(timer);
  
  message.value = msg;
  type.value = t;
  visible.value = true;
  
  timer = setTimeout(() => {
    visible.value = false;
    timer = null;
  }, duration);
};

defineExpose({
  show
});
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.toast.success {
  background-color: #67c23a;
}

.toast.error {
  background-color: #f56c6c;
}

.toast.info {
  background-color: #909399;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, top 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  top: 0;
}
</style>
