<template>
  <div class="index">
    <el-row type="flex" class="row-bg row-item" justify="center">
      <el-col :span="24"><div class="grid-content bg-purple col-tiem">
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark title">商品总览</div></el-col>
          </el-row>
          <el-row class="sj">
            <el-col :span="6"><div class="grid-content bg-purple">100</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">400</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">50</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">500</div></el-col>
          </el-row>
          <el-row  class="wz">
            <el-col :span="6"><div class="grid-content bg-purple">已下架</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">已上架</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">库存紧张</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">全部商品</div></el-col>
          </el-row>
        </div></el-col>
      <el-col :span="2"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple col-tiem">
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark title">用户总览</div></el-col>
          </el-row>
          <el-row class="sj">
            <el-col :span="6"><div class="grid-content bg-purple">100</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">200</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">1000</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">5000</div></el-col>
          </el-row>
          <el-row class="wz">
            <el-col :span="6"><div class="grid-content bg-purple">今日新增</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">昨日新增</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">本月新增</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light">会员总数</div></el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 600px; height: 400px; background: #fff"></div>
  </div>
</template>
<script>
import echarts from "echarts";

export default {
  // 数据可视化操作在mounted中
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    //  设置容器
    var myChart = echarts.init(document.getElementById("main"));

    // 配置项
    let option = {
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      // 提示框
      tooltip: {},
      // 图例
      legend: {
        data: ["近一周订单数量"],
      },
      // x 轴
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        boundaryGap: false,
      },
      // y 轴
      yAxis: {},
      // 数据列表
      series: [
        {
          name: "近一周订单数量", //数据名称
          type: "line", //图表类型
          data: [555, 620, 536, 310, 410, 720, 819],
        },
      ],
      color: ["red", "yellow"],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>
<style lang="less">
.index {
  width: 80%;
  margin: 0 auto;
  .row-item {
    text-align: center;
  }
  .col-tiem {
    border: 1px solid #000;
    .title{
      height: 40px;
      line-height: 40px;
      background: #fff;
      color: #333;
      font-weight: bolder;
      font-size: 20px;
    }
    .sj{
      margin-top: 30px;
      margin-bottom: 10px;
      color: #f00;
      font-size: 25px;
    }
    .wz{
      margin-bottom: 30px;
      font-size: 20px;
    }
  }
  #main {
    margin: 30px auto;
  }
}
</style>