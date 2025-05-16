<template>
  <div class="project-management-layout">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProjectManagementLayout"
});
</script>

<style scoped>
.project-management-layout {
  width: 100%;
  height: 100%;
}
</style>
