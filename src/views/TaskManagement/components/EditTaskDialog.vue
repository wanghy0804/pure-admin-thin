<template>
  <el-dialog
    :model-value="visible"
    title="编辑任务"
    width="1000px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="editTask" :rules="rules" label-width="90px">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="editTask.name" />
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="editTask.type" placeholder="请选择类型">
          <el-option label="需求" value="需求" />
          <el-option label="设计" value="设计" />
          <el-option label="开发" value="开发" />
          <el-option label="测试" value="测试" />
          <el-option label="缺陷" value="缺陷" />
          <el-option label="采购" value="采购" />
          <el-option label="数据" value="数据" />
          <el-option label="培训" value="培训" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="editTask.priority" placeholder="请选择优先级">
          <el-option label="普通" value="normal" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>
      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="editTask.dueDate"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="assignee">
        <el-input v-model="editTask.assignee" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="editTask.description" type="textarea" :rows="8" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  visible: Boolean,
  task: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(["update:visible", "update", "close"]);

const formRef = ref();
const editTask = reactive({ ...props.task });

watch(
  () => props.task,
  val => {
    Object.assign(editTask, val || {});
  }
);

const rules = {
  name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择任务类型", trigger: "change" }],
  priority: [{ required: true, message: "请选择优先级", trigger: "change" }],
  dueDate: [{ required: true, message: "请选择截止日期", trigger: "change" }],
  assignee: [{ required: true, message: "请输入负责人", trigger: "blur" }]
};

function handleClose() {
  emits("update:visible", false);
  emits("close");
}

function handleSubmit() {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emits("update", { ...editTask });
      emits("update:visible", false);
      ElMessage.success("任务保存成功");
    }
  });
}
</script>
