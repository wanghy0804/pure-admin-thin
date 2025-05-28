<template>
  <div class="task-management">
    <el-row :gutter="16">
      <!-- 任务统计卡片 -->
      <el-col :span="24">
        <el-card class="stats-card">
          <div class="stats-container">
            <div
              class="stat-item"
              :class="{
                'active-stat': statusFilter === '' && !isOverdueFilterActive
              }"
              @click="filterByStatus('all')"
            >
              <div class="stat-value clickable">{{ taskStats.total }}</div>
              <div class="stat-label">总任务数</div>
            </div>
            <div
              class="stat-item"
              :class="{
                'active-stat':
                  statusFilter === '未开始' && !isOverdueFilterActive
              }"
              @click="filterByStatus('未开始')"
            >
              <div class="stat-value clickable">{{ taskStats.notStarted }}</div>
              <div class="stat-label">未开始</div>
            </div>
            <div
              class="stat-item"
              :class="{
                'active-stat':
                  statusFilter === '进行中' && !isOverdueFilterActive
              }"
              @click="filterByStatus('进行中')"
            >
              <div class="stat-value clickable">{{ taskStats.inProgress }}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div
              class="stat-item"
              :class="{
                'active-stat':
                  statusFilter === '已完成' && !isOverdueFilterActive
              }"
              @click="filterByStatus('已完成')"
            >
              <div class="stat-value clickable">{{ taskStats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div
              class="stat-item"
              :class="{ 'active-stat': isOverdueFilterActive }"
              @click="filterByStatus('overdue')"
            >
              <div class="stat-value clickable">{{ taskStats.overdue }}</div>
              <div class="stat-label">已逾期</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <!-- 任务列表 -->
      <el-col :span="24">
        <el-card class="task-list-card">
          <template #header>
            <div class="card-header">
              <span class="font-medium">任务预览</span>
              <div class="header-actions">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索任务"
                  :prefix-icon="Search"
                  clearable
                  class="search-input"
                />
                <el-input
                  v-model="projectSearchQuery"
                  placeholder="搜索项目"
                  :prefix-icon="Search"
                  clearable
                  class="search-input"
                />
              </div>
            </div>
          </template>

          <el-table :data="filteredTasks" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="任务名称" min-width="180">
              <template #default="{ row }">
                <div class="task-name-cell">
                  <el-icon v-if="row.priority === 'high'">
                    <WarningFilled style="color: #f56c6c" />
                  </el-icon>
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectName"
              label="所属项目"
              min-width="120"
            />
            <el-table-column prop="assignee" label="负责人" width="100" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getTaskTypeTag(row.type)" size="small">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTag(row.status)" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="截止日期" width="120">
              <template #default="{ row }">
                <div :class="{ 'overdue-date': isOverdue(row.dueDate) }">
                  {{ row.dueDate }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="viewProjectDetail(row.projectId)"
                >
                  查看项目
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredTasks.length"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Search, WarningFilled } from "@element-plus/icons-vue";

const router = useRouter();
const searchQuery = ref("");
const projectSearchQuery = ref("");
const statusFilter = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const isOverdueFilterActive = ref(false);

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

// 任务统计数据
const taskStats = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notStarted = allTasks.value.filter(
    task => task.status === "未开始"
  ).length;
  const inProgress = allTasks.value.filter(
    task => task.status === "进行中"
  ).length;
  const completed = allTasks.value.filter(
    task => task.status === "已完成"
  ).length;

  // 计算逾期任务
  const overdue = allTasks.value.filter(task => {
    if (task.status === "已完成") return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  }).length;

  return {
    total: allTasks.value.length,
    notStarted,
    inProgress,
    completed,
    overdue
  };
});

// 筛选任务
const filteredTasks = computed(() => {
  let result = allTasks.value;

  // 应用任务搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      task =>
        task.name.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query)
    );
  }
  // 应用项目搜索筛选
  if (projectSearchQuery.value) {
    const query = projectSearchQuery.value.toLowerCase();
    result = result.filter(
      task =>
        task.projectName.toLowerCase().includes(query) ||
        task.projectId.toLowerCase().includes(query)
    );
  }

  // 应用逾期筛选
  if (isOverdueFilterActive.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    result = result.filter(task => {
      if (task.status === "已完成") return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    });
  }
  // 应用状态筛选
  else if (statusFilter.value) {
    result = result.filter(task => task.status === statusFilter.value);
  }

  return result;
});

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

// 跳转到项目详情
function viewProjectDetail(projectId) {
  router.push(`/ProjectManagement/detail/${projectId}`);
}

// 根据状态筛选任务
function filterByStatus(status) {
  // 重置到第一页
  currentPage.value = 1;

  if (status === "all") {
    statusFilter.value = "";
    isOverdueFilterActive.value = false;
  } else if (status === "overdue") {
    statusFilter.value = "";
    isOverdueFilterActive.value = true;
  } else {
    statusFilter.value = status;
    isOverdueFilterActive.value = false;
  }
}
</script>

<style scoped>
.task-management {
  padding: 16px;
}

.mt-16 {
  margin-top: 16px;
}

.stats-card {
  margin-bottom: 16px;
}

.stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
}

.stat-value {
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: #409eff;
}

.active-stat .stat-value {
  color: #409eff;
}

.active-stat .stat-label {
  font-weight: 500;
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 400px;
  margin-left: 8px;
}

.font-medium {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.task-name-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.overdue-date {
  font-weight: bold;
  color: #f56c6c;
}

.select-prefix-icon {
  margin-right: 6px;
  margin-left: 8px;
  color: #909399;
}
</style>
