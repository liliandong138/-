<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true" round
      >添加</el-button
    >
    <el-dialog
      title="商品添加"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getlist"
      @close="cz"
      @opened="openedfn"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        ref="jsform"
        :rules="rules"
      >
        <el-form-item prop="rolename" label="一级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select
            v-model="formdata.first_cateid"
            placeholder="请选择"
            @change="getlist2"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in erjilist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="username">
          <el-input v-model="formdata.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="图片">
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
        <el-form-item prop="goodsname" label="商品规格名">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select
            v-model="formdata.specsid"
            placeholder="请选择"
            @change="shux"
          >
            <el-option
              v-for="item in shuxlist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格值">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.specsattr" multiple placeholder="请选择">
            <el-option
              v-for="item in attrs"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价">
          <el-input type="number" v-model="formdata.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input type="number" v-model="formdata.market_price"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="formdata.ishot" :label="1">是</el-radio>
          <el-radio v-model="formdata.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formdata.isnew" :label="1">是</el-radio>
          <el-radio v-model="formdata.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="formdata.status" :label="1">上架</el-radio>
          <el-radio v-model="formdata.status" :label="2">下架</el-radio>
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
        label="一级分类"
        width="180"
        prop="firstcatename"
      ></el-table-column>
      <el-table-column
        label="二级分类"
        width="180"
        prop="secondcatename"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        width="180"
        prop="goodsname"
      ></el-table-column>
      <el-table-column
        label="销售价"
        width="180"
        prop="price"
      ></el-table-column>
      <el-table-column
        label="市场价"
        width="180"
        prop="market_price"
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
          <el-button size="mini" type="danger" @click="Delete(scope.row)"
            >删除</el-button
          >
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
import E from "wangeditor";
export default {
  data() {
    return {
      size: 2,//获取商品的条数
      total: 0,//总页数
      page: 1,//当前页码
      dialogVisible: false,//对话框状态
      tableData: [],//渲染的数据
      dialogImageUrl: "", //放大图片的地址
      preVisible: false, //放大图片对话库显示状态
      fileList: [], //上传的文件列表
      //表格绑定数据
      formdata: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      rules: {//验证
        goodsname: [
          {
            required: true,
            message: "请填写商品名称",
            trigger: "blur",
          },
        ],
      },
      rolelist: [], //一级标签的数据
      erjilist: [], //二级标签的数据
      shuxlist: [], //属性
      attrs: [], //属性值
    };
  },
  mounted() {
    this.getgly();
    // console.log(this.jslist);
  },
  methods: {
    //商品列表数据
    getgly() {
      this.$http.get("/api/goodscount").then((res) => {
        if (res.code == 200) {
          this.total = res.list[0].total;
        }
      });
      this.$http
        .get("/api/goodslist", { size: this.size, page: this.page })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.tableData = res.list ? res.list : [];
          }
        });
    },
    //一级标签和属性数据
    getlist() {
      //获取一级标签
      this.$http.get("/api/catelist", { pid: 0 }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.rolelist = res.list ? res.list : [];
        }
      });
      //获取一级属性
      this.$http.get("/api/specslist").then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.shuxlist = res.list ? res.list : [];
        }
      });
    },
    //通过一级标签获得的pid来获取二级标签的数据
    getlist2(pid) {
      // console.log(pid);
      this.$http.get("/api/catelist", { pid }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.erjilist = res.list ? res.list : [];
        }
      });
    },
    //重置
    cz() {
      this.formdata = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.fileList = [];
      this.editor = null;
      document.getElementById("editor").innerHTML = ""; //重置富文本编辑器的html内容
    },
    //打开对话框后执行的函数
    openedfn() {
      this.editor = new E("#editor");
      // 设置监听输入操作的回调函数，newHtml ：输入的内容
      this.editor.config.onchange = (newHtml) => {
        // console.log("change 之后最新的 html", newHtml);
        this.formdata.description = newHtml;
      };
      this.editor.create();
      //返回的数据设置为 富文本编辑框的内容
      this.editor.txt.html(this.formdata.description);
    },
    //删除
    Delete(row) {
      // console.log(row);
      let id = row.id;
      this.$http.post("/api/goodsdelete", { id }).then((res) => {
        if (res.code == 200) {
          this.page = 1;
          this.$message.success("您删除成功");
          this.getgly();
        }
      });
    },
    //编辑
    bj(row) {
      this.dialogVisible = true;
      console.log(row);
      this.$http.get("/api/goodsinfo", { id:row.id }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = row.id;
          //获取商品信息获取 二级分类列表
          this.getlist2(this.formdata.first_cateid);
          this.formdata.specsattr = row.specsattr.split(",");
          this.attrs = row.specsattr.split(",");
          this.fileList = [
            {
              name: "",
              url: "http://localhost:3000" + this.formdata.img,
            },
          ];
          console.log(this.fileList);
          // this.formdata.status = this.formdata.status == 1 ? true : false;
          this.editor = new E("#editor");
          // 设置监听输入操作的回调函数，newHtml ：输入的内容
          this.editor.config.onchange = (newHtml) => {
            // console.log("change 之后最新的 html", newHtml);
            this.formdata.description = newHtml;
          };
          this.editor.create();
          //返回的数据设置为 富文本编辑框的内容
          this.editor.txt.html(this.formdata.description);
        }
      });
    },
    //提交
    sbmi() {
      let url = this.formdata.id ? "/api/goodsedit" : "/api/goodsadd";
      // this.formdata.status = this.formdata.status ? 1 : 2;
      this.formdata.specsattr = this.formdata.specsattr.join(",");
      console.log(this.formdata);
      console.log(url);
      this.$http.upload(url, this.formdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("您已操作成功");
          this.dialogVisible = false;
          this.getgly();
        }
      });
    },
    //更新当前页
    pageChange(page) {
      //   console.log(page);
      this.page = page;
      this.getgly();
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
      console.log("ok");
    },
    //通过选择属性后的id来获取对应的属性值
    shux(id) {
      console.log(id);
      this.attrs = this.shuxlist.find((item) => item.id == id).attrs;
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