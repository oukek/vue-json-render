<template>
  <div class="page login-page">
    <div class="login-header">
      <h1>欢迎回来</h1>
      <p>请登录以继续</p>
    </div>
    
    <div class="card">
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
    
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  
  try {
    const res = await api.post('/user/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', res.data.token);
    router.push('/info');
  } catch (e: any) {
    error.value = '登录失败，请检查用户名或密码';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  justify-content: center;
  background-color: #fff;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 32px;
  color: #1d1d1f;
  margin-bottom: 8px;
}

.login-header p {
  color: #86868b;
}

.error-message {
  color: #ff3b30;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}
</style>
