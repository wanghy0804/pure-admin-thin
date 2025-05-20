<template>
  <div class="project-tasks">
    <el-card class="tasks-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">任务与工作项</span>
          <div class="header-actions">
            <el-button type="primary" size="small">
              <el-icon><Plus /></el-icon> 新建任务
            </el-button>
            <el-button type="primary" text size="small">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="project" class="tasks-content">
        <!-- 任务视图切换 -->
        <div class="view-toggle">
          <el-radio-group v-model="viewType" size="small">
            <el-radio-button label="list">列表视图</el-radio-button>
            <el-radio-button label="kanban">看板视图</el-radio-button>
          </el-radio-group>

          <el-select v-model="taskFilter" placeholder="筛选任务" size="small">
            <el-option label="全部任务" value="all" />
            <el-option label="进行中" value="inProgress" />
            <el-option label="未开始" value="notStarted" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </div>

        <!-- 列表视图 -->
        <div v-if="viewType === 'list'" class="list-view">
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
            <el-table-column prop="assignee" label="负责人" width="120" />
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
            <el-table-column prop="dueDate" label="截止日期" width="120" />
            <el-table-column label="操作" width="150">
              <template #default>
                <el-button type="primary" link size="small">编辑</el-button>
                <el-button type="success" link size="small">完成</el-button>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="taskData.length"
              :page-size="10"
            />
          </div>
        </div>

        <!-- 看板视图 -->
        <div v-else class="kanban-view">
          <div class="kanban-container">
            <div
              v-for="column in kanbanColumns"
              :key="column.status"
              class="kanban-column"
            >
              <div class="column-header">
                <h3>
                  {{ column.name }} ({{
                    getTasksByStatus(column.status).length
                  }})
                </h3>
              </div>
              <div class="column-content">
                <div
                  v-for="task in getTasksByStatus(column.status)"
                  :key="task.id"
                  class="task-card"
                  :class="{ 'high-priority': task.priority === 'high' }"
                >
                  <div class="task-header">
                    <span class="task-id">#{{ task.id }}</span>
                    <el-tag size="small" :type="getTaskTypeTag(task.type)">
                      {{ task.type }}
                    </el-tag>
                  </div>
                  <div class="task-title">{{ task.name }}</div>
                  <div class="task-footer">
                    <div class="task-assignee">
                      <el-avatar :size="24" :src="task.avatar || ''">{{
                        task.assignee.charAt(0)
                      }}</el-avatar>
                      <span>{{ task.assignee }}</span>
                    </div>
                    <div class="task-due-date">
                      <el-icon><Calendar /></el-icon>
                      <span>{{ task.dueDate }}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="getTasksByStatus(column.status).length === 0"
                  class="empty-column"
                >
                  <p>暂无任务</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-empty description="请选择项目" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import {
  Plus,
  Refresh,
  WarningFilled,
  Calendar
} from "@element-plus/icons-vue";

const props = defineProps({
  project: Object
});

const viewType = ref("list");
const taskFilter = ref("all");

// 模拟任务数据，实际应通过API获取
const taskData = ref([
  {
    id: 1001,
    name: "需求分析文档编写",
    assignee: "张三",
    type: "需求",
    status: "已完成",
    priority: "normal",
    dueDate: "2025-02-15",
    avatar: ""
  },
  {
    id: 1002,
    name: "数据库设计",
    assignee: "李四",
    type: "设计",
    status: "进行中",
    priority: "high",
    dueDate: "2025-03-20",
    avatar: ""
  },
  {
    id: 1003,
    name: "登录模块开发",
    assignee: "王五",
    type: "开发",
    status: "进行中",
    priority: "normal",
    dueDate: "2025-04-10",
    avatar: ""
  },
  {
    id: 1004,
    name: "用户管理模块开发",
    assignee: "赵六",
    type: "开发",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-04-25",
    avatar: ""
  },
  {
    id: 1005,
    name: "登录页面样式问题",
    assignee: "王五",
    type: "缺陷",
    status: "进行中",
    priority: "high",
    dueDate: "2025-03-15",
    avatar: ""
  },
  {
    id: 1006,
    name: "测试用例编写",
    assignee: "孙七",
    type: "测试",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-05-10",
    avatar: ""
  },
  {
    id: 1007,
    name: "性能优化",
    assignee: "李四",
    type: "开发",
    status: "未开始",
    priority: "normal",
    dueDate: "2025-06-01",
    avatar: ""
  }
]);

// 看板列定义
const kanbanColumns = [
  { name: "未开始", status: "未开始" },
  { name: "进行中", status: "进行中" },
  { name: "已完成", status: "已完成" }
];

// 根据筛选条件过滤任务
const filteredTasks = computed(() => {
  if (taskFilter.value === "all") {
    return taskData.value;
  }

  const statusMap = {
    inProgress: "进行中",
    notStarted: "未开始",
    completed: "已完成"
  };

  return taskData.value.filter(
    task => task.status === statusMap[taskFilter.value]
  );
});

// 根据状态获取任务列表
function getTasksByStatus(status) {
  if (taskFilter.value !== "all") {
    const statusMap = {
      inProgress: "进行中",
      notStarted: "未开始",
      completed: "已完成"
    };

    if (status !== statusMap[taskFilter.value]) {
      return [];
    }
  }

  return taskData.value.filter(task => task.status === status);
}

// 获取任务类型标签样式
function getTaskTypeTag(type) {
  const typeMap = {
    需求: "info",
    设计: "success",
    开发: "primary",
    测试: "warning",
    缺陷: "danger"
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
</script>

<style scoped>
.project-tasks {
  margin-bottom: 24px;
}

.tasks-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
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

.tasks-content {
  padding: 8px 0;
}

.view-toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
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

/* 看板视图样式 */
.kanban-container {
  display: flex;
  gap: 16px;
  padding-bottom: 8px;
  overflow-x: auto;
}

.kanban-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 280px;
  max-width: 350px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.column-header {
  padding: 12px;
  background-color: #e4e7ed;
  border-radius: 4px 4px 0 0;
}

.column-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.column-content {
  flex: 1;
  max-height: 500px;
  padding: 12px;
  overflow-y: auto;
}

.task-card {
  padding: 12px;
  margin-bottom: 12px;
  background-color: white;
  border-left: 3px solid #409eff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
}

.task-card.high-priority {
  border-left-color: #f56c6c;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.task-id {
  font-size: 12px;
  color: #909399;
}

.task-title {
  margin-bottom: 12px;
  font-weight: 500;
  color: #303133;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #606266;
}

.task-assignee {
  display: flex;
  gap: 4px;
  align-items: center;
}

.task-due-date {
  display: flex;
  gap: 4px;
  align-items: center;
}

.empty-column {
  padding: 20px 0;
  font-size: 14px;
  color: #909399;
  text-align: center;
}

.empty-state {
  padding: 30px 0;
}
</style>
