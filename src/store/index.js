import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

export default new Vuex.Store({
       state:{
           token:localStorage.getItem("token")?localStorage.getItem("token"):"",
           userinfo:localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):{}
       },
       mutations:{
           setinfo(state,payload){
            //    数据在vuex里面随着页面刷新数据重置
               localStorage.setItem("token",payload.token);
               localStorage.setItem("userinfo",JSON.stringify(payload.userinfo))
               state.token=payload.token;
               state.userinfo=payload.userinfo;
           },
           clearinfo(state){
            //    清空登录信息
            localStorage.removeItem("token");
            localStorage.removeItem("userinfo");
                    state.token="";
                    state.userinfo={}
           }
       }


})

