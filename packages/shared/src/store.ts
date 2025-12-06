import { reactive } from 'vue';
import { DataField, ModalConfig } from './index';

export const editorStore = reactive({
  dataFields: [] as DataField[],
  modals: [] as ModalConfig[]
});
