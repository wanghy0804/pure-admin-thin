<template>
  <el-dialog
    v-model="visible"
    title="查看文档"
    width="800px"
    :before-close="handleClose"
  >
    <div v-if="currentDocument" class="document-view">
      <div class="document-info">
        <h3 class="document-title">{{ currentDocument.name }}</h3>
        <div class="document-meta">
          <el-tag :type="getDocTypeTag(currentDocument.type)" size="small">
            {{ currentDocument.type }}
          </el-tag>
          <span class="document-size">{{ currentDocument.size }}</span>
          <span class="document-uploader"
            >上传者: {{ currentDocument.uploader }}</span
          >
          <span class="document-time"
            >上传时间: {{ currentDocument.uploadTime }}</span
          >
        </div>
      </div>

      <div class="document-preview">
        <!-- 根据文档类型显示不同的预览 -->
        <div v-if="currentDocument.type === 'Image'" class="image-preview">
          <img
            :src="currentDocument.previewUrl || '/placeholder-image.png'"
            alt="文档预览"
          />
        </div>
        <div v-else-if="currentDocument.type === 'PDF'" class="pdf-preview">
          <iframe :src="currentDocument.previewUrl" width="100%" height="500" />
        </div>
        <div v-else class="generic-preview">
          <el-empty description="暂不支持该类型文件的预览" />
          <div class="preview-actions">
            <el-button type="primary" @click="handleDownload">
              <el-icon><Download /></el-icon> 下载查看
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <el-empty description="未找到文档" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleDownload">
          <el-icon><Download /></el-icon> 下载
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { Download } from "@element-plus/icons-vue";

const emits = defineEmits(["update:visible", "download"]);
const visible = ref(false);
const currentDocument = ref(null);

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

function open(document) {
  currentDocument.value = document;
  visible.value = true;
}

function handleClose() {
  visible.value = false;
  emits("update:visible", false);
}

function handleDownload() {
  if (currentDocument.value) {
    emits("download", currentDocument.value);
  }
  // 不关闭弹窗，让用户继续查看
}

// 供外部调用
defineExpose({ open });
</script>

<style scoped>
.document-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.document-info {
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.document-title {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 500;
}

.document-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.document-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.image-preview img {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.generic-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.preview-actions {
  margin-top: 16px;
}

.empty-state {
  padding: 30px 0;
}
</style>
