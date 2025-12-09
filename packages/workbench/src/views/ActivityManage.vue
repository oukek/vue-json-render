<template>
  <div class="activity-manage">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.push('/activities')">← 返回</button>
        <h1>活动管理 - {{ activity?.name }}</h1>
      </div>
    </div>

    <div class="manage-content">
      <div class="tabs">
        <div 
          class="tab-item" 
          :class="{ active: currentTab === 'server' }"
          @click="currentTab = 'server'"
        >服务器管理</div>
        <div 
          class="tab-item" 
          :class="{ active: currentTab === 'data' }"
          @click="currentTab = 'data'"
        >游戏数据</div>
      </div>

      <!-- Server Management Tab -->
      <div v-if="currentTab === 'server'" class="tab-pane">
        <div class="pane-header">
            <button class="btn-primary" @click="showServerModal = true">+ 新增服务器</button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>服务器名称</th>
                        <th>状态</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="server in servers" :key="server.id">
                        <td>{{ server.id }}</td>
                        <td>{{ server.name }}</td>
                        <td>
                            <span :class="['status-badge', server.status]">
                                {{ server.status === 'active' ? '正常' : '维护中' }}
                            </span>
                        </td>
                        <td>{{ new Date(server.createdAt).toLocaleString() }}</td>
                        <td>
                            <button class="btn-secondary btn-sm" @click="editServer(server)">编辑</button>
                            <button class="btn-danger btn-sm" @click="confirmDeleteServer(server)" style="margin-left: 8px">删除</button>
                        </td>
                    </tr>
                    <tr v-if="servers.length === 0">
                        <td colspan="5" class="empty-state">暂无服务器</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <!-- Game Data Tab (Placeholder) -->
      <div v-if="currentTab === 'data'" class="tab-pane">
        <div class="empty-state">
            暂无游戏数据
        </div>
      </div>
    </div>

    <!-- Create/Edit Server Modal -->
    <div v-if="showServerModal" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ editingServer ? '编辑服务器' : '新增服务器' }}</h3>
                <button class="close-btn" @click="closeServerModal">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>服务器名称</label>
                    <input v-model="serverForm.name" class="form-input" placeholder="请输入服务器名称" />
                </div>
                <div class="form-group">
                    <label>状态</label>
                    <select v-model="serverForm.status" class="form-select">
                        <option value="active">正常</option>
                        <option value="maintenance">维护中</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" @click="closeServerModal">取消</button>
                <button class="btn-primary" @click="saveServer">保存</button>
            </div>
        </div>
    </div>

    <ConfirmModal
      v-model:visible="showDeleteModal"
      title="删除服务器"
      :message="`确定要删除服务器 '${serverToDelete?.name}' 吗？`"
      @confirm="handleDeleteServer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import ConfirmModal from '../components/business/ConfirmModal.vue';
import { toast } from '../utils/toast';

const route = useRoute();
const router = useRouter();
const activityId = route.params.id;

const activity = ref<any>(null);
const servers = ref<any[]>([]);
const currentTab = ref('server');

const showServerModal = ref(false);
const editingServer = ref<any>(null);
const serverForm = ref({ name: '', status: 'active' });

const showDeleteModal = ref(false);
const serverToDelete = ref<any>(null);

const fetchActivity = async () => {
    try {
        const res = await api.get(`/admin/activities/${activityId}`);
        activity.value = res.data;
    } catch (e) {
        toast('获取活动信息失败', 'error');
    }
};

const fetchServers = async () => {
    try {
        const res = await api.get('/servers', { params: { activityId } });
        servers.value = res.data;
    } catch (e) {
        toast('获取服务器列表失败', 'error');
    }
};

const closeServerModal = () => {
    showServerModal.value = false;
    editingServer.value = null;
    serverForm.value = { name: '', status: 'active' };
};

const editServer = (server: any) => {
    editingServer.value = server;
    serverForm.value = { name: server.name, status: server.status };
    showServerModal.value = true;
};

const saveServer = async () => {
    if (!serverForm.value.name) {
        toast('请输入服务器名称', 'error');
        return;
    }

    try {
        if (editingServer.value) {
            await api.put(`/admin/servers/${editingServer.value.id}`, {
                ...serverForm.value,
                activityId
            });
            toast('更新成功', 'success');
        } else {
            await api.post('/admin/servers', {
                ...serverForm.value,
                activityId
            });
            toast('创建成功', 'success');
        }
        closeServerModal();
        fetchServers();
    } catch (e) {
        toast('保存失败', 'error');
    }
};

const confirmDeleteServer = (server: any) => {
    serverToDelete.value = server;
    showDeleteModal.value = true;
};

const handleDeleteServer = async () => {
    if (!serverToDelete.value) return;
    try {
        await api.delete(`/admin/servers/${serverToDelete.value.id}`);
        toast('删除成功', 'success');
        showDeleteModal.value = false;
        fetchServers();
    } catch (e) {
        toast('删除失败', 'error');
    }
};

onMounted(() => {
    fetchActivity();
    fetchServers();
});
</script>

<style scoped>
.activity-manage {
    padding: 20px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.btn-back {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
}

.btn-back:hover {
    color: #333;
}

.manage-content {
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 0 20px;
}

.tab-item {
    padding: 16px 24px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    color: #666;
}

.tab-item.active {
    color: #1890ff;
    border-bottom-color: #1890ff;
}

.tab-pane {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
}

.pane-header {
    margin-bottom: 20px;
}

.table-container {
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background-color: #fafafa;
    font-weight: 500;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-badge.active {
    background-color: #e6f7ff;
    color: #1890ff;
}

.status-badge.maintenance {
    background-color: #fffbe6;
    color: #faad14;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 400px;
    padding: 20px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
}

.form-input, .form-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.btn-primary {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-secondary {
    background-color: white;
    border: 1px solid #d9d9d9;
    color: #333;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-danger {
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-sm {
    padding: 4px 8px;
    font-size: 12px;
}

.empty-state {
    text-align: center;
    color: #999;
    padding: 40px;
}
</style>
