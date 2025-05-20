<template>
  <div class="project-base-info">
    <el-card class="base-info-card">
      <template #header>
        <div class="card-header">
          <span class="font-medium">项目信息</span>
          <el-button type="primary" text size="small">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
        </div>
      </template>

      <div v-if="project" class="info-content">
        <el-descriptions :column="3" border>
          <!-- 基本信息 -->
          <el-descriptions-item label="项目名称">
            {{ project.value || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="项目ID">
            {{ project.id || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="立项时间">
            {{ projectData.projectTime || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="所属事业部">
            {{ projectData.department || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="项目负责人">
            {{ projectData.manager || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="销售人员">
            {{ projectData.sales || "未设置" }}
          </el-descriptions-item>

          <!-- 项目配置信息 -->
          <el-descriptions-item label="服务点数">
            {{ projectData.servicePoints || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="密信版本">
            {{ projectData.version || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="地区">
            {{ projectData.region || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="产品类型">
            {{ projectData.productType || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="部署方式">
            {{ projectData.deployType || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="项目状态">
            <el-tag :type="getStatusType(projectData.status)">
              {{ projectData.status || "未开始" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- GitHub README 风格的项目信息区域 -->
        <div class="github-readme-container">
          <!-- 项目描述部分 -->
          <div class="readme-section">
            <h2 class="readme-heading">
              <svg
                class="readme-icon"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              项目描述
            </h2>
            <div class="readme-content">
              <p>{{ projectData.description || "暂无项目描述" }}</p>
            </div>
          </div>

          <!-- 项目地址部分 -->
          <div class="readme-section">
            <h2 class="readme-heading">
              <svg
                class="readme-icon"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              项目地址
            </h2>
            <div class="readme-content">
              <p>{{ projectData.address || "暂无地址信息" }}</p>
            </div>
          </div>

          <!-- 环境拓扑信息部分 -->
          <div v-if="projectData.topologyType" class="readme-section">
            <h2 class="readme-heading">
              <svg
                class="readme-icon"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"
                />
              </svg>
              环境拓扑信息
            </h2>
            <div class="readme-content">
              <div
                v-if="projectData.topologyType === 'text'"
                class="topology-text readme-code-block"
              >
                <pre><code>{{ projectData.topologyText || "暂无拓扑图描述" }}</code></pre>
              </div>
              <div
                v-else-if="
                  projectData.topologyType === 'image' &&
                  projectData.topologyImage
                "
                class="topology-image"
              >
                <img
                  :src="projectData.topologyImage"
                  alt="拓扑图"
                  class="readme-image"
                />
              </div>
              <div v-else class="topology-empty">
                <p>暂无拓扑图信息</p>
              </div>
            </div>
          </div>

          <!-- 备注信息部分 -->
          <div class="readme-section">
            <h2 class="readme-heading">
              <svg
                class="readme-icon"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0114.25 13H8.06l-2.573 2.573A1.457 1.457 0 013 14.543V13H1.75A1.75 1.75 0 010 11.25v-9.5zM1.75 1a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h2a.75.75 0 01.75.75v2.19l2.72-2.72a.749.749 0 01.53-.22h6.5a.75.75 0 00.75-.75v-9.5a.75.75 0 00-.75-.75H1.75z"
                />
              </svg>
              备注
            </h2>
            <div class="readme-content">
              <blockquote class="readme-blockquote">
                <p>{{ projectData.remark || "暂无备注信息" }}</p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-empty description="请选择项目" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { Edit } from "@element-plus/icons-vue";

const props = defineProps({
  project: Object
});

// 模拟项目详细数据，实际应通过API获取
const projectData = ref({
  projectTime: "2025-05-01",
  department: "技术研发部",
  manager: "张三",
  sales: "李四",
  servicePoints: 5,
  version: "v2.5.1",
  region: "华北",
  productType: "企业级应用",
  deployType: "私有化部署",
  status: "进行中",
  description: "这是一个企业级项目管理系统，旨在提高团队协作效率和项目透明度。",
  address: "北京市海淀区中关村软件园",
  topologyType: "text",
  topologyText:
    "本项目采用三层架构，包含Web前端、应用服务层和数据库层。Web前端使用Vue.js框架，应用服务层使用Spring Boot，数据库采用MySQL。",
  remark:
    "该项目需要特别注意安全性和性能要求，已与客户确认需求规格。项目实施过程中需要定期与客户沟通进度，确保需求变更及时跟进。"
});

/**
 * 根据项目状态返回对应的标签类型
 * @param {string} status 项目状态
 * @returns {string} 标签类型
 */
function getStatusType(status) {
  const statusMap = {
    未开始: "info",
    进行中: "primary",
    已完成: "success",
    已暂停: "warning",
    已取消: "danger"
  };
  return statusMap[status] || "info";
}

/**
 * 格式化文件大小
 * @param {number} size 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(size) {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}
</script>

<style scoped>
.project-base-info {
  margin-bottom: 24px;
}

.base-info-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.font-medium {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.info-content {
  padding: 8px 0;
}

.project-description,
.project-address {
  margin-top: 20px;
}

.project-description h3,
.project-address h3 {
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
}

/* GitHub README 风格样式 */
.github-readme-container {
  padding: 16px;
  margin-top: 24px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color: #24292e;
  background-color: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.readme-section {
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eaecef;
}

.readme-section:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.readme-heading {
  display: flex;
  align-items: center;
  padding-bottom: 0.3em;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.25em;
  font-weight: 600;
  line-height: 1.25;
  color: #24292e;
}

.readme-icon {
  margin-right: 8px;
  color: #586069;
}

.readme-content {
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
}

.readme-content p {
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.6;
}

.readme-code-block {
  padding: 16px;
  margin-bottom: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.readme-code-block pre {
  margin: 0;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  word-wrap: normal;
  white-space: pre;
}

.readme-code-block code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  color: #24292e;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.readme-image {
  box-sizing: border-box;
  max-width: 100%;
  background-color: #fff;
  border: 1px solid #dfe2e5;
  border-radius: 6px;
}

.readme-blockquote {
  padding: 0 1em;
  margin: 0 0 16px;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.readme-blockquote p {
  padding: 16px 0;
  margin-top: 0;
  margin-bottom: 0;
}

/* 保留原有的一些样式 */
.topology-text p,
.topology-empty p {
  line-height: 1.6;
  color: #606266;
}

.topology-image img {
  max-width: 100%;
  border-radius: 6px;
}

.empty-state {
  padding: 30px 0;
}
</style>
