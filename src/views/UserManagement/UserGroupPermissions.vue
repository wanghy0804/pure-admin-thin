<template>
  <el-card>
    <template #header>
      <span>用户组权限管理</span>
    </template>
    <el-table :data="groupPermissions" style="width: 100%">
      <el-table-column prop="groupName" label="用户组名称" />
      <el-table-column prop="permissions" label="权限">
        <template #default="scope">
          <el-tag
            v-for="perm in scope.row.permissions"
            :key="perm"
            type="info"
            style="margin-right: 4px"
          >
            {{ perm }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="editGroupPermissions(scope.row)">
            编辑权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from "vue";

const groupPermissions = ref([
  { groupName: "管理员组", permissions: ["全部权限"] },
  { groupName: "普通用户组", permissions: ["查看"] }
]);

function editGroupPermissions(row: any) {
  // 编辑用户组权限逻辑
}
</script>
