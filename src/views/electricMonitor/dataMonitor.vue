<template>
  <!-- 用电检测 - 数据监测 -->
  <div class="dataMonitor">
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
              @change="getOnedx"
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

          <!-- <el-form-item label="电箱名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="电箱地址">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="电箱号">
            <el-input v-model="form.name"></el-input>
          </el-form-item> -->

          <!-- <el-button
            type="primary"
            @click="getOnedx"
            style="float:left;margin-left:10px;"
          >查询</el-button> -->

          <el-button
            @click="resetForm1('form')"
            style="float:left;margin-left:10px;"
          >重置 / 刷新</el-button>

          <!-- <el-radio-group
            v-model="cardList"
            @change="carListLocalStorage"
            style="margin-bottom: 20px;"
          >
            <el-radio-button :label="1">卡片</el-radio-button>
            <el-radio-button :label="2">列表</el-radio-button>
          </el-radio-group> -->
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <!-- 卡片显示 -->
        <div
          v-show="cardList ==1"
          class="cardz"
          v-for="(item,index) in tableData"
          :key="index"
          @click="see(item)"
        >
          <img
            class="cleft"
            src="../../../public/static/images/dx1.png"
            alt
          />
          <div class="cright">
            <p>
              <span class="s1">电箱名称:</span>
              <span class="s2">[{{ getString1(hexCharCodeToStr(item.nid)) }}]{{ item.mzname }}</span>
            </p>
            <p>
              <span class="s1">设备型号:</span>
              <span
                class="s2"
                v-if="item.type == 0"
              >[F]总路单相</span>
              <span
                class="s2"
                v-if="item.type == 1"
              >[F]总路三相</span>
              <span
                class="s2"
                v-if="item.type == 10"
              >[F]支路单相</span>
              <span
                class="s2"
                v-if="item.type == 11"
              >[F]支路三相</span>
              <span
                class="s2"
                v-if="item.type == 80"
              >[T]总路单相</span>
              <span
                class="s2"
                v-if="item.type == 81"
              >[T]总路三相</span>
              <span
                class="s2"
                v-if="item.type == 90"
              >[T]支路单相</span>
              <span
                class="s2"
                v-if="item.type == 91"
              >[T]支路三相</span>
            </p>
            <p>
              <span class="s1">安装地址:</span>
              <span class="s2">{{ item.jianzhu }}</span>
            </p>
            <p>
              <span class="s1">安装时间:</span>
              <span class="s2">{{ item.anzhuang }}</span>
            </p>
            <i
              class="el-icon-loading zt"
              style="color: #008080;"
            ></i>
            <!-- <p
              class="zt"
              :style="item.statu == 1?'color:#008080':'color:#F56C6C'"
            >{{ item.statu == 1?'在线':'离线' }}</p> -->
          </div>
        </div>

        <!-- 列表显示 -->
        <el-table
          v-show="cardList ==2"
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

          <el-table-column
            prop="mzname"
            show-overflow-tooltip
            label="名称"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="设备型号"
            align="center"
            min-width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">[F]总路单相</span>
              <span v-if="scope.row.type == 1">[F]总路三相</span>
              <span v-if="scope.row.type == 10">[F]支路单相</span>
              <span v-if="scope.row.type == 11">[F]支路三相</span>
              <span v-if="scope.row.type == 80">[T]总路单相</span>
              <span v-if="scope.row.type == 81">[T]总路三相</span>
              <span v-if="scope.row.type == 90">[T]支路单相</span>
              <span v-if="scope.row.type == 91">[T]支路三相</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="jianzhu"
            show-overflow-tooltip
            label="安装地址"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            prop="anzhuang"
            show-overflow-tooltip
            label="安装时间"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="statu"
            show-overflow-tooltip
            label="状态"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.statu == 1"
                style="color:#008080;"
              >在线</span>
              <span
                v-if="scope.row.statu == 0"
                style="color:#F56C6C;"
              >离线</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="操作"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:#008080;"
                icon="el-icon-search"
                @click="see(scope.row)"
              >查看分路</el-button>
            </template>
          </el-table-column>
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
import ElementUI from "element-ui";
import Qs from "qs";
// import copyright from "../../components/copyright";
const copyright = () => import("../../components/copyright");
export default {
  name: "dataMonitor",
  components: {
    copyright: copyright
  },
  data() {
    return {
      // 检索
      form: {
        region: ""
      },
      // 获取所有设备
      options: [],
      // 列表数据
      tableData: [],
      // 展示形式 true - 卡片形式 / false - 列表形式
      cardList: 1,
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
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
      });
    },
    // 初始化获取列表
    getList(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/getmzlist";
      let data = {
        uid: localStorage.getItem("uid"),
        page: Number(page) - 1
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        this.tableData = res.data.data;
        this.fenYe.total = res.data.total;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].anzhuang = new Date(
            this.tableData[i].anzhuang * 1000
          ).Format("yy-MM-dd hh:mm:ss");
        }
      });
    },
    // 查询 - 下拉获取指定电箱
    getOnedx() {
      if (this.form.region) {
        let type = "post";
        let url = this.urlb + "/api/pc/oneNetedInfo";
        let data = {
          uid: localStorage.getItem("uid"),
          nid: this.form.region
        };
        this.myAjax(type, url, data, res => {
          this.tableData = res.data.data;
          this.fenYe.total = 1;
          if (this.tableData) {
            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].anzhuang = new Date(
                this.tableData[i].anzhuang * 1000
              ).Format("yy-MM-dd hh:mm:ss");
            }
          }
        });
      } else {
        this.$message.warning("请选择要查询的电箱设备号!");
      }
    },
    // 重置
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      this.getList(1);
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
    },
    // 点击查看
    see(row) {
      if (row.nid) {
        let _this = this;
        ElementUI.Loading.service({
          fullscreen: true,
          background: "rgba(0,0,0,.4)"
        });
        setTimeout(() => {
          ElementUI.Loading.service({}).close();
          _this.$router.push({
            path: "/dataMonitorInfo",
            query: {
              nid: row.nid
            }
          });
        }, 500);
      } else {
        this.$message.warning("该条信息有误,请联系管理员");
        return false;
      }
    },

    // 储存 - 1:卡片 / 2:列表,的显示形态
    carListLocalStorage() {
      localStorage.setItem("cl", this.cardList);
    }
  },
  mounted() { },
  created() {
    this.getOptions();
    this.getList(1);
    this.cardList = localStorage.getItem("cl") ? localStorage.getItem("cl") : 1;
  }
};
</script>
  
<style lang="less" scoped>
.dataMonitor .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
  // margin-top: 3px;
}
.dataMonitor {
  overflow: hidden;
  height: 100%;
  .el-header {
    .el-form {
      text-align: left;
      margin-top: 10px;
      .el-form-item {
        float: left;
      }
      .el-radio-group {
        float: right;
      }
      .el-button {
        padding: 9px 20px;
        margin-top: 3px;
        float: right;
      }
    }
  }

  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    .cardz {
      width: 31.8%;
      height: 160px;
      float: left;
      margin-left: 1%;
      border-radius: 4px;
      border: 1px solid #e6e6e6;
      margin-top: 15px;
      position: relative;
      .cleft {
        display: block;
        width: 60px;
        float: left;
        padding: 50px 0 0 20px;
      }
      .cright {
        width: 71%;
        padding-left: 5%;
        float: left;
        height: 100%;
        padding-top: 15px;
        p {
          text-align: left;
          line-height: 35px;
          .s1 {
            // width: 60px;
            display: inline-block;
          }
          .s2 {
            font-size: 12px;
            color: #a8a6a6;
            margin-left: 10px;
          }
        }
        .zt {
          position: absolute;
          right: 20px;
          top: 5px;
          font-size: 12px;
        }
      }
    }
    .cardz:hover {
      box-shadow: 0px 0px 15px #d0d0d0;
      transition: 0.5s;
      cursor: pointer;
    }
  }
  .el-footer {
  }
}
</style>