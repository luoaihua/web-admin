<template>
    <div>
      <el-page-header title="产品管理" icon="">
        <template #content>
          <span class="text-large font-600 mr-3"> 添加产品 </span>
        </template>
      </el-page-header>
      <el-form
        ref="productFormRef"
        :model="productFrom"
        :rules="productFromRules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="产品名称" prop="title">
          <el-input v-model="productFrom.title" />
        </el-form-item>
        
        <el-form-item label="产品简要描述" prop="introduction">
          <el-input v-model="productFrom.introduction" type="textarea" />
        </el-form-item>
        <el-form-item label="产品详细描述" prop="detail">
          <el-input v-model="productFrom.detail" type="textarea" />
        </el-form-item>
        <el-form-item label="产品图片" prop="cover">
          <Upload :avatar="productFrom.cover" @avatarChange="handleChange" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from "vue";
  import upload from "@/util/upload";
  import Upload from "@/components/upload/Upload.vue";
  import { ElMessage } from "element-plus";
  import { useRouter } from "vue-router";
  const router = useRouter()
  const productFormRef = ref();
  const productFrom = reactive({
    title: "",
    introduction: "",
    detail: "",
    cover: "",
    file: null,
  });
  
  const productFromRules = reactive({
    title: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
    detail: [{ required: true, message: "请输入详细描述", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入简要描述", trigger: "blur" }],
    cover: [{ required: true, message: "请上产品传图片", trigger: "blur" }],
  });
  
  const handleChange = (file) => {
    productFrom.cover = URL.createObjectURL(file);
    productFrom.file = file;
  };
  
  const submitForm = () => {
    // console.log(productFrom)
    productFormRef.value.validate(async (vaild) => {
      if (vaild) {
        const res = await upload("/adminapi/product/add", productFrom);
        if (res.data.ActionType === "OK") {
          router.push("/product-manage/productlist");
        } else {
          ElMessage({
            showClose: true,
            message: "添加产品失败",
            type: "error",
          });
        }
      }
    });
  };
  </script>
  
  <style lang="scss" scoped>
  .el-form{
      margin-top: 20px;
  }
  </style>
  