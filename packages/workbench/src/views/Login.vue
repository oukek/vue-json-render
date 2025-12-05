<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>管理后台</h2>
        <p>登录以管理活动</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit" class="btn-primary w-full">登录</button>
      </form>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await api.post('/admin/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('admin_token', res.data.token);
    router.push('/activities');
  } catch (e: any) {
    error.value = '登录失败，请检查用户名或密码';
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h2 {
  color: #111827;
  font-size: 24px;
  font-weight: 700;
}

.login-header p {
  color: #6b7280;
  margin-top: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.w-full {
  width: 100%;
  padding: 10px;
}

.error-text {
  color: #ef4444;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}
</style>
