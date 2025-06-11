<template>
  <div>
    <el-card>
      <template #header>
        <span>用户列表</span>
        <el-button type="primary" style="float: right" @click="goAddUser"
          >新增用户</el-button
        >
      </template>
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" type="danger" @click="deleteUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户新增/编辑弹窗 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="userDialogMode === 'add' ? '新增用户' : '编辑用户'"
      width="400px"
      @close="closeUserDialog"
    >
      <el-form :model="userForm" label-width="80px" style="padding: 0 20px">
        <el-form-item label="用户名">
          <el-input
            v-model="userForm.username"
            :disabled="userDialogMode === 'edit'"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.status"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeUserDialog">取消</el-button>
        <el-button type="primary" @click="submitUserForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userList = ref([
  {
    username: "admin",
    email: "admin@test.com",
    role: "管理员",
    status: "启用"
  },
  {
    username: "user1",
    email: "user1@test.com",
    role: "普通用户",
    status: "禁用"
  }
]);

// 弹窗控制
const userDialogVisible = ref(false);
const userDialogMode = ref<"add" | "edit">("add");
const userForm = ref({
  username: "",
  email: "",
  role: "",
  status: true as boolean
});

function openAddUserDialog() {
  userDialogMode.value = "add";
  userForm.value = {
    username: "",
    email: "",
    role: "",
    status: true
  };
  userDialogVisible.value = true;
}

function goAddUser() {
  openAddUserDialog();
}

function editUser(row: any) {
  userDialogMode.value = "edit";
  userForm.value = {
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status === "启用" || row.status === true
  };
  userDialogVisible.value = true;
}

function closeUserDialog() {
  userDialogVisible.value = false;
}

function submitUserForm() {
  if (userDialogMode.value === "add") {
    // 简单校验
    if (!userForm.value.username || !userForm.value.email) return;
    userList.value.push({
      username: userForm.value.username,
      email: userForm.value.email,
      role: userForm.value.role,
      status: userForm.value.status ? "启用" : "禁用"
    });
  } else if (userDialogMode.value === "edit") {
    // 查找并更新
    const idx = userList.value.findIndex(
      u => u.username === userForm.value.username
    );
    if (idx !== -1) {
      userList.value[idx] = {
        ...userList.value[idx],
        email: userForm.value.email,
        role: userForm.value.role,
        status: userForm.value.status ? "启用" : "禁用"
      };
    }
  }
  closeUserDialog();
}

function deleteUser(row: any) {
  userList.value = userList.value.filter(u => u.username !== row.username);
}
</script>
