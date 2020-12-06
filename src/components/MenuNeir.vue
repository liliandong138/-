<template>
  <div>
    <template>
      <!-- data=数据
        label=每一列的表头直接写文本
        scope=包含每一行的的数据对象
        row=每一行数据
        prop=每一列的单元格数据  纯文本使用
        <template slot-scope="scope"> 非纯文本使用
        <el-tag v-if="scope.row.type==1">目录</el-tag>
         <el-tag v-else-if="scope.row.type==2" type="success">菜单</el-tag>
          </template>
       :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        children: '树形结构数据名称'
       'hasChildren'是否有树形结构数据
        row-key="id"每一行的标识
        type="success"类名
        
      -->
      <el-table
        :data="MENULIST"
        style="width: 100%"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
      >
        <el-table-column label="日期" width="180" prop="title"></el-table-column>
        <el-table-column label="图标" width="180" prop="icon">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==1">目录</el-tag>
            <el-tag v-else-if="scope.row.type==2" type="success">菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="菜单URL" width="180" prop="url">

        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="$emit('edit',scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
 <script>
export default {
  methods: {
    handleDelete(id) {
        // 删除弹框提示
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
            // 删除操作
          this.$http
            .post(this.$API.MENUDELETE, this.$qs.stringify({ id }))
            .then(res => {
              if (res.code == 200) {
                console.log(res);
                this.$message.success("删除成功");
                this.$emit("changeMenu",res.list)
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    }
  },
//   接收父组件传值
  props: {
    MENULIST: {
      type: Array,
      required: true
    }
  }
};
</script>