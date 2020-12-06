<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible=true">添加</el-button>
    <!-- 表格
    prop="catename"在表格中是列单元格的文本
     row-key="id"   
    行数据的 Key，用来优化 Table 的渲染；
    在使用 reserve-selection 功能与显示树形数据时，
    该属性是必填的。类型为 String 时，支持多层访问：
    :tree-props="{
               children:'children',   子节点的名字
               hasChildren:'hasChildren' 是否有子节点默认'hasChildren'
               }"
      渲染嵌套数据的配置选项
        
    -->
    <el-table
      :data="catelist"
      row-key="id"
      :tree-props="{
               children:'children',
               hasChildren:'hasChildren'
               }"
    >
      <el-table-column label="分类名称" prop="catename" width="200"></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="80px" :rules="rules" :model="formdata">
        <el-form-item prop="rolename" label="上级分类">
          <el-select v-model="formdata.pid">
            <el-option key="0" label="顶级分类" value="0"></el-option>
            <el-option
              v-for="item in toplist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="classification" label="分类名称">
          <el-input v-model="formdata.catename"></el-input>
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
            <img width="100%" :src="dialogImageUrl" alt="" />
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
      // 表格数据
      catelist: [],
      // 顶级菜单选择器数据
      toplist: [],
      // 上传文件数组
      fileList: [],
      // 对话框显示状态
      dialogVisible: false,
      // 图片放大的地址
      dialogImageUrl: "",
      //放大图片对话库显示状态
      preVisible: false,
      // 表单数据
      formdata: {
        pid: "",
        catename: "",
        img: "",
        status: true
      },
      // 表单验证规则
      rules: {
        rolename: [
          {
            required: true,
            message: "请选择菜单名称",
            trigger: "blur"
          }
        ],
        classification: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getlist();
    // this.getTopCate()
    this.getToplist();
  },
  methods: {
    // 编辑
    editFn(id) {
      this.dialogVisible = true;
      this.$http.get(this.$API.CATEINFO, { id }).then(res => {
        console.log(res.list);
        if (res.code == 200) {
          this.fileList = [
            {
              name:"",
              url: "http://localhost:3000" + res.list.img
            }
          ];
          this.formdata = {
            ...res.list
          };
          this.formdata.id = id;
          this.formdata.status = res.list.status ? 1 : 2;
        }
      });
    },
    // 表单数据提交
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.id ? this.$API.CATEEDIT : this.$API.CATEADD;
      this.$http.upload(url, this.formdata).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("操作成功");
        } else {
          this.$message.error("添加失败");
        }
        this.dialogVisible = false;
        this.getlist();
      });
    },

    // 文件移除触发的回调函数
    handleRemove() {},
    // 设置文件上传点击预览放大的回调函数
    handlePreview(file) {
      // 设置放大图片地址
      this.dialogImageUrl = file.url;
      //显示放大框
      this.preVisible = true;
    },
    // 设置文件上传的回调函数获取上传图片的相关信息
    // @file:上传文件信息对象 file.raw就是被上传的文件数据(相关信息)
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      console.log(file, fileList);
      this.formdata.img = file.raw;
    },
    // 删除
    deleFn(id) {
      this.$http.post(this.$API.CATEDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getlist();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 请求顶级菜单数据（选择器内菜单）
    getToplist() {
      this.$http.get(this.$API.CATELIST, { pid: 0 }).then(res => {
        console.log(res.list);
        if (res.code == 200) {
          this.toplist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 请求表格数据
    async getlist() {
      this.$http.get(this.$API.CATELIST, { istree: true }).then(res => {
        // console.log(res)
        if (res.code == 200) {
          this.catelist = res.list ? res.list : [];
          console.log(this.catelist)
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>