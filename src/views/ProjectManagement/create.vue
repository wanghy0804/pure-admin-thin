<template>
  <div class="project-create">
    <el-card class="main-content">
      <template #header>
        <div class="card-header">
          <span class="font-medium">新增项目</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="form-container"
      >
        <el-row :gutter="20">
          <!-- 第一行 -->
          <el-col :span="8">
            <el-form-item label="事业部名称" prop="department">
              <el-select
                v-model="form.department"
                placeholder="请选择事业部"
                clearable
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="项目名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入项目名称"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="销售人员" prop="sales">
              <el-input
                v-model="form.sales"
                placeholder="请输入销售人员"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第二行 -->
          <el-col :span="8">
            <el-form-item label="立项时间" prop="projectTime">
              <el-date-picker
                v-model="form.projectTime"
                type="date"
                placeholder="选择立项时间"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="服务点数" prop="servicePoints">
              <el-input-number
                v-model="form.servicePoints"
                :min="1"
                placeholder="请输入服务点数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="密信版本" prop="version">
              <el-input
                v-model="form.version"
                placeholder="请输入密信版本"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第三行 -->
          <el-col :span="8">
            <el-form-item label="地区" prop="region">
              <el-cascader
                v-model="form.region"
                :options="regionOptions"
                placeholder="请选择地区"
                style="width: 100%"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部署方式" prop="deployType">
              <el-select
                v-model="form.deployType"
                placeholder="请选择部署方式"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in deployTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类型" prop="productType">
              <el-select
                v-model="form.productType"
                placeholder="请选择产品类型"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in productTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="项目地址" prop="address">
              <el-input
                v-model="form.address"
                placeholder="请输入项目详细地址"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第五行 - 项目文档 -->
          <el-col :span="12">
            <el-form-item label="项目文档" prop="documents">
              <el-upload
                class="upload-demo"
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
                multiple
              >
                <template #trigger>
                  <div style="display: flex; gap: 0; align-items: center">
                    <el-button
                      type="primary"
                      style="
                        margin-right: 0;
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                      "
                      >选择文件</el-button
                    >
                    <el-button
                      type="success"
                      style="
                        margin-left: 0;
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                      "
                      @click.stop="submitUpload"
                    >
                      上传到服务器
                    </el-button>
                  </div>
                </template>
                <template #tip>
                  <div class="el-upload__tip">
                    支持上传 doc,docx,pdf 格式文件，单个文件不超过 10MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="现场环境拓扑" class="topology-form-item">
              <el-radio-group
                v-model="form.topologyType"
                class="topology-type-selector"
              >
                <el-radio-button label="text">文字描述</el-radio-button>
                <el-radio-button label="drawing">绘制拓扑图</el-radio-button>
              </el-radio-group>

              <div class="topology-content">
                <div
                  v-if="form.topologyType === 'text'"
                  class="topology-textarea"
                >
                  <el-input
                    v-model="form.topologyText"
                    type="textarea"
                    :rows="5"
                    placeholder="请描述现场环境拓扑，例如：
1. 网络架构：核心-汇聚-接入三层架构
2. 服务器配置：4台应用服务器，2台数据库服务器
3. 网络设备：Cisco 3850交换机，FortiGate防火墙
4. 安全设备：WAF、IPS等"
                  />
                </div>

                <div v-else class="drawing-area">
                  <div v-if="!form.topologyImage" class="drawing-placeholder">
                    <div class="placeholder-icon">
                      <el-icon size="64"><Picture /></el-icon>
                    </div>
                    <p>点击或拖拽图片到此处上传</p>
                    <div class="upload-container">
                      <el-upload
                        class="upload-topology"
                        action="#"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="handleTopologyChange"
                      >
                        <el-button type="primary" size="small" :icon="Upload">
                          上传图片
                        </el-button>
                      </el-upload>
                    </div>
                    <div class="hint-text">
                      支持 JPG/PNG 格式，建议尺寸 800x600 像素
                    </div>
                  </div>

                  <div v-else class="drawing-preview">
                    <img :src="form.topologyImage" alt="拓扑图预览" />
                    <div class="drawing-actions">
                      <el-button
                        type="danger"
                        size="small"
                        :icon="Delete"
                        @click="removeTopologyImage"
                      >
                        删除
                      </el-button>
                      <el-upload
                        class="ml-3"
                        action="#"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="handleTopologyChange"
                      >
                        <el-button type="primary" size="small" :icon="Refresh">
                          重新上传
                        </el-button>
                      </el-upload>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第七行 - 备注信息 -->
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="5"
                placeholder="请输入需要备注的信息"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item class="form-actions">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { Picture } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const formRef = ref();
const fileList = ref([]);

// 表单数据
const form = reactive({
  department: "",
  name: "",
  sales: "",
  projectTime: "",
  servicePoints: "",
  version: "",
  region: "",
  address: "",
  deployType: "",
  productType: "",
  status: "",
  topologyType: "text",
  topologyText: "",
  topologyImage: "",
  remark: ""
});

// 处理拓扑图上传
const handleTopologyChange = file => {
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      form.topologyImage = e.target.result;
    };
    reader.readAsDataURL(file.raw);
  }
  // 检查文件大小 (100MB)
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    ElMessage.error("图片大小不能超过 100MB");
    return false;
  }

  // 创建图片预览
  const reader = new FileReader();
  reader.onload = e => {
    form.topologyImage = e.target.result;
  };
  reader.readAsDataURL(file.raw);
  return false;
};

// 删除拓扑图
const removeTopologyImage = () => {
  form.topologyImage = "";
};

// 编辑拓扑图
const editTopologyImage = () => {
  // 这里可以集成绘图工具，暂时使用文件选择器
  document.querySelector(".drawing-uploader input").click();
};

// 表单验证规则
const rules = {
  department: [
    { required: true, message: "请选择事业部名称", trigger: "change" }
  ],
  name: [
    { required: true, message: "请输入项目名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
  ],
  sales: [{ required: true, message: "请输入销售人员", trigger: "blur" }],
  projectTime: [
    { required: true, message: "请选择立项时间", trigger: "change" }
  ],
  servicePoints: [
    { required: true, message: "请输入服务点数", trigger: "blur" }
  ],
  version: [{ required: true, message: "请输入密信版本", trigger: "blur" }],
  region: [{ required: true, message: "请选择地区", trigger: "change" }],
  address: [{ required: false, message: "请输入项目地址", trigger: "blur" }],
  deployType: [
    { required: true, message: "请选择部署方式", trigger: "change" }
  ],
  productType: [
    { required: true, message: "请选择产品类型", trigger: "change" }
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

// 文件上传相关方法
const handleRemove = (file, fileList) => {
  console.log(file, fileList);
};

const handlePreview = file => {
  console.log(file);
};

const submitUpload = () => {
  // 这里添加上传逻辑
  ElMessage.success("文件上传成功");
};

// 提交表单
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log("表单数据:", form);
      ElMessage.success("项目创建成功！");
      router.push("/ProjectManagement/index");
    } else {
      ElMessage.warning("请完善表单信息");
      return false;
    }
  });
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
  form.servicePoints = 1; // 重置数字输入框
};
</script>

<style scoped>
/* 响应式布局 */
@media (width <= 992px) {
  .el-col {
    margin-bottom: 16px;
  }

  .el-col:last-child {
    margin-bottom: 0;
  }
}

@media (width <= 768px) {
  .project-create {
    padding: 16px;
  }

  .main-content {
    padding: 16px;
  }

  .form-container {
    width: 100%;
  }

  :deep(.el-form-item__label) {
    padding-right: 12px;
  }
}

:deep(.el-form-item__label) {
  justify-content: flex-start !important;
  text-align: left !important;
}

:deep(.el-form-item__content) {
  text-align: left !important;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select),
:deep(.el-date-editor),
:deep(.el-radio-group) {
  text-align: left !important;
}

/* 确保所有内容左对齐 */
.el-form-item {
  margin-bottom: 18px;
}

.el-form-item__content {
  display: flex;
  justify-content: flex-start;
}

/* 调整输入框和选择器的宽度 */
.el-input,
.el-select,
.el-date-editor,
.el-cascader {
  width: 100%;
}

.project-create {
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  margin: 0 auto;
}

.main-content {
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.card-header .font-medium {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
}

/* 表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 22px;
}

/* 按钮组 */
.form-actions {
  padding-top: 16px;
  margin-top: 32px;
  text-align: right;
  border-top: 1px solid #ebeef5;
}

/* 行间距 */
.el-row {
  margin-bottom: 16px;
}

/* 上传区域 */
.upload-demo {
  width: 100%;
}

.topology-form-item {
  width: 100%;
}

.topology-form-item .el-form-item__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.topology-type-selector {
  margin-bottom: 8px;
}

.topology-content {
  width: 100%;
}

.topology-textarea {
  width: 100%;
}

.drawing-area {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  padding: 20px;
  background-color: #f5f7fa;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.drawing-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0;
  color: #909399;
}

.placeholder-icon {
  margin-bottom: 16px;
  color: #c0c4cc;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 16px 0;
}

.upload-button {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
}

.icon-upload {
  margin-right: 2px;
}

.drawing-placeholder p {
  margin: 8px 0 16px;
}

.drawing-placeholder .hint-text {
  margin-top: 12px;
  font-size: 12px;
  color: #c0c4cc;
}

.drawing-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.drawing-preview img {
  display: block;
  max-width: 100%;
  max-height: 400px;
  margin: 0 auto;
}

.drawing-actions {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
}

.drawing-actions .el-button {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  height: 40px;
  margin: 0;
  font-size: 16px;
}

/* 全局表单样式 */
</style>
