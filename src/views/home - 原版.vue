<template>
  <!-- 首页 -->
  <div class="home">
    <el-row class="top">
      <el-col :span="8">
        <ul class="ulLeft">
          <!-- content="进入线路能耗3D" -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="线路能耗"
            placement="bottom"
            v-for="(item,index) in homeRouter"
            :key="index"
          >
            <li @click="jempPaths(item)">
              <img
                :src="item.imgSrc"
                alt
              />
              {{ item.oneTitle}}
            </li>
          </el-tooltip> -->
        </ul>
      </el-col>
      <el-col :span="8">
        <h2>智慧用电 - 大数据监控平台</h2>
      </el-col>
      <el-col :span="8">
        <ul class="ulRight">
          <li
            class="t1"
            @click="path1"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="点击退出到登录"
              placement="bottom"
            >
              <img
                style="width: 26px;margin-top: -10px;"
                src="../../public/static/images/outT.png"
                alt
              />
            </el-tooltip>
            <p class="hometext">退出</p>
          </li>
          <li
            class="t1"
            @click="path2"
          >
            <img
              style="width: 26px;margin-top: -10px;"
              src="../../public/static/images/zhuye.png"
              alt=""
            >
            <p class="hometext">主页</p>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="点击进入操作页面"
              placement="bottom"
            >
              <img
                src="../../public/static/images/home4.jpg"
                alt
              />
            </el-tooltip> -->
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="16"
        class="z1"
      >
        <dv-border-box-8 class="z1_1">
          <div class="card">
            <div class="left">
              <img
                src="../../public/static/images/home_3.png"
                alt
              />
            </div>
            <div class="right">
              <p class="p1">当天报警统计</p>
              <p class="p2">
                报警次数
                <span>{{ tableData2Num }}</span>
              </p>
            </div>
          </div>
          <div
            @click="gotoinfo"
            id="charts2"
          ></div>
        </dv-border-box-8>
        <dv-border-box-8
          :reverse="true"
          class="z1_2"
        >
          <div class="card">
            <div class="left">
              <img
                src="../../public/static/images/home_4.png"
                alt
              />
            </div>
            <div class="right">
              <p class="p1">当月报警统计</p>
              <p class="p2">
                报警次数
                <span>{{ tableData1Num }}</span>
              </p>
            </div>
          </div>
          <div
            @click="gotoinfo"
            id="charts3"
          ></div>
        </dv-border-box-8>
      </el-col>

      <el-col
        :span="8"
        class="z2"
      >
        <dv-border-box-8>
          <div id="charts1"></div>
        </dv-border-box-8>
      </el-col>
    </el-row>

    <!-- style="margin-top:0;" -->
    <el-row>
      <el-col
        :span="16"
        class="z3"
      >
        <dv-border-box-8
          :reverse="true"
          class="z1_1"
        >
          <div class="card">
            <div class="left">
              <img
                src="../../public/static/images/home_1.png"
                alt
              />
            </div>
            <div class="right">
              <p class="p2">
                昨天用电
                <span>{{ electricityConsumptionData.yest != undefined ? Math.abs(electricityConsumptionData.yest):'0' }}</span>
                kW/h
              </p>
              <p class="p2">
                当天用电
                <span>{{ electricityConsumptionData.day != undefined ? Math.abs(electricityConsumptionData.day):'0' }}</span>
                kW/h
              </p>
              <p class="p2">
                当月用电
                <span>{{ electricityConsumptionData.month != undefined ? Math.abs(electricityConsumptionData.month):'0' }}</span>
                kW/h
              </p>
            </div>
          </div>

          <!-- <div class="card leftbottom" style="float:left">
            <div class="left">
              <img src="../../public/static/images/home_1.png" alt />
            </div>
            <div class="right">
              <p class="p2">
                昨天用电
                <span>{{ Math.abs(electricityConsumptionData.yest) }}</span>
                度
              </p>
            </div>
          </div>
          <div class="card leftbottom" style="float:left">
            <div class="left">
              <img src="../../public/static/images/home_1.png" alt />
            </div>
            <div class="right">
              <p class="p2">
                当天用电
                <span>{{ Math.abs(electricityConsumptionData.day) }}</span>
                度
              </p>
            </div>
          </div>
          <div class="card leftbottom" style="float:left">
            <div class="left">
              <img src="../../public/static/images/home_1.png" alt />
            </div>
            <div class="right">
              <p class="p2">
                当月用电
                <span>{{ Math.abs(electricityConsumptionData.month) }}</span>
                度
              </p>
            </div>
          </div>-->
          <div id="charts7"></div>
        </dv-border-box-8>
        <dv-border-box-8 class="z1_2 clearfix">
          <div
            class="clearfix"
            style="margin-bottom:56px"
          >
            <div class="selectbox">
              <el-select
                :popper-append-to-body="false"
                v-model="selvalue1"
                clearable
                placeholder="请选择电箱"
                @change="getLines"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="'['+getString1(hexCharCodeToStr(item.mzid))+']' + item.mzname"
                  :value="item.mzid"
                ></el-option>
              </el-select>
            </div>

            <div class="selectbox">
              <el-select
                :popper-append-to-body="false"
                v-model="selvalue2"
                clearable
                placeholder="请选择线路"
                @change="getCurrent"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.name"
                  :value="item.mid"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- <div class="card">
            <div class="left">
              <img src="../../public/static/images/3d_1.png" alt />
            </div>
            <div class="right">
              <p class="p1">线路能耗3D</p>
            </div>
          </div>
          <div id="charts8"></div>-->
          <div id="charts8"></div>
        </dv-border-box-8>
      </el-col>
      <el-col
        :span="8"
        style="float:right"
      >
        <div class="z4wrap">
          <dv-border-box-8
            :reverse="true"
            class="z4"
          >
            <h3>报警信息提示</h3>
            <template v-if="bjInfoData!=''">
              <div
                class="bjtext"
                v-for="(item,index) in bjInfoData"
                :key="index"
              >
                <i class="el-icon-bell tb"></i>
                <span
                  class="s1"
                  v-if="item.nid.length == 12"
                >{{ '['+ getString1(item.nid) + item.mzname +']' }} - [{{ item.aa }} - {{ item.name }}] - [{{ item.desc }}] - [{{ item.time }}]</span>
                <span
                  class="s1"
                  v-else
                >{{ '['+ getString1(hexCharCodeToStr(item.nid))+item.mzname +']' }} - [{{ item.aa }} - {{ item.name }}] - [{{ item.desc }}] - [{{ new Date(item.time*1000).Format('yy-MM-dd hh:mm:ss') }}]</span>
                <p class="s2">{{ item.beizhu }}</p>
              </div>
            </template>
            <template v-if="bjInfoData==''">
              <div class="textnull">
                <p>暂无报警</p>
              </div>
            </template>
          </dv-border-box-8>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
  <script>
import $ from "jquery";
import Qs from "qs";
import "echarts-gl";
require("echarts/lib/chart/bar");
export default {
  name: "home1",
  data() {
    return {
      // 首页路由
      homeRouter: [
        {
          oneTitle: "线路能耗",
          // oneTitle: "线路能耗3D",
          JempPath: "/tDenergyConsumption",
          imgSrc: require("../../public/static/images/3d_1.png")
        }
      ],
      // 显示：昨天 - 今天 - 本月 - 的用电量
      electricityConsumptionData: {
        yest: "",
        day: "",
        month: "",
        condition: ""
      },
      // 24 小时
      jdate: "",
      // 报警 - 月 - echars - 数据
      tableData1: [],
      // 报警 - 月 - 总条数
      tableData1Num: "",
      // 报警 - 天 - echars - 数据
      tableData2: [],
      // 报警 - 天 - 总条数
      tableData2Num: "",
      // 用电 - 天 - echars - 数据
      tableData3: [],

      // 电流 - echars - 数据
      tableData4Num: "",
      // 报警信息提示 - 数据
      bjInfoData: [],
      // 定时器
      time1: null,

      // 选择电箱的值
      selvalue1: "",
      // 电箱数据
      options1: [],
      // 选择线路的值
      selvalue2: "",
      // 选择线路数据
      options2: [],
      // 获取线路的设备nid
      nid: "",

      nid1: "",
      mid: "",

      // 线路用电量
      linedata: [],

      echarsDatas2: []
    };
  },
  methods: {
    // 点击退出
    path1() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          clearInterval(this.time1);
          localStorage.clear();
          this.$router.push({
            path: "/"
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "warning",
            message: "已取操作"
          });
        });
    },
    // 进入操作页
    path2() {
      this.$router.push("/dataMonitor");
      clearInterval(this.time1);
    },

    // 点击报警分类echarts跳转报警分类
    gotoinfo() {
      this.$confirm("是否查看详细报警信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
          this.$router.push({ path: "/alarmProcessingwy" });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },

    // 进入其他页面
    jempPaths(item) {
      // clearInterval(this.time1);
      // this.$router.push(item.JempPath);
    },
    // echars - 中国地图
    getStudent1() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts1"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        tooltip: {},
        legend: {
          orient: "vertical",
          left: "left",
          data: [""]
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          containLabel: false
        },
        visualMap: {
          min: 0,
          max: 1500,
          left: "85%",
          top: "40%",
          text: ["高", "低"],
          calculable: true,
          color: ["#0b50b9", "#c3e2f4"],
          hoverLink: true,
          textStyle: {
            color: "#FFF" //图例文字颜色，大小等配置
          }
        },
        selectedMode: "single",
        series: [
          {
            name: "",
            type: "map",
            mapType: "china",
            itemStyle: {
              normal: {
                borderColor: "rgba(0, 0, 0, 0.2)"
              },
              emphasis: {
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            showLegendSymbol: true,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: [
              { name: "北京", value: "150" },
              { name: "天津", value: "500" },
              { name: "上海", value: "350" },
              { name: "重庆", value: "50" },
              { name: "河北", value: "160" },
              { name: "河南", value: "860" },
              { name: "云南", value: "460" },
              { name: "辽宁", value: "960" },
              { name: "黑龙江", value: "1120" },
              { name: "湖南", value: "950" },
              { name: "安徽", value: "416" },
              { name: "山东", value: "132" },
              { name: "新疆", value: "540" },
              { name: "江苏", value: "569" },
              { name: "浙江", value: "464" },
              { name: "江西", value: "798" },
              { name: "湖北", value: "1203" },
              { name: "广西", value: "656" },
              { name: "甘肃", value: "12" },
              { name: "山西", value: "54" },
              { name: "内蒙古", value: "476" },
              { name: "陕西", value: "1355" },
              { name: "吉林", value: "464" },
              { name: "福建", value: "198" },
              { name: "贵州", value: "365" },
              { name: "广东", value: "414" },
              { name: "青海", value: "497" },
              { name: "西藏", value: "12" },
              { name: "四川", value: "14" },
              { name: "宁夏", value: "9" },
              { name: "海南", value: "146" },
              { name: "台湾", value: "985" },
              { name: "香港", value: "645" },
              { name: "澳门", value: "419" }
            ]
          }
        ]
      });
    },
    // 初始化获取 - 月 - 报警数据
    getDatas1() {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urla + "/api/pc/allJingDeal",
        data: Qs.stringify({
          uid: localStorage.getItem("uid"),
          nid: 0,
          ri: 0,
          yue: 1,
          by: 0,
          ste: 0,
          ete: 0
        })
      }).then(res => {
        this.tableData1Num = res.data.data[0];
        res.data.data.shift();
        this.tableData1 = res.data.data;
        this.getStudent6();
      });
      // let type = "post";
      // let url = this.urlb + "/appv1/usdpc1/allJingDeal";
      // let data = {
      //   uid: localStorage.getItem("uid"),
      //   nid: 1,
      //   ri: 0,
      //   yue: 1,
      //   by: 0,
      //   ste: 0,
      //   ete: 0
      // };
      // this.myAjax(type, url, data, res => {
      //   this.tableData1Num = res.data.data[0];
      //   res.data.data.shift();
      //   this.tableData1 = res.data.data;
      //   this.getStudent6();
      // });
    },
    // 初始化获取 - 天 - 报警数据
    getDatas2() {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urlb + "/api/pc/allJingDeal",
        data: Qs.stringify({
          uid: localStorage.getItem("uid"),
          nid: 1,
          ri: 1,
          yue: 0,
          by: 0,
          ste: 0,
          ete: 0
        })
      }).then(res => {
        this.tableData2Num = res.data.data[0];
        res.data.data.shift();
        this.tableData2 = res.data.data;
        this.getStudent4();
      });
      // let type = "post";
      // let url = this.urlb + "/appv1/usdpc1/allJingDeal";
      // let data = {
      //   uid: localStorage.getItem("uid"),
      //   nid: 1,
      //   ri: 1,
      //   yue: 0,
      //   by: 0,
      //   ste: 0,
      //   ete: 0
      // };
      // this.myAjax(type, url, data, res => {
      //   this.tableData2Num = res.data.data[0];
      //   res.data.data.shift();
      //   this.tableData2 = res.data.data;
      //   this.getStudent4();
      // });
    },

    // 初始化获取数据 - 日/月 - 饼图
    getDatas4(dataType) {
      let type = "post";
      let url = this.urlb + "/api/pc/allJingDeal";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: 0,
        ri: 0,
        yue: 0,
        by: 0,
        ste: 0,
        ete: 0
      };
      this.myAjax(type, url, data, res => {
        res.data.data.shift();
        this.echarsDatas2 = res.data.data;
        this.getStudent2();
      });
    },

    // 初始化获取 - 用电数据
    // 初始化获取用电量 - 昨天 - 今天 - 本月
    getDatas3() {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urlb + "/api/pc/ElectricityConsumption",
        data: Qs.stringify({
          uid: localStorage.getItem("uid")
        })
      }).then(res => {
        this.electricityConsumptionData.yest = res.data.ztia;
        this.electricityConsumptionData.day = res.data.btia;
        this.electricityConsumptionData.month = res.data.byue;
        // this.tianqu = res.data.tianqu;
        // this.jdate = new Date().getHours();
        // this.getStudent1();
      });

      // let type = "post";
      // let url = this.urlb + "/appv1/com/ElectricityConsumption";
      // let data = {
      //   uid: localStorage.getItem("uid")
      // };
      // this.myAjax(type, url, data, res => {
      //   this.electricityConsumptionData.yest = res.data.ztia;
      //   this.electricityConsumptionData.day = res.data.btia;
      //   this.electricityConsumptionData.month = res.data.byue;
      //   // this.tianqu = res.data.tianqu;
      //   // this.jdate = new Date().getHours();
      //   // this.getStudent1();
      // });
    },

    // 初始化 - 当天用电 折线图数据
    zLineDta() {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urla + "/api/pc/userElectricityTotal",
        data: Qs.stringify({
          uid: localStorage.getItem("uid")
        })
      }).then(res => {
        //  console.log(res);
        if (res.data.code == 46) {
          this.$message({
            showClose: true,
            message: "请先选择电箱计数",
            type: "warning"
          });
          // this.$router.replace({path:'/electricBoxCount'})
        }
        this.tableData3 = res.data.data;
        this.tableData3 = this.tableData3.map(val => {
          if (val != 0) {
            val = (val * 2) / 3;
            return Math.floor(val * 100) / 100;
            //  return val.toFixed(2)
          } else {
            return val;
          }
        });
        // console.log(this.tableData3)
        this.jdate = new Date().getHours();
        this.getStudent7();
      });

      // let type = "post";
      // let url = this.urla + "/appv1/com/userElectricityTotal";
      // let data = {
      //   uid: localStorage.getItem("uid")
      // };
      // this.myAjax(type, url, data, res => {
      //   // console.log(res);
      //   if (res.data.code == 46) {
      //     this.$message({
      //       showClose: true,
      //       message: "请先选择电箱计数",
      //       type: "warning"
      //     });
      //     // this.$router.replace({path:'/electricBoxCount'})
      //   }
      //   this.tableData3 = res.data.data;
      //   this.jdate = new Date().getHours();
      //   this.getStudent7();
      // });
    },

    // 初始化获取设备号
    getList(page) {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urla + "/api/pc/allNeted",
        data: Qs.stringify({
          uid: localStorage.getItem("uid")
        })
      }).then(res => {
        this.nid1 = res.data.data[0].mzid;
        this.selvalue1 = res.data.data[0].mzid;

        this.options1 = res.data.data;

        this.jdate = new Date().getHours();
        this.getLines();
      });

      // let type = "post";
      // let url = this.urlb + "/appv1/usdpc1/allNeted";
      // let data = {
      //   uid: localStorage.getItem("uid")
      // };
      // this.myAjax(type, url, data, res => {
      //   this.options1 = res.data.data;
      // });
    },

    // 根据设备号获取线路
    getLines(val) {
      this.nid = val;

      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urla + "/api/pc/getmzInfo",
        data: Qs.stringify({
          nid: val == undefined ? this.nid1 : val,
          uid: localStorage.getItem('uid')
        })
      }).then(res => {
        this.mid = res.data.data[0].mid;
        this.selvalue2 = res.data.data[0].name;
        this.options2 = res.data.data;

        this.jdate = new Date().getHours();
        this.getCurrent();
      });

      // let type = "post";
      // let url = this.urlb + "appv1/usdpc1/getmzInfo";
      // let data = {
      //   nid: val
      // };
      // this.myAjax(type, url, data, res => {
      //   this.options2 = res.data.data;
      // });
    },

    // 线路用电请求 - echarts 图数据
    getCurrent(val) {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urla + "/api/pc/getXianluEle",
        data: Qs.stringify({
          uid: localStorage.getItem("uid"),
          nid: this.nid == undefined ? this.nid1 : this.nid,
          mid: val == undefined ? this.mid : val
        })
      }).then(res => {
        // console.log(res.data.todayEle)
        this.linedata = res.data.todayEle;

        this.jdate = new Date().getHours();
        this.getStudent8();
      });
    },

    // echars - 饼形图
    getStudent2() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts1"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "报警分析",
          x: "center",
          top: 30,
          textStyle: {
            color: "#FFF", //图例文字颜色，大小等配置
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          // orient: "vertical",
          bottom: 10,
          textStyle: {
            color: "#FFF" //图例文字颜色，大小等配置
          },
          // fontWeight:200,
          // color:"#fff",
          // left: 'center',
          data: [
            "欠压告警",
            "过压预警",
            "过压报警",
            "电流告警",
            "电流预警",
            "电流报警",
            "漏电流报警",
            "温度报警",
            "分机报警"
          ]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["30%", "45%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: _this.echarsDatas2[0], name: "欠压告警" },
              { value: _this.echarsDatas2[1], name: "过压预警" },
              { value: _this.echarsDatas2[2], name: "过压报警" },
              { value: _this.echarsDatas2[3], name: "电流告警" },
              { value: _this.echarsDatas2[4], name: "电流预警" },
              { value: _this.echarsDatas2[5], name: "电流报警" },
              { value: _this.echarsDatas2[6], name: "漏电流报警" },
              { value: _this.echarsDatas2[7], name: "温度报警" },
              { value: _this.echarsDatas2[8], name: "分机报警" }
              // { value: 0, name: "欠压告警" },
              // { value: 0, name: "过压预警" },
              // { value: 0, name: "过压报警" },
              // { value: 0, name: "电流告警" },
              // { value: 0, name: "电流预警" },
              // { value: 0, name: "电流报警" },
              // { value: 0, name: "漏电流报警" },
              // { value: 0, name: "温度报警" },
              // { value: 0, name: "分机报警" }
            ]
          }
        ]
      });
    },
    // echars - 雷达图
    getStudent3() {
      // let _this = this;
      // let student = _this.$echarts.init(document.getElementById("charts3"));
      // $(window).resize(function() {
      //   student.resize();
      // });
      // student.setOption({
      //   title: {
      //     text: "基础雷达图",
      //     top: 20,
      //     left: 20,
      //     textStyle: {
      //       color: "#ffffff", //图例文字颜色，大小等配置
      //       fontSize: 14
      //     },
      //   },
      //   tooltip: {},
      //   legend: {
      //     data: ["预算分配", "实际开销"],
      //     // orient: "vertical",
      //     bottom: 14,
      //     right:10,
      //     textStyle: {
      //       color: "#FFF" //图例文字颜色，大小等配置
      //     },
      //     textStyle: {
      //       color: "#ffffff" //图例文字颜色，大小等配置
      //     },
      //   },
      //   radar: {
      //     center: ['50%', '52%'],
      //     // shape: 'circle',
      //     name: {
      //       textStyle: {
      //         color: "#fff",
      //         backgroundColor: "#999",
      //         borderRadius: 4,
      //         padding: [2, 5]
      //       }
      //     },
      //     indicator: [
      //       { name: "销售", max: 6500 },
      //       { name: "管理", max: 16000 },
      //       { name: "信息技术", max: 30000 },
      //       { name: "客服", max: 38000 },
      //       { name: "研发", max: 52000 },
      //       { name: "市场", max: 25000 }
      //     ]
      //   },
      //   series: [
      //     {
      //       name: "预算 vs 开销",
      //       type: "radar",
      //       // areaStyle: {normal: {}},
      //       data: [
      //         {
      //           value: [4300, 10000, 28000, 35000, 50000, 19000],
      //           name: "预算分配"
      //         },
      //         {
      //           value: [5000, 14000, 28000, 31000, 42000, 21000],
      //           name: "实际开销"
      //         }
      //       ]
      //     }
      //   ]
      // });
    },
    // echars - 折线图 - 天 - 趋势
    getStudent4() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts2"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        // title: {
        //   text: "当天 - 用电统计图",
        //   x: "center",
        //   top: 20,
        //   textStyle: {
        //     color: "#FFF", //图例文字颜色，大小等配置
        //     fontSize: 14
        //   }
        // },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          },
          data: [
            "欠压告警",
            "过压预警",
            "过压报警",
            "电流告警",
            "电流预警",
            "电流报警",
            "漏电流报警",
            "温度报警",
            "分机报警"
          ]
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            data: _this.tableData2,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            },
            itemStyle: {
              normal: {
                //这里是重点
                color: function (params) {
                  //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                  var colorList = [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622"
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  position: "top",
                  formatter: "{b}\n{c}",
                  formatter: "{c}"
                }
              }
            },
            barWidth: 30 //柱图宽度
          }
        ]
      });
    },
    // echars - 柱形图 - 月 - 趋势
    getStudent6() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts3"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        // title: {
        //   text: "当天 - 用电统计图",
        //   x: "center",
        //   top: 20,
        //   textStyle: {
        //     color: "#FFF", //图例文字颜色，大小等配置
        //     fontSize: 14
        //   }
        // },
        xAxis: {
          type: "category",
          //坐标轴斜着显示
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          },
          data: [
            "欠压告警",
            "过压预警",
            "过压报警",
            "电流告警",
            "电流预警",
            "电流报警",
            "漏电流报警",
            "温度报警",
            "分机报警"
          ]
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            data: _this.tableData1,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            },
            itemStyle: {
              normal: {
                //这里是重点
                color: function (params) {
                  //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                  var colorList = [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622"
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  position: "top",
                  formatter: "{b}\n{c}",
                  formatter: "{c}"
                }
              }
            },
            barWidth: 30 //柱图宽度
          }
        ]
      });
    },
    // echars - 折线图 - 当天用电 - 趋势
    getStudent7() {
      let _this = this;
      let arr = [
        "0点-1点",
        "1点-2点",
        "2点-3点",
        "3点-4点",
        "4点-5点",
        "5点-6点",
        "6点-7点",
        "7点-8点",
        "8点-9点",
        "9点-10点",
        "10点-11点",
        "11点-12点",
        "12点-13点",
        "13点-14点",
        "14点-15点",
        "15点-16点",
        "16点-17点",
        "17点-18点",
        "18点-19点",
        "19点-20点",
        "20点-21点",
        "21点-22点",
        "22点-23点",
        "23点-00点"
      ];
      arr.length = _this.jdate;
      let student = _this.$echarts.init(document.getElementById("charts7"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "当天总用电量走势图",
          x: "center",
          top: 20,
          textStyle: {
            color: "#FFF", //图例文字颜色，大小等配置
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#008080"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          // name:'点',
          type: "category",
          boundaryGap: false,
          // axisLabel: {
          //   formatter: "{value} /h"
          // },
          data: arr,
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          }
        },
        yAxis: {
          type: "value",
          name: "单位：(kW/h)",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            data: _this.tableData3,
            type: "line",
            areaStyle: {
              normal: {
                color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    // color: "#d7f4f8" // 0% 处的颜色
                    color: "#008080" // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    // color: "#eefcfd" // 100% 处的颜色
                    color: "#008080" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    // color: "transparent" // 100% 处的颜色
                    color: "transparent" // 100% 处的颜色
                  }
                ]), //背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 3,
                  type: "solid",
                  color: "#4fd6d2"
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#8cd5c2", //改变折线点的颜色
                lineStyle: {
                  color: "#8cd5c2" //改变折线颜色
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          }
        ]
      });
    },

    // echars - 折线图 - 线路用电 - 趋势
    getStudent8() {
      let _this = this;
      let arr = [
        "0点-1点",
        "1点-2点",
        "2点-3点",
        "3点-4点",
        "4点-5点",
        "5点-6点",
        "6点-7点",
        "7点-8点",
        "8点-9点",
        "9点-10点",
        "10点-11点",
        "11点-12点",
        "12点-13点",
        "13点-14点",
        "14点-15点",
        "15点-16点",
        "16点-17点",
        "17点-18点",
        "18点-19点",
        "19点-20点",
        "20点-21点",
        "21点-22点",
        "22点-23点",
        "23点-00点"
      ];
      arr.length = _this.jdate;
      let student = _this.$echarts.init(document.getElementById("charts8"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "当天线路用电量走势图",
          x: "center",
          top: 20,
          textStyle: {
            color: "#FFF", //图例文字颜色，大小等配置
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#008080"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          // name:'点',
          type: "category",
          boundaryGap: false,
          // axisLabel: {
          //   formatter: "{value} /h"
          // },
          data: arr,
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          }
        },
        yAxis: {
          type: "value",
          name: "单位：(kW/h)",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 1 //这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            data: _this.linedata,
            type: "line",
            areaStyle: {
              normal: {
                color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    // color: "#d7f4f8" // 0% 处的颜色
                    color: "#008080" // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    // color: "#eefcfd" // 100% 处的颜色
                    color: "#008080" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    // color: "transparent" // 100% 处的颜色
                    color: "transparent" // 100% 处的颜色
                  }
                ]), //背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 3,
                  type: "solid",
                  color: "#4fd6d2"
                }
              }
            },
            itemStyle: {
              normal: {
                color: "#8cd5c2", //改变折线点的颜色
                lineStyle: {
                  color: "#8cd5c2" //改变折线颜色
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          }
        ]
      });
    },

    // 报警信息提示 - 右下角提示处
    getAlarm() {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urlb + "/api/pc/typeJingList",
        data: Qs.stringify({
          uid: localStorage.getItem("uid"),
          page: 0,
          type: 0,
          nid: 0
        })
      }).then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
          // 电箱号
          res.data.data[i].nid = this.hexCharCodeToStr(res.data.data[i].nid);
          // 线路
          res.data.data[i].aa = "线路" + res.data.data[i].aa;
          // 告警类型
          if (res.data.data[i].otype == 1) {
            res.data.data[i].otype = "欠压告警";
          } else if (res.data.data[i].otype == 2) {
            res.data.data[i].otype = "过压预警";
          } else if (res.data.data[i].otype == 3) {
            res.data.data[i].otype = "过压报警";
          } else if (res.data.data[i].otype == 4) {
            res.data.data[i].otype = "电流预警";
          } else if (res.data.data[i].otype == 5) {
            res.data.data[i].otype = "电流告警";
          } else if (res.data.data[i].otype == 6) {
            res.data.data[i].otype = "电流报警";
          } else if (res.data.data[i].otype == 7) {
            res.data.data[i].otype = "漏电流报警";
          } else if (res.data.data[i].otype == 8) {
            res.data.data[i].otype = "温度报警";
          } else if (res.data.data[i].otype == 9) {
            res.data.data[i].otype = "分机报警";
          } else {
            res.data.data[i].otype = "- -";
          }
          // 报警级别
          res.data.data[i].limit = "建议断闸检修";
          // 报警状态
          if (res.data.data[i].status == 0) {
            res.data.data[i].status = "未读";
          } else if (res.data.data[i].status == 1) {
            res.data.data[i].status = "只阅读";
          } else if (res.data.data[i].status == 2) {
            res.data.data[i].status = "已经检修";
          } else if (res.data.data[i].status == 3) {
            res.data.data[i].status = "已删除";
          } else {
            res.data.data[i].otype = "- -";
          }
          // 检修人
          res.data.data[i].xname = res.data.data[i].xname
            ? res.data.data[i].xname
            : "- -";
          res.data.data[i].xtime = res.data.data[i].xtime
            ? res.data.data[i].xtime
            : "- -";
          // 报警发生的时间
          res.data.data[i].time = new Date(res.data.data[i].time * 1000).Format(
            "yy-MM-dd hh:mm:ss"
          );
        }
        this.bjInfoData = this.getString3(res.data.data, 8);
      });
    }
  },
  // 监听数据
  watch: {
    count(newCount, oldCount) {
      // console.log(newCount,oldCount)
      if (newCount.type == "jing") {
        this.bjInfoData.unshift({
          nid: newCount.nid, // 设备16进制
          mzname: newCount.mzname, // 设备名称
          jianzhu: newCount.jianzhu, // 线路名称
          aa: "线路" + newCount.aa, // 线路
          desc: newCount.desc, // 报警类型
          beizhu: newCount.beizhu, // 报警提示文字
          time: newCount.time // 时间
        });
        // this.$notify.warning({
        //   title:
        //     newCount.desc +
        //     "-" +
        //     new Date(newCount.time * 1000).Format("yy-MM-dd hh:mm:ss"),
        //   type: "warning",
        //   duration: 0,
        //   message:
        //     ("i",
        //       { style: "color: teal" },
        //       "[" +
        //       this.getString1(this.hexCharCodeToStr(newCount.nid)) +
        //       newCount.mzname +
        //       "]" +
        //       " - 线路" +
        //       newCount.aa +
        //       " : " +
        //       newCount.beizhu)
        // });
      }
    }
  },
  // 监听属性
  computed: {
    count() {
      return this.$store.state.socketData;
    }
  },
  // 初始化 - dom - 在created后
  mounted() {
    this.getStudent2();
    this.getStudent4();
    this.getStudent6();
    this.getStudent7();
    this.getStudent8();

    // setInterval(() => {
    //   this.$store.commit('setsocketData', {
    //     type: 'jing',
    //     nid: '34474c3430354c4130365157', // 设备16进制
    //     mzname: '牛羊肉—邢玉芬副食', // 设备名称
    //     jianzhu: '牛羊肉片', // 线路名称
    //     aa: '08', // 线路
    //     desc: '电流报警', // 报警类型
    //     beizhu: '当前电流处于过流报警值上,当前电流为:81.176A,所设电流预警值为:50A', // 报警提示文字
    //     time: '1600766564' // 时间
    //   })
    // }, 2000)
  },
  // 初始化 - 数据 - 在mounted前
  created() {
    this.jdate = new Date().getHours();
    this.getDatas1();
    this.getDatas2();
    this.getDatas3();
    this.getDatas4();
    this.zLineDta();
    this.getList(1);
    let _this = this;
    this.time1 = setInterval(() => {
      _this.getDatas1();
      _this.getDatas2();
      _this.getDatas3();
      _this.getDatas4();
      _this.zLineDta();
    }, 3600000);
    this.getAlarm();
  }
};
</script>
  
<style lang="less" scoped>
.el-tooltip__popper {
  background: #fff !important;
  border: 1px solid #fff !important;
}
.home {
  height: 100%;
  background: url("../../public/static/images/home7.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;
  overflow-x: hidden;
  .top {
    margin-top: 0 !important;
    line-height: 65px;
    .ulLeft {
      display: block;
      // width: 100%;
      width: 620px;
      height: 65px;
      li {
        cursor: pointer;
        color: #fff;
        float: right;
        padding: 0 15px;
        img {
          width: 35px;
          border-radius: 50%;
          vertical-align: middle;
        }
        &:first-child {
          margin-right: 40px;
        }
      }
    }
    .ulRight {
      padding-right: 60px;
      display: block;
      width: 100%;
      li {
        cursor: pointer;
        color: #fff;
        float: right;
        padding: 0 15px;
        img {
          width: 35px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      .t1:hover {
        color: teal;
      }
    }
    h2 {
      color: #fff;
      font-size: 24px;
      line-height: 65px;
    }
  }
  .el-row {
    // margin-top: 20px;
    margin-top: 1.5rem;
  }
  .z1 {
    height: 400px;
    .z1_1 {
      // background: url("../../public/static/images/home3.png") no-repeat;
      // background-size: 100% 100%;
      height: 400px;
      overflow: hidden;
      width: 50%;
      float: left;
      .card {
        width: 245px;
        height: 80px;
        background: rgba(255, 160, 96, 0.2);
        border-radius: 4px;
        border: 1px solid #ffa060;
        margin: auto;
        margin-top: 30px;
        .left {
          width: 40%;
          float: left;
          img {
            width: 38px;
            height: 38px;
            display: block;
            margin: auto;
            margin-top: 20px;
          }
        }
        .right {
          width: 60%;
          float: left;
          .p1 {
            color: #ffa060;
            font-size: 16px;
            margin-top: 15px;
          }
          .p2 {
            color: #ffa060;
            font-size: 12px;
            margin-top: 10px;
            span {
              color: #f56c6c;
              font-size: 18px;
              padding-left: 10px;
            }
          }
        }
      }
      #charts2 {
        height: 280px;
      }
    }
    .z1_2 {
      // background: url("../../public/static/images/home3.png") no-repeat;
      // background-size: 100% 100%;
      height: 400px;
      overflow: hidden;
      width: 50%;
      float: left;
      .card {
        width: 245px;
        height: 80px;
        background: rgba(255, 160, 96, 0.2);
        border-radius: 4px;
        border: 1px solid #fec107;
        margin: auto;
        margin-top: 30px;
        .left {
          width: 40%;
          float: left;
          img {
            width: 38px;
            height: 38px;
            display: block;
            margin: auto;
            margin-top: 20px;
          }
        }
        .right {
          width: 60%;
          float: left;
          .p1 {
            color: #fec107;
            font-size: 16px;
            margin-top: 15px;
          }
          .p2 {
            color: #fec107;
            font-size: 12px;
            margin-top: 10px;
            span {
              color: #ffa060;
              font-size: 18px;
              padding-left: 10px;
            }
          }
        }
      }
      #charts3 {
        height: 280px;
      }
    }
  }
  .z2 {
    #charts1 {
      height: 400px;
    }
  }
  .z3 {
    height: 400px;
    .z1_1 {
      // background: url("../../public/static/images/home3.png") no-repeat;
      // background-size: 100% 100%;
      height: 400px;
      overflow: hidden;
      width: 50%;
      float: left;
      .card {
        width: 280px;
        min-width: 310px;
        height: 80px;
        background: rgba(255, 160, 96, 0.2);
        border-radius: 4px;
        border: 1px solid #ffa060;
        margin: auto;
        margin-top: 30px;
        .left {
          width: 40%;
          float: left;
          img {
            width: 38px;
            height: 38px;
            display: block;
            margin: auto;
            margin-top: 20px;
          }
        }
        .right {
          width: 60%;
          float: left;
          .p1 {
            color: #ffa060;
            font-size: 16px;
            margin-top: 15px;
          }
          .p2 {
            color: #ffa060;
            font-size: 12px;
            margin-top: 3px;
            span {
              color: #f56c6c;
              font-size: 18px;
              padding-left: 10px;
            }
          }
        }
      }
      #charts7 {
        height: 280px;
      }
    }
    .z1_2 {
      // background: url("../../public/static/images/home3.png") no-repeat;
      // background-size: 100% 100%;
      height: 400px;
      overflow: hidden;
      width: 50%;
      float: left;
      .card {
        width: 245px;
        height: 80px;
        background: rgba(255, 160, 96, 0.2);
        border-radius: 4px;
        border: 1px solid #fec107;
        margin: auto;
        margin-top: 30px;
        .left {
          width: 40%;
          float: left;
          img {
            width: 38px;
            height: 38px;
            display: block;
            margin: auto;
            margin-top: 20px;
          }
        }
        .right {
          width: 60%;
          float: left;
          .p1 {
            color: #ffa060;
            font-size: 16px;
            margin-top: 30px;
          }
        }
      }
      #charts8 {
        height: 280px;
      }
    }
  }

  .z4wrap {
    .dv-border-box-8 /deep/ .border-box-content {
      overflow: auto !important;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #052792;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #20a3f5;
      }
    }
  }

  .z4 {
    // background: url("../../public/static/images/home3.png") no-repeat;
    // background-size: 100% 100%;
    height: 400px;
    box-sizing: border-box;
    padding: 10px 20px 20px 20px;
    overflow: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #052792;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #20a3f5;
    }
    h3 {
      color: red;
      line-height: 30px;
      text-align: center;
    }
    .bjtext {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 20px;
      font-size: 12px;
      text-align: left;
      .tb {
        color: #e6a23c;
        font-size: 20px;
        vertical-align: middle;
      }
      .s1 {
        color: #fff;
        padding: 0 15px;
      }
      .s2 {
        color: #f56c6c;
        padding-left: 35px;
      }
    }
  }

  .leftbottom {
    width: 185px !important;
    margin: 25px 10px !important;
  }

  // 暂无报警文字
  .textnull {
    margin-top: 60px;
    p {
      color: #e6a23c;
      font-size: 26px;
      font-weight: bold;
      font-family: "KaiTi";
    }
  }

  // 电流统计图选择
  .selectbox {
    float: left;
    margin: 22px 0 0 72px;
    .el-select /deep/ .el-input__inner {
      color: white;
      background-color: transparent !important;
    }
    .el-select /deep/ .el-popper {
      background-color: rgba(0, 0, 0, 0.45) !important;
      .el-select-dropdown__item {
        color: white !important;
      }
      .hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .clearfix::after {
    content: "";
    display: block;
    clear: both;
  }
}

.gotohome {
  font-size: 26px;
}
.hometext {
  line-height: 0;
  margin-top: -16px;
}
</style>
  