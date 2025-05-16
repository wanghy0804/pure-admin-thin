<template>
  <div class="ProjectManagement-detail">
    <h1>示例详情页</h1>
    <p>这是一个示例详情页的内容</p>
    <router-link to="/ProjectManagement/index">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("欢迎来到示例详情页");
</script>

<style scoped>
.ProjectManagement-detail {
  padding: 20px;
}
</style>
