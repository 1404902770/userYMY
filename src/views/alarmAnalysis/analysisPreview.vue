<template>
  <!-- 报警分析 - 分析预览 -->
  <div class="analysisPreview">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
        >
          <el-form-item label="电箱设备号">
            <el-select
              v-model="form.region"
              filterable
              placeholder="请选择设备/默认为全部"
              style="width:210px;"
            >
              <el-option
                v-for="(item,index) in options"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+']' + item.mzname"
                :value="hexCharCodeToStr(item.mzid)"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="具体日期">
            <el-date-picker
              v-model="form.dateDang"
              type="date"
              placeholder="选择日期"
              style="width:140px;"
              @change="datas1"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="日期范围">
            <el-date-picker
              v-model="form.dateRange"
              style="margin-top: 3px;width:250;"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="datas2"
            ></el-date-picker>
          </el-form-item>

          <el-button
            type="primary"
            @click="getDatas2"
          >查询</el-button>

          <el-button @click="getDatas0">重置 / 刷新</el-button>

          <el-button
            type="primary"
            @click="getDatas1(1)"
            style="float:right;"
          >当日</el-button>

          <el-button
            type="primary"
            @click="getDatas1(2)"
            style="float:right;"
          >当月</el-button>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <div
          class="charts1"
          id="charts1"
          ref="charts1"
        ></div>
        <div
          class="charts2"
          id="charts2"
          ref="charts2"
        ></div>
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
  name: "analysisPreview",
  components: {
    copyright
  },
  data() {
    return {
      // 检索
      form: {
        region: "", // 电箱设备号
        dateDang: "", // 定位到天
        dateRange: [] // 时间范围
      },
      // 获取所有设备
      options: [],
      // 列表数据
      tableData: [],
      // 范围时间选择
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.parse(new Date("2020-06-1 00:00")) ||
            time.getTime() > Date.now()
          ); //选择时间范围
        },
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
      }
    };
  },
  methods: {
    // 选择具体日期
    datas1() {
      this.form.dateRange = [];
    },
    // 选择日期范围
    datas2() {
      this.form.dateDang = "";
    },
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urlb + "/api/pc/allNeted";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
      });
    },
    // 初始化获取数据
    getDatas0() {
      this.form.region = "";
      this.form.dateDang = "";
      this.form.dateRange = [];
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
        this.tableData = res.data.data;
        this.getStudent1();
        this.getStudent2();
      });
    },
    // 初始化获取数据 - 日/月
    getDatas1(dataType) {
      let type = "post";
      let url = this.urlb + "/api/pc/allJingDeal";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: 1,
        by: 0,
        ste: 0,
        ete: 0
      };
      if (dataType == 1) {
        data.ri = 1;
        data.yue = 0;
      }
      if (dataType == 2) {
        data.ri = 0;
        data.yue = 1;
      }
      this.myAjax(type, url, data, res => {
        res.data.data.shift();
        this.tableData = res.data.data;
        this.getStudent1();
        this.getStudent2();
      });
    },
    // 初始化获取数据 - 指定日期/日期范围的
    getDatas2() {
      // this.form.dateRange = [];
      let type = "post";
      let url = this.urlb + "/api/pc/allJingDeal";
      let data = {
        uid: localStorage.getItem("uid"),
        ri: 0,
        yue: 0
      };

      // 具体日期查询
      if (this.form.dateDang) {
        this.form.region = "";
        data.nid = 0;
        data.by = new Date(this.form.dateDang.getTime()).Format("yy-MM-dd");
        data.ste = 0;
        data.ete = 0;

        this.myAjax(type, url, data, res => {
          // res.data.data.shift();
          this.tableData = res.data.data;
          this.getStudent1();
          this.getStudent2();
        });
      }

      // 电箱号和时间范围查询
      if (this.form.region && this.form.dateRange.length > 0) {
        data.nid = this.form.region;
        data.by = 0;
        data.ste = new Date(this.form.dateRange[0].getTime()).Format(
          "yy-MM-dd"
        );
        data.ete = new Date(this.form.dateRange[1].getTime()).Format(
          "yy-MM-dd"
        );

        // console.log(data)
        this.myAjax(type, url, data, res => {
          // res.data.data.shift();
          this.tableData = res.data.data;
          this.getStudent1();
          this.getStudent2();
        });
      }

      if (
        this.form.dateDang == "" &&
        this.form.region == [] &&
        this.form.dateRange.length == 0
      ) {
        this.$message({
          showClose: true,
          message: "请选择具体日期，或电箱号和日期范围",
          type: "warning"
        });
      }
    },
    // 柱状图
    getStudent1() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts1"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "报警分析",
          x: "center"
        },
        xAxis: {
          type: "category",
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
          type: "value"
        },
        series: [
          {
            data: _this.tableData,
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
    // 饼形图
    getStudent2() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("charts2"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: "报警分析",
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
    this.getDatas0();
    this.getOptions();
  }
};
</script>
  
<style lang="less" scoped>
.analysisPreview .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.analysisPreview
  .el-header
  .el-form
  /deep/
  .el-date-editor
  .el-range-separator {
  line-height: 28px !important;
}
.analysisPreview .el-header .el-form /deep/ .el-date-editor .el-range__icon {
  line-height: 28px !important;
}
.analysisPreview
  .el-header
  .el-form
  /deep/
  .el-date-editor
  .el-range__close-icon {
  line-height: 26px !important;
}

.analysisPreview {
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
      width: 60%;
      height: 400px;
      float: left;
      margin-top: 12%;
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
  