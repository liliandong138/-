<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible=true">添加</el-button>
    <!-- 表格 -->
    <el-table :data="specslist">
      <el-table-column label="属性名称" prop="specsname"></el-table-column>
      <el-table-column label="属性值">
        <template slot-scope="scope">
          <el-tag type="primary" v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible"   @close="closeFn">
      <!-- 表单 -->
      <el-form label-width="65px" :model="formdata" :rules="rules">
        <el-form-item label="属性名" prop="specsname">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>
        <!--  -->
        <el-form-item label="属性值" prop="attrs">
          <div v-for="(item,index) in attrsArr" :key="index">
            <el-input v-model="item.value" :style="{width:'60%'}"></el-input>
            <el-button type="primary" v-if="index==0" @click="Addattrs(index)">添加属性</el-button>
            <el-button type="danger" v-else @click="Delattrs(index)">删除属性</el-button>
          </div>
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
      specslist: [],
      //   表单数据
      formdata: {
        specsname: "",
        attrs: "",
        status: true
      },
      //   对话框显示状态
      dialogVisible: false,
      //   属性值构成的数据
      attrsArr: [{ value: "" }],
      rules: {
        specsname: [
          {
            required: true,
            message: "请输入属性名",
            trigger: "blur"
          },
          {
            message: "请输入非空属性名",
            min: 1,
            max: 6,
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getSpecsList();
  },
  methods: {
    // 第一次添加成功后关闭对话框数据重置 方便第二次添加
     closeFn() {
      this.attrsArr = [{ value: "" }],
      this.formdata = {
        specsname: "",
        attrs: "",
        status: true
      };
    },
    //   删除表格数据
    delFn(id) {
      this.$http.post(this.$API.SPECSDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getSpecsList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //   提交表单数据
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      //  map将对象数组转换成字符串构成的数组
      //  join将数组转换成字符串
      this.formdata.attrs = this.attrsArr.map(item => item.value).join(",");
      // 判断是提交还是编辑 提交是没有id
      let url = this.formdata.id ? this.$API.SPECSEDIT : this.$API.SPECSADD;
      // 请求数据
      this.$http.post(url, this.formdata).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getSpecsList();
        } else {
          this.$message.success(res.msg);
        }
      });
      this.dialogVisible=false
    },
    // 往attrsArr添加属性数据
    Addattrs() {
      this.attrsArr.push({ value: "" });
    },
    // 往attrsArr删除属性数据
    Delattrs(i) {
      this.attrsArr.splice(i, 1);
    },
    //   表格数据编辑
    editFn(id) {
      this.dialogVisible = true;
      this.$http.get(this.$API.SPECSINFO, { id }).then(res => {
        if (res.code == 200) {
          console.log(res.list);
          this.formdata = {
            ...res.list[0]
          };
        }
        this.attrsArr = res.list[0].attrs.map(item => ({ value: item }));
        this.formdata.status = this.formdata.status==1 ? true : false;
      });
    },
    // 请求表格数据
    getSpecsList() {
      this.$http.get(this.$API.SPECSLIST).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.specslist = res.list ? res.list : [];
          //   console.log(this.specslist);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>