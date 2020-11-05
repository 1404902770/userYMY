<template>
  <!-- 能耗分析 - 无功功率 -->
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
            <!-- @change="xzxl" -->
            <el-select
              v-model="form.region"
              filterable
              placeholder="请选择电箱设备号"
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

          <!-- <el-form-item label="日期范围" prop="dateRange">
            <el-date-picker
              v-model="form.dateRange"
              style="margin-top: 3px;width:250px;"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>-->

          <el-button
            type="primary"
            @click="squery"
          >查询</el-button>
          <!-- <el-button @click="resetForm1('form')">重置 / 刷新</el-button> -->
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
          <el-table-column
            prop="nid"
            show-overflow-tooltip
            label="设备号"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ hexCharCodeToStr(scope.row.nid) }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column
            prop="name"
            show-overflow-tooltip
            label="电箱设备号"
            align="center"
            min-width="120"
          ></el-table-column>-->

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
            prop="kve"
            show-overflow-tooltip
            label="月度无功功率(kVar)"
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
              <!-- <el-button
                type="text"
                style="color:#008080;"
                icon="el-icon-search"
                @click="see(scope.row)"
              >操作分路</el-button>-->
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
            class="charts1"
            id="charts1"
            ref="charts1"
          ></div>

          <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>-->
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
      // 检索
      form: {
        region: "", // 电箱设备号
        line: "", // 线路
        dateRange: "" // 范围时间
      },
      // 获取所有设备
      options: [],
      // 获取所有线路
      allLineData: [],
      // 列表数据
      tableData: [],
      // 范围时间选择
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      //echarts弹框
      dialogVisible: false,
      // 截取小时
      jdate: "",
      // 折线面积图数据
      tianqu: [],
      //折线图
      zhexian: "",
      //线路id
      mid: "",
      // 设备名字
      name: ""
    };
  },
  methods: {
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urlb + "/api/pc/allNeted";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
        this.form.region = this.options[0].mzid;
        // this.xzxl(this.form.region);
      });
    },
    // 选择线路
    // xzxl(val) {
    //   let type = "post";
    //   let url = this.urlb + "/appv1/usdpc1/getmzInfo";
    //   let data = {
    //     nid: val
    //   };
    //   this.myAjax(type, url, data, res => {
    //     // console.log(res)
    //     this.allLineData = res.data.data;
    //     this.form.line = this.allLineData[0].mid;
    //   });
    // },

    // 初始化获取数据
    getDatas0() {
      let type = "post";
      let url = this.urla + "/api/pc/getKvarMachInfo";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.region,
        mid: this.mid
      };

      this.myAjax(type, url, data, res => {
        // console.log(res);
        this.tianqu = res.data.data;
        this.getStudent1();
      });
    },

    // 初始化获取数据
    getDefaultData() {
      // console.log(this.form.options)

      let type = "post";
      let url = this.urla + "/api/pc/getMachKvar";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.region ? this.form.region : 0
      };
      this.myAjax(type, url, data, res => {
        // console.log(res);
        this.tableData = res.data.data;
      });
    },

    // 查看echarts图
    lookEcharts(row) {
      // console.log(row.name);
      this.name = row.name;
      this.mid = row.mid;
      this.dialogVisible = true;
      this.getDatas0();
    },

    // 筛选字段 - 重置
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      // this.getDatas0();
    },
    // 筛选字段 - 查询
    squery() {
      // if (this.form.region && !this.form.line) {
      //   this.$message.warning("请选择线路");
      //   return false;
      // } else {
      // this.getDatas0();

      this.getDefaultData();

      // }
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
      arr.length = _this.tianqu.length;
      _this.zhexian = _this.$echarts.init(document.getElementById("charts1"));

      setTimeout(() => {
        $(window).resize(function () {
          _this.zhexian.resize();
        });
      }, 0);

      _this.zhexian.setOption({
        tooltip: {
          trigger: "axis",
          // formatter: '{b0} 点<br />{c0}kW/h',
          formatter: '{b0} 点<br />{c0}kW/h',
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
          name: "kVar",
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
                    color: "#eefcfd" // 50% 处的颜色
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
    }
  },
  mounted() { },
  created() {
    // this.getDefaultData();
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
.el-dialog__wrapper /deep/ .el-dialog {
  margin-top: 7vh !important;
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
    #charts1 {
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
  