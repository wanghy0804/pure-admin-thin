<template>
  <div class="project-stats">
    <el-card class="stats-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">统计与报表</span>
          <div class="header-actions">
            <el-button type="primary" size="small">
              <el-icon><Download /></el-icon> 导出报表
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="project" class="stats-content">
        <!-- 项目概览数据卡片 -->
        <div class="stats-overview">
          <el-row :gutter="20">
            <el-col
              v-for="(item, index) in overviewData"
              :key="index"
              :span="6"
            >
              <el-card shadow="hover" class="overview-card">
                <div class="overview-item">
                  <div
                    class="overview-icon"
                    :style="{ backgroundColor: item.color }"
                  >
                    <el-icon><component :is="item.icon" /></el-icon>
                  </div>
                  <div class="overview-info">
                    <div class="overview-title">{{ item.title }}</div>
                    <div class="overview-value">{{ item.value }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 图表区域 -->
        <div class="stats-charts">
          <el-row :gutter="20">
            <!-- 进度趋势图 -->
            <el-col :span="12">
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">项目进度趋势</div>
                </template>
                <div ref="progressChartRef" class="chart-container">
                  <!-- 这里将渲染进度趋势图 -->
                  <div class="chart-placeholder">进度趋势图将在这里显示</div>
                </div>
              </el-card>
            </el-col>

            <!-- 任务完成情况图 -->
            <el-col :span="12">
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">任务完成情况</div>
                </template>
                <div ref="taskChartRef" class="chart-container">
                  <!-- 这里将渲染任务完成情况图 -->
                  <div class="chart-placeholder">
                    任务完成情况图将在这里显示
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mt-20">
            <!-- 资源使用情况图 -->
            <el-col :span="12">
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">资源使用情况</div>
                </template>
                <div ref="resourceChartRef" class="chart-container">
                  <!-- 这里将渲染资源使用情况图 -->
                  <div class="chart-placeholder">
                    资源使用情况图将在这里显示
                  </div>
                </div>
              </el-card>
            </el-col>

            <!-- 风险分析图 -->
            <el-col :span="12">
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">风险分析</div>
                </template>
                <div ref="riskChartRef" class="chart-container">
                  <!-- 这里将渲染风险分析图 -->
                  <div class="chart-placeholder">风险分析图将在这里显示</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 项目关键指标 -->
        <div class="stats-kpi mt-20">
          <el-card>
            <template #header>
              <div class="chart-header">项目关键指标 (KPI)</div>
            </template>
            <el-table :data="kpiData" style="width: 100%" border>
              <el-table-column prop="name" label="指标名称" width="180" />
              <el-table-column prop="target" label="目标值" width="120" />
              <el-table-column prop="actual" label="实际值" width="120" />
              <el-table-column prop="variance" label="偏差" width="120">
                <template #default="{ row }">
                  <span :class="getVarianceClass(row.variance)">{{
                    row.variance
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)" size="small">{{
                    row.status
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="trend" label="趋势" width="120">
                <template #default="{ row }">
                  <el-icon :color="getTrendColor(row.trend)">
                    <component :is="getTrendIcon(row.trend)" />
                  </el-icon>
                  {{ row.trend }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-empty description="请选择项目" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import {
  Download,
  Histogram,
  Calendar,
  User,
  Money,
  TrendCharts,
  CaretTop,
  CaretBottom,
  Minus
} from "@element-plus/icons-vue";

const props = defineProps({
  project: Object
});

// 项目概览数据
const overviewData = ref([
  {
    title: "总进度",
    value: "75%",
    icon: "Histogram",
    color: "#409eff"
  },
  {
    title: "剩余天数",
    value: "45天",
    icon: "Calendar",
    color: "#67c23a"
  },
  {
    title: "团队成员",
    value: "12人",
    icon: "User",
    color: "#e6a23c"
  },
  {
    title: "预算使用",
    value: "68%",
    icon: "Money",
    color: "#f56c6c"
  }
]);

// KPI 数据
const kpiData = ref([
  {
    name: "进度指数 (SPI)",
    target: "1.0",
    actual: "0.95",
    variance: "-0.05",
    status: "较好",
    trend: "上升"
  },
  {
    name: "成本指数 (CPI)",
    target: "1.0",
    actual: "1.05",
    variance: "+0.05",
    status: "良好",
    trend: "上升"
  },
  {
    name: "质量缺陷密度",
    target: "<2.0",
    actual: "1.8",
    variance: "+0.2",
    status: "良好",
    trend: "稳定"
  },
  {
    name: "客户满意度",
    target: ">4.5",
    actual: "4.3",
    variance: "-0.2",
    status: "一般",
    trend: "下降"
  },
  {
    name: "风险处理率",
    target: ">90%",
    actual: "85%",
    variance: "-5%",
    status: "一般",
    trend: "稳定"
  }
]);

// 获取偏差的样式类
function getVarianceClass(variance) {
  if (variance.startsWith("+")) {
    return "variance-positive";
  } else if (variance.startsWith("-")) {
    return "variance-negative";
  }
  return "variance-neutral";
}

// 获取状态类型
function getStatusType(status) {
  const statusMap = {
    良好: "success",
    较好: "primary",
    一般: "warning",
    较差: "danger",
    严重: "danger"
  };
  return statusMap[status] || "info";
}

// 获取趋势图标
function getTrendIcon(trend) {
  const trendMap = {
    上升: "CaretTop",
    下降: "CaretBottom",
    稳定: "Minus"
  };
  return trendMap[trend] || "TrendCharts";
}

// 获取趋势颜色
function getTrendColor(trend) {
  const colorMap = {
    上升: "#67c23a",
    下降: "#f56c6c",
    稳定: "#909399"
  };
  return colorMap[trend] || "#409eff";
}

// 注意: 实际项目中应该在这里使用 ECharts 或其他图表库来渲染图表
// 由于简化考虑，这里只展示占位符
</script>

<style scoped>
.project-stats {
  margin-bottom: 24px;
}

.stats-card {
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

.stats-content {
  padding: 8px 0;
}

.stats-overview {
  margin-bottom: 20px;
}

.overview-card {
  margin-bottom: 10px;
  border-radius: 8px;
}

.overview-item {
  display: flex;
  gap: 16px;
  align-items: center;
}

.overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 24px;
  color: white;
  border-radius: 8px;
}

.overview-info {
  flex: 1;
}

.overview-title {
  margin-bottom: 4px;
  font-size: 14px;
  color: #909399;
}

.overview-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.chart-card {
  height: 300px;
  margin-bottom: 10px;
}

.chart-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 230px;
}

.chart-placeholder {
  font-style: italic;
  color: #909399;
}

.mt-20 {
  margin-top: 20px;
}

.variance-positive {
  font-weight: 500;
  color: #67c23a;
}

.variance-negative {
  font-weight: 500;
  color: #f56c6c;
}

.variance-neutral {
  font-weight: 500;
  color: #909399;
}

.empty-state {
  padding: 30px 0;
}
</style>
