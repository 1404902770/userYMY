<template>
  <!-- 用电监测 - 数据检 - 详情 -->
  <div class="dataMonitorInfo">
    <el-container style="height: 100%;">
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用电监测</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/dataMonitor' }">数据检测</el-breadcrumb-item>
          <el-breadcrumb-item>电路详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button
          class="fh"
          type="primary"
          @click="goback()"
        >返回</el-button>

        <el-button
          style="margin-right:10px"
          class="fh"
          type="primary"
          @click="reset"
        >刷新</el-button>
      </el-header>
      <el-main>
        <h2 style="font-size:21px">{{fitem.name}}</h2>
        <div class="echartsbox">
          <!-- 电压图 -->
          <div
            class="charts1 charts"
            id="charts1"
            ref="charts1"
          ></div>

          <!-- 电流变化图 -->
          <div
            class="charts2 charts"
            id="charts2"
            ref="charts2"
          ></div>
        </div>

        <div class="echartsbox">
          <!-- 电流图 -->
          <div
            class="charts3 charts"
            id="charts3"
            ref="charts3"
          ></div>

          <!-- 有功功率图 -->
          <div
            class="charts4 charts"
            id="charts4"
            ref="charts4"
          ></div>
        </div>

        <div class="echartsbox">
          <!-- 无功功率图 -->
          <div
            class="charts5 charts"
            id="charts5"
            ref="charts5"
          ></div>

          <!-- 温度图 -->
          <div
            class="charts6 charts"
            id="charts6"
            ref="charts6"
          ></div>
        </div>

        <div class="echartsbox">
          <!-- 有功功率平均值图 -->
          <div
            class="charts7 charts"
            id="charts7"
            ref="charts7"
          ></div>

          <!-- 漏电流图 -->
          <div
            class="charts8 charts"
            id="charts8"
            ref="charts8"
          ></div>
        </div>
      </el-main>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
  </div>
</template>
  
  <script>
import charts from "../../components/echars";
import copyright from "../../components/copyright";
import Qs from "qs";
import $ from "jquery";
export default {
  name: "dataMonitorInfo",
  components: {
    charts,
    copyright
  },
  data() {
    return {
      // 电箱id
      nid: "",
      // 列表数据
      tableData: [],
      // dialog
      dialogVisible1: false,

      // 临时获取单个分录信息
      fitem: {},

      // 定时器
      interval: "",

      // 电压数据
      listdianya: [],
      // 三相电压
      listdianya2: [],
      listdianya3: [],

      // 电流变化数据
      listdianliubianhua: [],

      // 电流数据
      listdianliu: [],
      // 三相电流
      listdianliu2: [],
      listdianliu3: [],

      // 有功功率数据
      listyougong: [],
      // 三相有功功率数据
      listyougong2: [],
      listyougong3: [],

      // 无功功率数据
      listwugong: [],
      // 三相无功功率数据
      listwugong2: [],
      listwugong3: [],

      // 温度数据
      listwendu: [],
      // 有功功率平均值
      listyougongpingjun: [],
      // 漏电流数据
      listloudianliu: [],

      time: [],

      timer: '',

      num: 0
    };
  },
  watch: {
    count(newCount, oldCount) {
      // console.log(newCount, oldCount)
      if (newCount.type == "shunshi") {
        this.num = 0
        if (newCount.info.nid == this.nid && newCount.info.aa == this.fitem.mid) {
          if (newCount.info.leib == 1) {

            this.listdianya.push(newCount.data.vv);
            // this.listdianliu2=[]
            // this.listdianliu3=[]

            this.listdianliubianhua.push(newCount.data.bb);

            this.listdianliu.push(newCount.data.aa);
            // this.listdianliu2=[]
            // this.listdianliu3=[]

            this.listyougong.push(newCount.data.kk);
            // this.listyougong2=[]
            // this.listyougong3=[]

            this.listwugong.push(newCount.data.kr);
            // this.listwugong2=[]
            // this.listwugong3=[]

            this.listwendu.push(newCount.data.tt);
            this.listyougongpingjun.push(newCount.data.lsp);
            this.listloudianliu.push(newCount.data.ld * 1000);

            this.time.push(
              new Date(
                newCount.time * 1000
              ).Format('hh:mm:ss')
            );
          } else {

            this.listdianya.push(newCount.data.vv1);
            this.listdianya2.push(newCount.data.vv2);
            this.listdianya3.push(newCount.data.vv3);

            this.listdianliu.push(newCount.data.aa1);
            this.listdianliu2.push(newCount.data.aa2);
            this.listdianliu3.push(newCount.data.aa3);

            this.listyougong.push(newCount.data.kk1);
            this.listyougong2.push(newCount.data.kk2);
            this.listyougong3.push(newCount.data.kk3);

            this.listwugong.push(newCount.data.kv1);
            this.listwugong2.push(newCount.data.kv2);
            this.listwugong3.push(newCount.data.kv3);

            this.listwendu.push(newCount.data.tt);
            this.listyougongpingjun.push(newCount.data.lsp);
            this.listloudianliu.push(newCount.data.ld * 1000);
            this.listdianliubianhua.push(newCount.data.bb);

            this.time.push(
              new Date(
                newCount.time * 1000
              ).Format('hh:mm:ss')
            );
          }
        }
        // if (this.time.length > 5) {
        //   this.time.shift()
        //   this.time.push(
        //     new Date().getHours() +
        //     ":" +
        //     new Date().getMinutes() +
        //     ":" +
        //     new Date().getSeconds()
        //   );
        // } else {
        //   this.time.push(
        //     new Date().getHours() +
        //     ":" +
        //     new Date().getMinutes() +
        //     ":" +
        //     new Date().getSeconds()
        //   );
        // }
      }
      this.getStudent1();
      this.getStudent2();
      this.getStudent3();
      this.getStudent4();
      this.getStudent5();
      this.getStudent6();
      this.getStudent7();
      this.getStudent8();
    }
  },
  methods: {
    // 初始化获取所有分路
    getAllShunt() {
      let type = "post";
      let url = this.urlb + "/api/pc/getmzInfo";
      let data = {
        nid: this.nid,
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.tableData = res.data.data;
      });
    },

    // 读取echars瞬时数据
    readEhars() {
      // console.log('123')
      // console.log(this.num)
      let instance = this.$axios.create();
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.nid,
        aa: this.fitem.mid
      };
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urlb + "/api/mach/getshunshidata2",
        data: Qs.stringify(data)
      }).then(res => {
        // console.log(this.$store.state.socketData);

        // if (this.$store.state.socketData.type == "shunshi") {
        //   if (this.$store.state.socketData.leib == 1) {

        //     this.listdianya.push(this.$store.state.socketData.data.vv);
        //     // this.listdianliu2=[]
        //     // this.listdianliu3=[]

        //     this.listdianliubianhua.push(this.$store.state.socketData.data.bb);

        //     this.listdianliu.push(this.$store.state.socketData.data.aa);
        //     // this.listdianliu2=[]
        //     // this.listdianliu3=[]

        //     this.listyougong.push(this.$store.state.socketData.data.kk);
        //     // this.listyougong2=[]
        //     // this.listyougong3=[]

        //     this.listwugong.push(this.$store.state.socketData.data.kr);
        //     // this.listwugong2=[]
        //     // this.listwugong3=[]

        //     this.listwendu.push(this.$store.state.socketData.data.tt);
        //     this.listyougongpingjun.push(this.$store.state.socketData.data.lsp);
        //     this.listloudianliu.push(this.$store.state.socketData.data.ld);
        //   } else {

        //     this.listdianya.push(this.$store.state.socketData.data.vv1);
        //     this.listdianya2.push(this.$store.state.socketData.data.vv2);
        //     this.listdianya3.push(this.$store.state.socketData.data.vv3);

        //     this.listdianliu.push(this.$store.state.socketData.data.aa1);
        //     this.listdianliu2.push(this.$store.state.socketData.data.aa2);
        //     this.listdianliu3.push(this.$store.state.socketData.data.aa3);

        //     this.listyougong.push(this.$store.state.socketData.data.kk1);
        //     this.listyougong2.push(this.$store.state.socketData.data.kk2);
        //     this.listyougong3.push(this.$store.state.socketData.data.kk3);

        //     this.listwugong.push(this.$store.state.socketData.data.kv1);
        //     this.listwugong2.push(this.$store.state.socketData.data.kv2);
        //     this.listwugong3.push(this.$store.state.socketData.data.kv3);

        //     this.listwendu.push(this.$store.state.socketData.data.tt);
        //     this.listyougongpingjun.push(this.$store.state.socketData.data.lsp);
        //     this.listloudianliu.push(this.$store.state.socketData.data.ld);
        //     this.listdianliubianhua.push(this.$store.state.socketData.data.bb);
        //   }

        //   this.time.push(
        //     new Date().getHours() +
        //     ":" +
        //     new Date().getMinutes() +
        //     ":" +
        //     new Date().getSeconds()
        //   );
        // }
      });
    },

    // 电压图
    getStudent1() {
      if (this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01') {
        var tuli = ["电压A相", "电压B相", "电压C相"]
      } else {
        var tuli = ["电压"]
      }
      // console.log(Math.max.apply(null, this.listdianya))
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts1"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "电压波动"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: tuli,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // 保存图片
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(V)",
          type: "value",
          // min: Math.floor(Math.min.apply(null, this.listdianya))
          scale: true
        },
        series: [
          {
            name: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "电压A相" : '电压',
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531', //图例的颜色
                lineStyle: {
                  color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531' //改变折线颜色
                }
              }
            },
            data: this.listdianya
          },
          {
            name: "电压B相",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: "#006400",//图例的颜色
                lineStyle: {
                  color: "#006400" //改变折线颜色
                }
              }
            },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listdianya2 : []
          },
          {
            name: "电压C相",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                // color: "red",//图例的颜色
                // lineStyle: {
                //   color: 'red'//线的颜色
                // }
              }
            },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listdianya3 : []
          }
        ]
      });
    },

    // 电流变比图
    getStudent2() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts2"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "电流变比"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["电流变化"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          type: "value"
          // min: 220
        },
        series: [
          {
            name: "电流变化",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.listdianliubianhua
          }
        ]
      });
    },

    // 电流图
    getStudent3() {
      if (this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01') {
        var tuli = ["电流A相", "电流B相", "电流C相"]
      } else {
        var tuli = ["电流"]
      }

      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts3"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "电流波动"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: tuli,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(A)",
          type: "value",
          scale: true
          // min: 220
        },
        series: [
          {
            name: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "电流A相" : '电流',
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531', //图例的颜色
                lineStyle: {
                  color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531' //改变折线颜色
                }
              }
            },
            data: this.listdianliu
          },
          {
            name: "电流B相",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: "#006400",//图例的颜色
                lineStyle: {
                  color: "#006400" //改变折线颜色
                }
              }
            },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listdianliu2 : []
          },
          {
            name: "电流C相",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listdianliu3 : []
          }
        ]
      });
    },

    // 有功功率图
    getStudent4() {
      if (this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01') {
        var tuli = ["有功功率A相", "有功功率B相", "有功功率C相"]
      } else {
        var tuli = ["有功功率"]
      }

      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts4"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "有功功率波动"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: tuli
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(kW/h)",
          type: "value",
          scale: true
          // min: 220
        },
        series: [
          {
            name: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "有功功率A相" : '有功功率',
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531', //图例的颜色
                lineStyle: {
                  color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531' //改变折线颜色
                }
              }
            },
            data: this.listyougong
          },
          {
            name: "有功功率B相",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: "#006400",//图例的颜色
                lineStyle: {
                  color: "#006400" //改变折线颜色
                }
              }
            },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listyougong2 : []
          },
          {
            name: "有功功率C相",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listyougong3 : []
          }
        ]
      });
    },

    // 无功功率图
    getStudent5() {
      if (this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01') {
        var tuli = ["无功功率A相", "无功功率B相", "无功功率C相"]
      } else {
        var tuli = ["无功功率"]
      }

      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts5"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "无功功率波动"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: tuli
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(Kvar)",
          type: "value",
          scale: true
          // min: 220
        },
        series: [
          {
            name: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "无功功率A相" : '无功功率',
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531', //图例的颜色
                lineStyle: {
                  color: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? "#FFD700	" : '#c23531' //改变折线颜色
                }
              }
            },
            data: this.listwugong
          },
          {
            name: "无功功率B相",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                label: { show: true },
                color: "#006400",//图例的颜色
                lineStyle: {
                  color: "#006400" //改变折线颜色
                }
              }
            },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listwugong2 : []
          },
          {
            name: "无功功率C相",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.fitem.type == '81' || this.fitem.type == '91' || this.fitem.type == '11' || this.fitem.type == '01' ? this.listwugong3 : []
          }
        ]
      });
    },

    // 温度图
    getStudent6() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts6"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "温度波动"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["温度"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(℃)",
          type: "value"
          // min: 220
        },
        series: [
          {
            name: "温度",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.listwendu
          }
        ]
      });
    },

    // 有功功率平均值图
    getStudent7() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts7"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "有功功率平均值"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["有功功率平均值"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(KW/h)",
          type: "value"
          // min: 220
        },
        series: [
          {
            name: "有功功率平均值",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.listyougongpingjun
          }
        ]
      });
    },

    // 漏电流图
    getStudent8() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts8"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "漏电流波动"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["漏电流"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          name: "单位：(mA)",
          type: "value"
          // min: 220
        },
        series: [
          {
            name: "漏电流",
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
            data: this.listloudianliu
          }
        ]
      });
    },

    // 关闭socket
    closesocket() {
      let instance = this.$axios.create();
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.nid,
        aa: this.fitem.mid
      };
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urlb + "/api/mach/cancelKuozhanDataMl",
        data: Qs.stringify(data)
      })
    },

    // 刷新
    reset() {
      if (this.listdianya.length == 0) {
        this.readEhars()
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });
      } else if (this.listdianya.length >= 19) {

        // 电压数据
        this.listdianya = []
        // 三相电压
        this.listdianya2 = []
        this.listdianya3 = []

        // 电流变化数据
        this.listdianliubianhua = []

        // 电流数据
        this.listdianliu = []
        // 三相电流
        this.listdianliu2 = []
        this.listdianliu3 = []

        // 有功功率数据
        this.listyougong = []
        // 三相有功功率数据
        this.listyougong2 = []
        this.listyougong3 = []

        // 无功功率数据
        this.listwugong = []
        // 三相无功功率数据
        this.listwugong2 = []
        this.listwugong3 = []

        // 温度数据
        this.listwendu = []
        // 有功功率平均值
        this.listyougongpingjun = []
        // 漏电流数据
        this.listloudianliu = []

        this.time = []

        this.readEhars()
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });

      } else {
        this.$message({
          showClose: true,
          message: '正在加载,请勿点击',
          type: 'warning'
        });
      }
    },

    // 返回
    goback() {
      this.$router.go(-1)
      this.closesocket()
    },

    // 监听浏览器刷新
    beforeunloadHandler(e) {
      this.closesocket()
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      window.sessionStorage.setItem('a', 1)
      return '关闭提示'
    },
  },
  computed: {
    count() {
      return this.$store.state.socketData;
    }
  },
  // watch: {
  //   count(newval, oldval) {
  //     console.log(newval, oldval)
  //     // this.readEhars()
  //   }
  // },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))

    this.fitem = JSON.parse(sessionStorage.getItem("fitem"));

    this.readEhars();
    this.getStudent1();
    this.getStudent2();
    this.getStudent3();
    this.getStudent4();
    this.getStudent5();
    this.getStudent6();
    this.getStudent7();
    this.getStudent8();

    this.timer = setInterval(() => {
      this.num++
      //  if (this.listdianya.length < 20 && this.listdianya.length != 0 || this.listdianya.length == 0) {
      if (this.listdianya.length < 20 && this.listdianya.length != 0) {
        if (this.num == 5) {
          // console.log('')
          this.readEhars()
          this.num = 0
        }
      }
    }, 1000)
  },

  created() {
    this.listdianya = []
    this.listdianliu = []
    this.listyougong = []
    this.listwugong = []

    this.$store.commit("setsocketData", []);

    this.nid = this.$route.query.nid;
    if (this.$route.query.fitem != {}) {
      sessionStorage.setItem("fitem", JSON.stringify(this.$route.query.fitem));
    }
    this.getAllShunt();


  },
  destroyed() {
    this.closesocket()
    clearInterval(this.interval);
    clearInterval(this.timer);
  }
};
</script>
  
 <style lang="less" scoped>
.dataMonitorInfo .el-header .el-breadcrumb /deep/ .el-breadcrumb__inner.is-link,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
.dataMonitorInfo {
  overflow: hidden;
  height: 100%;
  .el-header {
    .el-breadcrumb {
      line-height: 60px;
      float: left;
    }
    .fh {
      padding: 9px 20px;
      margin-top: 12px;
      float: right;
    }
  }

  .el-main {
    height: 100%;
    padding: 0;
    .echartsbox {
      display: flex;
    }
    .charts {
      width: 50%;
      height: 300px;
      margin-top: 3%;
    }
  }
  .el-footer {
  }
}
</style>
  