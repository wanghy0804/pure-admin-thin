const ProjectManagement = {
  path: "/ProjectManagement",
  name: "ProjectManagement",
  component: () => import("@/views/ProjectManagement/layout.vue"),
  redirect: "/ProjectManagement/index",
  meta: {
    icon: "fluent-color:calendar-16",
    title: "项目管理",
    rank: 1
  },
  children: [
    {
      path: "create",
      name: "ProjectManagementCreate",
      component: () => import("@/views/ProjectManagement/create.vue"),
      meta: {
        title: "新增项目",
        icon: "fluent-color:add-16",
        rank: 0
      }
    },
    {
      path: "index",
      name: "ProjectManagementIndex",
      component: () => import("@/views/ProjectManagement/index.vue"),
      meta: {
        title: "项目预览",
        icon: "fluent-color:calendar-data-bar-16",
        rank: 1
      }
    },
    {
      path: "detail",
      name: "ProjectManagementDetail",
      component: () => import("@/views/ProjectManagement/detail.vue"),
      meta: {
        title: "项目详情",
        icon: "fluent-color:calendar-data-bar-16",
        rank: 2
      }
    }
  ]
};

export default ProjectManagement;
