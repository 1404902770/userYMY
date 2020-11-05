<template>
  <!-- 能耗分析 - 能耗波动 -->
  <div class="wave">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
        >
          <el-form-item
            label="电箱设备号"
            prop="region"
          >
            <el-select
              v-model="form.region"
              filterable
              placeholder="请选择电箱设备号"
              @change="xzxl"
            >
              <el-option
                v-for="(item,index) in options"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+']' + item.mzname"
                :value="item.mzid"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="线路" prop="line">
            <el-select
              ref="lines"
              style="width:150px;"
              v-model="form.line"
              filterable
              placeholder="请选择线路"
            >
              <el-option
                v-for="(item,index) in allLineData"
                :label="item.name"
                :value="item.mid"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item
            label="日期范围"
            prop="dateRange"
          >
            <el-date-picker
              v-model="form.dateRange"
              style="margin-top: 3px;width:250px;"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="cleardatevalue"
              :picker-options="timeChange"
            ></el-date-picker>
          </el-form-item>

          <el-form-item
            label="选择日期"
            prop="datevalue"
          >
            <el-date-picker
              v-model="form.datevalue"
              align="right"
              type="date"
              :clearable="false"
              value-format="timestamp"
              placeholder="选择日期"
              @change="cleardateRange"
              :picker-options="timeChange"
            >
            </el-date-picker>
          </el-form-item>

          <el-button
            type="primary"
            @click="squery"
          >查询</el-button>

          <el-button @click="resetForm1('form')">重置 / 刷新</el-button>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <!-- <div class="charts1" id="charts1" ref="charts1"></div> -->

        <!-- <div class="charts2" id="charts2" ref="charts2"></div> -->

        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
        >
          <!-- <el-table-column
            prop="nid"
            show-overflow-tooltip
            label="设备号"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ hexCharCodeToStr(scope.row.nid) }}</span>
            </template>
          </el-table-column>-->

          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="线路名称"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            prop="local"
            show-overflow-tooltip
            label="线路地址"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            prop="jianzhu"
            show-overflow-tooltip
            label="电箱地址"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            prop="mzname"
            show-overflow-tooltip
            label="电箱名称"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="ele"
            show-overflow-tooltip
            :label="form.dateRange.length>0? '能耗（kW/h）' : '当天能耗（kW/h）'"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="操作"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <i
                class="lookEcharts"
                @click="lookEcharts(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="name"
          :visible.sync="dialogVisible"
          width="60%"
        >
          <div
            class="echarts1"
            id="echarts1"
            ref="echarts1"
          ></div>
        </el-dialog>
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
  name: "wave",
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
        region: "", // 电箱设备号
        line: "", // 线路
        dateRange: "", // 范围时间
        datevalue: "" //选择某一天
      },
      // 获取所有设备
      options: [],
      // 获取所有线路
      allLineData: [],
      // 列表数据
      tableData: [],
      // 截取小时
      jdate: "",
      // 折线面积图数据
      tianqu: [],
      // 是否是当天时间
      type: 0,
      //echarts弹框
      dialogVisible: false,
      name: ''
    };
  },
  methods: {
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urla + this.api_4 + "getNetdSimpleList";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
        this.form.region = this.options[0].mzid;
        this.xzxl(this.form.region);
      });
    },
    // 选择线路
    xzxl(val) {
      let type = "post";
      let url = this.urlb + this.api_4 + "machedList";
      let data = {
        nid: val,
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        this.allLineData = res.data.data;
        this.form.line = this.allLineData[0].mid;
      });
    },
    // 初始化echarts获取数据
    getDatas0(mid) {
      var myDate = new Date().toLocaleDateString();
      let d = new Date(myDate)
      let time = Math.floor(d.getTime(d) / 1000)

      let type = "post";
      let url = this.urla + this.api_4 + "userEleMachedTotal";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.region,
        mid: mid,
        start: time
      };
      this.myAjax(type, url, data, res => {
        this.tianqu = res.data.data
        // let _this = this;
        this.jdate = new Date().getHours();
        // let a = res.data.data;
        // for (let index = 0; index < a.length; index++) {
        //   for (let i = 0; i < a[index].length; i++) {
        //     let b = JSON.parse(a[index][i]);
        //     this.tianqu.push(b.dzz);
        //   }
        // }
        this.getStudent1();
      });
    },

    cleardatevalue() {
      this.form.datevalue = ''
    },
    cleardateRange() {
      this.form.dateRange = []
    },

    // 初始化获取数据
    getDefaultData() {
      // console.log(this.form.options)

      let type = "post";
      let url = this.urlb + "/api/pc/oneMachElectricitys";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.region ? this.form.region : 0
      };
      if (this.form.dateRange && this.form.dateRange.length > 0) {
        data.type = 1;
        data.start = this.form.dateRange[0].getTime() / 1000;
        data.end = this.form.dateRange[1].getTime() / 1000 + 86399;
      } else {
        data.type = 0;
        data.start = 0;
        data.end = 0;
      }
      this.myAjax(type, url, data, res => {
        // console.log(res);
        this.tableData = res.data.btia;
        // this.getStudent1();
      });
    },

    // 初始化获取数据
    getDefaultData2() {
      // console.log(this.form.options)

      let type = "post";
      let url = this.urlb + "/api/pc/oneMachElectricitys";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.region ? this.form.region : 0
      };
      // if (this.form.datevalue.length > 0) {
      data.type = 1;
      data.start = this.form.datevalue / 1000;
      data.end = this.form.datevalue / 1000 + 86399;
      // } else {
      //   data.type = 0;
      //   data.start = 0;
      //   data.end = 0;
      // }
      this.myAjax(type, url, data, res => {
        // console.log(res);
        this.tableData = res.data.btia;
        // this.getStudent1();
      });
    },

    // 查看echarts图
    lookEcharts(row) {
      // console.log(row);
      this.name = row.name;
      this.dialogVisible = true;
      this.getDatas0(row.mid);
    },

    // 筛选字段 - 重置
    resetForm1(formName) {
      this.form.dateRange = [];
      this.form.datevalue = "";
      // this.$refs[formName].resetFields();
      this.getDefaultData();
    },
    // 筛选字段 - 查询
    squery() {
      if (this.form.region && !this.form.line) {
        this.$message.warning("请选择线路");
        return false;
      } else {
        // this.getDatas0();
        if (this.form.datevalue != '') {
          this.getDefaultData2();
        } else {
          this.getDefaultData();
        }
      }
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
      let student = _this.$echarts.init(document.getElementById("echarts1"));

      setTimeout(() => {
        $(window).resize(function () {
          student.resize();
        });
      }, 0);

      student.setOption({
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
          name: '点',
          type: "category",
          boundaryGap: false,
          // axisLabel: {
          //   formatter: "{value} /小时"
          // },
          data: arr
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: _this.tianqu,
            type: "line",
            areaStyle: {
              normal: {
                color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#d7f4f8" // 0% 处的颜色
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
    }
  },
  mounted() { },
  created() {
    this.getDefaultData();
    this.getOptions();
    // this.getDatas0();
    let _this = this;
    setTimeout(() => {
      _this.squery();
    }, 1000);
  }
};
</script>
  
<style lang="less" scoped>
.wave .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.wave .el-header .el-form /deep/ .el-date-editor .el-range-separator {
  line-height: 28px !important;
}
.wave .el-header .el-form /deep/ .el-date-editor .el-range__icon {
  line-height: 28px !important;
}
.wave .el-header .el-form /deep/ .el-date-editor .el-range__close-icon {
  line-height: 26px !important;
}
.wave {
  overflow: hidden;
  height: 100%;
  .el-header {
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
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    #echarts1 {
      width: 100%;
      height: 600px;
      margin-top: 5%;
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
.lookEcharts {
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
  border-radius: 50%;
  background-image: url("../../../public/static/images/tendency.png");
}
.lookEcharts:hover {
  box-shadow: 1px 3px 3px #888;
}
</style>
  