<template>
  <div class="ProjectManagement-detail">
    <div class="project-header">
      <div class="project-title">
        <h1 v-if="currentProject">
          {{ currentProject.value }}
          <el-tag size="small" type="info" effect="plain" class="project-id">
            项目编号: {{ currentProject.id }}
          </el-tag>
        </h1>
        <h1 v-else-if="latestProject">
          {{ latestProject.value }}
          <el-tag size="small" type="info" effect="plain" class="project-id">
            项目编号: {{ latestProject.id }}
          </el-tag>
        </h1>
        <h1 v-else class="empty-project-title">
          <svg class="folder-icon" viewBox="0 0 24 24" width="32" height="32">
            <path
              fill="#42A5F5"
              d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z"
            />
          </svg>
          <span class="artistic-text">请选择项目</span>
        </h1>
        <div v-if="currentProject || latestProject" class="project-subtitle">
          <el-icon><Calendar /></el-icon>
          <span>创建时间: {{ formatDate(new Date()) }}</span>
          <el-divider direction="vertical" />
          <el-icon><User /></el-icon>
          <span>
            项目经理:
            {{ (currentProject || latestProject).manager || "张三" }}
          </span>
        </div>
      </div>
      <div class="project-actions">
        <el-button type="primary" size="small" class="back-button">
          <router-link to="/ProjectManagement/index" class="back-link">
            <el-icon><Back /></el-icon> 返回项目列表
          </router-link>
        </el-button>
      </div>
    </div>

    <!-- 项目基本信息始终显示 -->
    <div class="project-base-section">
      <ProjectBaseInfo :project="currentProject || latestProject" />
    </div>

    <!-- 其他组件使用选项卡组织 -->
    <div class="project-tabs-section">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="进度与时间线" name="progress">
          <ProjectProgress :project="currentProject || latestProject" />
        </el-tab-pane>

        <el-tab-pane label="任务与工作项" name="tasks">
          <ProjectTasks :project="currentProject || latestProject" />
        </el-tab-pane>

        <el-tab-pane label="资源与预算" name="resources">
          <ProjectResources :project="currentProject || latestProject" />
        </el-tab-pane>

        <el-tab-pane label="风险与问题" name="risks">
          <ProjectRisks :project="currentProject || latestProject" />
        </el-tab-pane>

        <el-tab-pane label="文档与沟通" name="docs">
          <ProjectDocs :project="currentProject || latestProject" />
        </el-tab-pane>

        <el-tab-pane label="统计与报表" name="stats">
          <ProjectStats :project="currentProject || latestProject" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Back, Calendar, User } from "@element-plus/icons-vue";
import ProjectBaseInfo from "./components/ProjectBaseInfo.vue";
import ProjectProgress from "./components/ProjectProgress.vue";
import ProjectTasks from "./components/ProjectTasks.vue";
import ProjectResources from "./components/ProjectResources.vue";
import ProjectRisks from "./components/ProjectRisks.vue";
import ProjectDocs from "./components/ProjectDocs.vue";
import ProjectStats from "./components/ProjectStats.vue";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

// 路由和标签相关
const route = useRoute();
const router = useRouter();

// 接收路由参数
const props = defineProps<{
  id?: string;
}>();

// 当前选中的项目
const currentProject = ref();
const latestProject = ref();
const activeTab = ref("progress"); // 默认选中进度与时间线选项卡

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 模拟获取项目数据，实际应通过接口获取
function fetchProject(projectId: string): any {
  const projectsData = [
    {
      value: "企业级项目管理系统",
      id: "1001",
      manager: "张三",
      projectTime: "2025-05-01",
      department: "技术研发部",
      sales: "李四",
      servicePoints: 5,
      version: "v2.5.1",
      region: "华北",
      productType: "企业级应用",
      deployType: "私有化部署",
      status: "进行中",
      description:
        "这是一个企业级项目管理系统，旨在提高团队协作效率和项目透明度。"
    },
    {
      value: "智能工厂系统",
      id: "1002",
      manager: "李四",
      projectTime: "2025-04-15",
      department: "工业自动化部",
      sales: "王五",
      servicePoints: 8,
      version: "v3.0.0",
      region: "华东",
      productType: "工业系统",
      deployType: "云部署",
      status: "已完成",
      description: "面向工业4.0的智能工厂系统，实现生产全流程数字化管理与监控。"
    },
    {
      value: "医疗健康平台",
      id: "1003",
      manager: "王五",
      projectTime: "2025-03-20",
      department: "医疗健康部",
      sales: "赵六",
      servicePoints: 6,
      version: "v1.8.5",
      region: "华南",
      productType: "医疗平台",
      deployType: "混合部署",
      status: "未开始",
      description:
        "整合医疗资源与健康数据，提供智能化医疗服务与健康管理解决方案。"
    }
  ];
  return projectsData.find(p => p.id === projectId);
}

// 模拟获取最新项目，实际应通过接口获取
function fetchLatestProject(): void {
  // 获取第一个项目作为最新项目
  latestProject.value = {
    value: "企业级项目管理系统",
    id: "1001",
    manager: "张三",
    projectTime: "2025-05-01",
    department: "技术研发部",
    sales: "李四",
    servicePoints: 5,
    version: "v2.5.1",
    region: "华北",
    productType: "企业级应用",
    deployType: "私有化部署",
    status: "进行中",
    description:
      "这是一个企业级项目管理系统，旨在提高团队协作效率和项目透明度。"
  };
}

// 当用户从搜索栏选择项目时
function onProjectSelected(project: any): void {
  currentProject.value = project;

  // 更新路由，但避免重复推送相同的路由
  if (project && project.id) {
    const targetPath = `/ProjectManagement/detail/${project.id}`;
    // 只有当前路由不是目标路由时才进行跳转
    if (route.path !== targetPath) {
      router.push(targetPath);
    }
  }
}

// 更新页面标题
function updateTabTitle(): void {
  // 优先获取当前项目名称，其次尝试最新项目名称
  const projectName = currentProject.value?.value || latestProject.value?.value;

  if (projectName) {
    // 动态设置标签页标题为项目名称
    document.title = projectName;

    // 更新当前路由的 meta.title，这样标签页会显示项目名称
    if (route.meta) {
      route.meta.title = projectName;
    }

    // 如果使用了多标签页管理系统，更新对应标签的标题
    const multiTags = useMultiTagsStoreHook();
    const currentPath = route.path;

    // 查找当前路径对应的标签
    const currentTagIndex = multiTags.multiTags.findIndex(tag => {
      // 精确匹配当前路径
      if (tag.path === currentPath) return true;

      // 对于项目详情页的特殊处理，检查是否为相同的项目详情页
      if (
        tag.name === "ProjectManagementDetail" &&
        route.name === "ProjectManagementDetail"
      ) {
        // 如果路径中都包含项目ID，进一步检查
        const tagId = tag.path.split("/").pop();
        const currentId = currentPath.split("/").pop();
        return tagId === currentId;
      }

      return false;
    });

    if (currentTagIndex !== -1) {
      // 更新找到的标签的标题
      multiTags.multiTags[currentTagIndex].meta.title = projectName;
      // 缓存更新
      multiTags.tagsCache(multiTags.multiTags);
    }
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId, oldId) => {
    // 避免初始化时重复执行
    if (newId === oldId) return;

    if (newId && typeof newId === "string") {
      const project = fetchProject(newId);
      if (project) {
        currentProject.value = project;
      }
    } else {
      // 如果没有 ID 参数，显示最新项目但不重新加载
      if (!currentProject.value && !latestProject.value) {
        fetchLatestProject();
      }
    }
    updateTabTitle();
  },
  { immediate: true }
);

// 监听当前项目变化
watch(
  () => currentProject.value,
  () => {
    updateTabTitle();
  }
);

onMounted(() => {
  // 根据路由参数初始化项目数据
  const routeId = route.params.id;

  if (routeId && typeof routeId === "string") {
    // 有路由参数，加载对应项目
    const project = fetchProject(routeId);
    if (project) {
      currentProject.value = project;
    }
  } else {
    // 没有路由参数，加载最新项目
    fetchLatestProject();
  }

  // 更新标签标题
  updateTabTitle();
});
</script>

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 200% 50%;
  }
}

.ProjectManagement-detail {
  padding: 20px;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  color: #333;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.project-icon-title {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.project-title {
  flex: 1;
}

.project-title h1 {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
  color: #000;
}

.project-id {
  margin-left: 8px;
  font-size: 14px;
  font-weight: normal;
  color: #606266 !important;
  background-color: #f0f0f0 !important;
  border: 1px solid #e0e0e0 !important;
}

.empty-project-title {
  display: flex;
  gap: 16px;
  align-items: center;
  color: #409eff;
}

.folder-icon {
  filter: drop-shadow(0 2px 5px rgb(66 165 245 / 40%));
  animation: pulse 2s infinite ease-in-out;
}

.artistic-text {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: transparent;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgb(33 150 243 / 20%);
  background: linear-gradient(120deg, #42a5f5, #2196f3, #1e88e5);
  background-clip: text;
  animation: shimmer 3s infinite linear;
}

.project-subtitle {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.project-subtitle .el-divider--vertical {
  background-color: #ccc;
}

.project-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.back-button {
  margin-left: 8px;
  color: white !important;
  background-color: #409eff !important;
  border: 1px solid #409eff !important;
}

.back-button:hover {
  background-color: #66b1ff !important;
  border-color: #66b1ff !important;
}

.back-link {
  display: flex;
  gap: 4px;
  align-items: center;
  color: #fff;
  text-decoration: none;
}

.project-search-section {
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

:deep(.project-search-bar .el-input) {
  width: 100%;
}

.project-base-section {
  margin-bottom: 24px;
}

.project-tabs-section {
  margin-bottom: 24px;
}

/* 覆盖 element-plus 的一些样式 */
:deep(.el-tabs--border-card) {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

:deep(.el-tabs__content) {
  padding: 20px;
}

:deep(.el-tabs__header) {
  background-color: #f5f7fa;
}

:deep(.el-tabs__item.is-active) {
  background-color: #fff;
  border-bottom: 2px solid #409eff;
}
</style>
