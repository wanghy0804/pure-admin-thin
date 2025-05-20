<template>
  <div class="project-search-bar">
    <el-autocomplete
      v-model="search"
      :fetch-suggestions="querySearch"
      placeholder="请输入项目名称搜索，结果将显示项目编号"
      clearable
      class="search-input"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElAutocomplete } from "element-plus";

const emits = defineEmits(["project-selected"]);
const search = ref("");
const projects = ref([
  // 示例数据，实际应通过接口获取
  { value: "项目A", id: 1 },
  { value: "项目B", id: 2 },
  { value: "项目C", id: 3 }
]);

function querySearch(queryString: string, cb: (results: any[]) => void) {
  // 如果输入小于两个字符，不显示预查找到的项目
  if (queryString.length < 2) {
    cb([]);
    return;
  }
  const results = projects.value
    .filter(p => {
      // 同时支持项目名称和项目编号搜索
      return (
        p.value.includes(queryString) || p.id.toString().includes(queryString)
      );
    })
    .map(p => {
      // 修改显示的文本，添加项目编号
      const displayText = `${p.value} - 项目编号: ${p.id}`;
      return {
        value: displayText, // 选中后填充到输入框的值
        label: displayText, // 下拉菜单中显示的文本
        id: p.id, // 保留原始项目 ID
        originalValue: p.value // 保留原始项目名称
      };
    });
  cb(results);
}

function handleSelect(item: any) {
  // 创建一个新对象，包含原始项目名称和ID
  const selectedProject = {
    value: item.originalValue,
    id: item.id
  };
  emits("project-selected", selectedProject);
}
</script>

<style scoped>
.project-search-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 400px;
}
</style>
