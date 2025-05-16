const Layout = () => import("@/layout/index.vue");

export default {
  path: "/example",
  name: "Example",
  component: Layout,
  meta: {
    icon: "ep:star-filled",
    title: "示例页面",
    rank: 100
  },
  children: [
    {
      path: "index",
      name: "ExampleIndex",
      component: () => import("@/views/example/index.vue"),
      meta: {
        title: "示例首页"
      }
    },
    {
      path: "detail",
      name: "ExampleDetail",
      component: () => import("@/views/example/detail.vue"),
      meta: {
        title: "示例详情"
      }
    }
  ]
} satisfies RouteConfigsTable;
