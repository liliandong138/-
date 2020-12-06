<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dialog
      title="会员修改"
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
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formdata.nickname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formdata.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formdata.password"></el-input>
          <span>不填写则视为不修改密码</span>
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
        label="昵称"
        width="180"
        prop="nickname"
      ></el-table-column>
      <el-table-column
        label="手机号"
        width="180"
        prop="phone"
      ></el-table-column>
      <el-table-column
        label="注册日期"
        width="200"
        prop="addtime"
      ></el-table-column>
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
            background:设置背景
            layout:布局
            total:总条数
            page-size:每一页数据量
            current-change:当前页面发生变化触发的事件
            current-page:当前的页数
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      size: 2,//获取会员列表的条数
      total: 0,//总页数
      page: 1,//当前页
      dialogVisible: false,//对话框状态
      tableData: [],//渲染页面的数据
      formdata: {//对话框数据
        nickname: "",
        phone: "",
        password: "",
        status: true,
      },
      rules: {//验证
        phone: [
          {
            required: true,
            message: "请填写手机号",
            trigger: "blur",
          },
          {
            pattern: /^\S{11}$/g,
            message: "请输入11位电话号码",
            trigger: "blur", //失去焦点时触发验证
          },
        ],
      },
    };
  },
  mounted() {
    this.gethy();
    // console.log(this.jslist);
  },
  methods: {
    //获取会员列表
    gethy() {
      this.$http
        .get("/api/memberlist", { size: this.size, page: this.page })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            // res.list.addtime = this.$http.format(Number(res.list.addtime)) ;
            this.tableData = res.list ? res.list : [];
            for (var key in this.tableData) {
              this.tableData[key].addtime = this.$http.format(
                Number(this.tableData[key].addtime)
              );
            }
            console.log(this.tableData);
          }
        });
    },
    getlist() {},
    //重置
    cz() {
      this.formdata = {
        nickname: "",
        phone: "",
        password: "",
        status: true,
      };
    },
    //编辑
    bj(row) {
      this.dialogVisible = true;
      console.log(row);
      this.$http.get("/api/memberinfo", { uid: row.uid }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.formdata = res.list ? res.list : [];
          this.formdata.status = this.formdata.status == 1 ? true : false;
        }
      });
    },
    //提交
    sbmi() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.formdata);
      this.$http.post('/api/memberedit', this.formdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("您已操作成功");
          this.dialogVisible = false;
          this.gethy();
        }
      });
    },
    //更新当前页
    pageChange(page) {
      //   console.log(page);
      this.page = page;
      this.gethy();
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