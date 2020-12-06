<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn" class="btn">添加</el-button>
    <!--
      表格绑定的数据
      :data="userlist"
      表格单元格列数据（文本）
      prop="uid"
    -->
    <!-- 表格区域 -->
    <el-table :data="userlist">
      <el-table-column lable="用户编号" prop="uid" width="200"></el-table-column>
      <el-table-column lable="角色名称" prop="rolename" width="200"></el-table-column>
      <el-table-column lable="用户名" prop="username" width="200"></el-table-column>
      <el-table-column lable="状态" width="200">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column lable="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    background  背景颜色默认
    layout="prev, pager, next"  组件布局，子组件名用逗号分隔
     :total="分页的总数"
     :page-size="this.size" 每页显示的条数
     :current-page="this.page" 当前默认页数
     @current-change="pageChange"页面发生变化触发的函数 返回值当前页
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="this.total"
      @current-change="pageChange"
      :current-page="this.page"
      :page-size="this.size"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn">
      <!-- 表单内容
    
       lable-width 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
       ：model:绑定的数据
       ref：标记
       ：rules=表单验证
       props="表单要验证的项"
      -->

      <el-form label-width="80px" :model="fromdata" ref="roleform" :rules="rules">
        <el-form-item label="角色" prop="rolename">
          <!-- 将被选中的的角色（role）的id，作为新增管理员的roleid -->
          <el-select v-model="fromdata.roleid" placeholder="请选择">
            <!-- 选择器的配置项
           :lable="ltem.rolename" 选择器角色列表的文字
           :value="item.id"的值v-model的值双向绑定
            -->
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="fromdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="fromdata.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="fromdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  //  表格绑定数据
  data() {
    return {
      // 条总数
      total: 0,
      // 当前页数
      page: 1,
      // 页条数
      size: 2,
      // 表格数据
      userlist: [],

      dialogVisible: false,

      // 表单数据绑定
      fromdata: {
        roleid: "",
        username: "",
        password: "",
        status: true
      },
      // 角色列表数据
      rolelist: [],
      // 表单内容验证
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          },
          {
            message: "请输入1到5个非空字符",
            trigger: "blur",
            min: 2,
            max: 5
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            message: "请输入6-8非空字符",
            trigger: "blur",
            min: 6,
            max: 8
          }
        ]
      }
    };
  },
  mounted() {
    this.getdata();
    this.getroledata();
  },
  methods: {
    // 编辑
    editFn(uid){
      this.dialogVisible=true
      this.$http.get(this.$API.USERINFO,{uid}).then(res=>{
        console.log(res)
        if(res.code==200){
          this.fromdata={
           ...res.list
          }
        }
        this.fromdata.status=res.list.status==1?true:false

      })


    },
    // 第一次添加成功后再次添加里面信息重置
    openFn() {
      this.fromdata = {
        roleid: "",
        username: "",
        password: "",
        status: true
      };
    },
    // 删除
    deleFn(id) {
      this.$http.post(this.$API.USERDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getdata();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 页面发生变化触发的函数 page新页数
    pageChange(page) {
      this.page = page;
      this.getdata();
    },
    // 提交
    async submit() {
      // 提交状态判断
      this.fromdata.status = this.fromdata.status ? 1 : 2;
      // 判断是编辑还是添加 添加是没有uid
      let url = this.fromdata.uid ? this.$API.USEREDIT : this.$API.USERADD;
      let str = this.$qs.stringify(this.fromdata);
      let res = await this.$http.post(url, str);
      console.log(res);
      if (res.code == 200) {
        this.$message.success("操作成功");
        this.getdata();
        this.dialogVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 对话框显示
    addFn() {
      this.dialogVisible = true;
    },
    async getdata() {
      // 请求管理员页数数据
      let res = await this.$http.get(this.$API.USERLIST, {
        page: this.page,
        size: this.size
      });
      if (res.code == 200) {
        this.userlist = res.list ? res.list : [];
        // console.log(this.userlist);
      } else {
        this.$message.error(res.msg);
      }
      // 请求管理员总数数据
      let res1 = await this.$http.get(this.$API.USERCOUNT);
      // console.log(res1)
      this.total = res1.list[0].total;
    },
    // 请求角色列表数据
    async getroledata() {
      let res = await this.$http.get(this.$API.ROLELIST);
      // console.log(res)
      if (res.code == 200) {
        this.rolelist = this.rolelist ? res.list : [];
        // console.log(this.rolelist);
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>