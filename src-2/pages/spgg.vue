<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true" round
      >添加</el-button
    >
    <el-dialog
      title="规格添加"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getlist"
      @close="cz"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        ref="jsform"
        :rules="rules"
      >
        <el-form-item label="属性名称" prop="specsname">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <div v-for="(item, index) in attrsarr" :key="index">
            <el-input v-model="item.value" :style="{ width: '60%' }"></el-input>
            <el-button type="primary" v-if="index == 0" @click="addAttr"
              >添加属性</el-button
            >
            <el-button type="danger" v-else @click="deleteAttr(index)"
              >删除属性</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <!-- <p>{{formdata.status}}</p> -->
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sbmi">提交</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        label="属性名称"
        width="180"
        prop="specsname"
      ></el-table-column>
      <el-table-column label="属性值" width="200">
        <template slot-scope="scope">
          <el-tag
            type="primary"
            v-for="(item, index) in scope.row.attrs"
            :key="index"
            >{{ item }}</el-tag
          >
        </template>
      </el-table-column>
      <!-- 当前列的数据，
            scope：代表包含每一行的数据对象
            row:行
      -->
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="bj(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="Delete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,//对话框状态
      tableData: [],//渲染页面的数据
      formdata: {//对话框数据
        specsname: "",
        attrs: '',
        status: true,
      },
      rules: {//验证
        specsname: [
          {
            required: true,
            message: "请填写用户名称",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请填写角色密码",
            trigger: "blur",
          },
        ],
      },
      attrsarr:[{value:""}],//属性值构成的数据
    };
  },
  mounted() {
    this.getspgg();
    // console.log(this.jslist);
  },
  methods: {
    //添加属性
    addAttr(){
        this.attrsarr.push({value:''});
    },
    //删除属性
    deleteAttr(i){
        this.attrsarr.splice(i,1);
    },
    //列表数据
    getspgg() {
      this.$http.get("/api/specslist").then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.tableData = res.list ? res.list : [];
        }
      });
    },
    //获取角色列表
    getlist() {},
    //重置数据
    cz() {
      this.formdata={
        specsname: "",
        attrs: '',
        status: true,
      }
    },
    //删除
    Delete(row) {
      // console.log(row);
      let id = row.id;
      this.$http.post("/api/specsdelete", { id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("您删除成功");
          this.getspgg();
        }
      });
    },
    //编辑
    bj(row) {
        console.log(row);
      this.dialogVisible = true;
      this.formdata = {
        ...row,
      };
      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.attrsarr = this.formdata.attrs.map(item=>({value:item}))
    },
    //提交
    sbmi() {
      let url = this.formdata.id ? "/api/specsedit" : "/api/specsadd";
      this.formdata.status = this.formdata.status ? 1 : 2;
      this.formdata.attrs = this.attrsarr.map(item=>item.value).join(",")
      console.log(this.formdata.attrs);
      console.log(this.formdata);
      console.log(url);
      this.$http.post(url, this.formdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("您已操作成功");
          this.dialogVisible = false;
          this.getspgg();
        }
      });
    },
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
</style>