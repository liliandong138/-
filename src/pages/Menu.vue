<template>
  <div>
    <!--separator="/"分割符  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
      <br />
    </el-breadcrumb>
    <el-button class="btn" @click="dialogVisible = true">添加</el-button>
    <menu-neir :MENULIST="MENULIST" @changeMenu="updatamenulist" @edit="editFn"></menu-neir>
    <el-dialog title="新增菜单" :visible.sync="dialogVisible" width="50%" @open="getTop" @close="res">
      <el-form label-width="100px" :rules="rules" :model="formdata" ref="menudata">
        <el-form-item label="菜单类型">
          <el-select v-model="formdata.pid" placeholder="请选择" @change="checkedMenu">
            <el-option :key="0" label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in getTopList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="formdata.pid==0" prop="icon">
          <el-input v-model="formdata.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" v-else prop="url">
          <el-input v-model="formdata.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <!--:label=1 选中项  -->
          <el-radio v-model="formdata.type" :label="1" :disabled="formdata.type!==1">目录</el-radio>
          <el-radio v-model="formdata.type" :label="2" :disabled="formdata.type===1">菜单</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmenu">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      // 表格数据
      MENULIST: [],
      dialogVisible: false /* 对话框显示状态 */,
      getTopList: [] /* 顶级菜单 */,
      formdata: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
         url:"",
        status: true
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur"
          },
          {
            message: "请输入4-8非空字符名称",
            trigger: "blur",
            pattern: /^\S{4,8}$/
          }
        ],
        icon: [
          {
            required: true,
            message: "请输入菜单图标",
            trigger: "blur"
          },
          {
            message: "请输入5-8位字符",
            trigger: "blur",
            max: 8,
            min: 5
          }
        ],
        url: [
          {
            required: true,
            message: "请输入菜单地址",
            trigger: "blur"
          },
          {
            message: "请输入3-10非空字符",
            trigger: "blur",
            min: 3,
            max: 10
          }
        ]
      }
    };
  },

  mounted() {
    this.getList();
    this.res()
  },
  methods: {
    //  父组件自定义事件子组件传值进行编辑
    editFn(data){
             this.dialogVisible=true;
             this.formdata={
               ...data
             }
             this.status=this.status?true:false

    },
    //  重新打开窗口数据重置
    res() {
      this.formdata = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
         url:"",
        status: true
      };
    },

    // 提交事件
    addmenu() {
      // 根据是否存在id判断是添加还是编辑
      let Url =this.formdata.id?this.$API.MENUEDIT:this.$API.MENUDADD
      this.formdata.status = this.formdata.status ? 1 : 2;
      this.$refs.menudata.validate(value => {
        // value 是否验证通过的布尔值
        if (!value) {
          return false;
        } 
          let Addmenu = this.$qs.stringify(this.formdata);
          this.$http.post(Url, Addmenu).then(res => {
            if (res.code == 200) {
              console.log(Addmenu)
              this.$message.success("操作成功");
              //  更新表格数据
              this.getList();
              // 新增窗口消失
              this.dialogVisible = false;
            }
          });
        
      });
    },
    updatamenulist(menulist) {
      this.MENULIST = menulist;
    },
    checkedMenu(pid) {
      this.formdata.type = pid > 0 ? 2 : 1;
    },
    // 请求表格数据
    async getList() {
      let res = await this.$http
        .get(this.$API.MENULIST, { istree: true })
        .then(res => {
          // console.log(res); 
          // 数据赋值
          if (res.code == 200) {
            this.MENULIST = res.list ? res.list : [];
            console.log(this.MENULIST);
            
          } else {
            this.$message.error("数据请求失败");
          }
        });
    },
    // 请求添加顶级菜单数据
    async getTop() {
      let res = await this.$http
        .get(this.$API.MENULIST, { pid: 0 })
        .then(res => {
          if (res.code == 200) {
            console.log(res);
            this.getTopList = res.list ? res.list : [];
          } else {
            this.$message.error("数据请求失败");
          }
        });
    }
  }
};
</script>
<style lang="less" >
.el-button--primary {
  width: 100px;
}
.btn {
  background: #409eff;
  color: #fff;
  margin: 20px 0;
}
</style>