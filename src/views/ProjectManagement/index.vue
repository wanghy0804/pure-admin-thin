<template>
  <div class="project-management-container">
    <div class="page-header">
      <div class="header-title">
        <h2 class="text-text_color_primary">项目管理</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreateProject">
          <IconifyIconOffline :icon="AddLine" class="mr-5px" />
          新建项目
        </el-button>
      </div>
    </div>

    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="项目名称">
          <el-input
            v-model="filterForm.name"
            placeholder="请输入项目名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="事业部">
          <el-select
            v-model="filterForm.department"
            placeholder="请选择事业部"
            clearable
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="project-list">
      <el-row :gutter="20">
        <el-col
          v-for="project in projectList"
          :key="project.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="6"
        >
          <div :class="cardClass(project)">
            <div class="project-card-item_detail bg-bg_color">
              <el-row justify="space-between">
                <div :class="cardLogoClass(project)">
                  <DocumentIcon v-if="project.type === 1" />
                  <CalendarIcon v-if="project.type === 2" />
                  <ServiceIcon v-if="project.type === 3" />
                  <TeamIcon v-if="project.type === 4" />
                  <LaptopIcon v-if="project.type === 5" />
                </div>
                <div class="project-card-item_detail--operation">
                  <el-tag
                    :color="project.status === 1 ? '#00a870' : '#eee'"
                    effect="dark"
                    class="mx-1 project-card-item_detail--operation--tag"
                  >
                    {{ project.status === 1 ? "进行中" : "已完成" }}
                  </el-tag>
                  <el-dropdown trigger="click">
                    <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="handleViewProject(project)">
                          查看
                        </el-dropdown-item>
                        <el-dropdown-item @click="handleEditProject(project)">
                          编辑
                        </el-dropdown-item>
                        <el-dropdown-item @click="handleDeleteProject(project)">
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </el-row>
              <p class="project-card-item_detail--name text-text_color_primary">
                {{ project.name }}
              </p>
              <p class="project-card-item_detail--desc text-text_color_regular">
                {{ project.description }}
              </p>
              <div class="project-card-item_detail--footer">
                <div class="project-card-item_detail--info">
                  <span class="info-label">事业部：</span>
                  <span class="info-value">{{
                    getDepartmentLabel(project.department)
                  }}</span>
                </div>
                <div class="project-card-item_detail--info">
                  <span class="info-label">立项时间：</span>
                  <span class="info-value">{{
                    formatDate(project.projectTime)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[8, 16, 24, 32]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import IconifyIconOffline from "@/components/ReIcon/src/iconifyIconOffline";
import AddLine from "~icons/ri/add-line";
import More2Fill from "~icons/ri/more-2-fill";

// 导入图标组件
const DocumentIcon = defineComponent({
  name: "DocumentIcon",
  render() {
    return h("div", { class: "icon-wrapper" }, [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        [
          h("path", {
            d: "M14 3v4a1 1 0 001 1h4",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          })
        ]
      )
    ]);
  }
});

const CalendarIcon = defineComponent({
  name: "CalendarIcon",
  render() {
    return h("div", { class: "icon-wrapper" }, [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        [
          h("rect", {
            x: "3",
            y: "4",
            width: "18",
            height: "18",
            rx: "2",
            stroke: "currentColor",
            "stroke-width": "2"
          }),
          h("path", {
            d: "M16 2v4",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M8 2v4",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M3 10h18",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          })
        ]
      )
    ]);
  }
});

const ServiceIcon = defineComponent({
  name: "ServiceIcon",
  render() {
    return h("div", { class: "icon-wrapper" }, [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        [
          h("path", {
            d: "M12 15a3 3 0 100-6 3 3 0 000 6z",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
            stroke: "currentColor",
            "stroke-width": "2"
          })
        ]
      )
    ]);
  }
});

const TeamIcon = defineComponent({
  name: "TeamIcon",
  render() {
    return h("div", { class: "icon-wrapper" }, [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        [
          h("path", {
            d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("circle", {
            cx: "9",
            cy: "7",
            r: "4",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M23 21v-2a4 4 0 00-3-3.87",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M16 3.13a4 4 0 010 7.75",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          })
        ]
      )
    ]);
  }
});

const LaptopIcon = defineComponent({
  name: "LaptopIcon",
  render() {
    return h("div", { class: "icon-wrapper" }, [
      h(
        "svg",
        {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        [
          h("path", {
            d: "M20 16H4V6a2 2 0 012-2h12a2 2 0 012 2v10z",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }),
          h("path", {
            d: "M2 16h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z",
            stroke: "currentColor",
            "stroke-width": "2"
          })
        ]
      )
    ]);
  }
});

// 定义组件名称
defineOptions({
  name: "ProjectManagementIndex"
});

// 路由
const router = useRouter();

// 定义项目类型接口
interface ProjectType {
  id: number;
  name: string;
  description: string;
  department: number;
  status: number; // 1: 进行中, 2: 已完成
  type: number; // 1: 文档, 2: 日程, 3: 服务, 4: 团队, 5: 设备
  projectTime: string;
  sales: string;
  servicePoints: number;
  region: string[];
}

// 部门选项
const departmentOptions = [
  { value: 1, label: "技术部" },
  { value: 2, label: "市场部" },
  { value: 3, label: "销售部" },
  { value: 4, label: "产品部" },
  { value: 5, label: "运营部" }
];

// 状态选项
const statusOptions = [
  { value: 1, label: "进行中" },
  { value: 2, label: "已完成" }
];

// 获取部门标签
const getDepartmentLabel = (value: number): string => {
  const option = departmentOptions.find(item => item.value === value);
  return option ? option.label : "未知";
};

// 格式化日期
const formatDate = (date: string): string => {
  return dayjs(date).format("YYYY-MM-DD");
};

// 筛选表单
const filterForm = ref({
  name: "",
  department: "",
  status: ""
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(8);
const total = ref(0);

// 项目列表数据
const projectList = ref<ProjectType[]>([
  {
    id: 1,
    name: "企业信息管理系统",
    description: "为企业提供全面的信息管理解决方案，包括人事、财务、库存等模块",
    department: 1,
    status: 1,
    type: 1,
    projectTime: "2025-01-15",
    sales: "张三",
    servicePoints: 5,
    region: ["华东", "上海"]
  },
  {
    id: 2,
    name: "智慧校园平台",
    description: "为学校提供智能化管理平台，整合教学、学生管理、校园安全等功能",
    department: 4,
    status: 1,
    type: 2,
    projectTime: "2025-02-20",
    sales: "李四",
    servicePoints: 8,
    region: ["华北", "北京"]
  },
  {
    id: 3,
    name: "医疗数据分析系统",
    description:
      "为医疗机构提供数据分析工具，帮助医院优化资源配置和提高诊疗效率",
    department: 2,
    status: 2,
    type: 3,
    projectTime: "2024-11-05",
    sales: "王五",
    servicePoints: 12,
    region: ["华南", "广州"]
  },
  {
    id: 4,
    name: "智能物流追踪系统",
    description: "为物流企业提供实时追踪和管理解决方案，优化配送路线和提高效率",
    department: 3,
    status: 1,
    type: 4,
    projectTime: "2025-03-10",
    sales: "赵六",
    servicePoints: 6,
    region: ["西南", "成都"]
  },
  {
    id: 5,
    name: "金融风控平台",
    description: "为金融机构提供风险控制和监管合规解决方案，保障业务安全和稳定",
    department: 5,
    status: 1,
    type: 5,
    projectTime: "2025-04-18",
    sales: "孙七",
    servicePoints: 9,
    region: ["华中", "武汉"]
  },
  {
    id: 6,
    name: "智慧社区管理系统",
    description:
      "为社区提供智能化管理平台，包括访客管理、物业服务、社区活动等功能",
    department: 1,
    status: 2,
    type: 2,
    projectTime: "2024-12-25",
    sales: "周八",
    servicePoints: 4,
    region: ["东北", "沈阳"]
  }
]);

// 卡片样式计算属性
const cardClass = (project: ProjectType) => [
  "project-card-item",
  { "project-card-item__completed": project.status === 2 }
];

const cardLogoClass = (project: ProjectType) => [
  "project-card-item_detail--logo",
  { "project-card-item_detail--logo__disabled": project.status === 2 }
];

// 生命周期钩子
onMounted(() => {
  // 模拟获取数据
  total.value = projectList.value.length;
});

// 方法
const handleCreateProject = () => {
  router.push("/ProjectManagement/create");
};

const handleViewProject = (project: ProjectType) => {
  router.push(`/ProjectManagement/detail?id=${project.id}`);
};

const handleEditProject = (project: ProjectType) => {
  router.push(`/ProjectManagement/edit?id=${project.id}`);
};

const handleDeleteProject = (project: ProjectType) => {
  ElMessageBox.confirm(`确定要删除项目 "${project.name}" 吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // 模拟删除操作
      const index = projectList.value.findIndex(item => item.id === project.id);
      if (index !== -1) {
        projectList.value.splice(index, 1);
        total.value = projectList.value.length;
        ElMessage.success("删除成功");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

const handleSearch = () => {
  // 模拟搜索逻辑
  currentPage.value = 1;
  ElMessage.success("搜索成功");
};

const resetFilter = () => {
  filterForm.value.name = "";
  filterForm.value.department = "";
  filterForm.value.status = "";
  ElMessage.success("重置成功");
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 这里可以添加获取数据的逻辑
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 这里可以添加获取数据的逻辑
};
</script>

<style lang="scss" scoped>


// 响应式布局
@media (width <= 768px) {
  .project-management-container {
    padding: 16px;

    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .filter-section {
      padding: 16px;

      .filter-form {
        flex-direction: column;
      }
    }
  }
}

.project-management-container {
  padding: 24px;
  background-color: var(--el-bg-color);

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .header-title {
      h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
    }
  }

  .filter-section {
    padding: 20px;
    margin-bottom: 24px;
    background-color: var(--el-bg-color-overlay);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);

    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
  }

  .project-list {
    margin-bottom: 24px;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
}

.project-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: var(--el-box-shadow);
    transform: translateY(-5px);
  }

  &_detail {
    flex: 1;
    min-height: 180px;
    padding: 20px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      font-size: 26px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      gap: 8px;
      align-items: center;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 16px 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      font-weight: 500;
      white-space: nowrap;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      font-size: 14px;
      line-height: 20px;
      -webkit-box-orient: vertical;
    }

    &--footer {
      padding-top: 12px;
      border-top: 1px solid var(--el-border-color-lighter);

      .project-card-item_detail--info {
        display: flex;
        margin-bottom: 8px;
        font-size: 13px;

        .info-label {
          margin-right: 4px;
          color: var(--el-text-color-secondary);
        }

        .info-value {
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  &__completed {
    .project-card-item_detail--name,
    .project-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }
  }
}
</style>
