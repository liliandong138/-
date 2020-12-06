<template>
  <div class="sidebar-bg">
    <h3>后台管理系统</h3>
    <!-- el-menu 菜单
        el-menu-item 菜单项
        el-submenu 子菜单
    -->
    <!-- 菜单方法 
       background-color="#20222A"   菜单背景颜色
       :default-active="$router.path"  激活样式
       unique-opened  是否只保持一个子菜单的展开与:index="?"有关（唯一标识）
      
    -->
    <el-menu 
            background-color="#20222A" 
            :default-active="$router.path" 
            unique-opened
            >
      <el-menu-item index="/index">
        <i class="el-icon-s-home"></i>
        <router-link to="/index">首页</router-link>
      </el-menu-item>
      <el-submenu v-for="(menu,index) in menus" :key="index" :index="(index+1).toString()">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{menu.title}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(submenu,index) in menu.children" :key="index" >
            <router-link :to="submenu.url">{{submenu.title}}</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  computed: {
    menus() {
      //  请求数据
      return this.$store.state.userinfo.menus;
    }
  }
};
</script>
<style lang="less">
.el-menu-item a {
  color: #fff;
  text-decoration: none;
}
.el-submenu__title {
  color: #fff;
}
.el-menu-item .router-link-active {
  color: #e98e2f;
}
h3 {
  margin-top: 20px;
  text-align: center;
  color: #fff;
}
.el-menu{
         border-right: none;
}
</style>
