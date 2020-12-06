<template>
  <div class="Loyout">
    <el-container>
      <el-aside width="150px">
        <sider-bar></sider-bar>
      </el-aside>
      <el-container>
        <el-header>
          <!-- 父组件传值给子组件 -->
          <myheader :usernamer="username"></myheader>
        </el-header>
        <el-main>
          <div class="main_bg">
            <router-view></router-view>
          </div>
          
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import myheader from "../components/myheader";
import SiderBar from "../components/SiderBar";
export default {
  components: {
    myheader,
    SiderBar
  },
  computed: {
    username() {
      return this.$store.state.userinfo.username;
    }
  }
};
</script>

<style lang="less">
.Loyout {
  height: 100%;
  // background: rebeccapurple;
  .el-main{
     background:#E5E5E5;
       
  }
  .el-container {
    height: 100%;
 
    .el-aside {
      background: #20222a;
      overflow-x: hidden;
    
    }
    .el-header {
      background: #b3c0d1;
      line-height: 60px;
      text-align: right;
    }
 
    
  }
}
</style>