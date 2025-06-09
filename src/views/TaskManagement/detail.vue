<template>
  <div class="task-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button
          type="text"
          :icon="ArrowLeft"
          class="back-button"
          @click="goBack"
        >
          返回任务列表
        </el-button>
        <el-divider direction="vertical" />
        <h1 class="page-title">任务详情</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Edit">编辑任务</el-button>
        <el-button type="danger" :icon="Delete">删除任务</el-button>
      </div>
    </div>

    <el-row v-if="taskDetail" :gutter="20">
      <!-- 基本信息 -->
      <el-col :span="16">
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">基本信息</span>
              <el-tag :type="getStatusTag(taskDetail.status)" size="large">
                {{ taskDetail.status }}
              </el-tag>
            </div>
          </template>

          <div class="task-info">
            <div class="info-row">
              <div class="info-item">
                <span class="label">任务名称：</span>
                <span class="value task-name">
                  <el-icon v-if="taskDetail.priority === 'high'">
                    <WarningFilled style="color: #f56c6c" />
                  </el-icon>
                  {{ taskDetail.name }}
                </span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <span class="label">任务ID：</span>
                <span class="value">#{{ taskDetail.id }}</span>
              </div>
              <div class="info-item">
                <span class="label">任务类型：</span>
                <el-tag :type="getTaskTypeTag(taskDetail.type)">
                  {{ taskDetail.type }}
                </el-tag>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <span class="label">所属项目：</span>
                <el-link
                  type="primary"
                  @click="viewProjectDetail(taskDetail.projectId)"
                >
                  {{ taskDetail.projectName }}
                </el-link>
              </div>
              <div class="info-item">
                <span class="label">优先级：</span>
                <el-tag
                  :type="taskDetail.priority === 'high' ? 'danger' : 'info'"
                >
                  {{ taskDetail.priority === "high" ? "高" : "普通" }}
                </el-tag>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <span class="label">负责人：</span>
                <div class="assignee-info">
                  <el-avatar :size="30" class="assignee-avatar">
                    {{ taskDetail.assignee.charAt(0) }}
                  </el-avatar>
                  <span class="assignee-name">{{ taskDetail.assignee }}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="label">截止日期：</span>
                <span
                  class="value"
                  :class="{ 'overdue-date': isOverdue(taskDetail.dueDate) }"
                >
                  {{ taskDetail.dueDate }}
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 任务描述 -->
        <el-card class="detail-card mt-20">
          <template #header>
            <span class="card-title">任务描述</span>
          </template>
          <div class="task-description">
            <p v-if="taskDetail.description">
              {{ taskDetail.description }}
            </p>
            <p v-else class="no-description">暂无任务描述</p>
          </div>
        </el-card>

        <!-- 任务进度 -->
        <el-card class="detail-card mt-20">
          <template #header>
            <span class="card-title">任务进度</span>
          </template>
          <div class="task-progress">
            <div class="progress-info">
              <span>完成进度：{{ taskDetail.progress || 0 }}%</span>
              <span class="progress-status">{{
                getProgressStatus(taskDetail.progress || 0)
              }}</span>
            </div>
            <el-progress
              :percentage="taskDetail.progress || 0"
              :status="getProgressType(taskDetail.progress || 0)"
              :stroke-width="8"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 侧边栏信息 -->
      <el-col :span="8">
        <!-- 时间信息 -->
        <el-card class="detail-card">
          <template #header>
            <span class="card-title">时间信息</span>
          </template>
          <div class="time-info">
            <div class="time-item">
              <el-icon><Calendar /></el-icon>
              <div class="time-content">
                <div class="time-label">创建时间</div>
                <div class="time-value">
                  {{ taskDetail.createTime || "2025-01-15 10:30" }}
                </div>
              </div>
            </div>
            <div class="time-item">
              <el-icon><Clock /></el-icon>
              <div class="time-content">
                <div class="time-label">更新时间</div>
                <div class="time-value">
                  {{ taskDetail.updateTime || "2025-06-07 14:20" }}
                </div>
              </div>
            </div>
            <div class="time-item">
              <el-icon><Timer /></el-icon>
              <div class="time-content">
                <div class="time-label">截止时间</div>
                <div
                  class="time-value"
                  :class="{ 'overdue-date': isOverdue(taskDetail.dueDate) }"
                >
                  {{ taskDetail.dueDate }}
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 操作记录 -->
        <el-card class="detail-card mt-20">
          <template #header>
            <span class="card-title">操作记录</span>
          </template>
          <div class="action-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="(action, index) in taskActions"
                :key="index"
                :timestamp="action.timestamp"
                :type="action.type"
              >
                {{ action.description }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <el-empty description="任务不存在或加载失败" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ArrowLeft,
  Edit,
  Delete,
  WarningFilled,
  Calendar,
  Clock,
  Timer
} from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();
const taskDetail = ref(null);
const taskActions = ref([]);

// 模拟任务数据
const allTasks = ref([
  {
    id: 1001,
    name: "需求分析文档编写",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "张三",
    type: "需求",
    status: "已完成",
    priority: "normal",
    dueDate: "2025-02-15"
  },
  {
    id: 1002,
    name: "首页UI设计",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "李四",
    type: "设计",
    status: "已完成",
    priority: "normal",
    dueDate: "2025-02-28"
  },
  {
    id: 1003,
    name: "用户认证模块开发",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "王五",
    type: "开发",
    status: "进行中",
    priority: "high",
    dueDate: "2025-03-20"
  },
  {
    id: 1004,
    name: "产品页面开发",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "赵六",
    type: "开发",
    status: "进行中",
    priority: "normal",
    dueDate: "2025-04-25"
  },
  {
    id: 1005,
    name: "登录页面样式问题",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "王五",
    type: "缺陷",
    status: "进行中",
    priority: "high",
    dueDate: "2025-03-15"
  },
  {
    id: 1006,
    name: "测试用例编写",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "孙七",
    type: "测试",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-05-10"
  },
  {
    id: 1007,
    name: "性能优化",
    projectId: "PRJ001",
    projectName: "企业网站重构",
    assignee: "李四",
    type: "开发",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-06-01"
  },
  {
    id: 2001,
    name: "App原型设计",
    projectId: "PRJ002",
    projectName: "移动应用开发",
    assignee: "李四",
    type: "设计",
    status: "已完成",
    priority: "high",
    dueDate: "2025-02-10"
  },
  {
    id: 2002,
    name: "用户界面开发",
    projectId: "PRJ002",
    projectName: "移动应用开发",
    assignee: "王五",
    type: "开发",
    status: "进行中",
    priority: "normal",
    dueDate: "2025-03-25"
  },
  {
    id: 2003,
    name: "API集成",
    projectId: "PRJ002",
    projectName: "移动应用开发",
    assignee: "张三",
    type: "开发",
    status: "未开始",
    priority: "high",
    dueDate: "2025-04-15"
  },
  {
    id: 3001,
    name: "服务器迁移计划",
    projectId: "PRJ003",
    projectName: "数据中心升级",
    assignee: "赵六",
    type: "需求",
    status: "已完成",
    priority: "high",
    dueDate: "2025-01-30"
  },
  {
    id: 3002,
    name: "网络架构设计",
    projectId: "PRJ003",
    projectName: "数据中心升级",
    assignee: "张三",
    type: "设计",
    status: "已完成",
    priority: "normal",
    dueDate: "2025-02-20"
  },
  {
    id: 3003,
    name: "硬件采购",
    projectId: "PRJ003",
    projectName: "数据中心升级",
    assignee: "李四",
    type: "采购",
    status: "进行中",
    priority: "normal",
    dueDate: "2025-03-10"
  },
  {
    id: 4001,
    name: "客户数据导入",
    projectId: "PRJ004",
    projectName: "CRM系统实施",
    assignee: "王五",
    type: "数据",
    status: "进行中",
    priority: "high",
    dueDate: "2025-03-05"
  },
  {
    id: 4002,
    name: "用户培训",
    projectId: "PRJ004",
    projectName: "CRM系统实施",
    assignee: "孙七",
    type: "培训",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-04-20"
  },
  {
    id: 5001,
    name: "安全策略制定",
    projectId: "PRJ005",
    projectName: "安全审计系统",
    assignee: "张三",
    type: "需求",
    status: "已完成",
    priority: "high",
    dueDate: "2025-02-05"
  },
  {
    id: 5002,
    name: "漏洞扫描模块开发",
    projectId: "PRJ005",
    projectName: "安全审计系统",
    assignee: "李四",
    type: "开发",
    status: "进行中",
    priority: "high",
    dueDate: "2025-03-30"
  },
  {
    id: 5003,
    name: "报告生成功能",
    projectId: "PRJ005",
    projectName: "安全审计系统",
    assignee: "王五",
    type: "开发",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-04-30"
  }
]);

// 模拟操作记录数据
const mockActions = [
  {
    timestamp: "2025-06-07 14:20",
    type: "primary",
    description: "任务状态更新为进行中"
  },
  {
    timestamp: "2025-06-05 09:30",
    type: "info",
    description: "任务被分配给负责人"
  },
  {
    timestamp: "2025-06-03 16:45",
    type: "success",
    description: "任务创建成功"
  }
];

// 获取任务类型标签样式
function getTaskTypeTag(type) {
  const typeMap = {
    需求: "info",
    设计: "success",
    开发: "primary",
    测试: "warning",
    缺陷: "danger",
    采购: "info",
    数据: "info",
    培训: "success"
  };

  return typeMap[type] || "";
}

// 获取状态标签样式
function getStatusTag(status) {
  const statusMap = {
    未开始: "info",
    进行中: "primary",
    已完成: "success"
  };

  return statusMap[status] || "";
}

// 检查是否逾期
function isOverdue(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  return dueDate < today;
}

// 返回上一页
function goBack() {
  router.push("/TaskManagement");
}

// 跳转到项目详情
function viewProjectDetail(projectId) {
  router.push(`/ProjectManagement/detail/${projectId}`);
}

// 获取进度状态文字
function getProgressStatus(progress) {
  if (progress === 0) return "未开始";
  if (progress < 100) return "进行中";
  return "已完成";
}

// 获取进度条类型
function getProgressType(progress) {
  if (progress === 0) return "";
  if (progress < 100) return "";
  return "success";
}

// 加载任务详情
function loadTaskDetail() {
  const taskId = parseInt(route.params.id);
  const task = allTasks.value.find(t => t.id === taskId);

  if (task) {
    // 添加一些额外的详情数据
    taskDetail.value = {
      ...task,
      description:
        task.type === "需求"
          ? "这是一个详细的需求分析任务，需要对整个项目进行全面的分析，包括功能需求、非功能需求、用户故事等内容。"
          : task.type === "开发"
            ? "这是一个核心开发任务，需要按照设计文档和需求规格进行代码实现，确保代码质量和性能。"
            : task.type === "测试"
              ? "这是一个测试任务，需要编写测试用例，执行功能测试和性能测试，确保产品质量。"
              : "这是一个重要的项目任务，需要认真完成。",
      progress:
        task.status === "已完成"
          ? 100
          : task.status === "进行中"
            ? Math.floor(Math.random() * 80) + 10
            : 0,
      createTime: "2025-01-15 10:30",
      updateTime: "2025-06-07 14:20"
    };

    // 设置操作记录
    taskActions.value = mockActions;
  }
}

onMounted(() => {
  loadTaskDetail();
});
</script>

<style scoped>
.task-detail {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.header-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.back-button {
  font-size: 14px;
  color: #606266;
}

.back-button:hover {
  color: #409eff;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.detail-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.task-info {
  padding: 0;
}

.info-row {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
}

.label {
  min-width: 80px;
  font-weight: 500;
  color: #606266;
}

.value {
  font-weight: 400;
  color: #303133;
}

.task-name {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.assignee-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.assignee-avatar {
  font-weight: 600;
  color: white;
  background-color: #409eff;
}

.assignee-name {
  font-weight: 500;
}

.task-description {
  padding: 0;
  line-height: 1.6;
  color: #606266;
}

.no-description {
  font-style: italic;
  color: #c0c4cc;
}

.task-progress {
  padding: 0;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-status {
  font-size: 12px;
  color: #909399;
}

.time-info {
  padding: 0;
}

.time-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.time-item:last-child {
  margin-bottom: 0;
}

.time-item .el-icon {
  margin-top: 2px;
  color: #909399;
}

.time-content {
  flex: 1;
}

.time-label {
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.time-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.action-timeline {
  padding: 0;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.overdue-date {
  font-weight: bold;
  color: #f56c6c;
}
</style>
