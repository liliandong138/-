// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入全局组件
import MenuNeir from "./components/MenuNeir"
// 安装插件包后引入
import ElementUI from 'element-ui';
// 引入样式
import 'element-ui/lib/theme-chalk/index.css';
// 引入封装的axios
import http from './utils/http'
// 引入vuex
import store from './store'
// 引入qs
import qs from 'qs'
// 引入api
import API from './API'

// 安装插件
Vue.use(ElementUI);
// 添加到原型
Vue.prototype.$API=API
Vue.prototype.$http=http
Vue.prototype.$qs=qs
Vue.config.productionTip = false
// 注册全局组件
Vue.component("menu-neir",MenuNeir)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
