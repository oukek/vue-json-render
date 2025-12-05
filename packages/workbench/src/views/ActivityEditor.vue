<template>
  <div class="editor-container">
    <!-- Left Panel: Pages & Component Tree -->
    <div class="panel left-panel">
      
      <!-- Page List Section -->
      <div class="panel-section page-section">
        <div class="panel-header">
          <h3>页面</h3>
          <button class="btn-add" @click="addPage">+</button>
        </div>
        <div class="list-container">
          <div 
            class="list-item" 
            v-for="(page, index) in pages" 
            :key="index"
            :class="{ selected: currentPageIndex === index }"
            @click="selectPage(index)"
          >
            <div class="item-content">
                <span class="item-name">{{ page.pagename }}</span>
                <span v-if="page.isEntry" class="badge-entry">首页</span>
                <span v-else class="btn-set-entry" @click.stop="setEntryPage(index)" title="设为入口页">🏠</span>
            </div>
            <button class="btn-delete-mini" @click.stop="deletePage(index)">×</button>
          </div>
        </div>
      </div>

      <!-- Component List Section -->
      <div class="panel-section component-section">
        <div class="panel-header">
          <h3>组件 ({{ currentComponents.length }})</h3>
          <button class="btn-add" @click="showComponentLibrary = true">+</button>
        </div>
        <div class="list-container component-tree">
          <div 
            class="list-item" 
            v-for="(component, index) in currentComponents" 
            :key="component.id"
            :class="{ selected: selectedComponentId === component.id }"
            @click="selectComponent(component.id)"
          >
            <div class="item-content">
                <span class="component-name">{{ component.alias || component.name }}</span>
                <span class="component-type-badge">{{ component.name }}</span>
            </div>
            <button class="btn-delete-mini" @click.stop="deleteComponent(component.id)">×</button>
          </div>
          <div v-if="currentComponents.length === 0" class="empty-tree">
            当前页面无组件
          </div>
        </div>
      </div>
    </div>

    <!-- Center Panel: Canvas (Iframe) -->
    <div class="panel center-panel">
      <div class="canvas-header">
        <div class="header-left">
        </div>
        <div class="actions">
          <button class="btn-secondary" @click="saveActivityWithAlert">保存</button>
          <button class="btn-secondary" @click="router.back()">退出</button>
        </div>
      </div>
      <div class="mobile-emulator">
        <iframe 
          ref="iframeRef"
          src="http://localhost:3001/preview" 
          class="emulator-iframe"
          frameborder="0"
        ></iframe>
      </div>
    </div>

    <!-- Right Panel: Config -->
    <div class="panel right-panel">
      <div class="panel-tabs">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >活动配置</div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'page' }"
          @click="activeTab = 'page'"
        >页面配置</div>
      </div>

      <div class="config-content">
        <!-- Activity Config Tab -->
        <div v-if="activeTab === 'activity'" class="config-form activity-config">
           <FormInput 
              v-if="activity" 
              label="活动名称" 
              v-model="activity.name" 
              placeholder="输入活动名称" 
           />
        </div>

        <!-- Page Config Tab -->
        <div v-else-if="activeTab === 'page'" class="tab-content-wrapper">
          <div class="panel-header-sub">
            <h3 v-if="selectedComponent">组件配置</h3>
            <h3 v-else>页面配置</h3>
          </div>
      
          <div v-if="selectedComponent" class="config-form">
            <Collapse v-model="activeCollapseNames" accordion>
                <CollapseItem title="基础信息" name="basic">
                    <FormInput 
                        label="组件名称" 
                        v-model="selectedComponent.alias" 
                        @update:modelValue="(val) => sendComponentDiff('alias', val)" 
                        placeholder="输入组件名称"
                    />
                </CollapseItem>
                
                <CollapseItem title="样式配置" name="style">
                     <BaseConfigForm 
                        :modelValue="selectedComponent.base"
                        @update:modelValue="(val) => { selectedComponent.base = val; }"
                        @change="(key, val) => sendComponentDiff(key, val)"
                    />
                </CollapseItem>
                
                <CollapseItem title="组件配置" name="props">
                    <component 
                        :is="`${selectedComponent.name}Config`" 
                        :modelValue="selectedComponent.props"
                        :dataBinding="selectedComponent.dataBinding"
                        @update:modelValue="onPropsUpdate"
                        @update:dataBinding="onDataBindingUpdate"
                    />
                </CollapseItem>
            </Collapse>
          </div>
          
          <div v-else-if="currentPage" class="config-form page-config">
             <PageConfigForm 
                 :modelValue="currentPage"
                 @update:modelValue="(val) => { pages[currentPageIndex] = val; }"
                 @change="(key, val) => sendPageDiff(key, val)"
             />
          </div>
          
          <div v-else class="empty-state">
            请选择一个页面或组件
          </div>
        </div>
      </div>
    </div>

    <!-- Component Library Modal -->
    <div v-if="showComponentLibrary" class="modal-overlay" @click.self="showComponentLibrary = false">
      <div class="modal-card library-modal">
        <div class="modal-header">
          <h3>添加组件</h3>
          <button class="close-btn" @click="showComponentLibrary = false">×</button>
        </div>
        <div class="library-grid">
          <div 
            class="library-item" 
            v-for="(config, name) in componentConfigs" 
            :key="name"
            @click="addComponent(name)"
          >
            <div class="item-icon">{{ name[0] }}</div>
            <div class="item-name">{{ name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { componentConfigs } from '@vue-json-render/shared/workbench';
import { ActivityConfig, ComponentConfig, PageConfig, ColorPicker, DataField, BaseConfigForm, PageConfigForm, FormItem, FormInput } from '@vue-json-render/shared';
import Collapse from '../components/Collapse.vue';
import CollapseItem from '../components/CollapseItem.vue';
import { toast } from '../utils/toast';

const route = useRoute();
const router = useRouter();
const activityId = route.params.id;
const isNew = computed(() => activityId === 'new');

const activity = ref<any>(null);
const pages = ref<PageConfig[]>([]);
const currentPageIndex = ref(0);
const selectedComponentId = ref('');
const showComponentLibrary = ref(false);
const iframeRef = ref<HTMLIFrameElement | null>(null);
const iframeReady = ref(false);
const activeCollapseNames = ref('props');
const activeTab = ref('page'); // 'activity' | 'page'

const generateRoutePath = () => {
  return 'route_' + Math.random().toString(36).substr(2, 9);
};

const currentPage = computed(() => pages.value[currentPageIndex.value]);
const currentComponents = computed(() => currentPage.value?.components || []);

const selectedComponent = computed(() => 
  currentComponents.value.find(c => c.id === selectedComponentId.value)
);

// Communication with Iframe
const sendConfig = () => {
  if (!iframeRef.value || !iframeRef.value.contentWindow || !iframeReady.value || !currentPage.value) return;
  
  // Send ONLY the current page config to the preview
  iframeRef.value.contentWindow.postMessage({
    type: 'UPDATE_CONFIG',
    data: JSON.parse(JSON.stringify(currentPage.value))
  }, '*');
  
  // Also send Data Center config
  if (activity.value?.dataCenter) {
      iframeRef.value.contentWindow.postMessage({
        type: 'UPDATE_DATA_CENTER',
        data: JSON.parse(JSON.stringify(activity.value.dataCenter))
      }, '*');
  }
};

const sendDiff = (type: 'UPDATE_PAGE_DIFF' | 'UPDATE_COMPONENT_DIFF', key: string, value: any, id?: string) => {
  if (!iframeRef.value || !iframeRef.value.contentWindow || !iframeReady.value) return;
  iframeRef.value.contentWindow.postMessage({
    type,
    key,
    value,
    id
  }, '*');
};

const sendPageDiff = (key: string, value: any) => {
    sendDiff('UPDATE_PAGE_DIFF', key, value);
};

const sendComponentDiff = (key: string, value: any) => {
    if (!selectedComponentId.value) return;
    sendDiff('UPDATE_COMPONENT_DIFF', key, value, selectedComponentId.value);
};

const onDataBindingUpdate = (newBinding: Record<string, string>) => {
    if (selectedComponent.value) {
        selectedComponent.value.dataBinding = newBinding;
        // Ensure to send diff for dataBinding. 
        // Note: The preview might not handle dataBinding yet, but we store it.
        sendComponentDiff('dataBinding', newBinding);
        saveActivity();
    }
};

const onPropsUpdate = (newProps: any) => {
    if (selectedComponent.value) {
        selectedComponent.value.props = newProps;
        sendComponentDiff('props', newProps);
    }
};

const sendSelection = () => {
  if (!iframeRef.value || !iframeRef.value.contentWindow || !iframeReady.value) return;
  
  iframeRef.value.contentWindow.postMessage({
    type: 'SELECT_COMPONENT',
    data: selectedComponentId.value
  }, '*');
};

const handleMessage = (event: MessageEvent) => {
  const { type, data } = event.data;
  if (type === 'PREVIEW_READY') {
    iframeReady.value = true;
    sendConfig();
    sendSelection();
  } else if (type === 'COMPONENT_SELECTED') {
    selectedComponentId.value = data;
  }
};

// Load Activity
onMounted(async () => {
  window.addEventListener('message', handleMessage);

  if (isNew.value) {
    activity.value = { name: '未命名活动' };
    pages.value = [{ 
        pagename: 'index', 
        routePath: generateRoutePath(),
        components: [], 
        isEntry: true 
    }];
    return;
  }

  if (!activityId) return;
  try {
    const res = await api.get(`/admin/activities/${activityId}`);
    activity.value = res.data;
    
    let config = activity.value.config;
    if (typeof config === 'string') {
        config = JSON.parse(config);
    }
    
    if (!config || !config.pages || config.pages.length === 0) {
        pages.value = [{ 
            pagename: 'index', 
            routePath: generateRoutePath(),
            components: [], 
            isEntry: true 
        }];
    } else {
        // Backfill routePath and alias if missing
        pages.value = config.pages.map((p: PageConfig) => ({
            ...p,
            routePath: p.routePath || generateRoutePath(),
            components: p.components.map((c: ComponentConfig) => ({
                ...c,
                alias: c.alias || c.name
            }))
        }));

        if (config.dataCenter) {
            activity.value.dataCenter = config.dataCenter;
        } else {
            activity.value.dataCenter = { fields: [] };
        }
    }
    
    // Wait for iframe ready to send config
    const onIframeLoad = (e: MessageEvent) => {
        if (e.data.type === 'PREVIEW_READY') {
            iframeReady.value = true;
            sendConfig();
        } else if (e.data.type === 'COMPONENT_SELECTED') {
             selectedComponentId.value = e.data.data;
        }
    };
    window.addEventListener('message', onIframeLoad);
    
    // If iframe is already loaded (revisit)
    // We can try sending config after a short delay just in case
    setTimeout(() => {
        if (!iframeReady.value && iframeRef.value) {
             // Assume ready if we missed the event or just retry
             // Better to rely on event, but for dev hot reload:
             iframeReady.value = true;
             sendConfig();
        }
    }, 1000);
  } catch (e) {
    console.error('Failed to load activity', e);
  }
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});

const updatePreview = () => {
  // Debounce could be added here
  sendConfig();
};

const addPage = () => {
    const newPage: PageConfig = {
        pagename: `page_${pages.value.length + 1}`,
        routePath: generateRoutePath(),
        components: [],
        isEntry: false
    };
    pages.value.push(newPage);
    currentPageIndex.value = pages.value.length - 1;
    sendConfig();
};

const selectPage = (index: number) => {
    currentPageIndex.value = index;
    selectedComponentId.value = '';
    sendConfig();
};

const deletePage = (index: number) => {
    if (pages.value.length <= 1) {
        toast('至少保留一个页面', 'error');
        return;
    }
    
    // Check if deleting entry page
    if (pages.value[index].isEntry) {
        toast('不能删除入口页面，请先设置其他页面为入口', 'error');
        return;
    }

    pages.value.splice(index, 1);
    if (currentPageIndex.value >= pages.value.length) {
        currentPageIndex.value = pages.value.length - 1;
    }
    sendConfig();
};

const setEntryPage = (index: number) => {
    pages.value.forEach((p, i) => {
        p.isEntry = i === index;
    });
};

const addComponent = (name: string) => {
  const configCreator = componentConfigs[name];
  if (configCreator && currentPage.value) {
    const newComponent = configCreator.create();
    newComponent.alias = name; // Initialize alias
    currentPage.value.components.push(newComponent);
    selectedComponentId.value = newComponent.id;
    showComponentLibrary.value = false;
    nextTick(() => {
      sendConfig();
      sendSelection();
    });
  }
};

const selectComponent = (id: string) => {
  selectedComponentId.value = id;
  sendSelection();
};

const deleteComponent = (id?: string) => {
    const targetId = id || selectedComponentId.value;
    if (!targetId || !currentPage.value) return;
    currentPage.value.components = currentPage.value.components.filter(c => c.id !== targetId);
    if (selectedComponentId.value === targetId) {
        selectedComponentId.value = '';
    }
    sendConfig();
};

const saveActivity = async () => {
    if (!activity.value) return false;
    
    const newConfig: ActivityConfig = {
        name: activity.value.name,
        type: 'default',
        pages: pages.value,
        dataCenter: activity.value.dataCenter
    };

    const payload = {
        name: activity.value.name,
        config: newConfig
    };

    try {
        if (isNew.value) {
            await api.post('/admin/activities', payload);
            toast('创建成功', 'success');
            router.push('/activities');
        } else {
            await api.put(`/admin/activities/${activityId}`, payload);
            // Don't alert on auto-save or minor updates if not desired, but for now keep it simple
            // alert('保存成功'); 
        }
        return true;
    } catch (e) {
        console.error('保存失败', e);
        toast('保存失败', 'error');
        return false;
    }
};
const saveActivityWithAlert = async () => {
    const success = await saveActivity();
    if (success) {
        toast('保存成功', 'success');
    }
};
</script>

<style scoped>
.editor-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.panel {
  padding: 0;
  border-right: 1px solid #e5e7eb;
  background: white;
  display: flex;
  flex-direction: column;
}

.left-panel {
  width: 480px;
  flex-shrink: 0;
  flex-direction: row;
}

.mini-input {
    width: 60px;
    padding: 2px 4px;
    font-size: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 2px;
}
.data-field-row {
    display: flex;
    align-items: center;
    gap: 4px;
}
.separator {
    color: #9ca3af;
    font-size: 12px;
}



.component-type-badge {
  font-size: 10px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 4px;
  white-space: nowrap;
}

.panel-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid #e5e7eb;
}
.panel-section:last-child {
    border-right: none;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.btn-add {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
}
.btn-add:hover {
  background: #f3f4f6;
  color: #007aff;
  border-color: #007aff;
}

.list-container {
    overflow-y: auto;
    padding: 8px;
    flex: 1;
}

.component-tree {
  flex: 1;
}

.list-item {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  border: 1px solid transparent;
  position: relative;
}
.list-item:hover {
  background: #f9fafb;
}
.list-item.selected {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.item-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    overflow: hidden;
}

.item-name, .component-name {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
}

.component-id {
    font-size: 12px;
    color: #9ca3af;
}

.badge-entry {
    font-size: 10px;
    background: #dbeafe;
    color: #1d4ed8;
    padding: 2px 6px;
    border-radius: 10px;
    flex-shrink: 0;
    white-space: nowrap;
}

.btn-set-entry {
    font-size: 14px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}
.list-item:hover .btn-set-entry {
    opacity: 1;
}

.btn-delete-mini {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: #ef4444;
    cursor: pointer;
    border-radius: 4px;
    opacity: 0;
    transition: all 0.2s;
}
.btn-delete-mini:hover {
    background: #fee2e2;
}
.list-item:hover .btn-delete-mini {
    opacity: 1;
}

.center-panel {
  flex: 1;
  background: #f3f4f6;
  align-items: center;
}

.right-panel {
  width: 300px;
  flex-shrink: 0;
  border-left: 1px solid #e5e7eb;
  border-right: none;
  padding: 0;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.config-content {
    flex: 1;
    overflow-y: auto;
}

.page-config {
    padding: 20px;
}

.activity-config {
    padding: 20px;
}

.empty-state {
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 14px;
    margin-top: 50px;
}

.canvas-header {
    width: 100%;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.actions {
    display: flex;
    gap: 10px;
}

.activity-name-input {
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    min-width: 200px;
}
.activity-name-input:focus {
    outline: none;
    border-color: #3b82f6;
}

.mobile-emulator {
    width: 375px;
    height: 667px;
    background: white;
    border: 10px solid #1f2937;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.emulator-iframe {
    width: 100%;
    height: 100%;
    background: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.library-modal {
  width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.modal-header h3 {
    margin: 0;
    font-size: 18px;
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  background: #f9fafb;
}

.library-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}
.library-item:hover {
  border-color: #007aff;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.item-icon {
  width: 40px;
  height: 40px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}
.close-btn:hover {
    color: #666;
}

/* Reusing some styles from previous version for config form */

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab-item:hover {
  color: #374151;
  background: #f3f4f6;
}
.tab-item.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  background: white;
  font-weight: 500;
}

.panel-header-sub {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.panel-header-sub h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.tab-content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
}
</style>
