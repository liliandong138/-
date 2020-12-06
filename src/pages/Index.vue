<template>
  <div class="index-container">
    <!-- 删格布局
    el-row代表一行分24列
    el-col :span="6" 占6列
    
     -->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="col_item">
          <el-row>
            <div class="goodsbox">商品总览</div>
          </el-row>
          <div class="databox">
            <el-row>
              <el-col :span="6">
                <div>100</div>
              </el-col>
              <el-col :span="6">
                <div>40</div>
              </el-col>
              <el-col :span="6">
                <div>50</div>
              </el-col>
              <el-col :span="6">
                <div>500</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <p>已上架</p>
              </el-col>
              <el-col :span="6">
                <p>已下架</p>
              </el-col>
              <el-col :span="6">
                <p>库存紧张</p>
              </el-col>
              <el-col :span="6">
                <p>全部商品</p>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="col_item">
          <el-row>
            <div class="userbox">用户总览</div>
          </el-row>
          <div class="databox">
            <el-row>
              <el-col :span="6">
                <div>100</div>
              </el-col>
              <el-col :span="6">
                <div>40</div>
              </el-col>
              <el-col :span="6">
                <div>50</div>
              </el-col>
              <el-col :span="6">
                <div>500</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <p>已上架</p>
              </el-col>
              <el-col :span="6">
                <p>已下架</p>
              </el-col>
              <el-col :span="6">
                <p>库存紧张</p>
              </el-col>
              <el-col :span="6">
                <p>全部商品</p>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 创建ECharts容器并设置宽高 -->
    <div id="EChartsBox">


    </div>
  </div>
</template>
<script>
import echarts from "echarts"
export default {
  // 数据可视化操作在 mounted里
  mounted(){
    // 设置容器实例化echarts
     var myChart = echarts.init(document.getElementById('EChartsBox'));
    // 配置项
    let option={
          // 左侧标题
          title:{
              text:"近一周订单数量"
          },
          // 右上角下载图标
          toolbox:{
             feature:{
              saveAsImage:{}
             }
          },
          // 图例
          legend:{
            data:['销量']
          },
             // x 轴
            xAxis: {
                data: ["Mon","Tues","Wen","Thur","Fri","Sat","Sun"],
                //  坐标轴起点 终点间隔
                 boundaryGap:true,
            },
            // y 轴
            yAxis: {},
            // 数据列表
            series: [{
                name: '销量',//数据名称
                type: 'line',//图表类型
                data: [5, 20, 36, 10, 10, 20]
            }],
            color:["red"]
          

    }
// 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option); 

  }
};
</script>
<style lang="less">
.index-container {
  width: 80%;
  margin: 0 auto;

  .col_item {
    border: 1px solid;
    text-align: center;
    .databox {
      margin-bottom: 20px;
      p {
          color: red;
       }
      
    }
    .goodsbox {
      margin-bottom: 10px;
      background: #f2f6fc;
      font-weight: bold;
      
    }
    .userbox {
      margin-bottom: 10px;
      background: #f2f6fc;
      font-weight: bold;
    }
  }
}
#EChartsBox{
         margin-top:50px;
         width: 600px;
         height: 400px;
}
</style>