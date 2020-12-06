<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn" class="btn">添加</el-button>
    <!-- 表格 -->
    <el-table :data="goodslist">
      <el-table-column label="一级分类" prop="firstcatename"></el-table-column>
      <el-table-column label="二级分类" prop="secondcatename"></el-table-column>
      <el-table-column label="商品名称" prop="goodsname"></el-table-column>
      <el-table-column label="销售价" prop="market_price"></el-table-column>
      <el-table-column label="市场价" prop="price"></el-table-column>
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
    <!-- 对话框-->
    <el-dialog :visible.sync="dialogVisible" @open="openFn">
      <!-- 表单 -->
      <el-form label-width="100px" :model="formdata">
        <!-- 一级分类 -->
        <el-form-item label="一级分类">
          <!--下拉选择器
           组件自带下拉选择器的事件
           @change  选中值发生变化时触发	回调参数目前的绑定的v-model值与：value挂钩
          -->
          <el-select @change="secondFn" v-model="formdata.first_cateid" placeholder="请选择">
            <el-option
              v-for="item in firtlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- 二级分类 -->
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="formdata.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="formdata.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="图片上传">
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
        <el-form-item label="商品规格">
          <el-select v-model="formdata.specsid" placeholder="请选择" @change="specsChange">
            <el-option
              v-for="item in specslist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格属性">
          <el-select v-model="formdata.specsattr" placeholder="请选择" multiple>
            <el-option v-for="item in attrs" :key="item" :label="item" :value="item"></el-option>
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
        <el-form-item label="状态">
          <el-radio v-model="formdata.status" :label="1">上架</el-radio>
          <el-radio v-model="formdata.status" :label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
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
      goodslist: [],
      // 分页总数
      total: 0,
      // 当前页
      page: 1,
      // 每页显示的条数
      size: 2,
     
      fileList: [],
      // 对话框显示状态
      dialogVisible: false,
      // 图片放大的地址
      dialogImageUrl: "",
      //放大图片对话库显示状态
      preVisible: false,
      // 表单数据
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
        status: 1
      },
      // 商品一级分类数据
      firtlist: [],
      // 商品二级分类商品
      secondlist: [],
      // 商品规格（属性）分类数据
      specslist: [],
      // 属性值列表
      attrs: []
    };
  },
  mounted() {
    this.getGoodsdata();
    this.getFristCateList();
    this.getSpecslist();
  },
  methods: {
    // 编辑
    editFn(id){
            this.dialogVisible=true
             this.$http.get(this.$API.GOODSINFO,{id}).then(res=>{
              console.log(res.list)
               this.formdata={
                 ...res.list
               }
             })
            //  获取二级分类列表
             this.secondFn(this.formdata.first_cateid)
            //  获取规格属性值
             this.formdata.specsattr = this.attrs.split(",");
             this.formdata.specsattr = this.formdata.specsattr.split(",");
    },
    // 删除
    deleteFn(id){
        this.$http.post(this.$API.GOODSDELETE,{id}).then(res=>{
           if(res.code==200){
             this.$message.success("操作成功")
           }else{
             this.$message.error(res.msg)
           }
           
        })
         this.getGoodsdata();
    },
    // 页面变化更新数据 回调参数当前所在页面
    pageChange(page){
      this.page=page
      this.getGoodsdata();
    },
    
    // 提交
    submit() {
      // 判断是编辑还是提交
      let Url = this.formdata.id ? this.$API.GOODSEDIT : this.$API.GOODSADD;
      console.log(this.formdata)
      // 规格属性转成后台需要的字符串形式
      this.formdata.specsattr = this.attrs.join(",");
      
      // 包含图片的文件上传
      this.$http.upload(Url, this.formdata).then(res => {
        
        if (res.code == 200) {
          this.$message.success("操作成功");
         
        } else {
          this.$message.error(res.msg);
        }
          
      });
          this.dialogVisible = false;
          this.getGoodsdata();
    },
    // 文件移除时触发的回调函数
    handleRemove() {},
    //  设置文件上传点击预览放大的回调函数
    handlePreview(file) {
      //  设置放大图片地址
      this.dialogImageUrl = file.url;
      // 显示放大框
      this.preVisible = true;
    },
    // 设置文件上传的回调函数获取上传图片的相关信息
    // @file:上传文件信息对象 file.raw就是被上传的文件数据(图片相关信息)
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      // console.log(file, fileList);
      this.formdata.img = file.raw;
    },
    // 获取对话框二级分类数据
          // uip
    // 一级菜单的id等于二级菜单的uip 通过@change事件绑定的id传入获得对于二级分类
    secondFn(pid) {
      this.$http.get(this.$API.CATELIST, { pid }).then(res => {
       
        if (res.code == 200) {
          this.secondlist = res.list ? res.list : [];
          
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //  打开对话框获得一级分类数据
    openFn() {
      this.getFristCateList();
    },
    // 添加显示对话框
    addFn() {
      this.dialogVisible = true;
    },
    //    请求表格商品与商品总数数据
    getGoodsdata() {
      this.$http
        .get(this.$API.GOODSLIST, { page: this.page, size: this.size })
        .then(res => {
          if (res.code == 200) {
            this.goodslist = res.list ? res.list : [];
          
          }
        });
      this.$http.get(this.$API.GOODSCOUNT).then(res => {
        this.total = res.list[0].total;
        //  console.log(this.total)
      });
    },
    // 请求商品一级分类数据 pid作为参数获取一级分类 0就是一级分类
    getFristCateList() {
      this.$http.get(this.$API.CATELIST, { pid: 0 }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.firtlist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 请求规格列表数据
    getSpecslist() {
      this.$http.get(this.$API.SPECSLIST).then(res => {
    
        if (res.code == 200) {
          this.specslist = res.list ? res.list : [];
        }
      });
    },
    // 获取商品规格属性
    specsChange(id) {
      this.attrs = this.specslist.find(item => (item.id = id)).attrs;
      // console.log(id);
      // console.log(this.attrs);
    }
  }
};
</script>