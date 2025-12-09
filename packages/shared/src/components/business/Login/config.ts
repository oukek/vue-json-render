import { BaseConfig, ComponentConfig } from '../../../type';

export interface LoginProps {
  // Text Config
  title: string;
  subtitle: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  serverPlaceholder: string;
  loginBtnText: string;

  // Style Config
  // Card
  cardBackgroundColor: string;
  cardBorderRadius: string;
  cardPadding: string;
  cardShadow: string;
  
  // Title
  titleColor: string;
  titleFontSize: string;
  titleFontWeight: string;
  
  // Subtitle
  subtitleColor: string;
  subtitleFontSize: string;
  
  // Input
  inputHeight: string;
  inputBorderColor: string;
  inputBorderRadius: string;
  inputFontSize: string;
  
  // Button
  btnBackgroundColor: string;
  btnTextColor: string;
  btnFontSize: string;
  btnHeight: string;
  btnBorderRadius: string;
}

export const defaultBaseConfig: BaseConfig = {
  width: '400px',
  height: 'auto',
  backgroundColor: 'transparent',
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultLoginProps: LoginProps = {
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
};

export const createLoginConfig = (): ComponentConfig => ({
  id: `Login_${Date.now()}`,
  name: 'Login',
  base: { ...defaultBaseConfig },
  props: { ...defaultLoginProps },
  dataBinding: {}
});
