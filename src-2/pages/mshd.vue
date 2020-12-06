<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true" round
      >添加</el-button
    >
    <el-dialog
      title="限时秒杀添加"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getlist"
      @close="cz"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        ref="jsform"
        :rules="rules"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="fn"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="rolename" label="一级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select
            v-model="formdata.first_cateid"
            placeholder="请选择"
            @change="getlist2"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select
            v-model="formdata.second_cateid"
            placeholder="请选择"
            @change="getlist3"
          >
            <el-option
              v-for="item in erjilist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.goodsid" placeholder="请选择">
            <el-option
              v-for="item in splist"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <!-- <p>{{formdata.status}}</p> -->
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sbmi">提交</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        label="活动名称"
        width="180"
        prop="title"
      ></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="bj(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="Delete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import an53 from '@dfeidao/fd-an000053';
 
// const new_date = an53('2020/1/1', 'yyyy/M/d'); // 1577808000000
export default {
  
  data() {
    return {
      dialogVisible: false,//对话框状态
      tableData: [],//渲染的数据
      dialogImageUrl: "", //放大图片的地址
      preVisible: false, //放大图片对话库显示状态
      fileList: [], //上传的文件列表
      formdata: {//绑定对话框数据
        begintime: "",
        endtime: "",
        first_cateid: "",
        goodsid: "",
        second_cateid: "",
        status: true,
        title: "",
      },
      rules: {//验证
        title: [
          {
            required: true,
            message: "请填写轮播图标题",
            trigger: "blur",
          },
        ],
      },
      rolelist: [], //一级标签的数据
      erjilist: [], //二级标签的数据
      splist: [], //商品列表的数据
      value1:[],//时间对象
    };
  },
  mounted() {
    this.getms();
  },
  methods: {
    //时间转换
    fn() {
      console.log(this.value1);
      const fdate = this.value1.map(item=>{return this.$http.format(item)})
      console.log(fdate);
      const new_date = fdate.map(tiem=>{return an53(tiem, 'yyyy-MM-dd HH:mm:ss')})
      console.log(new_date);
      this.formdata.begintime=new_date[0]
      this.formdata.endtime=new_date[1]
    },
    //列表数据
    getms() {
      this.$http.get("/api/secklist").then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.tableData = res.list ? res.list : [];
        }
      });
    },
    //获取一级分类
    getlist() {
      //获取一级标签
      this.$http.get("/api/catelist", { pid: 0 }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.rolelist = res.list ? res.list : [];
        }
      });
      console.log(this.value1);
    },
    //获取二级分类
    getlist2(pid) {
      console.log(pid);
      this.$http.get("/api/catelist", { pid }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.erjilist = res.list ? res.list : [];
        }
      });
    },
    //通过second_cateid来获取对应的商品
    getlist3(fid) {
      console.log(fid);
      this.$http.get("/api/goodslist").then((res) => {
        if (res.code == 200) {
          console.log(res);
          //   this.erjilist = res.list ? res.list : [];
          let s = res.list.filter((item) => {
            return item.second_cateid == fid;
          });
          console.log(s);
          this.splist = s ? s : [];
        }
      });
    },
    //重置
    cz() {
      this.formdata= {
        begintime: "",
        endtime: "",
        first_cateid: "",
        goodsid: "",
        second_cateid: "",
        status: true,
        title: "",
      };
      this.value1 = [];
    },
    //删除
    Delete(row) {
      // console.log(row);
      let id = row.id;
      this.$http.post("/api/seckdelete", { id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("您删除成功");
          this.getms();
        }
      });
    },
    //编辑
    bj(row) {
      this.dialogVisible = true;
      this.$http.get("/api/seckinfo", { id: row.id }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.formdata = res.list ? res.list : [];
          // console.log(this.formdata);
          let a=this.$http.format(Number(res.list.begintime));
          console.log(a);
          this.value1.push(a);
          let b=this.$http.format(Number(res.list.endtime));
          console.log(b);
          this.value1.push(b);
          this.getlist2()
          this.getlist3(res.list.second_cateid)
          // this.value1.push(this.$http.format(this.formdata.endtime));
          console.log(this.value1);
          this.formdata.id = row.id;
          this.formdata.status = this.formdata.status == 1 ? true : false;
          // console.log(res);
        }
      });
    },
    //提交
    sbmi() {
      let url = this.formdata.id ? "/api/seckedit" : "/api/seckadd";
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.formdata);
      console.log(url);
      this.$http.post(url, this.formdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("您已操作成功");
          this.dialogVisible = false;
          this.getms();
        }
      });
    },
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
</style>