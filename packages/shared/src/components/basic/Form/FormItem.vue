<template>
  <div class="form-item">
    <label v-if="label">{{ label }}</label>
    <div class="form-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<style scoped>
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.form-item label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}
.form-content {
  width: 100%;
}
</style>
