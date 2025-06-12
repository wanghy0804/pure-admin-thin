// 用户管理模块路由

export default {
  path: "/user-management",
  name: "UserManagement",
  component: () => import("@/views/UserManagement/index.vue"),
  redirect: "/user-management/user-list",
  meta: {
    title: "用户管理",
    icon: "fluent-color:layer-diagonal-person-16",
    rank: 3,
    roles: ["admin", "user-admin"]
  },
  children: [
    {
      path: "/user-management/user-list",
      name: "UserList",
      meta: {
        title: "用户列表",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:people-16"
      },
      component: () => import("@/views/UserManagement/UserList.vue")
    },
    {
      path: "/user-management/group-list",
      name: "UserGroupList",
      meta: {
        title: "用户组列表",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:people-team-16"
      },
      component: () => import("@/views/UserManagement/UserGroupList.vue")
    },
    {
      path: "/user-management/add-user",
      name: "AddUser",
      meta: {
        title: "新增用户",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:person-available-16"
      },
      component: () => import("@/views/UserManagement/AddUser.vue")
    },
    {
      path: "/user-management/add-group",
      name: "AddUserGroup",
      meta: {
        title: "新增用户组",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:people-list-16"
      },
      component: () => import("@/views/UserManagement/AddUserGroup.vue")
    },
    {
      path: "/user-management/user-permissions",
      name: "UserPermissions",
      meta: {
        title: "用户权限",
        roles: ["admin", "user-admin"],
        icon: "fluent-color:contact-card-16"
      },
      component: () => import("@/views/UserManagement/UserPermissions.vue")
    },
    {
      path: "/user-management/group-permissions",
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
