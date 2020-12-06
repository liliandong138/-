<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <br />
    </el-breadcrumb>
    <el-button class="btn" @click="AddFn">添加</el-button>
    <el-table :data="datalist" row-key="id">
      <el-table-column label="角色名称" prop="rolename"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="角色添加">
      <!-- 表单 -->
      <el-form :rules="rules" :model="formdata" ref="Roledate">
        <!-- 在表单内prop="rolename"是要验证的数据与表单数据的键名同名 -->
        <el-form-item prop="rolename" label="角色名称" label-width="80px">
          <el-input v-model="formdata.rolename"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="menus" label-width="80px">
          <!-- 树状关联的数据 
           :data="dropdata"
           show-checkbox 左侧选择框的显示
           树状结构设置 
           :props="{
                   children:'children','children'树状结构名称
                   label:title 数据关联的文字
           }"
           node-key：节点的标识 选中的值(选中项)
            在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
                check-strictly
                  默认勾选的节点的 key 的数组
                :default-expanded-keys="[2, 3]"

          -->
          <el-tree
            ref="tree"
            :props="{
                    children: 'children',
                     label: 'title'
           }"
            :data="dropdata"
            show-checkbox
            node-key="id"
            check-strictly
            :default-checked-keys="checkedKeys"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //表格数据
      datalist: [],
      // 对话框显示状态
      dialogVisible: false,
      // 编辑时预先选中项
      checkedKeys: [],
      // 表单数据绑定
      formdata: {
        rolename: "",
        menus: [],
        status: true
      },
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ]
      },
      // 树状数据
      dropdata: []
    };
  },
  mounted() {
    // 数据调用
    this.getlist();
    this.droplist();
  },
  methods: {
    // 编辑
    handleEdit(id) {
      this.dialogVisible = true;
      this.$http.get(this.$API.ROLEINFO, { id }).then(res => {
        if (res.code == 200) {
          console.log(res);
          this.formdata.menus = res.list ? res.list.menus.split(",") : [];
          this.checkedKeys = res.list ? res.list.menus.split(",") : [];
          this.formdata.rolename = res.list.rolename;
          this.formdata.status = res.list.status == 1 ? true : false;
          // 接口说明编辑需要id
          this.formdata.id = id;
    
        }
      });
    },
    // 删除
    handleDelete(id) {
      this.$http.post(this.$API.ROLEDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          // 更新表格数据(被删除)
          this.getlist();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 添加还是编辑
    submit() {
      let url = this.formdata.id ? this.$API.ROLEEDIT : this.$API.ROLEADD;
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.status);
      this.formdata.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      this.$http.post(url, this.formdata).then(res => {
        console.log(res.list);
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.dialogVisible = false;
          // 更新表格数据(被添加)
          this.getlist();
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    // 对话框弹出
    AddFn() {
      this.dialogVisible = true;
    },
    // 请求树形结构数据在调用赋值
    async droplist() {
      let res = await this.$http
        .get(this.$API.MENULIST, { istree: true })
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.dropdata = res.list ? res.list : [];
            // console.log(this.droplist);
          } else {
            this.$message.error("数据请求失败");
          }
        });
    },
    // 请求表格数据在调用赋值
    async getlist() {
      let res = await this.$http.get(this.$API.ROLELIST).then(res => {
        //  console.log(res)
        if (res.code == 200) {
          this.datalist = res.list ? res.list : [];
          // console.log(this.datalist);
        } else {
          this.$message.error("数据请求失败");
        }
      });
    }
  }
};
</script>
<style lang="less">
.el-button--primary {
  width: 100px;
}
.btn {
  background: #409eff;
  color: #fff;
  margin: 20px 0;
}
</style>