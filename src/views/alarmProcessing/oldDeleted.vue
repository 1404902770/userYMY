<template>
  <!-- 综合报警 - 已经删除报警信息 -->
  <div class="oldDeleted">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          class="demo-ruleForm"
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
                :value="item.mzid"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="类别"
            prop="pu"
          >
            <el-select
              v-model="form.pu"
              placeholder="全部"
            >
              <el-option
                label="欠压告警"
                value="1"
              ></el-option>
              <el-option
                label="过压预警"
                value="2"
              ></el-option>
              <el-option
                label="过压报警"
                value="3"
              ></el-option>
              <el-option
                label="电流预警"
                value="4"
              ></el-option>
              <el-option
                label="电流告警"
                value="5"
              ></el-option>
              <el-option
                label="电流报警"
                value="6"
              ></el-option>
              <el-option
                label="漏电流报警"
                value="7"
              ></el-option>
              <el-option
                label="温度报警"
                value="8"
              ></el-option>
              <el-option
                label="分机报警"
                value="9"
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
        <!-- 列表 -->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
        >
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
          ></el-table-column>

          <el-table-column
            prop="beizhu"
            show-overflow-tooltip
            label="报警详情"
            align="center"
            min-width="80"
          ></el-table-column>

          <!-- <el-table-column prop="xname" show-overflow-tooltip label="检修人" align="center" min-width="60"></el-table-column>
          <el-table-column prop="xtime" show-overflow-tooltip label="检修时间" align="center" min-width="80"></el-table-column>                  -->
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
          :page-size="15"
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
  name: "oldDeleted",

  components: {
    copyright
  },

  data() {
    return {
      // 检索
      form: {
        region: "",
        pu: ""
      },
      // 获取所有设备
      options: [],
      // 列表数据
      tableData: [],
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
      let url = this.urlb + "/api/pc/allNeted";
      let data = {
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
      });
    },
    // 初始化获取列表
    getList(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/DeleteJingList";
      let data = {
        uid: localStorage.getItem("uid"),
        page: page,
        type: this.form.pu ? Number(this.form.pu) : 0,
        nid: this.form.region ? Number(this.form.region) : 0
      };
      this.myAjax(type, url, data, res => {
        this.tableData = res.data.data;
        this.fenYe.total = res.data.total[0].total;
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
          ).Format("yy-MM-dd hh:mm");
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList(1);
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
  }
};
</script>
  
<style lang="less" scoped>
.oldDeleted .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.oldDeleted {
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
  