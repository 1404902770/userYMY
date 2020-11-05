<template>
  <!-- <h1>电量波动 - 电量波动</h1> -->
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

          <div v-if="one!=''">
            <el-form-item
              label="选择线路"
              prop="allLineData"
              v-show="show1"
            >
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                style="float: left;margin-right: 20px;"
              >全选线路</el-checkbox>
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="(item,index) in allLineData"
                  :label="item.mid"
                  :key="index"
                >{{'[' + '线路' + item.mid +']'+item.name}}</el-checkbox>
              </el-checkbox-group>

              <!-- <el-radio-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <template v-for="(item,index) in allLineData">
                  <el-radio :key="index" :label="item.mid">{{'[' + '线路' + item.mid +']'+item.name}}</el-radio>
                </template>
              </el-radio-group>-->
            </el-form-item>
          </div>
        </el-form>
      </el-header>

      <el-main>
        <div
          class="echarts1"
          id="echarts1"
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
  name: "electricBox",
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

      // 电量波动时间
      eletime: [],

      one: [],

      // 多条线路
      manyLine: [],
      // 线路名称
      lineNameList: [],

      // 已选的线路
      checkedCities: [],
      checkAll: false,
      show1: false,
      isIndeterminate: true,
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

      this.isIndeterminate = false
      this.checkedCities = []
      this.manyLine = []
      this.eletime = []
      this.getStudent1()
      this.getdianxiang()
    },

    // 电量波动数据
    getdianxiang() {
      var myDate = new Date().toLocaleDateString();
      let d = new Date(myDate)
      let time = Math.floor(d.getTime(d) / 1000)

      let type = 'post'
      let url = this.urla + this.api_4 + 'netedEleWave'
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.form.region,
        time: this.form.datevalue != "" && this.form.datevalue != null ? this.form.datevalue / 1000 : time
      }
      this.myAjax(type, url, data, res => {
        // console.log(res)
        this.one = res.data.data
        res.data.data[0].time.forEach(val => {
          this.eletime.push(new Date(val * 1000).Format("yy-MM-dd hh:mm:ss"))
        })

        this.getStudent1()

        // console.log(this.eledata)
        // console.log(this.eletime)
      })
    },

    // 电量波动图
    getStudent1() {
      let _this = this;
      let student = _this.$echarts.init(document.getElementById("echarts1"));
      $(window).resize(function () {
        student.resize();
      });
      student.setOption({
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: '电量波动',
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
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.eletime
        },
        yAxis: {
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
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            // areaStyle: {
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //     offset: 0,
            //     color: 'rgb(255, 158, 68)'
            //   }, {
            //     offset: 1,
            //     color: 'rgb(255, 70, 131)'
            //   }])
            // },
            name: this.lineNameList.length != 0 ? this.lineNameList[0] : "",
            data: this.manyLine.length != 0 ? this.manyLine[0].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 2 ? this.lineNameList[1] : "",
            data: this.manyLine.length >= 2 ? this.manyLine[1].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 3 ? this.lineNameList[2] : "",
            data: this.manyLine.length >= 3 ? this.manyLine[2].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 4 ? this.lineNameList[3] : "",
            data: this.manyLine.length >= 4 ? this.manyLine[3].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 5 ? this.lineNameList[4] : "",
            data: this.manyLine.length >= 5 ? this.manyLine[4].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 6 ? this.lineNameList[5] : "",
            data: this.manyLine.length >= 6 ? this.manyLine[5].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 7 ? this.lineNameList[6] : "",
            data: this.manyLine.length >= 7 ? this.manyLine[6].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 8 ? this.lineNameList[7] : "",
            data: this.manyLine.length >= 8 ? this.manyLine[7].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 9 ? this.lineNameList[8] : "",
            data: this.manyLine.length >= 9 ? this.manyLine[8].dzz : [],
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 10 ? this.lineNameList[9] : "",
            data: this.manyLine.length >= 10 ? this.manyLine[9].dzz : [],
          },
          {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 11 ? this.lineNameList[10] : "",
            data: this.manyLine.length >= 11 ? this.manyLine[10].dzz : [],
          },
          {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // itemStyle: {
            //   color: 'rgb(255, 70, 131)'
            // },
            name: this.lineNameList.length >= 12 ? this.lineNameList[11] : "",
            data: this.manyLine.length >= 12 ? this.manyLine[11].dzz : [],
          }
        ]
      });
    },

    // 线路 - 全选
    handleCheckAllChange(val) {
      let arr = [];
      this.allLineData.forEach(item => {
        arr.push(item.mid);
      });
      this.checkedCities = val ? arr : [];
      this.isIndeterminate = false;
      this.manyLine = this.one.filter(num => {
        return this.checkedCities.indexOf(num.aa) != -1;
      });

      let name = [];
      for (var i = 0; i < this.allLineData.length; i++) {
        for (var j = 0; j < this.manyLine.length; j++) {
          if (this.manyLine[j].aa == this.allLineData[i].mid) {
            name.push(this.allLineData[i].name);
          }
        }
      }
      this.lineNameList = name;

      this.getStudent1();
    },
    // 线路 - 单个
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allLineData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allLineData.length;
      // console.log(this.checkedCities);

      let two = [];
      // 求合集
      this.manyLine = this.one.filter(num => {
        return this.checkedCities.indexOf(num.aa) != -1;
      });

      // console.log(this.manyLine)

      // 最大值
      // console.log(Math.max(...this.manyLine[0].ele))

      let name = [];
      for (var i = 0; i < this.allLineData.length; i++) {
        for (var j = 0; j < this.manyLine.length; j++) {
          if (this.manyLine[j].aa == this.allLineData[i].mid) {
            name.push(this.allLineData[i].name);
          }
        }
      }
      this.lineNameList = name;

      this.getStudent1();

      this.one.forEach(val => {
        if (val.mid == this.checkedCities) {
          // two.push(val);
          this.exportdata = val.ele;

          // this.zhexian.setOption({
          //   series: [
          //     {
          //       data: val.ele
          //     }
          //   ]
          // });
          // console.log(two);
        }
      });

      // for (var i = 0; i < this.one.length; i++) {
      //   if (this.one[i].mid == this.checkedCities) {
      //     console.log(this.one[i]);
      //   }
      // }
      // for (var i = 0; i < this.one.length; i++) {
      //   if (this.one[i].mid.indexOf() != -1) {
      //     console.log(this.one[i]);
      //   }
      // }
    },


    // 筛选字段 - 查询
    squery() {
      this.getdianxiang()
      this.manyLine = []
      this.eletime = []
    },

    // 重置刷新
    reset() {
      this.form.datevalue = ""
      this.eletime = []
      this.getdianxiang()
    }
  },

  watch: {
    // 监听 - 已选择电箱数据 - 列表
    count(newCount, oldCount) {
      if (newCount) {
        this.show1 = true;
      } else {
        this.show1 = false;
      }
    }
  },
  computed: {
    count() {
      return this.options;
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
  