export default {
  path: "/TaskManagement",
  redirect: "/TaskManagement/index",
  meta: {
    icon: "fluent-color:document-16",
    title: "任务管理",
    rank: 2
  },
  children: [
    {
      path: "/TaskManagement/index",
      name: "TaskManagementIndex",
      component: () => import("@/views/TaskManagement/index.vue"),
      meta: {
        title: "任务预览",
        icon: "fluent-color:document-text-16"
      }
    },
    {
      path: "/TaskManagement/detail/:id?",
      name: "TaskManagementDetail",
      component: () => import("@/views/TaskManagement/detail.vue"),
      meta: {
        title: "任务详情",
        icon: "fluent-color:drafts-16",
        dynamicNewTab: true
      },
      props: true
    }
  ]
};
