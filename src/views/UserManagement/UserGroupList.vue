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

    <!-- 用户组新增/编辑弹窗 -->
    <el-dialog
      v-model="groupDialogVisible"
      :title="groupDialogMode === 'add' ? '新增用户组' : '编辑用户组'"
      width="500px"
      @close="closeGroupDialog"
    >
      <el-form :model="groupForm" label-width="100px" style="padding: 0 20px">
        <el-form-item label="用户组名称">
          <el-input
            v-model="groupForm.groupName"
            :disabled="groupDialogMode === 'edit'"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="groupForm.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeGroupDialog">取消</el-button>
        <el-button type="primary" @click="submitGroupForm">保存</el-button>
      </template>
    </el-dialog>
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

// 弹窗控制
const groupDialogVisible = ref(false);
const groupDialogMode = ref<"add" | "edit">("add");
const groupForm = ref({
  groupName: "",
  description: ""
});

function openAddGroupDialog() {
  groupDialogMode.value = "add";
  groupForm.value = {
    groupName: "",
    description: ""
  };
  groupDialogVisible.value = true;
}

function goAddGroup() {
  openAddGroupDialog();
}

function editGroup(row: any) {
  groupDialogMode.value = "edit";
  groupForm.value = {
    groupName: row.groupName,
    description: row.description
  };
  groupDialogVisible.value = true;
}

function closeGroupDialog() {
  groupDialogVisible.value = false;
}

function submitGroupForm() {
  if (groupDialogMode.value === "add") {
    // 简单校验
    if (!groupForm.value.groupName) return;
    groupList.value.push({
      groupName: groupForm.value.groupName,
      description: groupForm.value.description,
      memberCount: 0
    });
  } else if (groupDialogMode.value === "edit") {
    // 查找并更新
    const idx = groupList.value.findIndex(
      g => g.groupName === groupForm.value.groupName
    );
    if (idx !== -1) {
      groupList.value[idx] = {
        ...groupList.value[idx],
        description: groupForm.value.description
      };
    }
  }
  closeGroupDialog();
}

function deleteGroup(row: any) {
  groupList.value = groupList.value.filter(g => g.groupName !== row.groupName);
}
</script>
