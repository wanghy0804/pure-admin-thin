# Vue Pure Admin 精简版（非国际化版本）

[![license](https://img.shields.io/github/license/pure-admin/vue-pure-admin.svg)](LICENSE)

**中文** | [English](./README.en-US.md)

## 介绍

精简版基于 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 提炼，保留核心功能，适合实际项目开发。全局引入 [element-plus](https://element-plus.org) 后，打包体积低于 `2.3MB`，开启 `brotli` 压缩和 `cdn` 替换可降至 `350kb` 以下。

## 项目结构与模块分析

### 📁 核心目录结构

```
src/
├── views/              # 页面视图模块
│   ├── ProjectManagement/    # 项目管理模块
│   ├── UserManagement/       # 用户管理模块
│   ├── TaskManagement/       # 任务管理模块
│   ├── system/              # 系统管理模块
│   ├── permission/          # 权限管理模块
│   ├── welcome/             # 欢迎页
│   ├── error/               # 错误页面
│   └── login/               # 登录模块
├── components/         # 全局复用组件
├── layout/            # 布局组件
├── router/            # 路由配置
├── store/             # 状态管理
├── api/               # API 接口
├── utils/             # 工具函数
├── plugins/           # 插件配置
├── style/             # 全局样式
├── assets/            # 静态资源
├── config/            # 配置文件
└── directives/        # 自定义指令
```

### 🔧 模块功能详解

#### 📄 页面模块 (views/)

- **ProjectManagement**: 项目管理完整流程

  - `index.vue`: 项目列表页面
  - `create.vue`: 项目创建页面
  - `detail.vue`: 项目详情页面
  - `components/`: 项目相关组件

- **UserManagement**: 用户与权限管理

  - `UserList.vue`: 用户列表管理
  - `AddUser.vue`: 添加用户功能
  - `UserPermissions.vue`: 用户权限配置
  - `UserGroupList.vue`: 用户组管理
  - `UserGroupPermissions.vue`: 用户组权限

- **TaskManagement**: 任务管理系统

  - `index.vue`: 任务列表页面
  - `detail.vue`: 任务详情页面
  - `components/`: 任务相关组件

- **system**: 系统管理功能

  - `user/`: 系统用户管理
  - `group/`: 系统分组管理

- **permission**: 权限控制模块
  - `page/`: 页面权限管理
  - `button/`: 按钮权限管理

#### 🧩 组件模块 (components/)

- **ReAuth**: 权限验证组件
- **ReDialog**: 对话框组件
- **ReIcon**: 图标组件
- **RePureTableBar**: 表格工具栏
- **ReSegmented**: 分段控制器
- **ReText**: 文本组件
- **ReCol**: 列组件
- **RePerms**: 权限组件

#### 🎨 样式模块 (style/)

- `index.scss`: 主样式文件
- `reset.scss`: 样式重置
- `theme.scss`: 主题配置
- `dark.scss`: 暗色主题
- `element-plus.scss`: Element Plus 样式定制
- `sidebar.scss`: 侧边栏样式
- `login.css`: 登录页样式
- `transition.scss`: 过渡动画
- `tailwind.css`: Tailwind CSS 配置

#### 🔧 工具模块 (utils/)

- `auth.ts`: 认证相关工具
- `permissionUtils.ts`: 权限工具函数
- `tree.ts`: 树形数据处理
- `message.ts`: 消息提示工具
- `responsive.ts`: 响应式工具
- `sso.ts`: 单点登录工具
- `print.ts`: 打印功能
- `http/`: HTTP 请求封装
- `progress/`: 进度条工具

#### 🔌 插件模块 (plugins/)

- `elementPlus.ts`: Element Plus 插件配置
- `echarts.ts`: ECharts 图表插件

#### 📡 API 模块 (api/)

- `user.ts`: 用户相关接口
- `routes.ts`: 路由相关接口
- `system/`: 系统相关接口

#### 🎯 指令模块 (directives/)

- `auth/`: 权限指令
- `perms/`: 权限验证指令
- `copy/`: 复制指令
- `longpress/`: 长按指令
- `ripple/`: 波纹效果指令
- `optimize/`: 性能优化指令

## 版本选择

当前为非国际化版本。如需国际化版本，[请点击这里](https://github.com/pure-admin/pure-admin-thin/tree/i18n)。

## 可用版本

- [JavaScript 版本](https://pure-admin.cn/pages/js/)
- [Max 版本](https://pure-admin.cn/pages/max/)

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **样式处理**: SCSS + Tailwind CSS
- **图表库**: ECharts
- **代码规范**: ESLint + Prettier + Stylelint

## 资源

### 视频教程

- [UI 设计教程](https://www.bilibili.com/video/BV17g411T7rq)
- [快速开发指南](https://www.bilibili.com/video/BV1kg411v7QT)

### 文档

- [Vue Pure Admin 文档](https://pure-admin.cn/)
- [@pureadmin/utils 文档](https://pure-admin-utils.netlify.app)

### 服务与支持

- [专业服务、软件外包和赞助支持](https://pure-admin.cn/pages/service/)

## 在线演示

[查看演示](https://pure-admin-thin.netlify.app/#/login)

## 快速开始

```bash
# 克隆项目
git clone https://github.com/pure-admin/pure-admin-thin.git

# 进入项目目录
cd pure-admin-thin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 维护者

[xiaoxian521](https://github.com/xiaoxian521)

## 重要说明

精简版不接受任何 `issues` 或 `pull requests`。如有问题请到完整版的 [issues](https://github.com/pure-admin/vue-pure-admin/issues/new/choose) 提交。谢谢！

## 许可证

[MIT © 2020-present, pure-admin](./LICENSE)
