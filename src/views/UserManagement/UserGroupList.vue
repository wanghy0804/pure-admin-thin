<template>
  <div>
    <el-card>
      <template #header>
        <span>用户组列表</span>
        <el-button type="primary" style="float: right" @click="goAddGroup"
          >新增用户组</el-button
        >
      </template>
      <el-table :data="groupList" style="width: 100%">
        <el-table-column prop="groupName" label="用户组名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="memberCount" label="成员数" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editGroup(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteGroup(scope.row)"
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
const groupList = ref([
  { groupName: "管理员组", description: "系统管理员", memberCount: 2 },
  { groupName: "普通用户组", description: "普通用户集合", memberCount: 10 }
]);

function goAddGroup() {
  router.push({ name: "AddUserGroup" });
}

function editGroup(row: any) {
  // 编辑用户组逻辑
}

function deleteGroup(row: any) {
  // 删除用户组逻辑
}
</script>
