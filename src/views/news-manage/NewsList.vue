<template>
  <div>
    <el-card>
      <el-page-header title="新闻管理" icon="">
        <template #content>
          <span class="text-large font-600 mr-3"> 新闻列表 </span>
        </template>
      </el-page-header>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column label="分类">
          <template #default="scope">
            {{ categoryFormat(scope.row.category) }}
          </template>
        </el-table-column>
        <el-table-column label="更新事件">
          <template #default="scope">
            {{ formatTime.getTime(scope.row.editorTime) }}
          </template>
        </el-table-column>
        <el-table-column label="是否发布">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isPublish"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              circle
              :icon="Star"
              size="small"
              @click="handlePreview(scope.row)"
              type="success"
            ></el-button>
            <el-button
              circle
              :icon="Edit"
              size="small"
              @click="handleEdit(scope.row)"
            ></el-button>

            <el-popconfirm
              title="你确定要删除吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button
                  circle
                  :icon="Delete"
                  size="small"
                  type="danger"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="预览新闻" width="50%">
      <div>
        <h2>{{ previewData.title }}</h2>
        <div style="font-size: 12px; color: gray">
          {{ formatTime.getTime(previewData.editorTime) }}
        </div>
        <el-divider>
          <el-icon><star-filled /></el-icon>
        </el-divider>

        <div v-html="previewData.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import formatTime from "@/util/formatTime";
import { Star, Edit, Delete, StarFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter()
const tableData = ref([]);
const previewData = ref();
const dialogVisible = ref(false);
onMounted(async () => {
  await getTableData();
});
const getTableData = async () => {
  const res = await axios.get(`/adminapi/news/list`);
  // console.log(res.data)
  tableData.value = res.data.data;
};

const categoryFormat = (category) => {
  const obj = {
    1: "最新动态",
    2: "典型案例",
    3: "通知公告",
  };

  return obj[category];
};
const handleSwitchChange = async (item) => {
  await axios.put(`/adminapi/news/publish`, {
    _id: item._id,
    isPublish: item.isPublish,
  });

  await getTableData();
};

const handlePreview = (data) => {
  previewData.value = data;
  dialogVisible.value = true;
};

const handleDelete = async (data) => {
    const result = await axios.delete(`/adminapi/news/list/${data._id}`);
  if (result.data.ActionType == "OK") {
    getTableData();
  }
};
const handleEdit = (data) => {
    router.push(`/news-manage/editnews/${data._id}`)
}
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>
