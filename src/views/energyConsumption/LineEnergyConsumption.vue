<template>
  <!-- 能耗分析 - 能耗波动 -->
  <div class="LineEnergyConsumption">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          label-width="90px"
        >
          <el-form-item
            label="选择设备"
            prop="options"
          >
            <!--@change="xzxl" -->
            <el-select
              v-model="form.options"
              prop="options"
              filterable
              placeholder="请选择"
              class="sb"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+']' + item.mzname"
                :value="item.mzid"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="时间范围" prop="dateRange">
            <el-date-picker
              v-model="form.dateRange"
              prop="dateRange"
              type="datetimerange"
              size="small"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="timeChange"
              class="fwsj"
            ></el-date-picker>
          </el-form-item>-->

          <el-button
            type="primary"
            @click="squery"
          >查询</el-button>
          <el-button
            type="primary"
            @click="exportExcel"
          >导出excel</el-button>
          <el-button @click="resetForm1('form')">重置 / 刷新</el-button>

          <div
            class="choice"
            v-if="one!=''"
          >
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

          <!-- <el-form-item label="具体某一天">
            <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>-->
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
import Qs from "qs";
import copyright from "../../components/copyright";
import $ from "jquery";
export default {
  name: "LineEnergyConsumption",
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
        options: "", // 设备
        allLineData: "", // 线路
        dateRange: "", // 范围时间
        oneDay: "" // 具体莫一天
      },
      // 获取所有设备
      options: [],
      // 获取所有线路
      allLineData: [],
      // 已选的线路
      checkedCities: [],
      checkAll: false,
      isIndeterminate: true,
      show1: false,
      // 截取小时
      jdate: "",
      // 折线图数据
      tianqu: [],
      // 饼型图数据
      tableData: [],

      // 折线图
      zhexian: "",

      // 选择单条
      one: [],

      // 多条线路
      manyLine: [],

      // 线路名称
      lineNameList: [],

      // 导出数据
      exportdata: ""
    };
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
      return this.form.options;
    }
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
      });
    },
    // 选择线路
    xzxl(val) {
      let type = "post";
      let url = this.urlb + "/api/pc/getmzInfo";
      let data = {
        nid: this.form.options,
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.allLineData = res.data.data;
      });
    },
    // 初始化获取数据
    getDatas0() {
      let type = "post";
      let url = this.urlb + "/api/pc/oneMachElectricitys";
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.form.options ? this.form.options : 0
      };
      if (this.form.dateRange && this.form.dateRange.length > 0) {
        data.type = 1;
        data.start = this.form.dateRange[0].getTime() / 1000;
        data.end = this.form.dateRange[1].getTime() / 1000;
      } else {
        data.type = 0;
        data.start = 0;
        data.end = 0;
      }
      this.myAjax(type, url, data, res => {
        // console.log(res);
        this.tianqu = res.data.btia;
        this.jdate = new Date().getHours();
        // this.getStudent1();
      });
    },

    // // 多条线路的当天用电量
    // machListElectricity(){
    //   let type='post'
    //   let url = this.urlb + 'appv1/com/machListElectricity'
    //   let data = {
    //     uid:localStorage.getItem('uid'),
    //     list:['34474c3430354b4735554c5801','34474c3430354b473556373401','34474c3430354b47355637340c']
    //     }

    //   this.myAjax(type,url,data,res=>{
    //     console.log(res)
    //   })
    // },

    // 单个主机及分机的用电量趋势
    getOneMatchTime() {
      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urla + "/api/pc/oneMachTimeElectricity",
        data: Qs.stringify({
          uid: localStorage.getItem("uid"),
          nid: this.form.options ? this.form.options : 0
        })
      }).then(res => {
        this.one = res.data.data;
      });

      // let type = "post";
      // let url = this.urla + "/api/pc/oneMachTimeElectricity";
      // let data = {
      //   uid: localStorage.getItem("uid"),
      //   nid: this.form.options ? this.form.options : 0
      // };
      // this.myAjax(type, url, data, res => {
      //   // console.log(res);
      //   this.one = res.data.data;
      // });
    },

    // 筛选字段 - 重置
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      this.manyLine = [];
      this.checkedCities = [];
      this.getStudent1();
      // this.getDatas0();
    },
    // 筛选字段 - 查询
    squery() {
      // console.log(this.form.dateRange);
      this.checkedCities = []
      if (this.manyLine.length > 0) {
        this.manyLine = []
        // this.getStudent1()
        this.zhexian.clear()
      }

      this.xzxl()
      this.getOneMatchTime();

      this.getDatas0();
    },
    // 折线面积图
    getStudent1() {
      let _this = this;
      let arr = [
        "0-1点",
        "1-2点",
        "2-3点",
        "3-4点",
        "4-5点",
        "5-6点",
        "6-7点",
        "7-8点",
        "8-9点",
        "9-10点",
        "10-11点",
        "11-12点",
        "12-13点",
        "13-14点",
        "14-15点",
        "15-16点",
        "16-17点",
        "17-18点",
        "18-19点",
        "19-20点",
        "20-21点",
        "21-22点",
        "22-23点"
      ];
      arr.length = _this.jdate;
      this.zhexian = _this.$echarts.init(document.getElementById("charts1"));

      setTimeout(() => {
        $(window).resize(function () {
          try {
            _this.zhexian.resize();
          } catch (error) {
            console.log(error);
          }
        });
      }, 0);

      this.zhexian.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#008080"
            }
          },
          textStyle: {
            align: "left"
          }
        },
        legend: {
          data: []
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
          name: "单位：(kW/h)",
          type: "value"
        },
        series: [
          // {
          //   data: _this.tianqu,
          //   type: "line",
          //   areaStyle: {
          //     normal: {
          //       color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //         {
          //           offset: 0,
          //           color: "#d7f4f8" // 0% 处的颜色
          //         },
          //         {
          //           offset: 0.5,
          //           color: "#eefcfd" // 100% 处的颜色
          //         },
          //         {
          //           offset: 1,
          //           color: "#fff" // 100% 处的颜色
          //         }
          //       ]), //背景渐变色
          //       lineStyle: {
          //         // 系列级个性化折线样式
          //         width: 3,
          //         type: "solid",
          //         color: "#4fd6d2"
          //       }
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: "#8cd5c2", //改变折线点的颜色
          //       lineStyle: {
          //         color: "#8cd5c2" //改变折线颜色
          //       }
          //     }
          //   },
          //   label: {
          //     normal: {
          //       show: true,
          //       position: "top"
          //     }
          //   }
          // }
          {
            data: _this.manyLine.length != 0 ? _this.manyLine[0].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[0] : "",
            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 2 ? _this.manyLine[1].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[1] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 3 ? _this.manyLine[2].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[2] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 4 ? _this.manyLine[3].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[3] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 5 ? _this.manyLine[4].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[4] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 6 ? _this.manyLine[5].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[5] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 7 ? _this.manyLine[6].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[6] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 8 ? _this.manyLine[7].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[7] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 9 ? _this.manyLine[8].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[8] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 10 ? _this.manyLine[9].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[9] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 11 ? _this.manyLine[10].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[10] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          },
          {
            data: _this.manyLine.length >= 12 ? _this.manyLine[11].ele : [],
            name: _this.manyLine.length != 0 ? _this.lineNameList[11] : "",

            type: "line",
            // areaStyle: {
            //   normal: {
            //     color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 0,
            //         color: "#d7f4f8" // 0% 处的颜色
            //       },
            //       {
            //         offset: 0.5,
            //         color: "#eefcfd" // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "#fff" // 100% 处的颜色
            //       }
            //     ]), //背景渐变色
            //     lineStyle: {
            //       // 系列级个性化折线样式
            //       width: 3,
            //       type: "solid",
            //       color: "#4fd6d2"
            //     }
            //   }
            // },
            // itemStyle: {
            //   normal: {
            //     color: "#8cd5c2", //改变折线点的颜色
            //     lineStyle: {
            //       color: "#8cd5c2" //改变折线颜色
            //     }
            //   }
            // },
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
        // const tHeader = ["当天时间/小时", "电流数值"];
        const tHeader = this.lineNameList;
        tHeader.unshift("当天时间");
        tHeader.unshift("状态");
        const filterValue = [
          "tag",
          "time",
          "num",
          "num1",
          "num2",
          "num3",
          "num4",
          "num5",
          "num6",
          "num7",
          "num8",
          "num9",
          "num10",
          "num11"
        ];
        let arr = [
          "0-1点",
          "1-2点",
          "2-3点",
          "3-4点",
          "4-5点",
          "5-6点",
          "6-7点",
          "7-8点",
          "8-9点",
          "9-10点",
          "10-11点",
          "11-12点",
          "12-13点",
          "13-14点",
          "14-15点",
          "15-16点",
          "16-17点",
          "17-18点",
          "18-19点",
          "19-20点",
          "20-21点",
          "21-22点",
          "22-23点"
        ];
        let tagList = [
          "谷值",
          "谷值",
          "谷值",
          "谷值",
          "谷值",
          "谷值",
          "谷值",
          "峰值",
          "峰值",
          "峰值",
          "平值",
          "平值",
          "平值",
          "平值",
          "峰值",
          "峰值",
          "峰值",
          "峰值",
          "平值",
          "平值",
          "平值",
          "平值",
          "谷值",
          "谷值"
        ];
        const list = [];
        for (let i = 0; i < this.jdate; i++) {
          list.push({
            tag: tagList[i],
            time: arr[i],
            // num: this.manyLine[0].ele[i]
            num: this.manyLine[0].ele[i],
            num1: this.manyLine.length >= 2 ? this.manyLine[1].ele[i] : "",
            num2: this.manyLine.length >= 3 ? this.manyLine[2].ele[i] : "",
            num3: this.manyLine.length >= 4 ? this.manyLine[3].ele[i] : "",
            num4: this.manyLine.length >= 5 ? this.manyLine[4].ele[i] : "",
            num5: this.manyLine.length >= 6 ? this.manyLine[5].ele[i] : "",
            num6: this.manyLine.length >= 7 ? this.manyLine[6].ele[i] : "",
            num7: this.manyLine.length >= 8 ? this.manyLine[7].ele[i] : "",
            num8: this.manyLine.length >= 9 ? this.manyLine[8].ele[i] : "",
            num9: this.manyLine.length >= 10 ? this.manyLine[9].ele[i] : "",
            num10: this.manyLine.length >= 11 ? this.manyLine[10].ele[i] : "",
            num11: this.manyLine.length >= 12 ? this.manyLine[11].ele[i] : ""
          });
        }

        // 每列总和数据
        var he = "";
        var he1 = "";
        var he2 = "";
        var he3 = "";
        var he4 = "";
        var he5 = "";
        var he6 = "";
        var he7 = "";
        var he8 = "";
        var he9 = "";
        var he10 = "";
        var he11 = "";
        if (this.manyLine.length > 0) {
          this.manyLine[0].ele.forEach(val => {
            // he +=Number(val)
            he = Number(he) + Number(val);
          });
        }
        if (this.manyLine.length >= 2) {
          this.manyLine[1].ele.forEach(val => {
            // he +=Number(val)
            he1 = Number(he1) + Number(val);
          });
        }
        if (this.manyLine.length >= 3) {
          this.manyLine[2].ele.forEach(val => {
            // he +=Number(val)
            he2 = Number(he2) + Number(val);
          });
        }
        if (this.manyLine.length >= 4) {
          this.manyLine[3].ele.forEach(val => {
            // he +=Number(val)
            he3 = Number(he3) + Number(val);
          });
        }
        if (this.manyLine.length >= 5) {
          this.manyLine[4].ele.forEach(val => {
            // he +=Number(val)
            he4 = Number(he4) + Number(val);
          });
        }
        if (this.manyLine.length >= 6) {
          this.manyLine[5].ele.forEach(val => {
            // he +=Number(val)
            he5 = Number(he5) + Number(val);
          });
        }
        if (this.manyLine.length >= 7) {
          this.manyLine[6].ele.forEach(val => {
            // he +=Number(val)
            he6 = Number(he6) + Number(val);
          });
        }
        if (this.manyLine.length >= 8) {
          this.manyLine[7].ele.forEach(val => {
            // he +=Number(val)
            he7 = Number(he7) + Number(val);
          });
        }
        if (this.manyLine.length >= 9) {
          this.manyLine[8].ele.forEach(val => {
            // he +=Number(val)
            he8 = Number(he8) + Number(val);
          });
        }
        if (this.manyLine.length >= 10) {
          this.manyLine[9].ele.forEach(val => {
            // he +=Number(val)
            he9 = Number(he9) + Number(val);
          });
        }
        if (this.manyLine.length >= 11) {
          this.manyLine[10].ele.forEach(val => {
            // he +=Number(val)
            he10 = Number(he10) + Number(val);
          });
        }
        if (this.manyLine.length >= 12) {
          this.manyLine[11].ele.forEach(val => {
            // he +=Number(val)
            he11 = Number(he11) + Number(val);
          });
        }

        // 添加空行
        list.push({
          time: "",
          num: "",
          num1: "",
          num2: "",
          num3: "",
          num4: "",
          num5: "",
          num6: "",
          num7: "",
          num8: "",
          num9: "",
          num10: "",
          num11: ""
        });

        // 添加每列总和
        list.push({
          time: "用电总和",
          num: he,
          num1: he1,
          num2: he2,
          num3: he3,
          num4: he4,
          num5: he5,
          num6: he6,
          num7: he7,
          num8: he8,
          num9: he9,
          num10: he10,
          num11: he11
          // num: eval(
          //   this.getString3(
          //     this.exportdata,
          //     this.exportdata.length - (this.exportdata.length - this.jdate)
          //   ).join("+")
          // )
        });

        // 添加空行
        list.push({
          time: "",
          num: "",
          num1: "",
          num2: "",
          num3: "",
          num4: "",
          num5: "",
          num6: "",
          num7: "",
          num8: "",
          num9: "",
          num10: "",
          num11: ""
        });

        // 峰值电量数据
        var maxdata = "";
        var maxdata1 = "";
        var maxdata2 = "";
        var maxdata3 = "";
        var maxdata4 = "";
        var maxdata5 = "";
        var maxdata6 = "";
        var maxdata7 = "";
        var maxdata8 = "";
        var maxdata9 = "";
        var maxdata10 = "";
        var maxdata11 = "";
        if (this.manyLine.length > 0) {
          maxdata = Math.max(...this.manyLine[0].ele);
        }
        if (this.manyLine.length >= 2) {
          maxdata1 = Math.max(...this.manyLine[1].ele);
        }
        if (this.manyLine.length >= 3) {
          maxdata2 = Math.max(...this.manyLine[2].ele);
        }
        if (this.manyLine.length >= 4) {
          maxdata3 = Math.max(...this.manyLine[3].ele);
        }
        if (this.manyLine.length >= 5) {
          maxdata4 = Math.max(...this.manyLine[4].ele);
        }
        if (this.manyLine.length >= 6) {
          maxdata5 = Math.max(...this.manyLine[5].ele);
        }
        if (this.manyLine.length >= 7) {
          maxdata6 = Math.max(...this.manyLine[6].ele);
        }
        if (this.manyLine.length >= 8) {
          maxdata7 = Math.max(...this.manyLine[7].ele);
        }
        if (this.manyLine.length >= 9) {
          maxdata8 = Math.max(...this.manyLine[8].ele);
        }
        if (this.manyLine.length >= 10) {
          maxdata9 = Math.max(...this.manyLine[9].ele);
        }
        if (this.manyLine.length >= 11) {
          maxdata10 = Math.max(...this.manyLine[10].ele);
        }
        if (this.manyLine.length >= 12) {
          maxdata11 = Math.max(...this.manyLine[11].ele);
        }

        // 峰值电量
        list.push({
          time: "峰值电量",
          num: maxdata,
          num1: maxdata1,
          num2: maxdata2,
          num3: maxdata3,
          num4: maxdata4,
          num5: maxdata5,
          num6: maxdata6,
          num7: maxdata7,
          num8: maxdata8,
          num9: maxdata9,
          num10: maxdata10,
          num11: maxdata11
        });

        // 谷值电量数据
        var mindata = "";
        var mindata1 = "";
        var mindata2 = "";
        var mindata3 = "";
        var mindata4 = "";
        var mindata5 = "";
        var mindata6 = "";
        var mindata7 = "";
        var mindata8 = "";
        var mindata9 = "";
        var mindata10 = "";
        var mindata11 = "";
        if (this.manyLine.length > 0) {
          mindata = Math.min(...this.manyLine[0].ele);
        }
        if (this.manyLine.length >= 2) {
          mindata1 = Math.min(...this.manyLine[1].ele);
        }
        if (this.manyLine.length >= 3) {
          mindata2 = Math.min(...this.manyLine[2].ele);
        }
        if (this.manyLine.length >= 4) {
          mindata3 = Math.min(...this.manyLine[3].ele);
        }
        if (this.manyLine.length >= 5) {
          mindata4 = Math.min(...this.manyLine[4].ele);
        }
        if (this.manyLine.length >= 6) {
          mindata5 = Math.min(...this.manyLine[5].ele);
        }
        if (this.manyLine.length >= 7) {
          mindata6 = Math.min(...this.manyLine[6].ele);
        }
        if (this.manyLine.length >= 8) {
          mindata7 = Math.min(...this.manyLine[7].ele);
        }
        if (this.manyLine.length >= 9) {
          mindata8 = Math.min(...this.manyLine[8].ele);
        }
        if (this.manyLine.length >= 10) {
          mindata9 = Math.min(...this.manyLine[9].ele);
        }
        if (this.manyLine.length >= 11) {
          mindata10 = Math.min(...this.manyLine[10].ele);
        }
        if (this.manyLine.length >= 12) {
          mindata11 = Math.min(...this.manyLine[11].ele);
        }

        // 谷值电量
        list.push({
          time: "谷值电量",
          num: mindata,
          num1: mindata1,
          num2: mindata2,
          num3: mindata3,
          num4: mindata4,
          num5: mindata5,
          num6: mindata6,
          num7: mindata7,
          num8: mindata8,
          num9: mindata9,
          num10: mindata10,
          num11: mindata11
        });

        const data = this.formatJson(filterValue, list);
        export_json_to_excel(tHeader, data, excel);
      });
    },
    // 点击导出 - 对应循环对象
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
        return this.checkedCities.indexOf(num.mid) != -1;
      });

      let name = [];
      for (var i = 0; i < this.allLineData.length; i++) {
        for (var j = 0; j < this.manyLine.length; j++) {
          if (this.manyLine[j].mid == this.allLineData[i].mid) {
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
        return this.checkedCities.indexOf(num.mid) != -1;
      });

      // 最大值
      // console.log(Math.max(...this.manyLine[0].ele))

      let name = [];
      for (var i = 0; i < this.allLineData.length; i++) {
        for (var j = 0; j < this.manyLine.length; j++) {
          if (this.manyLine[j].mid == this.allLineData[i].mid) {
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
    }
  },
  mounted() {
    // this.machListElectricity()
  },
  created() {
    this.getDatas0();
    this.getOptions();
  }
};
</script>
  
<style lang="less" scoped>
.LineEnergyConsumption .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.LineEnergyConsumption
  .el-header
  .el-form
  /deep/
  .el-date-editor
  .el-range-separator {
  line-height: 28px !important;
}
.LineEnergyConsumption
  .el-header
  .el-form
  /deep/
  .el-date-editor
  .el-range__icon {
  line-height: 28px !important;
}
.LineEnergyConsumption
  .el-header
  .el-form
  /deep/
  .el-date-editor
  .el-range__close-icon {
  line-height: 26px !important;
}
.LineEnergyConsumption {
  overflow: hidden;
  height: 100%;
  .el-header {
    height: 120px !important;
    .el-form {
      text-align: left;
      margin-top: 10px;
      .choice {
        overflow: hidden;
        position: absolute;
      }
      .el-form-item {
        float: left;
      }
      .el-button {
        margin-top: 3px;
        padding: 9px 20px;
        margin-left: 20px;
      }
      .fwsj {
        width: 360px;
      }
      .sb {
        width: 170px;
      }
      .xl {
        width: 170px;
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
      margin-top: 4%;
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
  