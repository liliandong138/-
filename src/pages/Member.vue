<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
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
    <el-table :data="memberlist" row-key="id">
      <el-table-column label="昵称" width="200" prop="nickname"></el-table-column>
      <el-table-column label="手机号" width="200" prop="phone"></el-table-column>
      <el-table-column label="注册日期" width="200" prop="addtime"></el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog

      width="50%"
      :visible.sync="dialogVisible"

    >
      <el-form label-width="80px"  :model="fromdata">
        <!-- label是表单文本 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="fromdata.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="fromdata.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="fromdata.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="fromdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFn">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格数据
      memberlist: [],
      // 当前页
      page: "",
      // 每页显示的数据
      size: "",
      // 对话框显示状态
      dialogVisible:false,
      // 表单数据
      fromdata:{
        nickname:"",
        phone:"",
        password:"",
        status:true
      }
    };
  },
  mounted() {
    // 获取表格数据
    this.getmemberlist();
  },
  methods: {
    // 提交
    submitFn(){
            this.$http.post(this.$API.MEMBEREDIT,this.fromdata).then(res=>{
              console.log(res.list)
               if(res.code==200){
                 this.$message.success("操作成功")

               }else{
                this.$message.error(res.msg)
               }
            })
             this.dialogVisible=false
    },
    // 编辑
    editFn(uid){
            this.dialogVisible=true;
            this.$http.get(this.$API.MEMBERINFO,{uid}).then(res=>{
              console.log(res.list)
               if(res.code==200){
                 this.fromdata.uid=uid
                 this.fromdata.status=this.fromdata.status?1:2
                 this.fromdata={
                   ...res.list
                 }
               }
            })
          
    },

    // 请求表格数据
    getmemberlist() {
      this.$http
        .get(this.$API.MEMBERLIST, { page: this.page, size: this.size })
        .then(res => {
          if (res.code == 200) {
            res.list.map(item => {
              item.addtime = this.getTime(parseInt(item.addtime));
              
            });
            this.memberlist=res.list?res.list:[]
          }
        
        });
    },
    // 时间戳转换函数
    getTime(dateStr) {
      var date = new Date(dateStr);
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Y = date.getFullYear() + "-";
      var M = Month < 10 ? "0" + Month + "-" : Month + "-";
      var D = Day + 1 < 10 ? "0" + Day : Day;
      return Y + M + D;
    }
  }
};
</script>