<template>
  <div class="project-resources">
    <el-card class="resources-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">资源与预算</span>
          <el-button type="primary" text size="small">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <div v-if="project" class="resources-content">
        <el-row :gutter="20">
          <!-- 预算概览 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <div class="budget-overview">
              <h3>预算概览</h3>
              <div class="budget-cards">
                <el-card shadow="hover" class="budget-card total-budget">
                  <div class="budget-card-content">
                    <div class="budget-card-title">总预算</div>
                    <div class="budget-card-amount">
                      {{ resourceData.totalBudget }}
                    </div>
                    <div class="budget-card-unit">元</div>
                  </div>
                </el-card>
                <el-card shadow="hover" class="budget-card used-budget">
                  <div class="budget-card-content">
                    <div class="budget-card-title">已消耗</div>
                    <div class="budget-card-amount">
                      {{ resourceData.usedBudget }}
                    </div>
                    <div class="budget-card-unit">
                      元 ({{ resourceData.usedPercentage }}%)
                    </div>
                  </div>
                </el-card>
                <el-card shadow="hover" class="budget-card remaining-budget">
                  <div class="budget-card-content">
                    <div class="budget-card-title">剩余预算</div>
                    <div class="budget-card-amount">
                      {{ resourceData.remainingBudget }}
                    </div>
                    <div class="budget-card-unit">元</div>
                  </div>
                </el-card>
              </div>
              <div class="budget-progress">
                <div class="progress-label">预算消耗进度</div>
                <el-progress
                  :percentage="resourceData.usedPercentage"
                  :color="getBudgetColor(resourceData.usedPercentage)"
                  :format="format"
                  :stroke-width="15"
                />
              </div>
            </div>
          </el-col>

          <!-- 预算分配图表 -->
          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <div class="budget-allocation">
              <h3>预算分配</h3>
              <div class="chart-container">
                <div class="pie-chart">
                  <!-- 模拟图表，实际应使用ECharts等图表库 -->
                  <div class="pie-segments">
                    <div
                      v-for="(segment, index) in resourceData.budgetAllocation"
                      :key="index"
                      class="pie-segment"
                      :style="{
                        backgroundColor: segment.color,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        margin: '0 10px'
                      }"
                    />
                  </div>
                  <div class="pie-legend">
                    <div
                      v-for="(segment, index) in resourceData.budgetAllocation"
                      :key="index"
                      class="legend-item"
                    >
                      <div
                        class="legend-color"
                        :style="{ backgroundColor: segment.color }"
                      />
                      <div class="legend-label">
                        {{ segment.name }}: {{ segment.percentage }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 成本偏差分析 -->
        <el-row :gutter="20" class="cost-variance">
          <el-col :span="24">
            <h3>成本偏差分析</h3>
            <el-table
              :data="resourceData.costVariance"
              style="width: 100%"
              border
            >
              <el-table-column prop="category" label="类别" width="180" />
              <el-table-column
                prop="planned"
                label="计划成本(元)"
                width="150"
              />
              <el-table-column prop="actual" label="实际成本(元)" width="150" />
              <el-table-column prop="variance" label="偏差(元)" width="120" />
              <el-table-column
                prop="variancePercentage"
                label="偏差百分比"
                width="120"
              >
                <template #default="{ row }">
                  <span
                    :class="{
                      'over-budget': row.variancePercentage > 0,
                      'under-budget': row.variancePercentage < 0
                    }"
                  >
                    {{ row.variancePercentage > 0 ? "+" : ""
                    }}{{ row.variancePercentage }}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="偏差图示" min-width="200">
                <template #default="{ row }">
                  <div class="variance-bar-container">
                    <div
                      class="variance-bar"
                      :class="{
                        'over-budget': row.variancePercentage > 0,
                        'under-budget': row.variancePercentage < 0
                      }"
                      :style="{ width: Math.abs(row.variancePercentage) + '%' }"
                    />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <!-- 人力资源分配 -->
        <el-row :gutter="20" class="human-resources">
          <el-col :span="24">
            <h3>人力资源分配</h3>
            <div class="team-allocation">
              <div
                v-for="(member, index) in resourceData.teamAllocation"
                :key="index"
                class="team-member"
              >
                <el-card shadow="hover" class="member-card">
                  <div class="member-info">
                    <el-avatar :size="50">{{
                      member.name.charAt(0)
                    }}</el-avatar>
                    <div class="member-details">
                      <div class="member-name">{{ member.name }}</div>
                      <div class="member-role">{{ member.role }}</div>
                    </div>
                  </div>
                  <div class="member-allocation">
                    <div class="allocation-label">项目分配率</div>
                    <el-progress
                      :percentage="member.allocation"
                      :color="getAllocationColor(member.allocation)"
                    />
                  </div>
                </el-card>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else class="empty-state">
        <el-empty description="请选择项目" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";

const props = defineProps({
  project: Object
});

// 格式化进度条显示
const format = percentage => {
  return `${percentage}%`;
};

// 根据预算消耗百分比返回不同颜色
function getBudgetColor(percentage) {
  if (percentage < 50) return "#67c23a";
  if (percentage < 80) return "#e6a23c";
  return "#f56c6c";
}

// 根据人力分配百分比返回不同颜色
function getAllocationColor(percentage) {
  if (percentage < 50) return "#409eff";
  if (percentage < 80) return "#e6a23c";
  return "#f56c6c";
}

// 模拟资源数据，实际应通过API获取
const resourceData = ref({
  totalBudget: 1000000,
  usedBudget: 650000,
  remainingBudget: 350000,
  usedPercentage: 65,
  budgetAllocation: [
    { name: "设备采购", percentage: 30, color: "#409eff" },
    { name: "人力成本", percentage: 45, color: "#67c23a" },
    { name: "软件许可", percentage: 15, color: "#e6a23c" },
    { name: "服务费用", percentage: 10, color: "#f56c6c" }
  ],
  costVariance: [
    {
      category: "设备采购",
      planned: 300000,
      actual: 320000,
      variance: 20000,
      variancePercentage: 6.67
    },
    {
      category: "人力成本",
      planned: 450000,
      actual: 420000,
      variance: -30000,
      variancePercentage: -6.67
    },
    {
      category: "软件许可",
      planned: 150000,
      actual: 160000,
      variance: 10000,
      variancePercentage: 6.67
    },
    {
      category: "服务费用",
      planned: 100000,
      actual: 95000,
      variance: -5000,
      variancePercentage: -5.0
    }
  ],
  teamAllocation: [
    { name: "张三", role: "项目经理", allocation: 90 },
    { name: "李四", role: "技术负责人", allocation: 85 },
    { name: "王五", role: "前端开发", allocation: 70 },
    { name: "赵六", role: "后端开发", allocation: 75 },
    { name: "孙七", role: "测试工程师", allocation: 60 },
    { name: "周八", role: "运维工程师", allocation: 40 }
  ]
});
</script>

<style scoped>


@media (width <= 1200px) {
  .team-member {
    flex: 0 0 calc(50% - 16px);
  }
}

@media (width <= 768px) {
  .team-member {
    flex: 0 0 100%;
  }
}

.project-resources {
  margin-bottom: 24px;
}

.resources-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.font-medium {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.resources-content {
  padding: 8px 0;
}

.resources-content h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

/* 预算概览样式 */
.budget-overview {
  margin-bottom: 24px;
}

.budget-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.budget-card {
  padding: 8px;
}

.budget-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.budget-card-title {
  margin-bottom: 8px;
  font-size: 14px;
  color: #909399;
}

.budget-card-amount {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.budget-card-unit {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.total-budget .budget-card-amount {
  color: #409eff;
}

.used-budget .budget-card-amount {
  color: #e6a23c;
}

.remaining-budget .budget-card-amount {
  color: #67c23a;
}

.budget-progress {
  margin-top: 16px;
}

.progress-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

/* 预算分配图表样式 */
.budget-allocation {
  margin-bottom: 24px;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.pie-segments {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.pie-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.legend-color {
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 2px;
}

.legend-label {
  font-size: 14px;
  color: #606266;
}

/* 成本偏差分析样式 */
.cost-variance {
  margin-top: 24px;
  margin-bottom: 24px;
}

.over-budget {
  color: #f56c6c;
}

.under-budget {
  color: #67c23a;
}

.variance-bar-container {
  position: relative;
  height: 16px;
  overflow: hidden;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.variance-bar {
  position: absolute;
  left: 50%;
  height: 100%;
  transform: translateX(-50%);
}

.variance-bar.over-budget {
  background-color: #f56c6c;
}

.variance-bar.under-budget {
  background-color: #67c23a;
}

/* 人力资源分配样式 */
.human-resources {
  margin-top: 24px;
}

.team-allocation {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.team-member {
  flex: 0 0 calc(33.333% - 16px);
}

.member-card {
  height: 100%;
}

.member-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.member-details {
  margin-left: 12px;
}

.member-name {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.member-role {
  font-size: 14px;
  color: #909399;
}

.member-allocation {
  margin-top: 8px;
}

.allocation-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.empty-state {
  padding: 30px 0;
}
</style>
