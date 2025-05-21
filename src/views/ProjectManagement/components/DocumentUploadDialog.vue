<template>
  <el-dialog
    v-model="visible"
    title="上传文档"
    width="700px"
    :before-close="handleClose"
  >
    <el-form
      ref="uploadFormRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="上传文件" prop="files">
        <el-upload
          class="upload-area"
          drag
          multiple
          action="#"
          :auto-upload="false"
          :limit="10"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">
              支持各类文档格式，单个文件不超过20MB，最多可上传10个文件
            </div>
          </template>
        </el-upload>
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
          <el-icon><upload-filled /></el-icon>
          {{ fileList.length > 1 ? `上传 ${fileList.length} 个文件` : "上传" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed, reactive } from "vue";
import { UploadFilled, Setting } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

const emits = defineEmits(["update:visible", "upload-complete"]);
const visible = ref(false);
const uploadFormRef = ref<FormInstance>();
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref("");
const fileList = ref([]);
const showBatchSettings = ref(false);
const batchSettings = reactive({
  tags: [],
  permission: "public",
  visibleTo: []
});

const form = ref({
  files: [],
  description: "",
  tags: [],
  permission: "public",
  visibleTo: []
});

const rules = ref<FormRules>({
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
    files: [],
    description: "",
    tags: [],
    permission: "public",
    visibleTo: []
  };

  // 重置上传状态
  isUploading.value = false;
  uploadProgress.value = 0;
  uploadStatus.value = "";
  fileList.value = [];
  showBatchSettings.value = false;

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

function handleFileChange(file, files) {
  // 更新文件列表
  form.value.files = files;
  // 保存当前文件列表的引用
  fileList.value = files;
  console.log("Files changed:", files.length, files);
}

function handleFileRemove(file, files) {
  // 更新文件列表
  form.value.files = files;
  // 保存当前文件列表的引用
  fileList.value = files;
  console.log("Files after remove:", files.length, files);
}

// 获取文件类型
function getFileType(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();
  if (["doc", "docx"].includes(extension)) {
    return "Word";
  } else if (["xls", "xlsx"].includes(extension)) {
    return "Excel";
  } else if (["ppt", "pptx"].includes(extension)) {
    return "PPT";
  } else if (extension === "pdf") {
    return "PDF";
  } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
    return "Image";
  } else {
    return "Other";
  }
}

// 获取文件名（包含扩展名）
function getFileName(fileName) {
  return fileName; // 直接返回完整文件名
}

function handleSubmit() {
  console.log("Submitting with files:", fileList.value.length);

  if (fileList.value.length === 0) {
    ElMessage.warning("请至少上传一个文件");
    return;
  }

  uploadFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      startUpload();
    }
  });
}

function startUpload() {
  if (fileList.value.length === 0 || isUploading.value) return;

  // 模拟上传过程
  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = "";

  // 模拟上传进度
  const interval = setInterval(() => {
    if (uploadProgress.value < 100) {
      uploadProgress.value += 5;
    } else {
      clearInterval(interval);
      uploadStatus.value = "success";

      // 上传完成后通知父组件 - 发送所有上传的文件
      fileList.value.forEach(file => {
        const uploadedFile = {
          name: getFileName(file.name),
          type: getFileType(file.name),
          size: formatFileSize(file.size),
          uploader: "当前用户", // 实际应用中应该是当前登录用户
          uploadTime: new Date().toLocaleString(),
          permission: form.value.permission,
          visibleTo: form.value.visibleTo
        };
        emits("upload-complete", uploadedFile);
      });

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

.placeholder-text {
  font-size: 14px;
  color: #909399;
}

.batch-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
