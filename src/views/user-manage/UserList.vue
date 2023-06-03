<template>
  <div>
    <el-card>
      <el-page-header title="用户管理" icon="">
        <template #content>
          <span class="text-large font-600 mr-3"> 用户列表 </span>
        </template>
      </el-page-header>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="头像">
          <template #default="scope">
            <div v-if="scope.row.avatar">
              <el-avatar
                :size="50"
                :src="`http://localhost:3000${scope.row.avatar}`"
              ></el-avatar>
            </div>
            <div v-else>
              <el-avatar
                :size="50"
                :src="`https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png`"
              ></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template #default="scope">
            <el-tag v-if="scope.row.role == 1" class="ml-2" type="danger"
              >管理员</el-tag
            >
            <el-tag v-else class="ml-2" type="info">编辑</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="你确定要删除吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button></template
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑用户" width="50%">
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
          <el-input v-model="userFrom.password" type="password" />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
const userFormRef = ref();
const userFrom = reactive({
  username: "",
  password: "",
  role: 2,
  introduction: "",
});
const userFromRules = reactive({
  username: [{ required: true, message: "请输入名字", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
  introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});
const roleOptions = [
  { value: 1, label: "管理员" },
  { value: 2, label: "编辑" },
];

const dialogVisible = ref(false);
const tableData = ref([]);
onMounted(() => {
  getTableData();
});

const getTableData = async () => {
  const result = await axios.post("/adminapi/user/list");
  tableData.value = result.data.data;
};
const handleEdit = async (data) => {
  const res = await axios.get(`/adminapi/user/list/${data._id}`);
  Object.assign(userFrom, {
    ...res.data.data[0],
  });
  dialogVisible.value = true;
};

const handleEditConfirm = async () => {
  userFormRef.value.validate(async (vaild) => {
    if (vaild) {
      const result = await axios.put(
        `/adminapi/user/list/${userFrom._id}`,
        userFrom
      );
      if (result.data.ActionType == "OK") {
        dialogVisible.value = false;
        getTableData();
      }
    }
  });
};

const handleDelete = async (data) => {
  const result = await axios.delete(`/adminapi/user/list/${data._id}`);
  if (result.data.ActionType == "OK") {
    getTableData();
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>
