import { createVNode, render } from 'vue';
import ToastComponent from '../components/basic/Toast.vue';

const container = document.createElement('div');
document.body.appendChild(container);

let toastVNode: any = null;

export const toast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 2000) => {
  if (!toastVNode) {
    toastVNode = createVNode(ToastComponent);
    render(toastVNode, container);
  }
  
  toastVNode.component?.exposed?.show(message, type, duration);
};
