<template>
     <!-- 下拉菜单 -->
    <el-dropdown @command="loginout">
      <!-- 下拉菜单项 -->
      <span class="el-dropdown-link">
        <span>{{usernamer}}</span>
        <!-- 图标引用 -->
        <i class="el-icon-setting"></i>
      </span>
      <!-- 下拉菜单选项 -->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

</template>
<script>

export default {
  // 接收组件传来的数据并验证
  props:{
      usernamer:{
            type:String,
            required:true

      }
  },
  methods:{
        // 登录清除通过@command自定义事件
        loginout(){
          this.$store.commit("clearinfo")
          this.$router.replace("/login")
        }
  }

    
    
        
   

        
       
    
}
</script>