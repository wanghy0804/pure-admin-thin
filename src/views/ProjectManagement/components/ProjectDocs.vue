<template>
  <div class="project-docs">
    <el-card class="docs-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">文档与沟通</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="openUploadDialog">
              <el-icon><Upload /></el-icon> 上传文档
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="project" class="docs-content">
        <el-tabs v-model="activeTab" class="docs-tabs" stretch>
          <!-- 文档库 -->
          <el-tab-pane label="文档库" name="documents">
            <div class="document-list">
              <div v-if="selectedDocs.length > 0" class="table-actions">
                <el-button type="primary" size="small" @click="batchDownload">
                  <el-icon><Download /></el-icon> 批量下载 ({{
                    selectedDocs.length
                  }})
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="confirmBatchDelete"
                >
                  <el-icon><Delete /></el-icon> 批量删除 ({{
                    selectedDocs.length
                  }})
                </el-button>
              </div>
              <el-table
                :data="docsData.documents"
                style="width: 100%"
                border
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="文档名称" min-width="180" />
                <el-table-column prop="type" label="类型" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getDocTypeTag(row.type)" size="small">
                      {{ row.type }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="size" label="大小" width="100" />
                <el-table-column prop="uploader" label="上传者" width="100" />
                <el-table-column
                  prop="uploadTime"
                  label="上传时间"
                  width="160"
                />
                <el-table-column label="操作" width="180">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="openViewDialog(row)"
                    >
                      <el-icon><View /></el-icon> 查看
                    </el-button>
                    <el-button
                      type="success"
                      link
                      size="small"
                      @click="downloadDocument(row)"
                    >
                      <el-icon><Download /></el-icon> 下载
                    </el-button>
                    <el-button
                      type="danger"
                      link
                      size="small"
                      @click="confirmDelete(row)"
                    >
                      <el-icon><Delete /></el-icon> 删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 讨论区 -->
          <el-tab-pane label="讨论区" name="discussions">
            <div class="discussion-list">
              <el-card
                v-for="(discussion, index) in docsData.discussions"
                :key="index"
                class="discussion-card"
              >
                <template #header>
                  <div class="discussion-header">
                    <div class="discussion-info">
                      <el-avatar :size="32" :src="discussion.avatar">
                        {{ discussion.creator.charAt(0) }}
                      </el-avatar>
                      <div class="discussion-meta">
                        <span class="discussion-creator">{{
                          discussion.creator
                        }}</span>
                        <span class="discussion-time">{{
                          discussion.createTime
                        }}</span>
                      </div>
                    </div>
                    <el-tag
                      size="small"
                      :type="discussion.solved ? 'success' : 'info'"
                    >
                      {{ discussion.solved ? "已解决" : "讨论中" }}
                    </el-tag>
                  </div>
                </template>
                <div class="discussion-content">
                  <h3 class="discussion-title">{{ discussion.title }}</h3>
                  <p class="discussion-text">{{ discussion.content }}</p>
                  <div class="discussion-stats">
                    <span class="replies-count">
                      <el-icon><ChatLineRound /></el-icon>
                      {{ discussion.repliesCount }} 回复
                    </span>
                    <span class="views-count">
                      <el-icon><View /></el-icon>
                      {{ discussion.viewsCount }} 浏览
                    </span>
                  </div>
                </div>
              </el-card>
              <div class="create-discussion">
                <el-button type="primary" plain>
                  <el-icon><Plus /></el-icon> 新建讨论
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 沟通记录 -->
          <el-tab-pane label="沟通记录" name="communications">
            <div class="communication-list">
              <el-timeline>
                <el-timeline-item
                  v-for="(comm, index) in docsData.communications"
                  :key="index"
                  :timestamp="comm.time"
                  :type="comm.type"
                  :color="comm.color"
                >
                  <el-card class="communication-card">
                    <div class="communication-content">
                      <div class="communication-header">
                        <span class="communication-title">{{
                          comm.title
                        }}</span>
                        <el-tag size="small" :type="comm.type">{{
                          comm.category
                        }}</el-tag>
                      </div>
                      <p class="communication-text">{{ comm.content }}</p>
                      <div class="communication-participants">
                        <span>参与人: {{ comm.participants.join(", ") }}</span>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else class="empty-state">
        <el-empty description="请选择项目" />
      </div>
    </el-card>

    <!-- 文档查看弹窗 -->
    <DocumentViewDialog
      ref="viewDialogRef"
      @download="handleDocumentDownload"
    />

    <!-- 文档下载弹窗 -->
    <DocumentDownloadDialog
      ref="downloadDialogRef"
      @download-complete="handleDownloadComplete"
    />

    <!-- 文档上传弹窗 -->
    <DocumentUploadDialog
      ref="uploadDialogRef"
      @upload-complete="handleUploadComplete"
    />

    <!-- 删除确认弹框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      :title="batchDeleteMode ? '批量删除文档' : '删除文档'"
      width="400px"
    >
      <div class="delete-confirm-content">
        <el-icon class="warning-icon"><Warning /></el-icon>
        <div v-if="batchDeleteMode">
          <p>
            确定要删除选中的
            <strong>{{ selectedDocs.length }}</strong> 个文档吗？
          </p>
          <p class="warning-text">此操作不可恢复，请谨慎操作！</p>
        </div>
        <div v-else-if="currentDocument">
          <p>
            确定要删除文档 <strong>{{ currentDocument.name }}</strong> 吗？
          </p>
          <p class="warning-text">此操作不可恢复，请谨慎操作！</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" :loading="isDeleting" @click="handleDelete">
            确认删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import {
  Upload,
  View,
  Download,
  ChatLineRound,
  Plus,
  Delete,
  Warning
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import DocumentViewDialog from "./DocumentViewDialog.vue";
import DocumentUploadDialog from "./DocumentUploadDialog.vue";

const props = defineProps({
  project: Object
});

const activeTab = ref("documents");

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

// 弹窗引用
const viewDialogRef = ref();
const downloadDialogRef = ref();
const uploadDialogRef = ref();

// 选中的文档
const selectedDocs = ref([]);

// 处理选中文档变化
function handleSelectionChange(selection) {
  selectedDocs.value = selection;
}

// 打开文档查看弹窗
function openViewDialog(document) {
  viewDialogRef.value?.open(document);
}

// 直接下载文档
function downloadDocument(document) {
  // 模拟直接下载文件
  ElMessage.success(`开始下载文档: ${document.name}`);

  // 实际应用中应该调用下载 API
  // 这里模拟下载完成通知
  setTimeout(() => {
    handleDownloadComplete({
      document: document
    });
  }, 1000);
}

// 批量下载文档
function batchDownload() {
  if (selectedDocs.value.length === 0) {
    ElMessage.warning("请选择要下载的文档");
    return;
  }

  // 模拟打包下载
  ElMessage.success(
    `正在将 ${selectedDocs.value.length} 个文档打包成ZIP下载...`
  );

  // 实际应用中应该调用打包下载 API
  // 这里模拟下载完成通知
  setTimeout(() => {
    ElMessage.success(`${selectedDocs.value.length} 个文档打包下载完成`);
  }, 2000);
}

// 打开文档上传弹窗
function openUploadDialog() {
  uploadDialogRef.value?.open();
}

// 处理文档下载事件（从查看弹窗触发）
function handleDocumentDownload(document) {
  openDownloadDialog(document);
}

// 处理下载完成事件
function handleDownloadComplete(options) {
  ElMessage.success(`文档 ${options.document.name} 下载完成`);
  // 实际应用中可能需要记录下载历史或执行其他操作
}

// 处理上传完成事件
function handleUploadComplete(document) {
  ElMessage.success(`文档 ${document.name} 上传成功`);
  // 添加到文档列表
  docsData.value.documents.unshift({
    name: document.name,
    type: document.type,
    size: document.size,
    uploader: document.uploader,
    uploadTime: document.uploadTime
  });
}

// 删除相关状态
const deleteDialogVisible = ref(false);
const batchDeleteMode = ref(false);
const currentDocument = ref(null);
const isDeleting = ref(false);

// 确认删除单个文档
function confirmDelete(document) {
  currentDocument.value = document;
  batchDeleteMode.value = false;
  deleteDialogVisible.value = true;
}

// 确认批量删除
function confirmBatchDelete() {
  if (selectedDocs.value.length === 0) {
    ElMessage.warning("请选择要删除的文档");
    return;
  }
  batchDeleteMode.value = true;
  deleteDialogVisible.value = true;
}

// 执行删除操作
function handleDelete() {
  isDeleting.value = true;

  // 模拟删除操作
  setTimeout(() => {
    if (batchDeleteMode.value) {
      // 批量删除
      const selectedIds = selectedDocs.value.map(doc => doc.name);
      docsData.value.documents = docsData.value.documents.filter(
        doc => !selectedIds.includes(doc.name)
      );
      ElMessage.success(`成功删除 ${selectedDocs.value.length} 个文档`);
      selectedDocs.value = [];
    } else if (currentDocument.value) {
      // 删除单个文档
      docsData.value.documents = docsData.value.documents.filter(
        doc => doc.name !== currentDocument.value.name
      );
      ElMessage.success(`文档 ${currentDocument.value.name} 删除成功`);
    }

    // 重置状态
    isDeleting.value = false;
    deleteDialogVisible.value = false;
    currentDocument.value = null;
  }, 1000);
}

// 模拟文档数据，实际应通过API获取
const docsData = ref({
  documents: [
    {
      name: "项目需求文档.docx",
      type: "Word",
      size: "2.5MB",
      uploader: "张三",
      uploadTime: "2025-01-15 10:30:00"
    },
    {
      name: "项目计划书.pdf",
      type: "PDF",
      size: "3.2MB",
      uploader: "李四",
      uploadTime: "2025-01-20 14:20:00"
    },
    {
      name: "项目进度跟踪表.xlsx",
      type: "Excel",
      size: "1.8MB",
      uploader: "王五",
      uploadTime: "2025-02-05 09:15:00"
    },
    {
      name: "项目沟通方案.pptx",
      type: "PPT",
      size: "5.1MB",
      uploader: "张三",
      uploadTime: "2025-02-10 16:45:00"
    },
    {
      name: "系统架构图.png",
      type: "Image",
      size: "0.8MB",
      uploader: "赵六",
      uploadTime: "2025-02-15 11:20:00"
    }
  ],
  discussions: [
    {
      title: "关于登录验证码功能的讨论",
      content:
        "我们是否需要在登录时添加验证码功能？这会增加用户登录的安全性，但可能会影响用户体验。",
      creator: "李四",
      avatar: "",
      createTime: "2025-03-05 09:30:00",
      repliesCount: 8,
      viewsCount: 35,
      solved: true
    },
    {
      title: "前端框架选型讨论",
      content:
        "我们是否考虑将前端框架从 Vue 2 升级到 Vue 3？这将带来哪些改进和挑战？",
      creator: "王五",
      avatar: "",
      createTime: "2025-03-10 14:15:00",
      repliesCount: 12,
      viewsCount: 48,
      solved: false
    },
    {
      title: "关于数据库连接池配置的问题",
      content:
        "当前数据库连接池配置可能存在问题，在高并发情况下经常出现连接超时。有什么建议吗？",
      creator: "赵六",
      avatar: "",
      createTime: "2025-03-15 10:45:00",
      repliesCount: 5,
      viewsCount: 22,
      solved: true
    }
  ],
  communications: [
    {
      time: "2025-04-15 10:00:00",
      title: "项目启动会议",
      category: "会议",
      type: "primary",
      color: "#409eff",
      content: "讨论项目目标、范围、时间线和团队分工。",
      participants: ["张三", "李四", "王五", "赵六", "王总"]
    },
    {
      time: "2025-04-20 15:30:00",
      title: "客户需求沟通",
      category: "客户沟通",
      type: "success",
      color: "#67c23a",
      content: "与客户确认需求细节，客户希望增加数据分析功能。",
      participants: ["张三", "李四", "客户代表"]
    },
    {
      time: "2025-05-05 09:15:00",
      title: "技术讨论会",
      category: "技术会议",
      type: "warning",
      color: "#e6a23c",
      content: "讨论数据库设计和系统架构问题，决定采用微服务架构。",
      participants: ["李四", "王五", "赵六", "孙七"]
    },
    {
      time: "2025-05-15 16:00:00",
      title: "项目进度汇报",
      category: "内部沟通",
      type: "info",
      color: "#909399",
      content: "团队汇报当前项目进度，讨论存在的问题和解决方案。",
      participants: ["张三", "李四", "王五", "赵六", "孙七", "周八"]
    }
  ]
});
</script>

<style scoped>
.project-docs {
  margin-bottom: 24px;
}

.docs-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.font-medium {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.docs-content {
  padding: 8px 0;
}

.docs-tabs {
  margin-bottom: 16px;
}

/* 讨论区样式 */
.discussion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.discussion-card {
  margin-bottom: 0;
}

.discussion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.discussion-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.discussion-meta {
  display: flex;
  flex-direction: column;
}

.discussion-creator {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.discussion-time {
  font-size: 12px;
  color: #909399;
}

.discussion-title {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.discussion-text {
  margin-bottom: 16px;
  color: #606266;
}

.discussion-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #909399;
}

.replies-count,
.views-count {
  display: flex;
  gap: 4px;
  align-items: center;
}

.create-discussion {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* 沟通记录样式 */
.communication-card {
  margin-bottom: 0;
}

.communication-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.communication-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.communication-text {
  margin: 8px 0;
  color: #606266;
}

.communication-participants {
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
}

.empty-state {
  padding: 30px 0;
}
</style>
