<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>工作台</h2>
      </div>
      <nav>
        <router-link to="/activities" class="nav-link active">活动管理</router-link>
        <a href="#" @click.prevent="logout" class="nav-link">退出登录</a>
      </nav>
    </aside>
    
    <main class="main-content">
      <div class="page-header">
        <h1>活动管理</h1>
        <button class="btn-primary" @click="createActivity">
          + 新建活动
        </button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in activities" :key="activity.id">
              <td>#{{ activity.id }}</td>
              <td>{{ activity.name }}</td>
              <td>{{ new Date(activity.createdAt).toLocaleString() }}</td>
              <td>
                <button class="btn-secondary btn-sm" @click="editActivity(activity)">编辑</button>
              </td>
            </tr>
            <tr v-if="activities.length === 0">
                <td colspan="4" class="empty-state">暂无活动</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const activities = ref<any[]>([]);

const fetchActivities = async () => {
  try {
    const res = await api.get('/admin/activities');
    activities.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

const createActivity = () => {
    router.push('/editor/new');
};

const editActivity = (activity: any) => {
    router.push(`/editor/${activity.id}`);
};

const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
};

onMounted(fetchActivities);
</script>

<style scoped>
.dashboard {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 260px;
    background-color: var(--sidebar-bg);
    color: var(--sidebar-text);
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 24px;
    border-bottom: 1px solid #374151;
}

.sidebar-header h2 {
    color: white;
    font-size: 20px;
}

.sidebar nav {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-link {
    color: #9ca3af;
    text-decoration: none;
    padding: 10px 12px;
    border-radius: 6px;
    transition: all 0.2s;
}

.nav-link:hover, .nav-link.active {
    background-color: #374151;
    color: white;
}

.main-content {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.page-header h1 {
    font-size: 24px;
    font-weight: 600;
}

.table-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background-color: #f9fafb;
    text-align: left;
    padding: 12px 24px;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

td {
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
}

tr:last-child td {
    border-bottom: none;
}

.btn-sm {
    padding: 4px 12px;
    font-size: 12px;
}

.empty-state {
    text-align: center;
    padding: 48px;
    color: #9ca3af;
}
</style>
