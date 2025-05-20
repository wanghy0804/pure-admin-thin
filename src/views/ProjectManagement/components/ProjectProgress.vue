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
          <div class="section-header">
            <h3>里程碑</h3>
            <el-button type="primary" size="small" @click="openMilestoneDialog">
              <el-icon><Plus /></el-icon> 添加里程碑
            </el-button>
          </div>
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
                <div class="milestone-header">
                  <h4>{{ milestone.title }}</h4>
                  <div class="milestone-actions">
                    <el-button
                      type="primary"
                      text
                      size="small"
                      @click="editMilestone(index)"
                    >
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button
                      type="danger"
                      text
                      size="small"
                      @click="deleteMilestone(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
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
          <div class="section-header">
            <h3>甘特图</h3>
            <el-tooltip content="甘特图根据里程碑自动生成" placement="top">
              <el-button type="info" size="small" plain>
                <el-icon><InfoFilled /></el-icon> 自动生成
              </el-button>
            </el-tooltip>
          </div>
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
                  <div class="task-header">
                    <div class="task-name">{{ task.title }}</div>
                  </div>
                  <div class="task-owner">
                    <el-tag size="small" :type="task.statusType">
                      {{ task.status }}
                    </el-tag>
                  </div>
                </div>
                <div class="gantt-timeline">
                  <div
                    class="gantt-bar"
                    :style="{
                      width: task.duration + '%',
                      marginLeft: task.start + '%',
                      backgroundColor: task.color
                    }"
                    :class="{ completed: task.statusType === 'success' }"
                  >
                    {{ task.title }}
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

    <!-- 里程碑弹框 -->
    <el-dialog
      v-model="milestoneDialogVisible"
      :title="isEditing ? '编辑里程碑' : '添加里程碑'"
      width="500px"
    >
      <el-form :model="milestoneForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input
            v-model="milestoneForm.title"
            placeholder="请输入里程碑标题"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="milestoneForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述信息"
          />
        </el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker
            v-model="milestoneForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="milestoneForm.statusType" style="width: 100%">
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="milestoneDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMilestone">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 任务弹框 -->
    <el-dialog
      v-model="taskDialogVisible"
      :title="isEditing ? '编辑任务' : '添加任务'"
      width="500px"
    >
      <el-form :model="taskForm" label-width="100px">
        <el-form-item label="任务名称" required>
          <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="负责人" required>
          <el-input v-model="taskForm.owner" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="开始位置">
          <el-slider v-model="taskForm.start" :max="100" :step="1" show-input />
        </el-form-item>
        <el-form-item label="持续时间">
          <el-slider
            v-model="taskForm.duration"
            :max="50"
            :min="5"
            :step="1"
            show-input
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="taskForm.statusType" style="width: 100%">
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否完成">
          <el-switch v-model="taskForm.completed" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="taskDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTask">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, reactive, computed } from "vue";
import {
  Refresh,
  Plus,
  Edit,
  Delete,
  InfoFilled
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps({
  project: Object
});

// 格式化进度条显示
const format = percentage => {
  return percentage === 100 ? "完成" : `${percentage}%`;
};

// 弹框显示状态
const milestoneDialogVisible = ref(false);
const isEditing = ref(false);
const editIndex = ref(-1);

// 表单数据
const milestoneForm = reactive({
  title: "",
  description: "",
  date: "",
  statusType: "info"
});

// 状态选项
const statusOptions = [
  { label: "已完成", value: "success" },
  { label: "进行中", value: "primary" },
  { label: "未开始", value: "info" },
  { label: "警告", value: "warning" },
  { label: "错误", value: "danger" }
];

// 打开里程碑弹框
const openMilestoneDialog = () => {
  resetMilestoneForm();
  isEditing.value = false;
  milestoneDialogVisible.value = true;
};

// 重置里程碑表单
const resetMilestoneForm = () => {
  milestoneForm.title = "";
  milestoneForm.description = "";
  milestoneForm.date = "";
  milestoneForm.statusType = "info";
};

// 编辑里程碑
const editMilestone = index => {
  const milestone = progressData.value.milestones[index];
  milestoneForm.title = milestone.title;
  milestoneForm.description = milestone.description;
  milestoneForm.date = milestone.date;
  milestoneForm.statusType = milestone.statusType;

  isEditing.value = true;
  editIndex.value = index;
  milestoneDialogVisible.value = true;
};

// 从里程碑生成甘特图任务
const generateGanttTasks = milestones => {
  if (!milestones || milestones.length === 0) return [];

  // 获取日期范围
  const dates = milestones.map(m => new Date(m.date)).sort((a, b) => a - b);
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // 生成甘特图任务
  return milestones.map((milestone, index) => {
    const milestoneDate = new Date(milestone.date);
    const daysSinceStart = Math.ceil(
      (milestoneDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const start = Math.floor((daysSinceStart / totalDays) * 100);

    // 计算持续时间，确保不重叠
    let duration;
    if (index < milestones.length - 1) {
      const nextDate = new Date(milestones[index + 1].date);
      const daysToNext = Math.ceil(
        (nextDate - milestoneDate) / (1000 * 60 * 60 * 24)
      );
      duration = Math.floor((daysToNext / totalDays) * 100) - 2; // 减2为了留间隔
    } else {
      duration = 15; // 最后一个里程碑固定持续时间
    }

    return {
      ...milestone,
      start,
      duration: Math.max(5, duration) // 确保持续时间至少为5
    };
  });
};

// 删除里程碑
const deleteMilestone = index => {
  ElMessageBox.confirm("确定要删除这个里程碑吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      progressData.value.milestones.splice(index, 1);
      // 更新甘特图月份
      progressData.value.ganttMonths = generateMonths(
        progressData.value.milestones
      );
      ElMessage({
        type: "success",
        message: "删除成功"
      });
    })
    .catch(() => {
      // 取消删除
    });
};

// 保存里程碑
const saveMilestone = () => {
  // 表单验证
  if (!milestoneForm.title || !milestoneForm.date) {
    ElMessage.error("请填写必要的信息");
    return;
  }

  const newMilestone = {
    title: milestoneForm.title,
    description: milestoneForm.description,
    date: milestoneForm.date,
    statusType: milestoneForm.statusType
  };

  if (isEditing.value) {
    // 更新现有里程碑
    const enhancedMilestone = enhanceMilestones([newMilestone])[0];
    progressData.value.milestones[editIndex.value] = enhancedMilestone;
  } else {
    // 添加新里程碑
    const enhancedMilestone = enhanceMilestones([newMilestone])[0];
    progressData.value.milestones.push(enhancedMilestone);
  }

  // 按日期排序
  progressData.value.milestones.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // 更新甘特图月份和任务
  progressData.value.ganttMonths = generateMonths(
    progressData.value.milestones
  );
  updateGanttTasks();

  milestoneDialogVisible.value = false;
  ElMessage({
    type: "success",
    message: isEditing.value ? "更新成功" : "添加成功"
  });
};

// 模拟进度数据，实际应通过API获取
// 状态颜色映射
const statusColorMap = {
  success: "#67c23a", // 绿色 - 已完成
  primary: "#409eff", // 蓝色 - 进行中
  info: "#909399", // 灰色 - 未开始
  warning: "#e6a23c", // 黄色 - 警告
  danger: "#f56c6c" // 红色 - 错误
};

// 里程碑数据
const milestones = [
  {
    title: "项目启动",
    description: "项目正式启动，确定项目范围和目标",
    date: "2025-01-15",
    statusType: "success"
  },
  {
    title: "需求分析",
    description: "完成需求收集和分析，确定产品功能",
    date: "2025-02-20",
    statusType: "success"
  },
  {
    title: "设计阶段",
    description: "完成系统架构设计和UI设计",
    date: "2025-03-25",
    statusType: "primary"
  },
  {
    title: "开发阶段",
    description: "核心功能开发",
    date: "2025-05-30",
    statusType: "info"
  },
  {
    title: "测试阶段",
    description: "系统测试和验收",
    date: "2025-07-15",
    statusType: "info"
  },
  {
    title: "项目交付",
    description: "系统上线和交付",
    date: "2025-08-30",
    statusType: "info"
  }
];

// 自动生成月份
const generateMonths = milestones => {
  if (!milestones || milestones.length === 0) return [];

  // 提取所有日期并排序
  const dates = milestones.map(m => new Date(m.date)).sort((a, b) => a - b);

  // 获取最早和最晚的日期
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // 计算需要显示的月份数量
  const monthDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth() +
    1;

  // 生成月份数组
  const months = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < monthDiff; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    months.push(`${year * 100 + month}`.padStart(4, "0"));

    // 移动到下个月
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
};

// 为里程碑和任务添加类型和颜色
const enhanceMilestones = milestones => {
  return milestones.map(milestone => {
    const type = milestone.statusType;
    return {
      ...milestone,
      type,
      color: statusColorMap[type]
    };
  });
};

// 处理后的数据
const processedMilestones = enhanceMilestones(milestones);
const ganttMonthsData = generateMonths(milestones);

// 使用computed属性自动生成甘特图任务
const progressData = ref({
  completionRate: 65,
  status: "success", // success/exception/warning
  milestones: processedMilestones,
  ganttMonths: ganttMonthsData,
  ganttTasks: generateGanttTasks(processedMilestones)
});

// 监听里程碑变化，自动更新甘特图任务
const updateGanttTasks = () => {
  progressData.value.ganttTasks = generateGanttTasks(
    progressData.value.milestones
  );
};
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

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.milestone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.milestone-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.milestone-actions {
  display: flex;
  gap: 4px;
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

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.task-name {
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.task-actions:hover {
  opacity: 1;
}

.task-owner {
  font-size: 12px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
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
