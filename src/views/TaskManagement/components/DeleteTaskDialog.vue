<template>
  <el-dialog
    :model-value="visible"
    title="删除任务"
    width="400px"
    @close="handleClose"
  >
    <div style="margin-bottom: 18px; font-weight: bold; color: #f56c6c">
      确认要删除任务 <span style="color: #409eff">{{ taskName }}</span> 吗？
    </div>
    <div style="margin-bottom: 12px">请输入下方验证码以确认删除：</div>
    <div
      style="display: flex; gap: 12px; align-items: center; margin-bottom: 18px"
    >
      <span
        style="
          padding: 4px 12px;
          font-size: 20px;
          letter-spacing: 2px;
          user-select: none;
          background: #f5f7fa;
          border-radius: 4px;
        "
      >
        {{ code }}
      </span>
      <el-button size="small" @click="refreshCode">换一组</el-button>
    </div>
    <el-input
      v-model="inputCode"
      maxlength="6"
      placeholder="请输入验证码"
      style="width: 220px; margin-bottom: 12px"
      @keyup.enter="handleDelete"
    />
    <div
      v-if="errorMsg"
      style="margin-bottom: 8px; font-size: 13px; color: #f56c6c"
    >
      {{ errorMsg }}
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" @click="handleDelete">确认删除</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  taskName: String
});
const emits = defineEmits(["update:visible", "delete", "close"]);

const inputCode = ref("");
const code = ref("");
const errorMsg = ref("");

const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZabdefghpqrty23456789";

function generateCode() {
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return result;
}

function refreshCode() {
  code.value = generateCode();
  inputCode.value = "";
  errorMsg.value = "";
}

function handleClose() {
  emits("update:visible", false);
  emits("close");
  inputCode.value = "";
  errorMsg.value = "";
}

function handleDelete() {
  if (inputCode.value.toUpperCase() !== code.value) {
    errorMsg.value = "验证码错误，请重新输入";
    // 不自动刷新验证码，保持当前验证码
    return;
  }
  emits("delete");
  emits("update:visible", false);
  inputCode.value = "";
  errorMsg.value = "";
}

watch(
  () => props.visible,
  val => {
    if (val) refreshCode();
  }
);
</script>
