import { reactive } from 'vue';
import { PageConfig, ComponentConfig, DataCenterConfig, ActivityConfig, ModalConfig } from './index';

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

export interface User {
  id: number;
  username: string;
  level: number;
  experience: number;
}

export interface DynamicData {
  user?: User;
  queryParams?: Record<string, string>;
  [key: string]: any;
}

export interface ApiClient {
  get(url: string, config?: any): Promise<any>;
  post?(url: string, data?: any, config?: any): Promise<any>;
  put?(url: string, data?: any, config?: any): Promise<any>;
  delete?(url: string, config?: any): Promise<any>;
}

export interface Router {
  push(to: string | any): Promise<any>;
  replace?(to: string | any): Promise<any>;
  back?(): void;
}

export class DataCenter {
  private api?: ApiClient;
  private router?: Router;

  state = reactive({
    activityId: '' as string,
    activityConfig: null as ActivityConfig | null,
    config: null as PageConfig | null,
    modals: [] as ModalConfig[],
    activeModalId: null as string | null,
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
      if (typeof window !== 'undefined' && window.self !== window.top) {
        this.state.mode = 'preview';
      }
    } catch (e) {
      // Ignore cross-origin errors
    }
  }

  setup(options: { api: ApiClient, router?: Router }) {
    this.api = options.api;
    this.router = options.router;
    this.init();
  }

  async init() {
    if (typeof window === 'undefined') return;

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
          
          // Find entry page
          const pages = this.state.activityConfig?.pages || [];
          const entryPage = pages.find(p => p.isEntry) || pages[0];
          
          if (this.state.activityConfig?.modals) {
             this.state.modals = this.state.activityConfig.modals;
          }

          if (entryPage && this.router) {
            this.router.push(`/page/${entryPage.routePath}`);
          }
        } catch (e) {
          console.error('Init failed', e);
        }
      }
    }
  }

  handleMessage(event: MessageEvent) {
    const { type, data, key, value, id, activeModalId } = event.data;
    
    if (type === 'UPDATE_CONFIG') {
      // Full update
      // Check if data has modals
      if (data.modals) {
          this.state.modals = data.modals;
          // Clean modals from page config
          const pageConfig = { ...data };
          delete pageConfig.modals;
          this.state.config = pageConfig;
      } else {
          this.state.config = data;
      }
      
      if (activeModalId !== undefined) {
          this.state.activeModalId = activeModalId;
      }
    } else if (type === 'UPDATE_DATA_CENTER') {
      this.state.dataCenterConfig = data;
    } else if (type === 'UPDATE_PAGE_DIFF') {
      // Page config update (key/value)
      if (this.state.config) {
        set(this.state.config, key, value);
      }
    } else if (type === 'UPDATE_COMPONENT_DIFF') {
      // Component config update
      // Try to find in page first
      let found = false;
      if (this.state.config && id) {
        const component = this.state.config.components.find((c: ComponentConfig) => c.id === id);
        if (component) {
          set(component, key, value);
          found = true;
        }
      }
      // If not found, try modals
      if (!found && this.state.modals && id) {
          for (const modal of this.state.modals) {
              const component = modal.components.find((c: ComponentConfig) => c.id === id);
              if (component) {
                  set(component, key, value);
                  break;
              }
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
    if (!this.api) {
      throw new Error('API client not initialized');
    }

    try {
      const res = await this.api.get(`/user/activities/${activityId}`);
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
    if (!this.api) {
      throw new Error('API client not initialized');
    }
    try {
      const res = await this.api.get('/user/info');
      
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
