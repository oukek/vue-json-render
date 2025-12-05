<template>
  <div class="shared-progress">
    <div 
      class="shared-progress-bar" 
      :style="{ 
        height: `${strokeWidth}px`, 
        backgroundColor: trackColor,
        borderRadius: `${borderRadius}px`
      }"
    >
      <div
        class="shared-progress-inner"
        :class="{ 
          'shared-progress-striped': striped,
          'shared-progress-animated': animated && striped
        }"
        :style="barStyle"
      >
        <div v-if="showText && textInside" class="shared-progress-text-inside" :style="{ fontSize }">
          {{ percentage }}%
        </div>
      </div>
    </div>
    <div v-if="showText && !textInside" class="shared-progress-text" :style="{ color: textColor, fontSize }">
      {{ percentage }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ProgressProps } from './config';

const props = withDefaults(defineProps<ProgressProps>(), {
  percentage: 0,
  strokeWidth: 6,
  color: '#409eff',
  trackColor: '#ebeef5',
  showText: true,
  textInside: false,
  textColor: '#606266',
  fontSize: '12px',
  borderRadius: 100,
  striped: false,
  animated: false,
});

const barStyle = computed(() => ({
  width: `${Math.min(Math.max(props.percentage, 0), 100)}%`,
  backgroundColor: props.color,
  borderRadius: `${props.borderRadius}px`,
  lineHeight: `${props.strokeWidth}px`
}));

</script>

<style scoped>
.shared-progress {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.shared-progress-bar {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
}

.shared-progress-inner {
  height: 100%;
  transition: width 0.6s ease;
  text-align: right;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.shared-progress-text {
  margin-left: 5px;
  min-width: 35px; /* prevent layout shift */
}

.shared-progress-text-inside {
  color: #fff;
  margin-right: 5px;
  white-space: nowrap;
}

.shared-progress-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.shared-progress-animated {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
