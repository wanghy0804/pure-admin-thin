<template>
  <div class="project-risks">
    <el-card class="risks-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">风险与问题</span>
          <div class="header-actions">
            <el-button type="primary" size="small">
              <el-icon><Plus /></el-icon> 添加风险
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="project" class="risks-content">
        <el-tabs v-model="activeTab" class="risk-tabs">
          <!-- 风险清单 -->
          <el-tab-pane label="风险清单" name="risks">
            <div class="risk-list">
              <el-table :data="riskData.risks" style="width: 100%" border>
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column
                  prop="title"
                  label="风险描述"
                  min-width="180"
                />
                <el-table-column prop="category" label="类别" width="120" />
                <el-table-column prop="level" label="级别" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getRiskLevelType(row.level)" size="small">
                      {{ row.level }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="probability"
                  label="发生概率"
                  width="100"
                >
                  <template #default="{ row }">
                    {{ row.probability }}%
                  </template>
                </el-table-column>
                <el-table-column prop="impact" label="影响" width="100">
                  <template #default="{ row }">
                    <el-rate
                      v-model="row.impact"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="owner" label="负责人" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getRiskStatusType(row.status)" size="small">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default>
                    <el-button type="primary" link size="small">详情</el-button>
                    <el-button type="success" link size="small">处理</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 问题列表 -->
          <el-tab-pane label="问题列表" name="issues">
            <div class="issue-list">
              <el-table :data="riskData.issues" style="width: 100%" border>
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column
                  prop="title"
                  label="问题描述"
                  min-width="180"
                />
                <el-table-column prop="type" label="类型" width="120">
                  <template #default="{ row }">
                    <el-tag :type="getIssueTypeType(row.type)" size="small">
                      {{ row.type }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="priority" label="优先级" width="100">
                  <template #default="{ row }">
                    <el-tag
                      :type="getIssuePriorityType(row.priority)"
                      size="small"
                    >
                      {{ row.priority }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="reporter" label="报告人" width="100" />
                <el-table-column prop="assignee" label="负责人" width="100" />
                <el-table-column
                  prop="createdAt"
                  label="创建时间"
                  width="120"
                />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getIssueStatusType(row.status)" size="small">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default>
                    <el-button type="primary" link size="small">详情</el-button>
                    <el-button type="success" link size="small">解决</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 变更记录 -->
          <el-tab-pane label="变更记录" name="changes">
            <div class="change-list">
              <el-timeline>
                <el-timeline-item
                  v-for="(change, index) in riskData.changes"
                  :key="index"
                  :timestamp="change.date"
                  :type="getChangeType(change.type)"
                >
                  <el-card class="change-card">
                    <template #header>
                      <div class="change-header">
                        <span class="change-title">{{ change.title }}</span>
                        <el-tag size="small" :type="getChangeType(change.type)">
                          {{ change.type }}
                        </el-tag>
                      </div>
                    </template>
                    <div class="change-content">
                      <p>{{ change.description }}</p>
                      <div class="change-meta">
                        <span class="change-requester"
                          >申请人: {{ change.requester }}</span
                        >
                        <span class="change-approver"
                          >审批人: {{ change.approver }}</span
                        >
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps({
  project: Object
});

const activeTab = ref("risks");

// 风险级别标签类型
function getRiskLevelType(level) {
  const levelMap = {
    高: "danger",
    中: "warning",
    低: "info"
  };
  return levelMap[level] || "";
}

// 风险状态标签类型
function getRiskStatusType(status) {
  const statusMap = {
    未处理: "danger",
    处理中: "warning",
    已缓解: "success",
    已关闭: "info"
  };
  return statusMap[status] || "";
}

// 问题类型标签类型
function getIssueTypeType(type) {
  const typeMap = {
    功能问题: "danger",
    性能问题: "warning",
    安全问题: "info",
    兼容性问题: "primary"
  };
  return typeMap[type] || "";
}

// 问题优先级标签类型
function getIssuePriorityType(priority) {
  const priorityMap = {
    紧急: "danger",
    高: "warning",
    中: "info",
    低: "success"
  };
  return priorityMap[priority] || "";
}

// 问题状态标签类型
function getIssueStatusType(status) {
  const statusMap = {
    未解决: "danger",
    处理中: "warning",
    已解决: "success",
    已关闭: "info"
  };
  return statusMap[status] || "";
}

// 变更类型标签类型
function getChangeType(type) {
  const typeMap = {
    范围变更: "danger",
    时间变更: "warning",
    资源变更: "info",
    技术变更: "primary"
  };
  return typeMap[type] || "";
}

// 模拟风险数据，实际应通过API获取
const riskData = ref({
  risks: [
    {
      id: "R001",
      title: "服务器硬件故障风险",
      category: "技术风险",
      level: "高",
      probability: 30,
      impact: 5,
      owner: "赵六",
      status: "已缓解"
    },
    {
      id: "R002",
      title: "项目进度延期风险",
      category: "进度风险",
      level: "中",
      probability: 50,
      impact: 4,
      owner: "张三",
      status: "处理中"
    },
    {
      id: "R003",
      title: "项目预算超支风险",
      category: "财务风险",
      level: "中",
      probability: 40,
      impact: 4,
      owner: "李四",
      status: "未处理"
    },
    {
      id: "R004",
      title: "关键人员离职风险",
      category: "人力风险",
      level: "高",
      probability: 20,
      impact: 5,
      owner: "张三",
      status: "未处理"
    }
  ],
  issues: [
    {
      id: "I001",
      title: "登录页面布局错乱",
      type: "功能问题",
      priority: "高",
      reporter: "王五",
      assignee: "李四",
      createdAt: "2025-03-15",
      status: "已解决"
    },
    {
      id: "I002",
      title: "数据加载速度过慢",
      type: "性能问题",
      priority: "中",
      reporter: "孙七",
      assignee: "赵六",
      createdAt: "2025-03-20",
      status: "处理中"
    },
    {
      id: "I003",
      title: "用户权限控制不完善",
      type: "安全问题",
      priority: "紧急",
      reporter: "周八",
      assignee: "李四",
      createdAt: "2025-03-25",
      status: "未解决"
    }
  ],
  changes: [
    {
      date: "2025-04-10",
      title: "增加新功能模块",
      type: "范围变更",
      description: "应客户要求，增加数据分析报表模块，预计将增加项目工期15天。",
      requester: "张三",
      approver: "王总"
    },
    {
      date: "2025-03-25",
      title: "项目交付日期延期",
      type: "时间变更",
      description:
        "由于前期需求变更和技术难点突破耗时较长，项目交付日期延期一个月。",
      requester: "李四",
      approver: "王总"
    },
    {
      date: "2025-03-10",
      title: "更换数据库技术方案",
      type: "技术变更",
      description:
        "由原计划的MySQL数据库更换为PostgreSQL，以支持更复杂的数据分析需求。",
      requester: "赵六",
      approver: "李四"
    }
  ]
});
</script>

<style scoped>
.project-risks {
  margin-bottom: 24px;
}

.risks-card {
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

.risks-content {
  padding: 8px 0;
}

.risk-tabs {
  margin-bottom: 16px;
}

.risk-list,
.issue-list,
.change-list {
  margin-top: 16px;
}

.change-card {
  margin-bottom: 16px;
}

.change-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.change-title {
  font-size: 15px;
  font-weight: 500;
}

.change-content p {
  margin: 8px 0;
  color: #606266;
}

.change-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
}

.empty-state {
  padding: 30px 0;
}
</style>
