<template>
  <div>
    <el-card>
      <el-page-header title="新闻管理" icon="">
        <template #content>
          <span class="text-large font-600 mr-3"> 创建新闻 </span>
        </template>
      </el-page-header>

      <el-form
        ref="newsFormRef"
        :model="newsFrom"
        :rules="newsFromRules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="newsFrom.title" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <editor @contentEvent="handleChange" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select
            v-model="newsFrom.category"
            class="m-2"
            placeholder="Select"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="cover">
          <Upload :avatar="newsFrom.cover" @avatarChange="handleCoverChange" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加新闻</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Editor from "@/components/editor/Editor.vue";
import Upload from "@/components/upload/Upload.vue";
import upload from "@/util/upload";
import { useRouter } from "vue-router";
const router = useRouter();

const newsFormRef = ref();
const newsFrom = reactive({
  title: "",
  content: "",
  category: 1, // 1 最新动态 2 典型案例 3 通知公告
  cover: "",
  file: null,
  isPublish: 0,
});

const newsFromRules = reactive({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  cover: [{ required: true, message: "请上传图片", trigger: "blur" }],
});

const handleChange = (content) => {
  newsFrom.content = content;
};

const options = [
  { value: 1, label: "最新动态" },
  { value: 2, label: "典型案例" },
  { value: 3, label: "通知公告" },
];

const handleCoverChange = (file) => {
  newsFrom.cover = URL.createObjectURL(file);
  newsFrom.file = file;
};

const submitForm = () => {
  newsFormRef.value.validate(async (vaild) => {
    if (vaild) {
      const res = await upload("/adminapi/news/add", newsFrom);
      if (res.data.ActionType === "OK") {
        router.push("/news-manage/newslist");
      } else {
        ElMessage({
          showClose: true,
          message: "添加新闻失败",
          type: "error",
        });
      }
    }
  });
};
</script>
<style lang="scss" scoped>
.el-form {
  margin-top: 20px;
}
</style>
