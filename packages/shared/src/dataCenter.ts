import { reactive } from 'vue';
import { PageConfig, ComponentConfig, DataCenterConfig, ActivityConfig, ModalConfig, DataField } from './index';

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

export interface UserInfo {
  id: number;
  username: string;
  level: number;
  experience: number;
}

export interface DynamicData {
  user?: UserInfo;
  queryParams?: Record<string, string>;
  [key: string]: any;
}

export interface ApiClient {
  get(url: string, config?: any): Promise<any>;
  post(url: string, data?: any, config?: any): Promise<any>;
  put(url: string, data?: any, config?: any): Promise<any>;
  delete(url: string, config?: any): Promise<any>;
}

export interface Router {
  push(to: string | any): Promise<any>;
  replace?(to: string | any): Promise<any>;
  back?(): void;
}

export class DataCenter {
  public api?: ApiClient;
  public router?: Router;
  private initializing = false;

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
      },
      userList: [
        { id: 1, name: 'Alice', avatar: 'https://example.com/alice.png' },
        { id: 2, name: 'Bob', avatar: 'https://example.com/bob.png' }
      ]
    } as DynamicData,
    mode: 'production' as 'preview' | 'production',
    loading: false,
    error: ''
  });

  constructor() {
    // Detect mode
    try {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        const searchParams = new URLSearchParams(window.location.search);
        // If explicitly embedded (e.g. PC view), do not switch to preview mode
        if (!searchParams.has('embedded')) {
          this.state.mode = 'preview';
        }
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
        this.initializing = true;
        this.state.loading = true;
        try {
          await this.loadActivity();
          
          // Find target page
          const pages = this.state.activityConfig?.pages || [];
          let targetRoutePath = this.state.dynamicData.queryParams['pageId'];
          
          if (!targetRoutePath) {
             const entryPage = pages.find(p => p.isEntry) || pages[0];
             if (entryPage) targetRoutePath = entryPage.routePath;
          }
          
          if (this.state.activityConfig?.modals) {
             this.state.modals = this.state.activityConfig.modals;
          }

          if (targetRoutePath) {
             // Explicitly set page config because initPage might have been called 
             // and returned early while initializing was true
             this.setPage(targetRoutePath);
          }

          // Allow initPage to run during redirect
          this.initializing = false;

          if (targetRoutePath && this.router) {
            const routeParams = {
              path: '/',
              query: {
                ...this.state.dynamicData.queryParams,
                pageId: targetRoutePath
              }
            };
            if (this.router.replace) {
              await this.router.replace(routeParams);
            } else {
              await this.router.push(routeParams);
            }
          }
        } catch (e) {
          console.error('Init failed', e);
          this.state.error = 'Initialization failed';
        } finally {
          this.initializing = false;
          this.state.loading = false;
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
      this.updateDynamicDataFromConfig();
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

  updateDynamicDataFromConfig() {
    if (!this.state.dataCenterConfig || !this.state.dataCenterConfig.fields) return;
    
    const mockData = this.generateMockData(this.state.dataCenterConfig.fields);
    // Merge mock data into dynamicData
    Object.assign(this.state.dynamicData, mockData);
  }

  private generateMockData(fields: DataField[]): any {
    const result: any = {};
    fields.forEach(field => {
      if (field.mockValue !== undefined && field.mockValue !== '') {
        result[field.key] = field.mockValue;
      } else if (field.type === 'object' && field.children) {
        result[field.key] = this.generateMockData(field.children);
      } else if (field.type === 'array' && field.children) {
        result[field.key] = [this.generateMockData(field.children)];
      } else {
         switch (field.type) {
           case 'string': result[field.key] = 'text'; break;
           case 'number': result[field.key] = 0; break;
           case 'boolean': result[field.key] = false; break;
           default: result[field.key] = null;
         }
      }
    });
    return result;
  }

  async initPage(pageId?: string) {
    if (this.initializing) return;

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

  setValue(path: string, value: any) {
    if (!path) return;
    set(this.state.dynamicData, path, value);
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
          this.updateDynamicDataFromConfig();
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
