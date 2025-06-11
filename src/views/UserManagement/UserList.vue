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

function goAddUser() {
  router.push({ name: "AddUser" });
}

function editUser(row: any) {
  // 跳转编辑页面或弹窗
}

function deleteUser(row: any) {
  // 删除用户逻辑
}
</script>
