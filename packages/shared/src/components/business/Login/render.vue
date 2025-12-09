<template>
  <div class="login-component" :style="containerStyle">
    <div class="login-card" :style="cardStyle">
      <div class="login-header">
        <h1 :style="titleStyle">{{ title }}</h1>
        <p :style="subtitleStyle">{{ subtitle }}</p>
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Server Select (Moved to top) -->
        <div class="form-group">
          <select v-model="serverId" :style="inputStyle" required>
            <option value="" disabled>{{ serverPlaceholder }}</option>
            <option v-for="server in servers" :key="server.id" :value="server.id">
              {{ server.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <input 
            v-model="username" 
            type="text" 
            :placeholder="usernamePlaceholder" 
            :style="inputStyle"
            required 
          />
        </div>

        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            :placeholder="passwordPlaceholder" 
            :style="inputStyle"
            required 
          />
        </div>

        <button type="submit" :style="btnStyle" :disabled="loading">
          {{ loading ? '登录中...' : loginBtnText }}
        </button>
      </form>
      
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, CSSProperties } from 'vue';
import { LoginProps } from './config';
import { dataCenter } from '../../../dataCenter';

const props = withDefaults(defineProps<LoginProps>(), {
  title: '欢迎回来',
  subtitle: '请登录以继续',
  usernamePlaceholder: '请输入用户名',
  passwordPlaceholder: '请输入密码',
  serverPlaceholder: '请选择服务器',
  loginBtnText: '登录',
  
  cardBackgroundColor: '#ffffff',
  cardBorderRadius: '12px',
  cardPadding: '32px',
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  
  titleColor: '#1d1d1f',
  titleFontSize: '32px',
  titleFontWeight: '600',
  
  subtitleColor: '#86868b',
  subtitleFontSize: '14px',
  
  inputHeight: '40px',
  inputBorderColor: '#d1d5db',
  inputBorderRadius: '6px',
  inputFontSize: '14px',
  
  btnBackgroundColor: '#4f46e5',
  btnTextColor: '#ffffff',
  btnFontSize: '16px',
  btnHeight: '44px',
  btnBorderRadius: '6px',
});

const username = ref('');
const password = ref('');
const serverId = ref<number | ''>('');
const servers = ref<any[]>([]);
const loading = ref(false);
const error = ref('');

// Computed Styles
const containerStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const cardStyle = computed<CSSProperties>(() => ({
  backgroundColor: props.cardBackgroundColor,
  borderRadius: props.cardBorderRadius,
  padding: props.cardPadding,
  boxShadow: props.cardShadow,
  width: '100%',
  maxWidth: '100%', // Controlled by parent container usually
  boxSizing: 'border-box',
}));

const titleStyle = computed<CSSProperties>(() => ({
  color: props.titleColor,
  fontSize: props.titleFontSize,
  fontWeight: props.titleFontWeight as any,
  marginBottom: '8px',
  textAlign: 'center',
}));

const subtitleStyle = computed<CSSProperties>(() => ({
  color: props.subtitleColor,
  fontSize: props.subtitleFontSize,
  textAlign: 'center',
  marginBottom: '24px',
}));

const inputStyle = computed<CSSProperties>(() => ({
  height: props.inputHeight,
  borderColor: props.inputBorderColor,
  borderRadius: props.inputBorderRadius,
  fontSize: props.inputFontSize,
  width: '100%',
  padding: '0 12px',
  borderWidth: '1px',
  borderStyle: 'solid',
  marginBottom: '16px',
  boxSizing: 'border-box',
  outline: 'none',
}));

const btnStyle = computed<CSSProperties>(() => ({
  backgroundColor: props.btnBackgroundColor,
  color: props.btnTextColor,
  fontSize: props.btnFontSize,
  height: props.btnHeight,
  borderRadius: props.btnBorderRadius,
  width: '100%',
  border: 'none',
  cursor: loading.value ? 'not-allowed' : 'pointer',
  opacity: loading.value ? 0.7 : 1,
}));

// Logic
const fetchServers = async () => {
  if (!dataCenter.api) return;
  try {
    const activityId = dataCenter.state.activityId;
    const res = await dataCenter.api.get('/servers', { params: { activityId } });
    servers.value = res.data || [];
  } catch (e) {
    console.error('Failed to fetch servers', e);
    // Mock data for preview if failed (or if no API)
    if (dataCenter.state.mode === 'preview') {
      servers.value = [
        { id: 1, name: '测试服务器1' },
        { id: 2, name: '测试服务器2' },
      ];
    }
  }
};

const handleLogin = async () => {
  if (!serverId.value) {
    error.value = '请选择服务器';
    return;
  }
  
  if (!dataCenter.api) {
    console.warn('API client not initialized');
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const res = await dataCenter.api.post('/user/login', {
      username: username.value,
      password: password.value,
      serverId: Number(serverId.value)
    });
    
    // Handle login success
    // Usually store token and redirect
    if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        // Redirect to info or home
        // dataCenter.router?.push('/info');
        // Or trigger an event?
        // For now, let's assume we redirect to a default page or just emit success
        console.log('Login success', res.data);
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || '登录失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchServers();
});
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
}
</style>
