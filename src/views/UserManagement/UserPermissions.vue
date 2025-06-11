<template>
  <el-card>
    <template #header>
      <span>用户权限管理</span>
    </template>
    <el-table :data="userPermissions" style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="permissions" label="权限">
        <template #default="scope">
          <el-tag
            v-for="perm in scope.row.permissions"
            :key="perm"
            type="success"
            style="margin-right: 4px"
          >
            {{ perm }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="editPermissions(scope.row)"
            >编辑权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from "vue";

const userPermissions = ref([
  { username: "admin", permissions: ["查看", "编辑", "删除"] },
  { username: "user1", permissions: ["查看"] }
]);

function editPermissions(row: any) {
  // 编辑用户权限逻辑
}
</script>
