<template>
  <div class="page activity-page">
    <div class="header">
        <button class="back-btn" @click="router.back()">←</button>
        <h2>查找活动</h2>
    </div>

    <div class="card">
      <div class="search-box">
        <input 
            v-model="activityId" 
            type="number" 
            placeholder="输入活动 ID (如: 1)"
            @keyup.enter="fetchActivity"
        />
        <button class="btn-primary" @click="fetchActivity" :disabled="!activityId">
            搜索
        </button>
      </div>
    </div>

    <transition name="slide-up">
        <div v-if="activity" class="result-section">
            <h3>查询结果</h3>
            <div class="card result-card">
                <div class="result-header">
                    <span class="result-label">活动名称</span>
                    <span class="result-name">{{ activity.name }}</span>
                </div>
                <div class="result-body">
                    <span class="result-label">配置信息</span>
                    <div class="json-viewer">
                        <pre>{{ JSON.stringify(activity.config, null, 2) }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    
    <div v-if="error" class="error-toast">
        {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const activityId = ref('');
const activity = ref<any>(null);
const error = ref('');
const router = useRouter();

const fetchActivity = async () => {
  if (!activityId.value) return;
  
  error.value = '';
  activity.value = null;
  try {
    const res = await api.get(`/user/activities/${activityId.value}`);
    activity.value = res.data;
  } catch (e: any) {
    error.value = '未找到该活动';
    setTimeout(() => error.value = '', 3000);
  }
};
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.back-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--primary-color);
    margin-right: 16px;
    cursor: pointer;
    padding: 0;
}

.search-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.result-section {
    margin-top: 24px;
}

.result-card {
    padding: 0;
    overflow: hidden;
}

.result-header {
    padding: 16px 20px;
    background: #f9f9fa;
    border-bottom: 1px solid #f2f2f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-name {
    font-weight: 600;
    color: var(--primary-color);
}

.result-body {
    padding: 20px;
}

.json-viewer {
    background: #1d1d1f;
    color: #fff;
    padding: 16px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    overflow-x: auto;
    margin-top: 8px;
}

.error-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 100px;
    font-size: 14px;
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
