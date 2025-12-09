<template>
  <div class="form-table">
    <div class="form-label">{{ label }}</div>
    <div class="table-container">
      <div class="table-header">
        <div v-for="col in columns" :key="col.key" class="table-cell header-cell" :style="{ width: col.width }">
          {{ col.label }}
        </div>
        <div class="table-cell header-cell action-cell">操作</div>
      </div>
      <div class="table-body">
        <div v-for="(row, index) in modelValue" :key="index" class="table-row">
          <div v-for="col in columns" :key="col.key" class="table-cell" :style="{ width: col.width }">
            <input
              v-model="row[col.key]"
              class="cell-input"
              :placeholder="col.label"
              @input="updateValue"
            />
          </div>
          <div class="table-cell action-cell">
            <button class="delete-btn" @click="removeRow(index)">删除</button>
          </div>
        </div>
      </div>
      <div class="table-footer">
        <button class="add-btn" @click="addRow">+ 添加一项</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

export interface TableColumn {
  label: string;
  key: string;
  width?: string;
}

const props = defineProps<{
  label: string;
  modelValue: any[];
  columns: TableColumn[];
}>();

const emit = defineEmits(['update:modelValue']);

const updateValue = () => {
  emit('update:modelValue', [...props.modelValue]);
};

const addRow = () => {
  const newRow: any = {};
  props.columns.forEach(col => {
    newRow[col.key] = '';
  });
  const newValue = props.modelValue ? [...props.modelValue, newRow] : [newRow];
  emit('update:modelValue', newValue);
};

const removeRow = (index: number) => {
  const newValue = [...props.modelValue];
  newValue.splice(index, 1);
  emit('update:modelValue', newValue);
};
</script>

<style scoped>
.form-table {
  margin-bottom: 12px;
}
.form-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.table-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
}
.table-header {
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #d9d9d9;
}
.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
}
.table-row:last-child {
  border-bottom: none;
}
.table-cell {
  padding: 8px;
  flex: 1;
  display: flex;
  align-items: center;
}
.header-cell {
  font-weight: 500;
  font-size: 12px;
  color: #333;
}
.action-cell {
  width: 60px;
  flex: none;
  justify-content: center;
}
.cell-input {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 4px;
  font-size: 12px;
  outline: none;
}
.cell-input:focus {
  border-color: #1890ff;
}
.delete-btn {
  color: #ff4d4f;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
}
.delete-btn:hover {
  background: #fff1f0;
  border-radius: 2px;
}
.table-footer {
  padding: 8px;
  border-top: 1px solid #d9d9d9;
  text-align: center;
}
.add-btn {
  width: 100%;
  padding: 4px 0;
  background: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  color: #666;
  cursor: pointer;
  font-size: 12px;
}
.add-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}
</style>
