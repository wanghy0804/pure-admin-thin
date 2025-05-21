<template>
  <el-dialog
    v-model="visible"
    title="上传文档"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="uploadFormRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="文档名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入文档名称" />
      </el-form-item>

      <el-form-item label="文档类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择文档类型"
          style="width: 100%"
        >
          <el-option label="Word文档" value="Word" />
          <el-option label="Excel表格" value="Excel" />
          <el-option label="PPT演示文稿" value="PPT" />
          <el-option label="PDF文档" value="PDF" />
          <el-option label="图片" value="Image" />
          <el-option label="其他" value="Other" />
        </el-select>
      </el-form-item>

      <el-form-item label="上传文件" prop="file">
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">
              支持各类文档格式，单个文件不超过20MB
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="文档描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入文档描述（选填）"
        />
      </el-form-item>

      <el-form-item label="文档标签" prop="tags">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或创建标签（选填）"
          style="width: 100%"
        >
          <el-option label="需求文档" value="需求文档" />
          <el-option label="设计文档" value="设计文档" />
          <el-option label="技术方案" value="技术方案" />
          <el-option label="测试报告" value="测试报告" />
          <el-option label="会议记录" value="会议记录" />
        </el-select>
      </el-form-item>

      <el-form-item label="权限设置" prop="permission">
        <el-radio-group v-model="form.permission">
          <el-radio label="public">公开（所有项目成员可见）</el-radio>
          <el-radio label="restricted">受限（仅指定成员可见）</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.permission === 'restricted'"
        label="可见成员"
        prop="visibleTo"
      >
        <el-select
          v-model="form.visibleTo"
          multiple
          filterable
          placeholder="请选择可见成员"
          style="width: 100%"
        >
          <el-option label="张三" value="张三" />
          <el-option label="李四" value="李四" />
          <el-option label="王五" value="王五" />
          <el-option label="赵六" value="赵六" />
        </el-select>
      </el-form-item>
    </el-form>

    <div v-if="isUploading" class="upload-progress">
      <el-progress :percentage="uploadProgress" :status="uploadStatus" />
      <div class="progress-text">{{ progressText }}</div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="isUploading" @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="isUploading" @click="handleSubmit">
          <el-icon><upload-filled /></el-icon> 上传
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

const emits = defineEmits(["update:visible", "upload-complete"]);
const visible = ref(false);
const uploadFormRef = ref<FormInstance>();
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref("");
const selectedFile = ref(null);

const form = ref({
  name: "",
  type: "",
  file: null,
  description: "",
  tags: [],
  permission: "public",
  visibleTo: []
});

const rules = ref<FormRules>({
  name: [{ required: true, message: "请输入文档名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择文档类型", trigger: "change" }],
  file: [{ required: true, message: "请上传文件", trigger: "change" }],
  visibleTo: [
    {
      required: true,
      message: "请选择可见成员",
      trigger: "change",
      validator: (rule, value, callback) => {
        if (
          form.value.permission === "restricted" &&
          (!value || value.length === 0)
        ) {
          callback(new Error("请选择可见成员"));
        } else {
          callback();
        }
      }
    }
  ]
});

const progressText = computed(() => {
  if (!isUploading.value) return "";
  if (uploadStatus.value === "success") return "上传完成";
  if (uploadStatus.value === "exception") return "上传失败";
  return `正在上传...${uploadProgress.value}%`;
});

function open() {
  // 重置表单数据
  form.value = {
    name: "",
    type: "",
    file: null,
    description: "",
    tags: [],
    permission: "public",
    visibleTo: []
  };

  // 重置上传状态
  isUploading.value = false;
  uploadProgress.value = 0;
  uploadStatus.value = "";
  selectedFile.value = null;

  // 如果表单实例存在，清除验证
  if (uploadFormRef.value) {
    uploadFormRef.value.clearValidate();
  }

  visible.value = true;
}

function handleClose() {
  if (
    isUploading.value &&
    uploadStatus.value !== "success" &&
    uploadStatus.value !== "exception"
  ) {
    // 如果正在上传，提示用户
    if (confirm("上传正在进行中，确定要取消吗？")) {
      cancelUpload();
    } else {
      return;
    }
  }
  visible.value = false;
  emits("update:visible", false);
}

function handleFileChange(file) {
  selectedFile.value = file;
  form.value.file = file;

  // 如果用户没有输入文档名称，使用文件名
  if (!form.value.name && file.name) {
    const fileName = file.name.split(".");
    fileName.pop(); // 移除扩展名
    form.value.name = fileName.join(".");
  }

  // 根据文件扩展名自动选择文档类型
  const extension = file.name.split(".").pop().toLowerCase();
  if (["doc", "docx"].includes(extension)) {
    form.value.type = "Word";
  } else if (["xls", "xlsx"].includes(extension)) {
    form.value.type = "Excel";
  } else if (["ppt", "pptx"].includes(extension)) {
    form.value.type = "PPT";
  } else if (extension === "pdf") {
    form.value.type = "PDF";
  } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
    form.value.type = "Image";
  } else {
    form.value.type = "Other";
  }
}

function handleFileRemove() {
  selectedFile.value = null;
  form.value.file = null;
}

function handleSubmit() {
  uploadFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      startUpload();
    }
  });
}

function startUpload() {
  if (!form.value.file || isUploading.value) return;

  // 模拟上传过程
  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = "";

  // 准备上传数据
  const uploadData = {
    ...form.value,
    // 计算文件大小
    size: formatFileSize(selectedFile.value.size),
    uploader: "当前用户", // 实际应用中应该是当前登录用户
    uploadTime: new Date().toLocaleString()
  };

  // 模拟上传进度
  const interval = setInterval(() => {
    if (uploadProgress.value < 100) {
      uploadProgress.value += 5;
    } else {
      clearInterval(interval);
      uploadStatus.value = "success";

      // 上传完成后通知父组件
      emits("upload-complete", uploadData);

      // 上传完成后2秒关闭弹窗
      setTimeout(() => {
        if (visible.value) {
          visible.value = false;
          emits("update:visible", false);
        }
      }, 2000);
    }
  }, 200);
}

function cancelUpload() {
  isUploading.value = false;
  uploadStatus.value = "exception";
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 供外部调用
defineExpose({ open });
</script>

<style scoped>
.upload-area {
  width: 100%;
}

.upload-progress {
  margin-top: 20px;
}

.progress-text {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}
</style>
