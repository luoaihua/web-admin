<template>
  <div>
    <el-page-header title="用户管理" icon="">
      <template #content>
        <span class="text-large font-600 mr-3"> 添加用户 </span>
      </template>
    </el-page-header>
    <el-form
      ref="userFormRef"
      :model="userFrom"
      :rules="userFromRules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userFrom.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userFrom.password" type="password"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="userFrom.gender"
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
      <el-form-item label="权限" prop="role">
        <el-select
          v-model="userFrom.role"
          class="m-2"
          placeholder="Select"
          style="width: 100%"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="个人简介" prop="introduction">
        <el-input v-model="userFrom.introduction" type="textarea" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <Upload :avatar="userFrom.avatar" @avatarChange="handleChange" />
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
const userFormRef = ref();
const userFrom = reactive({
  username: "",
  password: "",
  gender: 0,
  role: 2,
  introduction: "",
  avatar: "",
  file: null,
});

const userFromRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});

const options = [
  { value: 0, label: "保密" },
  { value: 1, label: "男" },
  { value: 2, label: "女" },
];

const roleOptions = [
    {value: 1, label:"管理员"},
    {value: 2, label:"编辑"}
]

const handleChange = (file) => {
  // console.log(files.raw)
  userFrom.avatar = URL.createObjectURL(file);
  userFrom.file = file;
};

const submitForm = () => {
  userFormRef.value.validate(async (vaild) => {
    if (vaild) {
      const res = await upload("/adminapi/user/add", userFrom);
      if (res.data.ActionType === "OK") {
        router.push("/user-manage/userList");
      } else {
        ElMessage({
          showClose: true,
          message: "添加用户失败",
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
