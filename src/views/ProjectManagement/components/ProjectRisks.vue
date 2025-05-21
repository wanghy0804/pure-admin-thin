<template>
  <div class="project-risks">
    <el-card class="risks-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">风险与问题</span>
          <div class="header-actions">
            <el-button
              v-if="activeTab === 'risks'"
              type="primary"
              size="small"
              @click="openAddRiskDialog"
            >
              <el-icon><Plus /></el-icon> 添加风险
            </el-button>
            <el-button
              v-if="activeTab === 'issues'"
              type="primary"
              size="small"
              @click="openAddIssueDialog"
            >
              <el-icon><Plus /></el-icon> 添加问题
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="project" class="risks-content">
        <el-tabs v-model="activeTab" class="risk-tabs centered-tabs" stretch>
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
                <el-table-column prop="impact" label="影响" width="180">
                  <template #default="{ row }">
                    <el-rate
                      :model-value="Number(row.impact)"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                      style="width: 100%"
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
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="openRiskDetail(row)"
                      >详情</el-button
                    >
                    <el-button
                      v-if="row.status !== '已关闭'"
                      type="success"
                      link
                      size="small"
                      @click="openRiskEdit(row)"
                      >处理</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 问题记录 -->
          <el-tab-pane label="问题记录" name="issues">
            <div class="issue-list">
              <ProjectAddIssueDialog
                ref="addIssueDialogRef"
                @submit="handleAddIssueSubmit"
              />
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
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="openIssueDetail(row)"
                    >
                      详情
                    </el-button>
                    <el-button
                      v-if="row.status !== '已关闭'"
                      type="success"
                      link
                      size="small"
                      @click="openIssueSolution(row)"
                    >
                      解决
                    </el-button>
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

    <!-- 添加风险弹窗组件 -->
    <ProjectAddRiskDialog
      ref="addRiskDialogRef"
      @submit="handleAddRiskSubmit"
    />

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="riskDetailDialogVisible"
      :title="detailType === 'risk' ? '风险详情' : '问题详情'"
      width="600px"
      :before-close="
        () => {
          riskDetailDialogVisible = false;
        }
      "
    >
      <el-form v-if="currentRisk && detailType === 'risk'" label-width="100px">
        <el-form-item label="风险描述">
          <el-input :model-value="currentRisk.title" disabled />
        </el-form-item>
        <el-form-item label="风险类别">
          <el-input :model-value="currentRisk.category" disabled />
        </el-form-item>
        <el-form-item label="风险级别">
          <el-select
            :model-value="currentRisk.level"
            disabled
            style="width: 100%"
          >
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生概率">
          <el-input-number :model-value="currentRisk.probability" disabled /> %
        </el-form-item>
        <el-form-item label="影响程度">
          <el-rate
            :model-value="Number(currentRisk.impact)"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input :model-value="currentRisk.owner" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            :model-value="currentRisk.status"
            disabled
            style="width: 100%"
          >
            <el-option label="未处理" value="未处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已缓解" value="已缓解" />
            <el-option label="已解决" value="已解决" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form v-if="currentRisk && detailType === 'issue'" label-width="100px">
        <el-form-item label="问题描述">
          <el-input :model-value="currentRisk.title" disabled />
        </el-form-item>
        <el-form-item label="类型">
          <el-input :model-value="currentRisk.type" disabled />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input :model-value="currentRisk.priority" disabled />
        </el-form-item>
        <el-form-item label="报告人">
          <el-input :model-value="currentRisk.reporter" disabled />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input :model-value="currentRisk.assignee" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            :model-value="currentRisk.status"
            disabled
            style="width: 100%"
          >
            <el-option label="未解决" value="未解决" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已解决" value="已解决" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input :model-value="currentRisk.createdAt" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="riskDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 风险处理弹窗 -->
    <el-dialog
      v-if="currentRisk && detailType === 'risk'"
      v-model="riskEditDialogVisible"
      title="处理风险"
      width="600px"
      :before-close="
        () => {
          riskEditDialogVisible = false;
        }
      "
    >
      <el-form label-width="100px">
        <el-form-item label="风险描述">
          <el-input v-model="currentRisk.title" />
        </el-form-item>
        <el-form-item label="风险类别">
          <el-input v-model="currentRisk.category" />
        </el-form-item>
        <el-form-item label="风险级别">
          <el-select v-model="currentRisk.level" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生概率">
          <el-input-number
            v-model="currentRisk.probability"
            :min="0"
            :max="100"
          />
          %
        </el-form-item>
        <el-form-item label="影响程度">
          <el-rate
            v-model="currentRisk.impact"
            :max="5"
            show-score
            text-color="#ff9900"
            score-template="{value}"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="currentRisk.owner" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentRisk.status" style="width: 100%">
            <el-option label="未处理" value="未处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已缓解" value="已缓解" />
            <el-option label="已解决" value="已解决" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="riskEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRiskEdit">保存</el-button>
      </template>
    </el-dialog>
    <!-- 问题处理弹窗 -->
    <el-dialog
      v-if="currentRisk && detailType === 'issue'"
      v-model="riskEditDialogVisible"
      title="处理问题"
      width="600px"
      :before-close="
        () => {
          riskEditDialogVisible = false;
        }
      "
    >
      <el-form label-width="100px">
        <el-form-item label="问题描述">
          <el-input v-model="currentRisk.title" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="currentRisk.type" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input v-model="currentRisk.priority" />
        </el-form-item>
        <el-form-item label="报告人">
          <el-input v-model="currentRisk.reporter" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="currentRisk.assignee" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentRisk.status" style="width: 100%">
            <el-option label="未解决" value="未解决" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已解决" value="已解决" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="currentRisk.createdAt" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="riskEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRiskEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 问题解决弹窗 -->
    <el-dialog
      v-model="issueSolutionDialogVisible"
      title="问题解决"
      width="600px"
      :before-close="
        () => {
          issueSolutionDialogVisible = false;
        }
      "
    >
      <el-form v-if="currentRisk" label-width="100px">
        <el-form-item label="问题ID">
          <el-input v-model="currentRisk.id" disabled />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="currentRisk.title" />
        </el-form-item>
        <el-form-item label="问题类型">
          <el-select v-model="currentRisk.type" style="width: 100%">
            <el-option label="功能问题" value="功能问题" />
            <el-option label="性能问题" value="性能问题" />
            <el-option label="安全问题" value="安全问题" />
            <el-option label="兼容性问题" value="兼容性问题" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="currentRisk.priority" style="width: 100%">
            <el-option label="紧急" value="紧急" />
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input
            v-model="currentRisk.solution"
            type="textarea"
            :rows="4"
            placeholder="请输入问题解决方案"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="currentRisk.assignee" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentRisk.status" style="width: 100%">
            <el-option label="未解决" value="未解决" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已解决" value="已解决" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="issueSolutionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveIssueSolution">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { defineProps, ref, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import ProjectAddIssueDialog from "./ProjectAddIssueDialog.vue";
import ProjectAddRiskDialog from "./ProjectAddRiskDialog.vue";

// 添加问题弹窗
const addIssueDialogRef = ref();
const openAddIssueDialog = () => {
  addIssueDialogRef.value?.open();
};
function handleAddIssueSubmit(issue) {
  // 添加到 riskData.issues
  const newId = `I${String(riskData.value.issues.length + 1).padStart(3, "0")}`;
  riskData.value.issues.push({
    ...issue,
    id: newId,
    createdAt: new Date().toISOString().slice(0, 10)
  });
}
import type { FormInstance, FormRules } from "element-plus";

const props = defineProps({
  project: Object
});

const activeTab = ref("risks");
const addRiskDialogRef = ref();

// 弹窗控制变量和当前风险数据
const riskDetailDialogVisible = ref(false);
const riskEditDialogVisible = ref(false);
const issueSolutionDialogVisible = ref(false);
const currentRisk = ref<any>(null);

// 打开详情弹窗（风险/问题通用）
const detailType = ref("risk");
function openRiskDetail(row: any) {
  currentRisk.value = cloneDeep(row);
  detailType.value = "risk";
  riskDetailDialogVisible.value = true;
}
function openIssueDetail(row: any) {
  currentRisk.value = cloneDeep(row);
  detailType.value = "issue";
  riskDetailDialogVisible.value = true;
  issueDetailReadonly.value = true;
}
function openIssueEdit(row: any) {
  currentRisk.value = cloneDeep(row);
  riskEditDialogVisible.value = true;
  issueDetailReadonly.value = false;
}

// 打开问题解决弹窗
function openIssueSolution(row: any) {
  currentRisk.value = cloneDeep(row);
  issueSolutionDialogVisible.value = true;
  detailType.value = "issue";
}
const issueDetailReadonly = ref(false);
// 打开编辑弹窗
function openRiskEdit(row: any) {
  currentRisk.value = cloneDeep(row);
  riskEditDialogVisible.value = true;
}
// 保存编辑
function saveRiskEdit() {
  if (!currentRisk.value) return;
  if (detailType.value === "risk") {
    // 查找并更新riskData.risks里对应项
    const idx = riskData.value.risks.findIndex(
      r => r.id === currentRisk.value.id
    );
    if (idx !== -1) {
      riskData.value.risks[idx] = cloneDeep(currentRisk.value);
    }
  } else if (detailType.value === "issue") {
    // 查找并更新riskData.issues里对应项
    const idx = riskData.value.issues.findIndex(
      i => i.id === currentRisk.value.id
    );
    if (idx !== -1) {
      riskData.value.issues[idx] = cloneDeep(currentRisk.value);
    }
  }
  riskEditDialogVisible.value = false;
}

// 保存问题解决
function saveIssueSolution() {
  if (!currentRisk.value) return;
  // 查找并更新riskData.issues里对应项
  const idx = riskData.value.issues.findIndex(
    i => i.id === currentRisk.value.id
  );
  if (idx !== -1) {
    riskData.value.issues[idx] = cloneDeep(currentRisk.value);
  }
  issueSolutionDialogVisible.value = false;
}

// 添加风险弹窗
const openAddRiskDialog = () => {
  addRiskDialogRef.value?.open();
};

function handleAddRiskSubmit(risk) {
  // 添加到 riskData.risks
  const newId = `R${String(riskData.value.risks.length + 1).padStart(3, "0")}`;
  riskData.value.risks.push({ ...risk, id: newId });
}

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
    },
    {
      id: "I004",
      title: "兼容性问题已关闭",
      type: "兼容性问题",
      priority: "低",
      reporter: "张三",
      assignee: "王五",
      createdAt: "2025-04-01",
      status: "已关闭"
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

.centered-tabs .el-tabs__nav-wrap {
  display: flex;
  justify-content: center;
}

.centered-tabs .el-tabs__nav {
  float: none;
  display: inline-flex;
}

.centered-tabs .el-tabs__item {
  padding: 0 20px;
}
</style>
