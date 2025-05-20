<template>
  <div class="project-progress">
    <el-card class="progress-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">进度与时间线</span>
          <el-button type="primary" text size="small">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <div v-if="project" class="progress-content">
        <!-- 项目总体进度 -->
        <div class="overall-progress">
          <h3>项目总体进度 ({{ progressData.completionRate }}%)</h3>
          <el-progress
            :percentage="progressData.completionRate"
            :status="progressData.status"
            :stroke-width="20"
            :format="format"
          />
        </div>

        <!-- 里程碑时间线 -->
        <div class="milestones">
          <h3>里程碑</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(milestone, index) in progressData.milestones"
              :key="index"
              :type="milestone.type"
              :color="milestone.color"
              :timestamp="milestone.date"
              :hollow="milestone.hollow"
            >
              <div class="milestone-content">
                <h4>{{ milestone.title }}</h4>
                <p>{{ milestone.description }}</p>
                <el-tag
                  v-if="milestone.status"
                  :type="milestone.statusType"
                  size="small"
                >
                  {{ milestone.status }}
                </el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 甘特图 -->
        <div class="gantt-chart">
          <h3>甘特图</h3>
          <div class="gantt-container">
            <div class="gantt-header">
              <div class="gantt-task-info">任务</div>
              <div class="gantt-timeline">
                <div
                  v-for="(month, index) in progressData.ganttMonths"
                  :key="index"
                  class="gantt-month"
                >
                  {{ month }}
                </div>
              </div>
            </div>
            <div class="gantt-body">
              <div
                v-for="(task, index) in progressData.ganttTasks"
                :key="index"
                class="gantt-row"
              >
                <div class="gantt-task-info">
                  <div class="task-name">{{ task.name }}</div>
                  <div class="task-owner">{{ task.owner }}</div>
                </div>
                <div class="gantt-timeline">
                  <div
                    class="gantt-bar"
                    :style="{
                      width: task.duration + '%',
                      marginLeft: task.start + '%',
                      backgroundColor: task.color
                    }"
                    :class="{ completed: task.completed }"
                  >
                    {{ task.name }}
                  </div>
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
import { defineProps, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";

const props = defineProps({
  project: Object
});

// 格式化进度条显示
const format = percentage => {
  return percentage === 100 ? "完成" : `${percentage}%`;
};

// 模拟进度数据，实际应通过API获取
const progressData = ref({
  completionRate: 65,
  status: "success", // success/exception/warning
  milestones: [
    {
      title: "项目启动",
      description: "项目正式启动，确定项目范围和目标",
      date: "2025-01-15",
      type: "success",
      color: "#67c23a",
      status: "已完成",
      statusType: "success",
      hollow: false
    },
    {
      title: "需求分析",
      description: "完成需求收集和分析，确定产品功能",
      date: "2025-02-20",
      type: "success",
      color: "#67c23a",
      status: "已完成",
      statusType: "success",
      hollow: false
    },
    {
      title: "设计阶段",
      description: "完成系统架构设计和UI设计",
      date: "2025-03-25",
      type: "primary",
      color: "#409eff",
      status: "进行中",
      statusType: "primary",
      hollow: false
    },
    {
      title: "开发阶段",
      description: "核心功能开发",
      date: "2025-05-30",
      type: "info",
      color: "#909399",
      status: "未开始",
      statusType: "info",
      hollow: true
    },
    {
      title: "测试阶段",
      description: "系统测试和验收",
      date: "2025-07-15",
      type: "info",
      color: "#909399",
      status: "未开始",
      statusType: "info",
      hollow: true
    },
    {
      title: "项目交付",
      description: "系统上线和交付",
      date: "2025-08-30",
      type: "info",
      color: "#909399",
      status: "未开始",
      statusType: "info",
      hollow: true
    }
  ],
  ganttMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"],
  ganttTasks: [
    {
      name: "需求分析",
      owner: "张三",
      start: 0,
      duration: 15,
      color: "#67c23a",
      completed: true
    },
    {
      name: "系统设计",
      owner: "李四",
      start: 12,
      duration: 18,
      color: "#67c23a",
      completed: true
    },
    {
      name: "前端开发",
      owner: "王五",
      start: 25,
      duration: 30,
      color: "#409eff",
      completed: false
    },
    {
      name: "后端开发",
      owner: "赵六",
      start: 25,
      duration: 35,
      color: "#409eff",
      completed: false
    },
    {
      name: "系统测试",
      owner: "测试团队",
      start: 55,
      duration: 20,
      color: "#909399",
      completed: false
    },
    {
      name: "部署上线",
      owner: "运维团队",
      start: 75,
      duration: 15,
      color: "#909399",
      completed: false
    }
  ]
});
</script>

<style scoped>
.project-progress {
  margin-bottom: 24px;
}

.progress-card {
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

.progress-content {
  padding: 8px 0;
}

.overall-progress,
.milestones,
.gantt-chart {
  margin-bottom: 30px;
}

.overall-progress h3,
.milestones h3,
.gantt-chart h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.milestone-content h4 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.milestone-content p {
  margin: 0 0 8px;
  color: #606266;
}

/* 甘特图样式 */
.gantt-container {
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.gantt-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.gantt-task-info {
  width: 150px;
  padding: 10px;
  font-weight: bold;
  border-right: 1px solid #ebeef5;
}

.gantt-timeline {
  position: relative;
  display: flex;
  flex: 1;
}

.gantt-month {
  flex: 1;
  padding: 10px 0;
  text-align: center;
  border-right: 1px solid #ebeef5;
}

.gantt-month:last-child {
  border-right: none;
}

.gantt-body {
  max-height: 300px;
  overflow-y: auto;
}

.gantt-row {
  display: flex;
  height: 60px;
  border-bottom: 1px solid #ebeef5;
}

.gantt-row:last-child {
  border-bottom: none;
}

.gantt-row .gantt-task-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: normal;
}

.task-name {
  margin-bottom: 4px;
  font-weight: 500;
}

.task-owner {
  font-size: 12px;
  color: #909399;
}

.gantt-row .gantt-timeline {
  position: relative;
}

.gantt-bar {
  position: absolute;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: white;
  white-space: nowrap;
  border-radius: 4px;
  transform: translateY(-50%);
}

.gantt-bar.completed {
  background-image: linear-gradient(
    45deg,
    rgb(255 255 255 / 15%) 25%,
    transparent 25%,
    transparent 50%,
    rgb(255 255 255 / 15%) 50%,
    rgb(255 255 255 / 15%) 75%,
    transparent 75%,
    transparent
  );
  background-size: 16px 16px;
}

.empty-state {
  padding: 30px 0;
}
</style>
