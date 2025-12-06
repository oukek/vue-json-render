import { BaseConfig, ComponentConfig } from '../../index';

export interface ProgressProps {
  percentage: number | string;
  strokeWidth: number | string;
  color: string;
  trackColor: string;
  showText: boolean;
  textInside: boolean;
  textColor: string;
  fontSize: string;
  borderRadius: number | string;
  striped: boolean;
  animated: boolean;
}

export const defaultBaseConfig: BaseConfig = {
  width: '300px',
  height: 'auto',
  backgroundColor: 'transparent',
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultProgressProps: ProgressProps = {
  percentage: 50,
  strokeWidth: 12,
  color: '#409eff',
  trackColor: '#ebeef5',
  showText: true,
  textInside: false,
  textColor: '#606266',
  fontSize: '12px',
  borderRadius: 100,
  striped: false,
  animated: false,
};

export const createProgressConfig = (): ComponentConfig => ({
  id: `Progress_${Date.now()}`,
  name: 'Progress',
  base: { ...defaultBaseConfig },
  props: { ...defaultProgressProps },
  dataBinding: {}
});
