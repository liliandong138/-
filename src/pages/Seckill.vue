<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible=true">添加</el-button>
    <!-- 表格 -->
    <el-table :data="seckillList" row-key="id">
      <el-table-column label="活动名称" prop="title"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="80px" :model="formdata">
        <el-form-item label="活动名称">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <div class="block">
            <el-date-picker
              v-model="timelist"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeFn"
            >></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select v-model="formdata.first_cateid" @change="secondFn">
            <el-option
              v-for="item in fristlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="formdata.second_cateid" @change="goodsFn">
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="formdata.goodsid">
            <el-option
              v-for="item in goodslist"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
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
      seckillList: [],
      //   一级分类菜单
      fristlist: [],
      //   二级分类菜单
      secondlist: [],
      //   三级商品菜单
      goodslist: [],
      // 时间列表
      timelist: [],
      //   表单数据
      formdata: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: ""
      },
      //   对话框显示状态
      dialogVisible: false
    };
  },
  mounted() {
    //   获取表格数据
    this.getsecklist();
    this.getfristlist();
  },
  methods: {
    // 选定弹窗时间触发的函数通过change绑定的值
    timeFn() {
      this.timelist = this.timelist.map(item => {
        return (item = new Date(item).getTime());
      });
      this.formdata.begintime = this.timelist[0];
      this.formdata.endtime = this.timelist[1];
    },
    //   请求表格数据
    getsecklist() {
      this.$http.get(this.$API.SECKLIST).then(res => {
        if (res.code == 200) {
          this.seckillList = res.list ? res.list : [];
        }
      });
    },
    //请求一级分类菜单数据
    getfristlist() {
      this.$http.get(this.$API.CATELIST, { pid: 0 }).then(res => {
        if (res.code == 200) {
          this.fristlist = res.list ? res.list : [];
          console.log(1);
          
        } else {
          this.$message.error(res.msg);
          console.log(2);
          
        }
      });
    },
    // 请求二级分类菜单数据
    secondFn(pid) {
      this.$http.get(this.$API.CATELIST, { pid }).then(res => {
        //  console.log(res.list);
        if (res.code == 200) {
          this.secondlist = res.list ? res.list : [];
          console.log(this.secondlist);
        } else {
          this.$message.error(res.msg);
          console.log(22222);
          
        }
      });
    },
    // 请求三级商品菜单数据
    goodsFn(sid) {
      console.log(sid);
      this.$http
        .get(this.$API.GOODSLIST, { sid, fid: this.formdata.first_cateid })
        .then(res => {
          console.log(res.list);
          if (res.code == 200) {
            this.goodslist = res.list ? res.list : [];
            console.log(this.goodslist);
          }
        });
    },
    // 时间戳转换年月日函数
    getTime(dateStr) {
      var date = new Date(dateStr);
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Y = date.getFullYear() + "-";
      var M = Month < 10 ? "0" + Month + "-" : Month + "-";
      var D = Day + 1 < 10 ? "0" + Day : Day;
      return Y + M + D;
    },
    //  编辑
    handleEdit(id) {
      this.dialogVisible = true;
      console.log(id);
      
      this.$http.get(this.$API.SECKINFO, { id }).then(res => {
        console.log(res.list);
        if (res.code == 200) {
          this.formdata = {
            ...res.list
          };

        }
      this.formdata.id=id
      // this.formdata.first_cateid = 
      this.formdata.status = this.formdata.status ? 1 : 2;
      secondFn()
      goodsFn()
      });
    },
    // fenlei(pid) {
    //   this.$http.get(this.$API.CATELIST, { pid }).then(res => {
    //     console.log(res.list);
    //     if (res.code == 200) {
    //       this.formdata = {
    //         ...res.list
    //       };
    //     }
    //   });
    // },
    //  删除
    handleDelete(id) {
      this.$http.post(this.$API.SECKDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getsecklist();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //  提交
    //  根据有无id判断是编辑还是添加
    submit() {
      let url = this.formdata.id ? this.$API.SECKEDIT : this.$API.SECKADD;
      //  如果有文件上传的话不能用qs加密影响上传
      let str = this.$qs.stringify(this.formdata);
      this.formdata.status = this.formdata.status ? 1 : 2;
      this.$http.post(url, this.formdata).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getsecklist();
        } else {
          this.$message.error(res.msg);
        }
        this.dialogVisible = false;
      });
    }
  }
};
</script>