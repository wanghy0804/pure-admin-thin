// 用户管理模块路由

export default {
  path: "/user-management",
  name: "UserManagement",
  meta: {
    title: "用户管理",
    icon: "fluent-color:layer-diagonal-person-16",
    rank: 3,
    roles: ["admin", "user-admin"]
  },
  component: () => import("@/views/UserManagement/index.vue"),
  children: [
    {
      path: "user-list",
      name: "UserList",
      meta: {
        title: "用户列表",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:people-16"
      },
      component: () => import("@/views/UserManagement/UserList.vue")
    },
    {
      path: "group-list",
      name: "UserGroupList",
      meta: {
        title: "用户组列表",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:people-team-16"
      },
      component: () => import("@/views/UserManagement/UserGroupList.vue")
    },
    {
      path: "add-user",
      name: "AddUser",
      meta: {
        title: "新增用户",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:person-available-16"
      },
      component: () => import("@/views/UserManagement/AddUser.vue")
    },
    {
      path: "add-group",
      name: "AddUserGroup",
      meta: {
        title: "新增用户组",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:people-list-16"
      },
      component: () => import("@/views/UserManagement/AddUserGroup.vue")
    },
    {
      path: "user-permissions",
      name: "UserPermissions",
      meta: {
        title: "用户权限",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:contact-card-16"
      },
      component: () => import("@/views/UserManagement/UserPermissions.vue")
    },
    {
      path: "group-permissions",
      name: "UserGroupPermissions",
      meta: {
        title: "用户组权限",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:scan-person-16"
      },
      component: () => import("@/views/UserManagement/UserGroupPermissions.vue")
    }
  ]
};
