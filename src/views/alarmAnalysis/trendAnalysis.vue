<template>
  <!-- 报警分析 - 走势分析 -->
  <div class="trendAnalysis">
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
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in options"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+']' + item.mzname"
                :value="hexCharCodeToStr(item.mzid)"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-button
            type="primary"
            @click="submitForm"
          >查询</el-button>

          <el-button @click="resetForm('form')">重置 / 刷新</el-button>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <div
          class="charts1"
          id="charts1"
          ref="charts1"
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
  name: "trendAnalysis",
  components: {
    copyright
  },
  data() {
    return {
      // 检索
      form: {
        region: "" // 电箱设备号
      },
      // 获取所有设备
      options: [],
      // 列表数据
      tableData: [],
    };
  },
  methods: {
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urlb + "/api/pc/allNeted";
      let data = {
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
      });
    },
    // 初始化获取数据
    getDatas() {
      let type = "post";
      let url = this.urlb + "/api/pc/zoushifenxi";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.region ? this.form.region : 0
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        this.tableData = res.data.data;
        this.getechars();
      });
    },
    // 循环拿出数组的第几个
    forDara(index) {
      let arr = [];
      for (let i = 1; i < 9; i++) {
        for (let n = 0; n < this.tableData.length; n++) {
          arr.push(this.tableData[n][index + 1])
        }
      }
      return arr;
    },
    // echars
    getechars() {
      let _this = this;
      let arr1 = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
      arr1.length = new Date().getMonth() + 1
      let student = _this.$echarts.init(
        document.getElementById("charts1")
      );
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        title: {
          text: '走势分析',
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["欠压告警", "过压预警", "过压报警", "电流告警", "电流预警", "电流报警", "漏电流报警", "温度报警", "分机报警"]
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
          data: arr1,
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
            name: "欠压告警",
            type: "line",
            smooth: true,
            data: _this.forDara(0)
          },
          {
            name: "过压预警",
            type: "line",
            smooth: true,
            data: _this.forDara(1)
          },
          {
            name: "过压报警",
            type: "line",
            smooth: true,
            data: _this.forDara(2)
          },
          {
            name: "电流告警",
            type: "line",
            smooth: true,
            data: _this.forDara(3)
          },
          {
            name: "电流预警",
            type: "line",
            smooth: true,
            data: _this.forDara(4)
          },
          {
            name: "电流报警",
            type: "line",
            smooth: true,
            data: _this.forDara(5)
          },
          {
            name: "漏电流报警",
            type: "line",
            smooth: true,
            data: _this.forDara(6)
          },
          {
            name: "温度报警",
            type: "line",
            smooth: true,
            data: _this.forDara(7)
          },
          {
            name: "分机报警",
            type: "line",
            smooth: true,
            data: _this.forDara(8)
          }
        ]
      });
    },
    // 查询
    submitForm() {
      this.getDatas();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getDatas();
    }
  },
  mounted() { },
  created() {
    this.getDatas();
    this.getOptions();
  }
};
</script>
  
<style lang="less" scoped>
.trendAnalysis .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.trendAnalysis {
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
      height: 400px;
      float: left;
      margin-top: 12%;
    }
  }
}
</style>
  