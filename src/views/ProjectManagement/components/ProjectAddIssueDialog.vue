<template>
  <el-dialog
    v-model="visible"
    title="添加新问题"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="issueFormRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="问题描述" prop="title">
        <el-input v-model="form.title" placeholder="请输入问题描述" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option label="功能问题" value="功能问题" />
          <el-option label="性能问题" value="性能问题" />
          <el-option label="安全问题" value="安全问题" />
          <el-option label="兼容性问题" value="兼容性问题" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="form.priority" placeholder="请选择优先级">
          <el-option label="紧急" value="紧急" />
          <el-option label="高" value="高" />
          <el-option label="中" value="中" />
          <el-option label="低" value="低" />
        </el-select>
      </el-form-item>
      <el-form-item label="报告人" prop="reporter">
        <el-input v-model="form.reporter" placeholder="请输入报告人" />
      </el-form-item>
      <el-form-item label="负责人" prop="assignee">
        <el-input v-model="form.assignee" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="未解决" value="未解决" />
          <el-option label="处理中" value="处理中" />
          <el-option label="已解决" value="已解决" />
          <el-option label="已关闭" value="已关闭" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const emits = defineEmits(["update:visible", "submit"]);
const visible = ref(false);
const issueFormRef = ref<FormInstance>();
const form = ref({
  title: "",
  type: "",
  priority: "",
  reporter: "",
  assignee: "",
  status: "未解决"
});

const rules = ref<FormRules>({
  title: [{ required: true, message: "请输入问题描述", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  priority: [{ required: true, message: "请选择优先级", trigger: "change" }],
  reporter: [{ required: true, message: "请输入报告人", trigger: "blur" }],
  assignee: [{ required: true, message: "请输入负责人", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
});

function open() {
  // 重置表单数据为初始状态
  form.value = {
    title: "",
    type: "",
    priority: "",
    reporter: "",
    assignee: "",
    status: "未解决"
  };

  // 如果表单实例存在，清除验证
  if (issueFormRef.value) {
    issueFormRef.value.clearValidate();
  }

  visible.value = true;
}

function handleClose() {
  visible.value = false;
  emits("update:visible", false);
}

function handleSubmit() {
  issueFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      emits("submit", { ...form.value });
      handleClose();
    }
  });
}

// 供外部调用
defineExpose({ open });
</script>
