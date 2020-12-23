<template>
  <div
    class="usersreport"
    v-loading="false"
    element-loading-text="该功能正在研发，本月底上线"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <!-- <div class="usersreport"> -->

    <!-- <iframe
      class="CustomReport"
      frameborder="0"
      scrolling="yes"
      style="width:100%;height:100%;border:0;"
      src="http://www.acrelcloud.cn/v2/CustomReport.html?adv=0.5218154898928633"
    ></iframe> -->
    <div class="leftcontent">
      <div class="toptitle">分析报告</div>

      <el-container>
        <el-header>
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
          >

            <el-form-item label="起始日期:">
              <el-date-picker
                v-model="form.startdate"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
                :picker-options="timeChange"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="截止日期:">
              <el-date-picker
                v-model="form.enddate"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
                :picker-options="timeChange"
              >
              </el-date-picker>
            </el-form-item>

          </el-form>
        </el-header>

        <el-main>
          <div class="eqtable">
            <!-- <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox> -->

            <!-- <div style="margin: 15px 0;"></div> -->
            <!--  @change="handleCheckedeleChange" -->
            <el-radio-group v-model="checkedele">
              <el-radio
                v-for="(item,index) in electricbox"
                :label="item"
                :key="index"
              >{{'['+getString1(hexCharCodeToStr(item.mzid))+'] ' + item.mzname + ' [' + item.jianzhu +']'}}</el-radio>
            </el-radio-group>
          </div>
        </el-main>

        <el-footer>
          <div class="submit">
            <!-- <el-button
              size="medium"
              @click="handleCheckAllChange(choosetext=='全选当页'?true:false)"
            >{{choosetext}}</el-button> -->
            <el-button
              size="medium"
              @click="submit"
            >确定</el-button>
          </div>
        </el-footer>
      </el-container>

    </div>
    <div class="rightcontent">
      <div
        class="report-p1 split"
        style="page-break-before: always"
      ><label class="R-advert">智能云控 物联天下</label>
        <h1>用电分析报告</h1>
        <table class="message">
          <tbody>
            <tr>
              <td>电箱名称：</td>
              <td id="subName1">{{choose.mzname}}</td>
            </tr>
            <tr>
              <td>电箱地址：</td>
              <td id="subAddress1">{{choose.jianzhu}}</td>
            </tr>
            <tr>
              <td>报告日期：</td>
              <td id="subDate1">{{form.sta}}</td>
            </tr>
          </tbody>
        </table>
        <img
          src="../../../public/static/images/report-bg-01.png"
          class="page1-bg"
        >
      </div>

      <div
        class="report-p2"
        style="page-break-before: always"
      >
        <h3>1、电箱概况</h3>
        <table class="table substation">
          <tbody>
            <tr>
              <td>电箱名称</td>
              <td
                colspan="4"
                id="name"
              >{{choose.mzname ? choose.mzname:'-'}}</td>
            </tr>
            <tr>
              <td>电箱地址</td>
              <td
                colspan="4"
                id="name"
              >{{choose.jianzhu ? choose.jianzhu:'-'}}</td>
            </tr>
            <tr>
              <td>电箱型号</td>
              <td>电箱规格</td>
              <td>电箱极数</td>
              <td>分机数量</td>
              <td>是否使能</td>
            </tr>
            <tr>
              <td id="xinghao">{{choose.xinghao ? choose.xinghao:'-'}}</td>
              <td id="guige">{{choose.guige ? choose.guige+'A':'-'}}</td>
              <td id="jishu">{{choose.jishu ? choose.jishu+'P':'-'}}</td>
              <td id="fenji">{{choose.fen ? choose.fen+"个":'-'}}</td>
              <td id="shineng">{{choose.neng ? choose.neng =='01' ? "使能":"不使能":'-'}}</td>
            </tr>
          </tbody>
        </table>
        <h3>2、回路概况</h3>
        <p class="pDiv"> 该电箱下共有回路{{choose.fen ? choose.fen:'--'}}条，回路详情见下表：</p>
        <p
          class="powerString"
          id="powerString"
        ></p>
        <div
          class="powerContain"
          id="powerContain"
        >
          <!-- 线路列表 -->
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
          >

            <el-table-column
              label="电箱号"
              align="center"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ hexCharCodeToStr(scope.row.nid) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="mid"
              show-overflow-tooltip
              label="线路"
              align="center"
              min-width="50"
            ></el-table-column>

            <el-table-column
              prop="name"
              show-overflow-tooltip
              label="线路名称"
              align="center"
              min-width="100"
            ></el-table-column>

            <el-table-column
              prop="local"
              show-overflow-tooltip
              label="线路地址"
              align="center"
              min-width="100"
            ></el-table-column>

            <el-table-column
              prop="type"
              show-overflow-tooltip
              label="线路类型"
              align="center"
              min-width="70"
            ></el-table-column>

            <el-table-column
              prop="jianzhu"
              show-overflow-tooltip
              label="电箱地址"
              align="center"
              min-width="100"
            ></el-table-column>

            <el-table-column
              prop="mzname"
              show-overflow-tooltip
              label="电箱名称"
              align="center"
              min-width="100"
            ></el-table-column>
          </el-table>
        </div>
        <img
          src="../../../public/static/images/report-bg-02.png"
          class="page2-bg"
        >
      </div>

      <div class="report-p4 num0">
        <!-- <h4>2.2、线路能耗排名</h4>
        <div
          class="ranking"
          id="ranking"
        ></div> -->
        <!-- <p class="ranking-p"></p> -->
        <h3>3、阈值概况</h3>
        <div
          class="monitorTable"
          id="monitorTable"
        ></div><img
          src="../../../public/static/images/report-bg-02.png"
          class="page3-bg"
        >
      </div>

      <div class="report-p5">
        <h4>4、能耗分析</h4>
        <p class="pDiv"> 该电箱监测周期内总耗电量--kW·h，日平均耗电量--kW·h，单日最大耗电量--kW·h，日耗电情况详见下图：</p>
        <div class="daycurve"></div>
        <h4 class="daycurve-h4">4.1、日能耗排行</h4>
        <div class="daycurve2"></div>
        <p id="pfDiv"></p><img
          src="../../../public/static/images/report-bg-02.png"
          class="page3-bg"
        >
      </div>

      <div
        class="report-p3"
        style="page-break-before: always"
      >
        <h3>5、报警分析</h3>
        <h4>5.1、日报警数排行</h4>
        <p class="pDiv"> 该电箱在周期范围内共有报警信息--条，其中欠压报警--条，过压告警--条，过压报警--条，电流预警--条，电流告警--条，电流报警--条，
          温度报警--条，漏电流报警--条，分机报警--条，单日报警次数最多--条，最低--条，平均--条，报警详情见下图：</p>
        <p id="event"></p>
        <div
          class="eventDiv"
          id="eventDiv"
        >
          <div class="daycurve"></div>
        </div>
        <h4
          class="change"
          id="change"
        >5.2、报警事件</h4>
        <p id="sigevent"></p>
        <div id="sigeventTable">
          <div class="daycurve"></div>
        </div><img
          src="../../../public/static/images/report-bg-02.png"
          class="page3-bg"
        >
      </div>

      <div
        class="report-p6"
        style="page-break-before: always"
      >
        <h3 class="message">6、体检分析</h3>
        <div class="daycurve"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      form: {
        // 开始日期
        startdate: new Date(new Date() - 1000 * 60 * 60 * 24 * 30).getTime(),
        // 结束日期
        enddate: new Date().getTime(),
      },

      // 选择的数据
      checkedele: {},
      // 复选框绑定的数据
      electricbox: [],

      // 线路列表数据
      tableData: [],

      // 确定后选择
      choose: {},

      // 选择按钮文字
      choosetext: "全选当页"
    }
  },
  methods: {
    // 初始化获取所有设备
    getOptions() {
      let type = "post";
      let url = this.urlb + this.api_4 + "getNetedInfo";
      let data = {
        uid: localStorage.getItem("uid"),
        page: 1,
        limit: 13
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        this.electricbox = res.data.data
      });
    },

    // 获取线路列表
    getList(page) {
      let type = "post";
      let url = this.urlb + this.api_4 + "getNetedMachedList";
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.choose.mzid
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        // let arr1 = ['一', '二'];
        this.tableData = res.data.data;
        for (let i = 0; i < this.tableData.length; i++) {

          if (this.tableData[i].type == '0') {
            this.tableData[i].type = '[F]总路单相';
          } else if (this.tableData[i].type == '1') {
            this.tableData[i].type = '[F]总路三相';
          } else if (this.tableData[i].type == '10') {
            this.tableData[i].type = '[F]支路单相';
          } else if (this.tableData[i].type == '11') {
            this.tableData[i].type = '[F]支路三相';
          } else if (this.tableData[i].type == '80') {
            this.tableData[i].type = '[T]总路单相';
          } else if (this.tableData[i].type == '81') {
            this.tableData[i].type = '[T]总路三相';
          } else if (this.tableData[i].type == '90') {
            this.tableData[i].type = '[T]支路单相';
          } else {
            this.tableData[i].type = '[T]支路三相';
          }

          this.tableData[i].mid = parseInt(this.tableData[i].mid, 16) + "条"
        }
      });
    },

    // 判断是否全选
    // handleCheckAllChange(val) {
    //   console.log(val)

    //   this.checkedele = val ? this.electricbox : [];
    //   this.choosetext = "取消全选"
    //   if (val == false) {
    //     this.choosetext = "全选当页"
    //   }

    //   console.log(this.checkedele)
    // },
    // 单选某项
    // handleCheckedeleChange(value) {
    //   console.log(value)
    //   this.checkedele = value
    // },

    // 确定选择
    submit() {
      let obj = JSON.stringify(this.checkedele)
      console.log(JSON.parse(obj))
      this.choose = JSON.parse(obj)
      this.getList()
      console.log(this.form)
      // this.electricbox = obj
    },
  },

  created() {
    this.getOptions()
  }

}
</script>

<style lang="less">
.usersreport {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  .el-loading-text,
  .el-icon-loading {
    color: white !important;
  }
  .leftcontent {
    width: 400px;
    // height: 820px;
    // height: 52rem;
    height: 92%;
    border: 1px solid;
    text-align: left;
    position: relative;
    .toptitle {
      width: 400px;
      height: 40px;
      line-height: 40px;
      background: teal;
      color: white;
      padding-left: 5px;
      box-sizing: border-box;
    }
    .el-header {
      height: 90px !important;
      padding: 0;
      margin-top: 6px;
      .el-form-item {
        margin-bottom: 2px !important;
      }
    }
    .el-main {
      .eqtable {
        max-height: 520px;
        overflow-y: scroll;
      }
      .el-radio-group {
        display: flex;
        flex-direction: column;
        .el-radio {
          margin: 3px 0;
        }
      }
    }
    .el-footer {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 60px !important;
    }
  }
  .rightcontent {
    text-align: left;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #052792;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #20a3f5;
    }
    h1,
    h2,
    h3,
    h4 {
      font-family: inherit;
      font-weight: 500;
      line-height: 1.1;
      color: inherit;
    }
    .pDiv {
      text-indent: 2em;
    }

    .report-p1 {
      width: 700px;
      height: 820px;
      clear: both;
      margin: 0 auto;
      padding: 30px;
      position: relative;
      border: 1px solid #000;
      background-color: #ffffff;
      margin-bottom: 10px;
      box-sizing: border-box;
      label {
        padding-top: 8px;
        font-weight: normal;
        display: inline-block;
        max-width: 100%;
        margin-bottom: 5px;
        font-weight: 700;
      }
      h1 {
        text-align: center;
        margin-top: 140px;
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 80px;
      }
      .message {
        margin: 0 auto;
        width: 400px;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #eee;
        clear: both;
        tr td:first-child {
          width: 100px;
        }
        tr td {
          padding: 10px;
          border: 1px solid #ccc;
        }
      }
      .page1-bg {
        position: absolute;
        bottom: 0;
        left: -5px;
        width: 101%;
      }
    }
    .report-p2 {
      position: relative;
      width: 700px;
      height: 820px;
      padding: 30px;
      margin: 0 auto;
      border: 1px solid #000;
      background-color: #ffffff;
      margin-bottom: 10px;
      box-sizing: border-box;
      h3 {
        font-size: 24px;
        margin-bottom: 20px;
      }
      h4 {
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
        text-align: center;
        td,
        th {
          padding: 8px;
          line-height: 1.42857143;
          vertical-align: top;
          border-top: 1px solid #ddd;
        }
      }
      //   .table > tbody > tr > td,
      //   .table > tbody > tr > th,
      //   .table > tfoot > tr > td,
      //   .table > tfoot > tr > th,
      //   .table > thead > tr > td,
      //   .table > thead > tr > th {
      //     padding: 8px;
      //     line-height: 1.42857143;
      //     vertical-align: top;
      //     border-top: 1px solid #ddd;
      //   }

      #powerString,
      .daycurve-p1,
      .daycurve-p2 {
        font-size: 15px;
        text-indent: 25px;
        line-height: 27px;
      }
      .powerContain {
        width: 640px;
        max-height: 460px;
        margin: 0 auto;
        overflow-y: scroll;
      }
      .page2-bg {
        width: 532px;
        height: 90px;
        z-index: -5;
        margin-left: 32px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    h4 {
      font-size: 18px;
      font-family: inherit;
      font-weight: 500;
      line-height: 1.1;
      color: inherit;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    p {
      margin: 0 0 10px;
    }
    h3 {
      font-size: 24px;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .daycurve,
    .daycurve2 {
      // width: 530px;
      width: 100%;
      height: 250px;
      margin-bottom: 10px;
      border: 1px solid #eee;
    }

    .report-p4,
    .report-p5 {
      margin-bottom: 10px;
      padding: 30px;
    }
    .report-p4,
    .report-p5,
    .report-p6 {
      position: relative;
      width: 700px;
      height: 820px;
      padding: 30px;
      margin: 0 auto;
      margin-bottom: 10px !important;
      background-color: #ffffff;
      border: 1px solid #000;
      box-sizing: border-box;
    }

    .report-p4 {
      .ranking {
        // width: 530px;
        width: 100%;
        height: 280px;
        margin-bottom: 10px;
        border: solid 1px #eee;
      }
      .ranking-p {
        text-align: center;
      }
      .page3-bg {
        width: 532px;
        height: 90px;
        z-index: -5;
        margin-left: 32px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    .report-p5 {
      h4:first-child {
        font-size: 22px;
      }
      .page3-bg {
        width: 532px;
        height: 90px;
        z-index: -5;
        margin-left: 32px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    .report-p3 {
      position: relative;
      width: 700px;
      height: 820px;
      padding: 30px;
      margin: 0 auto;
      margin-bottom: 10px;
      background-color: #ffffff;
      border: 1px solid #000;
      box-sizing: border-box;
      #event {
        text-align: left;
      }
      p {
        font-size: 15px;
      }
      // .daycurve,
      // .daycurve2 {
      //   width: 530px;
      //   height: 250px;
      //   margin-bottom: 10px;
      //   border: 1px solid #eee;
      // }
      .change {
        margin-top: 30px;
      }
      .page3-bg {
        width: 532px;
        height: 90px;
        z-index: -5;
        margin-left: 32px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>