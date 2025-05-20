export default {
  path: "/ProjectManagement",
  redirect: "/ProjectManagement/index",
  meta: {
    icon: "fluent-color:calendar-16",
    title: "项目管理",
    rank: 1
  },
  children: [
    {
      path: "/ProjectManagement/index",
      name: "ProjectManagementIndex",
      component: () => import("@/views/ProjectManagement/index.vue"),
      meta: {
        title: "项目预览",
        icon: "fluent-color:calendar-sync-16"
      }
    },
    {
      path: "/ProjectManagement/create",
      name: "ProjectManagementCreate",
      component: () => import("@/views/ProjectManagement/create.vue"),
      meta: {
        title: "新增项目",
        icon: "fluent-color:calendar-edit-16"
      }
    },
    {
      path: "/ProjectManagement/detail/:id?",
      name: "ProjectManagementDetail",
      component: () => import("@/views/ProjectManagement/detail.vue"),
      meta: {
        title: "项目详情",
        icon: "fluent-color:calendar-data-bar-16",
        dynamicNewTab: true
      },
      props: true
    }
  ]
};
