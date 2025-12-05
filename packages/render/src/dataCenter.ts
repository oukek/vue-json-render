import { reactive, computed } from 'vue';
import { PageConfig, ComponentConfig, DataCenterConfig, BUILT_IN_DATA_MAP, ActivityConfig } from '@vue-json-render/shared';
import api from './api';

// Simple implementation of lodash set
function set(obj: any, path: string, value: any) {
  if (!obj) return;
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

interface User {
  id: number;
  username: string;
  level: number;
  experience: number;
}

interface DynamicData {
  user?: User;
  queryParams?: Record<string, string>;
  [key: string]: any;
}

class DataCenter {
  state = reactive({
    activityId: '' as string,
    activityConfig: null as ActivityConfig | null,
    config: null as PageConfig | null,
    dataCenterConfig: null as DataCenterConfig | null,
    dynamicData: {
      user: {
        id: 0,
        username: '',
        level: 1,
        experience: 0
      }
    } as DynamicData,
    mode: 'production' as 'preview' | 'production',
    loading: false,
    error: ''
  });

  constructor() {
    // Detect mode
    try {
      if (window.self !== window.top) {
        this.state.mode = 'preview';
      }
    } catch (e) {
      // Ignore cross-origin errors
    }
    
    this.init();
  }

  async init() {
    if (this.state.mode === 'preview') {
      window.addEventListener('message', this.handleMessage.bind(this));
    } else {
      // Parse query params
      const searchParams = new URLSearchParams(window.location.search);
      const queryParams: Record<string, string> = {};
      for (const [key, value] of searchParams) {
        queryParams[key] = value;
      }
      this.state.dynamicData.queryParams = queryParams;
      if (queryParams.id) {
        this.state.activityId = queryParams.id;
      }

      if (this.state.activityId) {
        try {
          await this.loadActivity();
          const router = (await import('./router')).default;
          
          // Find entry page
          const pages = this.state.activityConfig?.pages || [];
          const entryPage = pages.find(p => p.isEntry) || pages[0];
          
          if (entryPage) {
            router.push(`/page/${entryPage.routePath}`);
          }
        } catch (e) {
          console.error('Init failed', e);
        }
      }
    }
  }

  handleMessage(event: MessageEvent) {
    const { type, data, key, value, id } = event.data;
    
    if (type === 'UPDATE_CONFIG') {
      // Full update
      this.state.config = data;
    } else if (type === 'UPDATE_DATA_CENTER') {
      this.state.dataCenterConfig = data;
    } else if (type === 'UPDATE_PAGE_DIFF') {
      // Page config update (key/value)
      if (this.state.config) {
        set(this.state.config, key, value);
      }
    } else if (type === 'UPDATE_COMPONENT_DIFF') {
      // Component config update
      if (this.state.config && id) {
        const component = this.state.config.components.find((c: ComponentConfig) => c.id === id);
        if (component) {
          set(component, key, value);
        }
      }
    }
  }

  async initPage(pageId?: string) {
    this.state.loading = true;
    this.state.error = '';
    try {
      if (!this.state.activityId && this.state.mode === 'production') {
         throw new Error('缺少活动ID参数');
      }
      
      this.setPage(pageId);
    } catch(e: any) {
      this.state.error = e.message || '加载活动失败';
      console.error(e);
    } finally {
      this.state.loading = false;
    }
  }

  private getValue(path: string) {
    if (!path) return undefined;
    const keys = path.split('.');
    let current = this.state.dynamicData;
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }
    return current;
  }

  resolveComponentProps(component: ComponentConfig) {
    let resolved = { ...(component.props || {}) };
    
    // 1. Apply explicit bindings
    if (component.dataBinding) {
        for (const [prop, path] of Object.entries(component.dataBinding)) {
            if (!path) continue;
            const value = this.getValue(path);
            if (value !== undefined) {
                resolved[prop] = value;
            }
        }
    }

    // 2. Process template strings in string props
    for (const key in resolved) {
        const val = resolved[key];
        if (typeof val === 'string' && val.includes('{{')) {
            resolved[key] = val.replace(/\{\{(.*?)\}\}/g, (_, path) => {
                const v = this.getValue(path.trim());
                return v !== undefined ? String(v) : `{{${path}}}`;
            });
        }
    }
    
    return resolved;
  }

  async loadActivity(id?: string) {
    const activityId = id || this.state.activityId;
    if (!activityId) {
      throw new Error('Activity ID is missing');
    }
    try {
      const res = await api.get(`/user/activities/${activityId}`);
      const activityConfig = res.data.config as ActivityConfig;
      this.state.activityConfig = activityConfig;
      this.state.activityId = activityId;
      
      if (activityConfig.dataCenter) {
          this.state.dataCenterConfig = activityConfig.dataCenter;
      }
      return activityConfig;
    } catch (e) {
      console.error('Failed to load activity', e);
      throw e;
    }
  }

  setPage(pageId?: string) {
    if (!this.state.activityConfig || !this.state.activityConfig.pages) {
        throw new Error('Activity config not loaded or empty');
    }
    
    let page: PageConfig | undefined;
    
    if (pageId) {
        page = this.state.activityConfig.pages.find(p => p.routePath === pageId);
    } 
    
    if (!page) {
        // Default to entry or first
        page = this.state.activityConfig.pages.find(p => p.isEntry) || this.state.activityConfig.pages[0];
    }
    
    if (page) {
        this.state.config = page;
        return page;
    } else {
        throw new Error('Page not found');
    }
  }

  async fetchDynamicData() {
    try {
      const res = await api.get('/user/info');
      
      this.state.dynamicData.user = res.data;
      return this.state.dynamicData;
    } catch (e) {
      console.error('Failed to fetch dynamic data', e);
      throw e;
    }
  }
  
  get config() {
    return this.state.config;
  }
  
  get dynamicData() {
    return this.state.dynamicData;
  }
}

export const dataCenter = new DataCenter();
