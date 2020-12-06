<template>
  <div class="login-bg">
    <div class="form-Box">
      <!-- :model="名字" 表单数据 需要同名称数据对象 
         :rules="名字" 表单验证规则 需要同名称数据对象数组对象{[{}]}多条
         ref="名字"表单组件的引用
         prop="password"要被验证的项
             
      -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <h2>登录</h2>
        <el-form-item label prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {mapMutations} from "vuex"
export default {
    methods:{
      ...mapMutations(["setinfo"]),
       submit(form){
         this.$refs[form].validate(value=>{
          //  vlaue 被验证的表单数据
          if(!value){
            // 没有通过不提交
              return false
          }else{
            // 通过请求数据
              let str = this.$qs.stringify(this.ruleForm);
              this.$http.post(this.$API.USERLOGIN,str).then(res=>{
                // console.log(res)
                  // 进行判断 验证通过进行传参把tonken userinfo写进浏览器进行跳转到首页 不通过就错误消息提示
                  if (res.code==200) {
                     this.setinfo({token:res.list.token,userinfo:res.list});
                     this.$router.replace('/index')

                  }else{
                      this.$message.error("账号或者密码错误");
                      
                  }
                 
              })
          }

         })

       }
    },
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            // 没输入离开焦点的验证规则
            required: true,
            message: "请输入管理员账号",
            trigger: "blur",
          
          },
          {
            //   输入不符合条件的验证规则
            message: "请输入4-8非空字符",
            trigger: "blur",
            pattern: /^\S{4,8}$/
          }
        ],
        password: [
          {
            required: true,
            message: "请输入管理员密码",
            trigger: "blur"
          },
          {
            message: "请输入5-8位字符",
            trigger: "blur",
            max: 8,
            min: 5
          }
        ]
      }
    };
  }
};
</script>
<style  lang="less">
.login-bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .form-Box {
    width: 300px;
    height: 250px;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    margin: auto;
    text-align: center;
  }
  .el-button {
    width: 100%;
  }
  h2 {
    color: red;
    margin-bottom: 20px;
  }
}
</style>