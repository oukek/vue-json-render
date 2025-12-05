<template>
  <div class="page user-info-page">
    <div class="profile-header">
        <div class="avatar">
            {{ user?.username?.charAt(0).toUpperCase() }}
        </div>
        <h2>{{ user?.username || '用户' }}</h2>
        <span class="badge">{{ user?.role === 'admin' ? '管理员' : '普通用户' }}</span>
    </div>

    <div class="card info-card">
      <div class="info-row">
        <span class="label">用户 ID</span>
        <span class="value">#{{ user?.id }}</span>
      </div>
      <div class="info-row">
        <span class="label">用户名</span>
        <span class="value">{{ user?.username }}</span>
      </div>
    </div>

    <div class="actions">
        <router-link to="/activity" class="btn-primary-link">
            <button class="btn-primary">查询活动配置</button>
        </router-link>
        
        <button class="btn-secondary" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const user = ref<any>(null);
const router = useRouter();

onMounted(async () => {
  try {
    const res = await api.get('/user/info');
    user.value = res.data;
  } catch (e) {
    console.error(e);
    router.push('/login');
  }
});

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
}
</script>

<style scoped>
.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
}

.avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #007aff, #00c6ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.badge {
    background: #e5e5ea;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: #86868b;
}

.info-card {
    padding: 0;
    overflow: hidden;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f2f2f7;
}

.info-row:last-child {
    border-bottom: none;
}

.label {
    color: #86868b;
}

.value {
    font-weight: 500;
}

.btn-primary-link {
    text-decoration: none;
    display: block;
    width: 100%;
}

.actions {
    margin-top: auto;
    padding-bottom: 20px;
}
</style>
