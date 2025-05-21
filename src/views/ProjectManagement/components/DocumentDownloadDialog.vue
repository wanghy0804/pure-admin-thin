<template>
  <el-dialog
    v-model="visible"
    title="下载文档"
    width="500px"
    :before-close="handleClose"
  >
    <div v-if="currentDocument" class="download-content">
      <div class="document-info">
        <h3 class="document-title">{{ currentDocument.name }}</h3>
        <div class="document-meta">
          <el-tag :type="getDocTypeTag(currentDocument.type)" size="small">
            {{ currentDocument.type }}
          </el-tag>
          <span class="document-size">{{ currentDocument.size }}</span>
        </div>
      </div>

      <el-divider />

      <div class="download-options">
        <h4>下载选项</h4>
        <el-form label-position="top">
          <el-form-item label="下载位置">
            <el-radio-group v-model="downloadOption">
              <el-radio label="local">本地下载</el-radio>
              <el-radio label="cloud">云端存储</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="downloadOption === 'cloud'" label="云端位置">
            <el-select v-model="cloudLocation" placeholder="请选择云端位置">
              <el-option label="个人云盘" value="personal" />
              <el-option label="团队共享" value="team" />
              <el-option label="项目文件夹" value="project" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="isDownloading" class="download-progress">
        <el-progress :percentage="downloadProgress" :status="downloadStatus" />
        <div class="progress-text">{{ progressText }}</div>
      </div>
    </div>
    <div v-else class="empty-state">
      <el-empty description="未找到文档" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="isDownloading" @click="handleClose"
          >取消</el-button
        >
        <el-button
          type="primary"
          :loading="isDownloading"
          @click="handleDownload"
        >
          <el-icon><Download /></el-icon> 开始下载
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from "vue";
import { Download } from "@element-plus/icons-vue";

const emits = defineEmits(["update:visible", "download-complete"]);
const visible = ref(false);
const currentDocument = ref(null);
const downloadOption = ref("local");
const cloudLocation = ref("personal");
const isDownloading = ref(false);
const downloadProgress = ref(0);
const downloadStatus = ref("");

// 获取文档类型标签
function getDocTypeTag(type) {
  const typeMap = {
    Word: "primary",
    Excel: "success",
    PPT: "warning",
    PDF: "danger",
    Image: "info"
  };
  return typeMap[type] || "";
}

const progressText = computed(() => {
  if (!isDownloading.value) return "";
  if (downloadStatus.value === "success") return "下载完成";
  if (downloadStatus.value === "exception") return "下载失败";
  return `正在下载...${downloadProgress.value}%`;
});

function open(document) {
  currentDocument.value = document;
  // 重置下载状态
  isDownloading.value = false;
  downloadProgress.value = 0;
  downloadStatus.value = "";
  downloadOption.value = "local";
  cloudLocation.value = "personal";
  visible.value = true;
}

function handleClose() {
  if (
    isDownloading.value &&
    downloadStatus.value !== "success" &&
    downloadStatus.value !== "exception"
  ) {
    // 如果正在下载，提示用户
    if (confirm("下载正在进行中，确定要取消吗？")) {
      cancelDownload();
    } else {
      return;
    }
  }
  visible.value = false;
  emits("update:visible", false);
}

function handleDownload() {
  if (!currentDocument.value || isDownloading.value) return;

  // 模拟下载过程
  isDownloading.value = true;
  downloadProgress.value = 0;
  downloadStatus.value = "";

  const options = {
    location: downloadOption.value,
    cloudPath: downloadOption.value === "cloud" ? cloudLocation.value : null,
    document: currentDocument.value
  };

  // 模拟下载进度
  const interval = setInterval(() => {
    if (downloadProgress.value < 100) {
      downloadProgress.value += 10;
    } else {
      clearInterval(interval);
      downloadStatus.value = "success";
      isDownloading.value = false;
      emits("download-complete", options);

      // 下载完成后2秒关闭弹窗
      setTimeout(() => {
        if (visible.value) {
          visible.value = false;
          emits("update:visible", false);
        }
      }, 2000);
    }
  }, 300);
}

function cancelDownload() {
  isDownloading.value = false;
  downloadStatus.value = "exception";
}

// 供外部调用
defineExpose({ open });
</script>

<style scoped>
.download-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.document-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.document-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.download-options h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 500;
}

.download-progress {
  margin-top: 16px;
}

.progress-text {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.empty-state {
  padding: 30px 0;
}
</style>
