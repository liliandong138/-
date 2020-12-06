<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 表格 -->
    <el-table :data="bannerlist">
      <el-table-column label="轮播图名称" prop="title"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="deleteFn(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible"  @close="rest">
      <!-- 表单 -->
      <el-form label-width="90px" :model="formdata">
        <el-form-item prop="rolename" label="轮播图标题">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <!-- 图片上传
               action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                :on-preview:设置预览时的 回调函数
                :on-remove:设置移除时的 回调函数
                :on-change:设置选择上传图片时的回调函数
                :file-list:上传文件列表
          
          
          -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync=" preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态">
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
      // 对话框显示状态
      dialogVisible: false,
      //   表格数据
      bannerlist: [],
      //  文件列表
      fileList: [],
      //   图片放大框
      preVisible: false,
      //   图片放大地址
      dialogImageUrl: "",
      //   表单数据
      formdata: {
        title: "",
        img: "",
        status: true
      }
    };
  },
  mounted() {
    //   请求表格数据
    this.getbannerlist();
  },

  methods: {
    //   添加之后再次打开添加内容重置
    rest() {
      this.fileList = [];
      this.formdata = {
        title: "",
        img: "",
        status: true
      };
    },
    // 点击添加打开对话框
    addFn() {
      this.dialogVisible = true;
      
    },
    //   编辑
    editFn(id) {
      this.dialogVisible = true;
      this.$http.get(this.$API.BANNERINFO, { id }).then(res => {
        if (res.code == 200) {
          this.formdata = {
            ...res.list
          };
        }
        this.fileList = [
          {
            url: "http://localhost:3000" + res.list.img,
            name: ""
          }
        ];
        this.formdata.status = res.list.status == 1 ? true : false;
      
        this.formdata.id = id;
      });

      
    },
    //  设置文件上传点击预览放大的回调函数
    handlePreview(file) {
      // 设置放大图片地址
      this.dialogImageUrl = file.url;
      //显示放大框
      this.preVisible = true;
    },
    // 文件移除时触发的回调函数
    handleRemove() {},
    // 设置文件上传的回调函数获取上传图片的相关信息
    // @file:上传文件信息对象 file.raw就是被上传的文件数据(图片相关信息)
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      // console.log(file, fileList);
      this.formdata.img = file.raw;
    },

    //   获取表格数据
    getbannerlist() {
      this.$http.get(this.$API.BANNERLIST).then(res => {
        console.log(res.list);
        if (res.code == 200) {
          this.bannerlist = res.list ? res.list : [];
        }
      });
    },
    // 提交
    submit() {
      //  判断是编辑还是添加
      let url = this.formdata.id ? this.$API.BANNEREDIT : this.$API.BANNERADD;
      this.formdata.status = this.formdata.status ? 1 : 2;
      this.$http.upload(url, this.formdata).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getbannerlist();
        } else {
          this.$message.success("操作失败");
        }
      });
      this.dialogVisible = false;
    },
    // 删除
    deleteFn(id) {
      this.$http.post(this.$API.BANNERDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getbannerlist();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>