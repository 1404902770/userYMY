<template>
  <!-- <h1>电量波动 - 象限无功总电量波动</h1> -->
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
            @click="squery('1','machedWg1Wave')"
          >1象限波动</el-button>

          <el-button
            type="primary"
            @click="squery('2','machedWg2Wave')"
          >2象限波动</el-button>

          <el-button
            type="primary"
            @click="squery('3','machedWg3Wave')"
          >3象限波动</el-button>

          <el-button
            type="primary"
            @click="squery('4','machedWg4Wave')"
          >4象限波动</el-button>

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

      // 线路波动
      linedata: [],
      // 线路波动时间
      linetime: [],

      xiangxian: "",

      // echarts图
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

    // 线路波动数据
    getxianlu(geturl) {
      var myDate = new Date().toLocaleDateString();
      let d = new Date(myDate)
      let time = Math.floor(d.getTime(d) / 1000)

      let type = 'post'
      let url = this.urla + this.api_4 + geturl
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.form.region,
        mid: this.form.line,
        time: this.form.datevalue != "" && this.form.datevalue != null ? this.form.datevalue / 1000 : time
      }
      this.myAjax(type, url, data, res => {
        // console.log(res)

        if (res.data.data.wg1) {
          this.linedata = res.data.data.wg1
        } else if (res.data.data.wg2) {
          this.linedata = res.data.data.wg2
        } else if (res.data.data.wg3) {
          this.linedata = res.data.data.wg2
        } else {
          this.linedata = res.data.data.wg4
        }

        res.data.data.time.forEach(val => {
          this.linetime.push(new Date(
            val * 1000
          ).Format("yy-MM-dd hh:mm:ss"))
        })

        // for (var i = 0; i < arr.length; i++) {
        //   let num = arr[i] - Math.floor(arr[0])
        //   let val = num.toFixed(2)

        //   this.linedata.push(val)
        // }

        if (this.student != null) {
          this.student.clear()
        }
        this.getStudent1()

      })
    },

    // 线路波动
    getStudent1() {
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
          formatter: '时间：{b}<br/>{a0}：{c0}Kwh'
        },
        title: {
          left: 'center',
          text: '象限无功总电量波动',
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
          data: [this.xiangxian + '象限无功总电量'],
          left: 160
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.linetime
        },
        yAxis: {
          name: "单位：(Kwh)",
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
            name: this.xiangxian + '象限无功总电量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //     offset: 0,
            //     color: 'rgb(255, 158, 68)'
            //   }, {
            //     offset: 1,
            //     color: 'rgb(255, 70, 131)'
            //   }])
            // },
            data: this.linedata
          }
        ]
      });
    },


    // 筛选字段 - 查询
    squery(xiang, geturl) {
      this.xiangxian = xiang
      if (this.form.line == '') {
        this.$message({
          showClose: true,
          message: '请选择线路',
          type: 'warning'
        });
      } else {
        this.getxianlu(geturl)
      }
      sessionStorage.setItem('url', geturl)
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

        this.getxianlu(sessionStorage.getItem('url'))
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
  .echarts1 {
    width: 100%;
    height: 600px;
  }
}
</style>
  