<template>
  <div class="ProjectManagement-index">
    <h1>示例首页</h1>
    <p>这是一个示例首页的内容</p>
    <router-link to="/ProjectManagement/detail">查看详情</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "ProjectManagementIndex"
});

const message = ref("欢迎来到示例首页");
</script>

<style scoped>
.ProjectManagement-index {
  padding: 20px;
}
</style>
