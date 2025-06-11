<template>
  <el-card>
    <template #header>
      <span>用户组权限管理</span>
    </template>
    <el-table :data="groupPermissions" style="width: 100%">
      <el-table-column prop="groupName" label="用户组名称" />
      <el-table-column prop="roles" label="角色">
        <template #default="scope">
          <el-tag
            v-for="role in scope.row.roles"
            :key="role"
            type="info"
            style="margin-right: 4px"
          >
            {{ role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="permissions" label="权限">
        <template #default="scope">
          <div v-for="perm in scope.row.permissions" :key="perm.code">
            <b>{{ perm.code }}</b
            >：
            <el-tag
              v-for="action in perm.actions"
              :key="action"
              size="small"
              type="success"
              style="margin-right: 2px"
              >{{ action }}</el-tag
            >
            <span v-if="perm.dataScope"
              >（数据范围：{{ perm.dataScope }}）</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)"
            >编辑权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑权限弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户组权限" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户组名称">
          <el-input v-model="editForm.groupName" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.roles" multiple placeholder="请选择角色">
            <el-option label="超级管理员" value="super-admin" />
            <el-option label="项目经理" value="project-manager" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限配置">
          <el-tree
            ref="permTreeRef"
            :data="allPermissions"
            show-checkbox
            node-key="code"
            :default-checked-keys="editForm.permissions.map(p => p.code)"
            :props="{ label: 'title', children: 'children' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditPermissions">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getDynamicPermissionOptions } from "@/utils/permissionUtils";

const allPermissions = ref(getDynamicPermissionOptions());

const groupPermissions = ref([
  {
    groupName: "管理员组",
    roles: ["super-admin"],
    permissions: [
      { code: "project:view", actions: ["read", "update", "delete"] },
      { code: "user:list", actions: ["read"] }
    ]
  },
  {
    groupName: "普通用户组",
    roles: ["user"],
    permissions: [{ code: "project:view", actions: ["read"] }]
  }
]);

const editDialogVisible = ref(false);
const currentEditGroup = ref(null);
const editForm = ref({ groupName: "", roles: [], permissions: [] });

function openEditDialog(row: any) {
  currentEditGroup.value = row;
  editForm.value = JSON.parse(JSON.stringify(row));
  editDialogVisible.value = true;
}

function saveEditPermissions() {
  const idx = groupPermissions.value.findIndex(
    g => g.groupName === editForm.value.groupName
  );
  if (idx !== -1) {
    groupPermissions.value[idx] = JSON.parse(JSON.stringify(editForm.value));
    ElMessage.success("权限已更新");
  }
  editDialogVisible.value = false;
}
</script>
