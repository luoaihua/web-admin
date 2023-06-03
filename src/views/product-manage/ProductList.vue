<template>
    <div>
      <el-card>
        <el-page-header title="产品管理" icon="">
          <template #content>
            <span class="text-large font-600 mr-3"> 产品列表 </span>
          </template>
        </el-page-header>

        <el-table :data="tableData" style="width: 100%">
            
          <el-table-column prop="title" label="产品名称" />
          <el-table-column prop="title" label="introduction" />
          <el-table-column label="更新事件">
          <template #default="scope">
            {{ formatTime.getTime(scope.row.editorTime) }}
          </template>
        </el-table-column>
          
          <el-table-column label="操作">
            <template #default="scope">
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import formatTime from "@/util/formatTime";
  import { Edit, Delete } from "@element-plus/icons-vue";
  import { useRouter } from "vue-router";
  const router = useRouter()
  const tableData = ref([]);
  onMounted(async () => {
    await getTableData();
  });
  const getTableData = async () => {
    const res = await axios.get(`/adminapi/product/list`);
    // console.log(res.data)
    tableData.value = res.data.data;
  };
  
  const handleDelete = async (data) => {
      const result = await axios.delete(`/adminapi/product/list/${data._id}`);
    if (result.data.ActionType == "OK") {
      getTableData();
    }
  };
  const handleEdit = (data) => {
      router.push(`/product-manage/productedit/${data._id}`)
  }
  </script>
  <style lang="scss" scoped>
  .el-table {
    margin-top: 20px;
  }
  </style>
  