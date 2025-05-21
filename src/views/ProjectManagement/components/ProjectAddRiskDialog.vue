<template>
  <el-dialog
    v-model="visible"
    title="添加新风险"
    width="600px"
    :before-close="handleClose"
  >
    <el-form ref="riskFormRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="风险描述" prop="title">
        <el-input v-model="form.title" placeholder="请输入风险描述" />
      </el-form-item>
      <el-form-item label="风险类别" prop="category">
        <el-input
          v-model="form.category"
          placeholder="请输入风险类别"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="风险级别" prop="level">
        <el-select v-model="form.level" placeholder="请选择风险级别">
          <el-option label="高" value="高" />
          <el-option label="中" value="中" />
          <el-option label="低" value="低" />
        </el-select>
      </el-form-item>
      <el-form-item label="发生概率" prop="probability">
        <el-input-number
          v-model="form.probability"
          :min="0"
          :max="100"
          placeholder="请输入发生概率"
        />%
      </el-form-item>
      <el-form-item label="影响程度" prop="impact">
        <el-rate
          v-model="form.impact"
          :max="5"
          show-score
          text-color="#ff9900"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="owner">
        <el-input v-model="form.owner" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="未处理" value="未处理" />
          <el-option label="处理中" value="处理中" />
          <el-option label="已缓解" value="已缓解" />
          <el-option label="已解决" value="已解决" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const emits = defineEmits(["update:visible", "submit"]);
const visible = ref(false);
const riskFormRef = ref<FormInstance>();
const form = ref({
  title: "",
  category: "",
  level: "中",
  probability: 0,
  impact: 3,
  owner: "",
  status: "未处理"
});

const rules = ref<FormRules>({
  title: [{ required: true, message: "请输入风险描述", trigger: "blur" }],
  category: [{ required: true, message: "请输入风险类别", trigger: "blur" }],
  level: [{ required: true, message: "请选择风险级别", trigger: "change" }],
  probability: [
    { required: true, message: "请输入发生概率", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 100,
      message: "概率必须在0-100之间",
      trigger: "blur"
    }
  ],
  impact: [{ required: true, message: "请选择影响程度", trigger: "change" }],
  owner: [{ required: true, message: "请输入负责人", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
});

function open() {
  // 重置表单数据为初始状态
  form.value = {
    title: "",
    category: "",
    level: "中",
    probability: 0,
    impact: 3,
    owner: "",
    status: "未处理"
  };

  // 如果表单实例存在，清除验证
  if (riskFormRef.value) {
    riskFormRef.value.clearValidate();
  }

  visible.value = true;
}

function handleClose() {
  visible.value = false;
  emits("update:visible", false);
}

function handleSubmit() {
  riskFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      emits("submit", { ...form.value });
      handleClose();
    }
  });
}

// 供外部调用
defineExpose({ open });
</script>
