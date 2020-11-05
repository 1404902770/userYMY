<template>
  <!-- <h1>电量波动 - 线路电压波动</h1> -->
  <div
    class="electric"
    style="height: 100%;"
  >
    <el-container style="height: 100%;">
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

          <el-form-item
            label="选择线路"
            prop="line"
          >
            <el-select
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
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>

          <el-button
            type="primary"
            @click="squery"
          >查询</el-button>

          <el-button @click="reset">重置 / 刷新</el-button>

        </el-form>
      </el-header>

      <el-main>
        <div
          class="echarts1"
          id="echarts2"
        >
        </div>
      </el-main>

      <el-footer>
        <copyright></copyright>
      </el-footer>
    </el-container>
  </div>
</template>
  
<script>
import $ from "jquery";
import copyright from "../../components/copyright";

export default {
  name: "lineWave",
  components: {
    copyright
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      // 检索
      form: {
        region: "", // 电箱设备号
        line: "", // 线路
        datevalue: "",//选择日期
      },
      // 获取所有设备
      options: [],
      // 获取线路
      allLineData: [],

      // 线路电压波动
      linedata: [],
      // 线路波动时间
      linetime: [],

      linedata2: [],
      linedata3: [],

      student: null
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
        this.allLineData = res.data.data;
      });
    },

    // 线路电压波动数据
    getxianlu() {
      var myDate = new Date().toLocaleDateString();
      let d = new Date(myDate)
      let time = Math.floor(d.getTime(d) / 1000)

      let type = 'post'
      let url = this.urla + this.api_4 + 'machedVvWave'
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.form.region,
        mid: this.form.line,
        time: this.form.datevalue != "" && this.form.datevalue != null ? this.form.datevalue / 1000 : time
      }
      this.myAjax(type, url, data, res => {
        // console.log(res)

        if (res.data.data.vv1) {
          this.linedata = res.data.data.vv1
        } else {
          this.linedata = res.data.data.vv
        }

        if (res.data.data.vv2) {
          this.linedata2 = res.data.data.vv2
        } else {
          this.linedata2 = []
        }

        if (res.data.data.vv3) {
          this.linedata3 = res.data.data.vv3
        } else {
          this.linedata3 = []
        }

        res.data.data.time.forEach(val => {
          this.linetime.push(new Date(
            val * 1000
          ).Format("yy-MM-dd hh:mm:ss"))
        })

        if (this.student != null) {
          this.student.clear()
        }
        this.getStudent1()

      })
    },

    // 线路电压波动
    getStudent1() {
      if (this.linedata2.length > 0) {
        var tuli = ["A相", "B相", "C相"]
      } else {
        var tuli = ["电压"]
      }

      let _this = this;
      this.student = _this.$echarts.init(document.getElementById("echarts2"));
      $(window).resize(function () {
        this.student.resize();
      });
      this.student.setOption({
        tooltip: {
          trigger: 'axis',
          // position: function (pt) {
          //   return [pt[0], '10%'];
          // }
          // formatter: '时间：{b}<br/>{a0}：{c0}V',
        },
        title: {
          left: 'center',
          text: '线路电压波动',
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: tuli,
          left: 160
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.linetime
        },
        yAxis: {
          name: '单位:V',
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        series: [
          {
            name: this.linedata2.length > 0 ? 'A相' : '电压',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            color: this.linedata2.length > 0 ? "#FFD700	" : '#c23531', //图例的颜色
            lineStyle: {
              color: this.linedata2.length > 0 ? "#FFD700	" : '#c23531' //改变折线颜色
            },
            data: this.linedata
          },
          {
            name: 'B相',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            color: '#006400', //图例的颜色
            lineStyle: {
              color: '#006400' //改变折线颜色
            },
            data: this.linedata2.length > 0 ? this.linedata2 : []
          },
          {
            name: 'C相',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            data: this.linedata3.length > 0 ? this.linedata3 : []
          }
        ]
      });
    },


    // 筛选字段 - 查询
    squery() {
      if (this.form.line == '') {
        this.$message({
          showClose: true,
          message: '请选择线路',
          type: 'warning'
        });
      } else {
        this.getxianlu()
      }
      this.linedata = []
      this.linetime = []
    },

    // 重置刷新
    reset() {
      this.form.datevalue = ""
      if (this.form.line == '') {
        this.$message({
          showClose: true,
          message: '请选择线路',
          type: 'warning'
        });
      } else {
        this.linedata = []
        this.linetime = []

        this.getxianlu()
      }
    }
  },

  mounted() { },

  created() {
    this.getOptions()
  }
};
</script>
  
 <style lang="less" scoped>
.el-header {
  border-bottom: 1px solid #e6e6e6;
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
  width: 100%;
  margin-bottom: 120px;
  .echarts1 {
    width: 100%;
    height: 600px;
  }
}
</style>
  