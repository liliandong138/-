<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true" round
      >添加</el-button
    >
    <el-dialog
      title="轮播图添加"
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
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片">
          <!-- 上传组件主题
                action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                on-preview:设置预览时的 回调函数
                on-remove:设置移除时的 回调函数
                on-change:设置选择上传图片时的回调函数
           -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 放大图片设置 
            visible：显示状态
            apped-to-body:多个对话框的堆叠顺序问题
          -->
          <el-dialog :visible.sync="preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
        label="轮播图名称"
        width="180"
        prop="title"
      ></el-table-column>
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
      dialogVisible: false,//对话框的状态
      tableData: [],//渲染页面的数据
      dialogImageUrl: "", //放大图片的地址
      preVisible: false, //放大图片对话库显示状态
      fileList: [], //上传的文件列表
      formdata: {//对话框数据
        img: "",
        status: true,
        title: "",
      },
      rules: {//验证
        title: [
          {
            required: true,
            message: "请填写轮播图标题",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getlbt();
    // console.log(this.jslist);
  },
  methods: {
    //列表数据
    getlbt() {
      this.$http.get("/api/bannerlist").then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.tableData = res.list ? res.list : [];
        }
      });
    },
    getlist() {},
    //重置
    cz() {
      this.formdata = {
        img: "",
        status: true,
        title: "",
      };
      this.fileList = [];
    },
    //删除
    Delete(row) {
      // console.log(row);
      let id = row.id;
      this.$http.post("/api/bannerdelete", { id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("您删除成功");
          this.getlbt();
        }
      });
    },
    //编辑
    bj(row) {
      this.dialogVisible = true;
      this.$http.get("/api/bannerinfo", { id: row.id }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.formdata = res.list ? res.list : [];
          this.formdata.id = row.id
          this.fileList = [
            {
              name: "",
              url: "http://localhost:3000" + this.formdata.img,
            },
          ];
          this.formdata.status = this.formdata.status == 1 ? true : false;
        }
      });
    },
    //提交
    sbmi() {
      let url = this.formdata.id ? "/api/banneredit" : "/api/banneradd";
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.formdata);
      console.log(url);
      this.$http.upload(url, this.formdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("您已操作成功");
          this.dialogVisible = false;
          this.getlbt();
        }
      });
    },
    // file：选中的上传图片对象
    handlePreview(file) {
      // console.log("handlePreview")
      this.dialogImageUrl = file.url; // 设置放大图片地址
      this.preVisible = true; //显示放大框
    },
    // @file:上传文件信息对象 file.raw就是被上传的文件数据
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      console.log(file, fileList);
      this.formdata.img = file.raw;
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