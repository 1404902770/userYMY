<template>
  <!-- 能耗分析 - 能耗分析 -->
  <div class="trend">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          label-width="90px"
        >
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="form.dateRange"
              prop="dateRange"
              type="datetimerange"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="timeChange"
            ></el-date-picker>
          </el-form-item>

          <el-button
            type="primary"
            @click="squery"
          >查询</el-button>

          <el-button
            type="primary"
            @click="exportExcel"
          >导出excel</el-button>

          <el-button
            @click="resetForm1('form')"
            style="float:right;"
          >重置 / 刷新</el-button>

          <div class="electricityConsumption">
            <p>
              <img
                src="../../../public/static/images/yongdianliang.png"
                alt
              />
              昨日用电量：
              <span>{{ Math.abs(electricityConsumptionData.yest) }}kw/h</span>
              <dv-decoration-5 />
            </p>
            <p>
              <img
                src="../../../public/static/images/yongdianliang.png"
                alt
              />
              今日用电量：
              <span>{{ Math.abs(electricityConsumptionData.day) }}kw/h</span>
              <dv-decoration-5 />
            </p>
            <p>
              <img
                src="../../../public/static/images/yongdianliang.png"
                alt
              />
              本月用电量：
              <span>{{ Math.abs(electricityConsumptionData.month) }}kw/h</span>
              <dv-decoration-5 />
            </p>
            <p>
              <img
                src="../../../public/static/images/yongdianliang.png"
                alt
              />
              <template v-if="electricityConsumptionData.condition">时间范围用电量：</template>
              <template v-else>请选择时间范围</template>
              <span v-if="electricityConsumptionData.condition">{{ Math.abs(electricityConsumptionData.condition) }}kw/h</span>
              <span v-else>- -</span>
              <dv-decoration-5 />
            </p>
          </div>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <div
          class="charts1"
          id="charts1"
          ref="charts1"
        ></div>
        <!-- <div class="charts2" id="charts2" ref="charts2"></div> -->
      </el-main>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
  </div>
</template>
  
  <script>
import copyright from "../../components/copyright";
import $ from "jquery";
export default {
  name: "trend",
  components: {
    copyright
  },
  data() {
    return {
      // 时间范围
      timeChange: {
        disabledDate(time) {
          return (
            time.getTime() < Date.parse(new Date("2020-05-31 00:00")) ||
            time.getTime() > Date.now()
          ); //选择时间范围
        }
      },
      // 检索
      form: {
        dateRange: "" // 范围时间
      },
      // 截取小时
      jdate: "",
      // 折线图数据
      tianqu: [],
      // 饼型图数据
      tableData: [],
      // 显示：昨天 - 今天 - 本月 - 的用电量
      electricityConsumptionData: {
        yest: "",
        day: "",
        month: "",
        condition: ""
      }
    };
  },
  methods: {
    // 初始化获取用电量 - 昨天 - 今天 - 本月
    getDatas0() {
      let type = "post";
      let url = this.urla + this.api_4 + "ElectricityConsumption";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        this.electricityConsumptionData.yest = res.data.ztia;
        this.electricityConsumptionData.day = res.data.btia;
        this.electricityConsumptionData.month = res.data.byue;
        // this.tianqu = res.data.tianqu;
        // this.jdate = new Date().getHours();
        // this.getStudent1();
      });
    },
    // 初始化折线图数据
    zLineDta() {
      var myDate = new Date().toLocaleDateString();
      let d = new Date(myDate)
      let time = Math.floor(d.getTime(d) / 1000)

      let type = "post";
      let url = this.urla + this.api_4 + "userEleTimeTotal";
      let data = {
        uid: localStorage.getItem("uid"),
        time
      };
      this.myAjax(type, url, data, res => {
        // console.log(res);
        if (res.data.code == 46) {
          this.$message({
            showClose: true,
            message: "请先选择电箱计数",
            type: "warning"
          });
          this.$router.replace({ path: "/electricBoxCount" });
        }
        this.tianqu = res.data.data;
        this.jdate = new Date().getHours();
        this.getStudent1();
      });
    },
    // 初始化获取时间段用电量
    getDatas1() {
      let type = "post";
      let url = this.urla + this.api_4 + "timeSlotEnergyConsumption";
      let data = {
        uid: localStorage.getItem("uid"),
        start: new Date(this.form.dateRange[0]) / 1000,
        send: new Date(this.form.dateRange[1]) / 1000 + 86399
      };
      // if (this.form.dateRange && this.form.dateRange.length > 0) {
      //   data.ste = this.form.dateRange[0].getTime() / 1000;
      //   data.ete = this.form.dateRange[1].getTime() / 1000;
      // } else {
      //   data.ste = 0;
      //   data.ete = 0;
      // }
      this.myAjax(type, url, data, res => {
        this.electricityConsumptionData.condition = res.data.data;
      });
    },
    // 筛选字段 - 重置
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      this.getDatas0();
    },
    // 筛选字段 - 查询
    squery() {
      // console.log(this.form.dateRange);
      this.getDatas1();
    },
    // 折线面积图
    getStudent1() {
      let _this = this;
      let arr = [
        "0-1",
        "1-2",
        "2-3",
        "3-4",
        "4-5",
        "5-6",
        "6-7",
        "7-8",
        "8-9",
        "9-10",
        "10-11",
        "11-12",
        "12-13",
        "13-14",
        "14-15",
        "15-16",
        "16-17",
        "17-18",
        "18-19",
        "19-20",
        "20-21",
        "21-22",
        "22-23"
      ];
      arr.length = _this.jdate;
      let student = _this.$echarts.init(document.getElementById("charts1"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "当天每小时用电量波动",
          left: "center",
          top: 10
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
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          name: "点",
          type: "category",
          boundaryGap: false,
          // axisLabel: {
          //   formatter: "{value} /小时"
          // },
          data: arr
        },
        yAxis: {
          type: "value",
          name: "单位：(kW/h)"
        },
        series: [
          {
            data: _this.tianqu,
            type: "line",
            smooth: true,
            areaStyle: {
              normal: {
                color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#008080" // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "#eefcfd" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
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
    // 饼形图
    getStudent2() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts2"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "能耗分析 - 饼形图",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: -10,
          top: 80,
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
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: _this.tableData[0], name: "欠压告警" },
              { value: _this.tableData[1], name: "过压预警" },
              { value: _this.tableData[2], name: "过压报警" },
              { value: _this.tableData[3], name: "电流告警" },
              { value: _this.tableData[4], name: "电流预警" },
              { value: _this.tableData[5], name: "电流报警" },
              { value: _this.tableData[6], name: "漏电流报警" },
              { value: _this.tableData[7], name: "温度报警" },
              { value: _this.tableData[8], name: "分机报警" }
            ]
          }
        ]
      });
    },
    // 点击导出
    exportExcel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../public/static/js/Export2Excel");
        const excel = "excel的标题";
        const tHeader = ["当天时间/小时", "电流数值"];
        const filterValue = ["time", "num"];
        let arr = [
          "0-1 点",
          "1-2 点",
          "2-3 点",
          "3-4 点",
          "4-5 点",
          "5-6 点",
          "6-7 点",
          "7-8 点",
          "8-9 点",
          "9-10 点",
          "10-11 点",
          "11-12 点",
          "12-13 点",
          "13-14 点",
          "14-15 点",
          "15-16 点",
          "16-17 点",
          "17-18 点",
          "18-19 点",
          "19-20 点",
          "20-21 点",
          "21-22 点",
          "22-23 点"
        ];
        const list = [];
        for (let i = 0; i < this.jdate; i++) {
          list.push({
            time: arr[i],
            num: this.tianqu[i]
          });
        }
        list.push({
          time: "用电总和",
          num: eval(
            this.getString3(
              this.tianqu,
              this.tianqu.length - (this.tianqu.length - this.jdate)
            ).join("+")
          )
        });
        const data = this.formatJson(filterValue, list);
        export_json_to_excel(tHeader, data, excel);
      });
    },
    // 点击导出 - 对应循环对象
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
  mounted() { },
  created() {
    this.getDatas0();
    this.zLineDta();
  }
};
</script>
  
<style lang="less" scoped>
.trend .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.trend .el-header .el-form /deep/ .el-date-editor .el-range-separator {
  line-height: 28px !important;
}
.trend .el-header .el-form /deep/ .el-date-editor .el-range__icon {
  line-height: 28px !important;
}
.trend .el-header .el-form /deep/ .el-date-editor .el-range__close-icon {
  line-height: 26px !important;
}
.trend {
  overflow: hidden;
  height: 100%;
  .el-header {
    height: 120px !important;
    .el-form {
      text-align: left;
      margin-top: 10px;
      .el-form-item {
        float: left;
      }
      .el-button {
        margin-top: 3px;
        padding: 9px 20px;
        margin-left: 20px;
      }
      .electricityConsumption {
        clear: both;
        text-align: left;
        color: #555;
        padding-left: 90px;
        line-height: 34px;
        overflow: hidden;
        margin-top: 40px;
        p {
          width: 24%;
          float: left;
          margin-right: 1%;
          text-align: center;
          color: #3f96a5;
          font-weight: 600;
          height: 70px;
          position: relative;
          img {
            width: 18px;
            margin-top: -4px;
            vertical-align: middle;
            margin-right: 20px;
          }
          span {
            display: block;
            line-height: 2px;
            font-weight: 600;
            padding: 0 4px;
            font-size: 16px;
            color: #3f96a5;
          }
          .dv-decoration-5 {
            width: 98%;
            position: absolute;
            bottom: -10px;
          }
        }
      }
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    #charts1 {
      width: 100%;
      height: 600px;
      margin-top: 3%;
    }
    #charts2 {
      width: 40%;
      height: 400px;
      float: left;
      margin-top: 12%;
      margin-left: -5%;
    }
  }
}
</style>
  