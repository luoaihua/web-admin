<template>
  <div>
    <el-page-header title="企业门户网站管理系统" icon="">
      <template #content>
        <span class="text-large font-600 mr-3"> 个人中心 </span>
      </template>
    </el-page-header>
    <el-row :gutter="20" class="el-row">
      <el-col :span="8">
        <el-card class="box-card">
          <el-avatar :size="100" :src="avatarUrl" />
          <h3>{{ store.state.userInfo.username }}</h3>
          <h5>{{ store.state.userInfo.role == 1 ? "管理员" : "编辑" }}</h5>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
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
            <el-form-item label="个人简介" prop="introduction">
              <el-input v-model="userFrom.introduction" type="textarea" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <Upload :avatar="userFrom.avatar" @avatarChange="handleChange"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()"
                >更新</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import upload from "@/util/upload";
import Upload from "@/components/upload/Upload.vue";
const store = useStore();

const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? `http://localhost:3000${store.state.userInfo.avatar}`
    : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);
const { username, gender, introduction, avatar } = store.state.userInfo;
const userFormRef = ref();
const userFrom = reactive({
  username,
  gender,
  introduction,
  avatar,
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

const handleChange = (file) => {
  // console.log(files.raw)
  userFrom.avatar = URL.createObjectURL(file);
  userFrom.file = file;
};

const submitForm = () => {
  userFormRef.value.validate(async (vaild) => {
    if (vaild) {
      const res = await upload("/adminapi/user/upload", userFrom);
      if (res.data.ActionType === "OK") {
        if (!res.data.data.avatar) delete res.data.data.avatar;
        store.commit("changeUserInfo", res.data.data);
        ElMessage({
          showClose: true,
          message: "更新成功",
          type: "success",
        });
      } else {
        ElMessage({
          showClose: true,
          message: "用户名和密码不匹配",
          type: "error",
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-top: 20px;
  .box-card {
    text-align: center;
  }
}
</style>
