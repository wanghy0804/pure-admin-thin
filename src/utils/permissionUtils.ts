// 动态获取所有可分配权限点（菜单、按钮、数据权限等）
// 实际项目中可从路由、后端接口、按钮配置等自动生成
export function getDynamicPermissionOptions() {
  // 示例权限树结构，实际应自动生成
  return [
    {
      code: "project",
      title: "项目管理",
      children: [
        {
          code: "project:view",
          title: "项目查看",
          actions: ["read"]
        },
        {
          code: "project:create",
          title: "项目创建",
          actions: ["create"]
        },
        {
          code: "project:edit",
          title: "项目编辑",
          actions: ["update"]
        },
        {
          code: "project:delete",
          title: "项目删除",
          actions: ["delete"]
        }
      ]
    },
    {
      code: "user",
      title: "用户管理",
      children: [
        {
          code: "user:list",
          title: "用户列表",
          actions: ["read"]
        },
        {
          code: "user:add",
          title: "新增用户",
          actions: ["create"]
        },
        {
          code: "user:edit",
          title: "编辑用户",
          actions: ["update"]
        },
        {
          code: "user:delete",
          title: "删除用户",
          actions: ["delete"]
        }
      ]
    }
  ];
}
