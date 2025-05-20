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
          <el-descriptions-item label="服务点数">
            {{ projectData.servicePoints || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="产品类型">
            {{ projectData.productType || "未设置" }}
          </el-descriptions-item>
          <el-descriptions-item label="部署方式">
            {{ projectData.deployType || "未设置" }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="project-description">
          <h3>项目描述</h3>
          <p>{{ projectData.description || "暂无项目描述" }}</p>
        </div>

        <div class="project-address">
          <h3>项目地址</h3>
          <p>{{ projectData.address || "暂无地址信息" }}</p>
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
  productType: "企业级应用",
  deployType: "私有化部署",
  description: "这是一个企业级项目管理系统，旨在提高团队协作效率和项目透明度。",
  address: "北京市海淀区中关村软件园"
});
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

.project-description p,
.project-address p {
  line-height: 1.6;
  color: #606266;
}

.empty-state {
  padding: 30px 0;
}
</style>
