<template>
  <el-card>
    <template #header>
      <span>新增用户组</span>
    </template>
    <el-form :model="form" label-width="100px" style="max-width: 400px">
      <el-form-item label="用户组名称">
        <el-input v-model="form.groupName" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  groupName: "",
  description: ""
});

function submit() {
  // 提交新增用户组逻辑
  router.push({ name: "UserGroupList" });
}
</script>
