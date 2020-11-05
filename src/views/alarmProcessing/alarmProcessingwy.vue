<template>
  <!-- 综合报警 - 报警分类 -->
  <div class="alarmProcessingwy">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          class="demo-ruleForm"
          label-width="90px"
        >
          <el-form-item
            label="电箱设备号"
            prop="region"
            class="dianxiang"
          >
            <el-select
              v-model="form.region"
              filterable
              placeholder="全部"
              @change='getlines'
            >
              <el-option
                v-for="(item,index) in options"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+'] ' + item.mzname + ' [' + item.jianzhu +']'"
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
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in linearry"
                :key="index"
                :label="item.name"
                :value="item.mid"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="处理查询"
            prop="pu"
          >
            <el-select
              v-model="form.pu"
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in jingtype"
                :key="index"
                :label="item.title"
                :value="item.bhao"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="选择时间"
            prop="p1"
          >
            <el-date-picker
              v-model="value"
              :clearable='false'
              type="datetimerange"
              value-format="timestamp"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
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
        <!-- 列表 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="seeDetail"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
          ></el-table-column> -->

          <el-table-column
            prop="nid"
            show-overflow-tooltip
            label="电箱号"
            align="center"
            min-width="80"
          ></el-table-column>

          <el-table-column
            prop="mzname"
            show-overflow-tooltip
            label="电箱名字"
            align="center"
            min-width="80"
          ></el-table-column>

          <el-table-column
            prop="jianzhu"
            show-overflow-tooltip
            label="电箱地址"
            align="center"
            min-width="80"
          ></el-table-column>

          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="线路名字"
            align="center"
            min-width="80"
          ></el-table-column>

          <el-table-column
            prop="aa"
            show-overflow-tooltip
            label="线路"
            align="center"
            min-width="60"
          ></el-table-column>

          <el-table-column
            prop="local"
            show-overflow-tooltip
            label="线路地址"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="otype"
            show-overflow-tooltip
            label="告警类型"
            align="center"
            min-width="80"
          ></el-table-column>

          <el-table-column
            prop="limit"
            show-overflow-tooltip
            label="报警级别"
            align="center"
            min-width="90"
          ></el-table-column>

          <el-table-column
            prop="status"
            show-overflow-tooltip
            label="报警状态"
            align="center"
            min-width="80"
            :filters="[{text: '只阅读', value: '只阅读'}, {text: '未读', value: '未读'}]"
            :filter-method="filterHandler"
          ></el-table-column>

          <el-table-column
            prop="beizhu"
            show-overflow-tooltip
            label="报警详情"
            align="center"
            min-width="80"
          ></el-table-column>

          <!-- <el-table-column prop="xname" show-overflow-tooltip label="检修人" align="center" min-width="60"></el-table-column>
          <el-table-column prop="xtime" show-overflow-tooltip label="检修时间" align="center" min-width="80"></el-table-column> -->
          <el-table-column
            prop="time"
            show-overflow-tooltip
            label="报警发生时间"
            align="center"
            min-width="100"
          ></el-table-column>
        </el-table>
      </el-main>
      <!-- 尾部 -->
      <el-footer>
        <!-- 分页 -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="fenYe.currentPage"
          layout="total, prev, pager, next, jumper"
          :page-size="13"
          :total="fenYe.total"
        ></el-pagination>
      </el-footer>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
  </div>
</template>
  
  <script>
import copyright from "../../components/copyright";
export default {
  name: "alarmProcessingwy",
  components: {
    copyright
  },
  data() {
    return {
      // 时间快快捷键
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 选择时间
      value: "",
      // 检索
      form: {
        region: "",
        pu: "",
        line: ""
      },
      // 获取所有设备
      options: [],
      // 列表数据
      tableData: [],
      // 报警类型
      jingtype: [],
      // 线路信息
      linearry: [],
      // 分页
      fenYe: {
        currentPage: 1, // 当前页数
        total: null // 共多少页
      }
    };
  },
  methods: {
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urlb + this.api_4 + "getNetdSimpleList";
      let data = {
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
      });
    },
    // 初始化获取下拉数据 - 获取报警类型
    getjingtype() {
      let type = 'post'
      let url = this.urla + this.api_4 + 'jingOtype'
      let data = {
        uid: localStorage.getItem('uid')
      }
      this.myAjax(type, url, data, res => {
        this.jingtype = res.data.data
      })
    },
    // 选择电箱获取线路
    getlines() {
      let type = 'post'
      let url = this.urla + this.api_4 + 'machedList'
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.form.region
      }
      this.myAjax(type, url, data, res => {
        this.linearry = res.data.data
      })
    },
    // 初始化获取列表
    getList(page) {
      if (this.form.pu == '' && this.form.region == '') {

        let type = "post";
        let url = this.urlb + this.api_4 + "jingAllList";
        let data = {
          uid: localStorage.getItem("uid"),
          lei: 1,
          page: page - 1,
          limit: 13,
          start: 0,
          send: 0
        };
        if (this.value == "") {
          data.start = 0
          data.send = 0
        } else {
          data.lei = 2
          data.start = this.value[0] / 1000
          data.send = this.value[1] / 1000 + 86399
          // let data = {
          //   uid: localStorage.getItem("uid"),
          //   lei: 2,
          //   page: page - 1,
          //   limit: 13,
          //   start: this.value[0] / 1000,
          //   send: this.value[1] / 1000 + 86399
          // };
        }
        this.myAjax(type, url, data, res => {
          this.tableData = res.data.data;
          this.fenYe.total = res.data.length;
          for (let i = 0; i < this.tableData.length; i++) {
            // 电箱号
            this.tableData[i].nid = this.hexCharCodeToStr(this.tableData[i].nid);
            // 线路
            this.tableData[i].aa = '线路' + this.tableData[i].aa;
            // 告警类型
            if (this.tableData[i].otype == 1) {
              this.tableData[i].otype = '欠压告警'
            } else if (this.tableData[i].otype == 2) {
              this.tableData[i].otype = '过压预警'
            } else if (this.tableData[i].otype == 3) {
              this.tableData[i].otype = '过压报警'
            } else if (this.tableData[i].otype == 4) {
              this.tableData[i].otype = '电流预警'
            } else if (this.tableData[i].otype == 5) {
              this.tableData[i].otype = '电流告警'
            } else if (this.tableData[i].otype == 6) {
              this.tableData[i].otype = '电流报警'
            } else if (this.tableData[i].otype == 7) {
              this.tableData[i].otype = '漏电流报警'
            } else if (this.tableData[i].otype == 8) {
              this.tableData[i].otype = '温度报警'
            } else if (this.tableData[i].otype == 9) {
              this.tableData[i].otype = '分机报警'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 报警级别
            this.tableData[i].limit = '建议断闸检修'
            // 报警状态
            if (this.tableData[i].status == 0) {
              this.tableData[i].status = '未读'
            } else if (this.tableData[i].status == 1) {
              this.tableData[i].status = '只阅读'
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].status = '已经检修'
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].status = '已删除'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 检修人
            this.tableData[i].xname = this.tableData[i].xname ? this.tableData[i].xname : '- -';
            this.tableData[i].xtime = this.tableData[i].xtime ? this.tableData[i].xtime : '- -';
            // 报警发生的时间        
            this.tableData[i].time = new Date(
              this.tableData[i].time * 1000
            ).Format("yy-MM-dd hh:mm:ss");
          }
        });
      } else if (this.form.pu != '') {
        let type = "post";
        let url = this.urlb + this.api_4 + "jingOtypeList";
        let data = {
          uid: localStorage.getItem("uid"),
          lei: 1,
          otype: this.form.pu,
          page: page - 1,
          limit: 13,
          start: 0,
          send: 0
        };
        if (this.value == '') {
          data.lei = 1
          data.start = 0
          data.send = 0
        } else {
          data.lei = 2
          data.start = this.value[0] / 1000
          data.send = this.value[1] / 1000 + 86399
          // let data = {
          //   uid: localStorage.getItem("uid"),
          //   lei: 2,
          //   page: page - 1,
          //   limit: 13,
          //   start: this.value[0] / 1000,
          //   send: this.value[1] / 1000 + 86399
          // };
        }
        this.myAjax(type, url, data, res => {
          this.tableData = res.data.data;
          this.fenYe.total = res.data.length;
          for (let i = 0; i < this.tableData.length; i++) {
            // 电箱号
            this.tableData[i].nid = this.hexCharCodeToStr(this.tableData[i].nid);
            // 线路
            this.tableData[i].aa = '线路' + this.tableData[i].aa;
            // 告警类型
            if (this.tableData[i].otype == 1) {
              this.tableData[i].otype = '欠压告警'
            } else if (this.tableData[i].otype == 2) {
              this.tableData[i].otype = '过压预警'
            } else if (this.tableData[i].otype == 3) {
              this.tableData[i].otype = '过压报警'
            } else if (this.tableData[i].otype == 4) {
              this.tableData[i].otype = '电流预警'
            } else if (this.tableData[i].otype == 5) {
              this.tableData[i].otype = '电流告警'
            } else if (this.tableData[i].otype == 6) {
              this.tableData[i].otype = '电流报警'
            } else if (this.tableData[i].otype == 7) {
              this.tableData[i].otype = '漏电流报警'
            } else if (this.tableData[i].otype == 8) {
              this.tableData[i].otype = '温度报警'
            } else if (this.tableData[i].otype == 9) {
              this.tableData[i].otype = '分机报警'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 报警级别
            this.tableData[i].limit = '建议断闸检修'
            // 报警状态
            if (this.tableData[i].status == 0) {
              this.tableData[i].status = '未读'
            } else if (this.tableData[i].status == 1) {
              this.tableData[i].status = '只阅读'
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].status = '已经检修'
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].status = '已删除'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 检修人
            this.tableData[i].xname = this.tableData[i].xname ? this.tableData[i].xname : '- -';
            this.tableData[i].xtime = this.tableData[i].xtime ? this.tableData[i].xtime : '- -';
            // 报警发生的时间        
            this.tableData[i].time = new Date(
              this.tableData[i].time * 1000
            ).Format("yy-MM-dd hh:mm:ss");
          }
        });
      } else if (this.form.line != '' && this.form.region != '') {
        let type = "post";
        let url = this.urlb + this.api_4 + "jingMachedList";
        let data = {
          uid: localStorage.getItem("uid"),
          lei: 1,
          nid: this.form.region,
          mid: this.form.line,
          page: page - 1,
          limit: 13,
          start: 0,
          send: 0
        };
        if (this.value == '') {
          data.lei = 1
          data.start = 0
          data.send = 0
        } else {
          data.lei = 2
          data.start = this.value[0] / 1000
          data.send = this.value[1] / 1000 + 86399
          // let data = {
          //   uid: localStorage.getItem("uid"),
          //   lei: 2,
          //   page: page - 1,
          //   limit: 13,
          //   start: this.value[0] / 1000,
          //   send: this.value[1] / 1000 + 86399
          // };
        }
        this.myAjax(type, url, data, res => {
          this.tableData = res.data.data;
          this.fenYe.total = res.data.length;
          for (let i = 0; i < this.tableData.length; i++) {
            // 电箱号
            this.tableData[i].nid = this.hexCharCodeToStr(this.tableData[i].nid);
            // 线路
            this.tableData[i].aa = '线路' + this.tableData[i].aa;
            // 告警类型
            if (this.tableData[i].otype == 1) {
              this.tableData[i].otype = '欠压告警'
            } else if (this.tableData[i].otype == 2) {
              this.tableData[i].otype = '过压预警'
            } else if (this.tableData[i].otype == 3) {
              this.tableData[i].otype = '过压报警'
            } else if (this.tableData[i].otype == 4) {
              this.tableData[i].otype = '电流预警'
            } else if (this.tableData[i].otype == 5) {
              this.tableData[i].otype = '电流告警'
            } else if (this.tableData[i].otype == 6) {
              this.tableData[i].otype = '电流报警'
            } else if (this.tableData[i].otype == 7) {
              this.tableData[i].otype = '漏电流报警'
            } else if (this.tableData[i].otype == 8) {
              this.tableData[i].otype = '温度报警'
            } else if (this.tableData[i].otype == 9) {
              this.tableData[i].otype = '分机报警'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 报警级别
            this.tableData[i].limit = '建议断闸检修'
            // 报警状态
            if (this.tableData[i].status == 0) {
              this.tableData[i].status = '未读'
            } else if (this.tableData[i].status == 1) {
              this.tableData[i].status = '只阅读'
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].status = '已经检修'
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].status = '已删除'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 检修人
            this.tableData[i].xname = this.tableData[i].xname ? this.tableData[i].xname : '- -';
            this.tableData[i].xtime = this.tableData[i].xtime ? this.tableData[i].xtime : '- -';
            // 报警发生的时间        
            this.tableData[i].time = new Date(
              this.tableData[i].time * 1000
            ).Format("yy-MM-dd hh:mm:ss");
          }
        });
      } else {
        let type = "post";
        let url = this.urlb + this.api_4 + "jingNetedList";
        let data = {
          uid: localStorage.getItem("uid"),
          lei: 1,
          nid: this.form.region,
          page: page - 1,
          limit: 13,
          start: 0,
          send: 0
        };
        if (this.value == '') {
          data.lei = 1
          data.start = 0
          data.send = 0
        } else {
          data.lei = 2
          data.start = this.value[0] / 1000
          data.send = this.value[1] / 1000 + 86399
          // let data = {
          //   uid: localStorage.getItem("uid"),
          //   lei: 2,
          //   page: page - 1,
          //   limit: 13,
          //   start: this.value[0] / 1000,
          //   send: this.value[1] / 1000 + 86399
          // };
        }
        this.myAjax(type, url, data, res => {
          this.tableData = res.data.data;
          this.fenYe.total = res.data.length;
          for (let i = 0; i < this.tableData.length; i++) {
            // 电箱号
            this.tableData[i].nid = this.hexCharCodeToStr(this.tableData[i].nid);
            // 线路
            this.tableData[i].aa = '线路' + this.tableData[i].aa;
            // 告警类型
            if (this.tableData[i].otype == 1) {
              this.tableData[i].otype = '欠压告警'
            } else if (this.tableData[i].otype == 2) {
              this.tableData[i].otype = '过压预警'
            } else if (this.tableData[i].otype == 3) {
              this.tableData[i].otype = '过压报警'
            } else if (this.tableData[i].otype == 4) {
              this.tableData[i].otype = '电流预警'
            } else if (this.tableData[i].otype == 5) {
              this.tableData[i].otype = '电流告警'
            } else if (this.tableData[i].otype == 6) {
              this.tableData[i].otype = '电流报警'
            } else if (this.tableData[i].otype == 7) {
              this.tableData[i].otype = '漏电流报警'
            } else if (this.tableData[i].otype == 8) {
              this.tableData[i].otype = '温度报警'
            } else if (this.tableData[i].otype == 9) {
              this.tableData[i].otype = '分机报警'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 报警级别
            this.tableData[i].limit = '建议断闸检修'
            // 报警状态
            if (this.tableData[i].status == 0) {
              this.tableData[i].status = '未读'
            } else if (this.tableData[i].status == 1) {
              this.tableData[i].status = '只阅读'
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].status = '已经检修'
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].status = '已删除'
            } else {
              this.tableData[i].otype = '- -'
            }
            // 检修人
            this.tableData[i].xname = this.tableData[i].xname ? this.tableData[i].xname : '- -';
            this.tableData[i].xtime = this.tableData[i].xtime ? this.tableData[i].xtime : '- -';
            // 报警发生的时间        
            this.tableData[i].time = new Date(
              this.tableData[i].time * 1000
            ).Format("yy-MM-dd hh:mm:ss");
          }
        });
      }

    },

    // 报警状态筛选
    filterHandler(value, row, column) {
      // console.log(value, row, column)
    },

    // 点击表格某一行
    seeDetail(row, column, event) {
      // console.log(row, column, event)
    },

    // 表格选择事件
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      console.log(val)

      // let list = []
      // val.forEach(val=>{
      //   list.push(val.id)
      // })
      // console.log(list)
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.value = ""
      this.form.line = ""

      this.getList(1);
      this.fenYe.currentPage = 1;
    },
    // 查询
    submitForm() {
      this.getList(1);
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
    }
  },
  mounted() { },
  created() {
    this.getList(1);
    this.getOptions();
    this.getjingtype()
  }
};
</script>
  
<style lang="less" scoped>
.alarmProcessingwy .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.alarmProcessingwy {
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
      .dianxiang {
        width: 360px;
        .el-select {
          width: 100%;
        }
      }
      .el-date-editor /deep/ .el-range__icon {
        line-height: 26px !important;
      }
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    .oo2 {
      font-size: 20px;
      vertical-align: middle;
      margin: -2px 5px 0 5px;
      color: #f56c6c;
    }
    .oo1 {
      font-size: 20px;
      vertical-align: middle;
      margin: -2px 5px 0 5px;
      color: #008080;
    }
  }
  .el-footer {
  }
}
</style>
  