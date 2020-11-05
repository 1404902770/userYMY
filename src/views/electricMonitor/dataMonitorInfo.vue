<template>
  <!-- 用电监测 - 数据检 - 详情 -->
  <div class="dataMonitorInfo">
    <el-container style="height: 100%;">
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用电监测</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/dataMonitor' }">数据监测</el-breadcrumb-item>
          <el-breadcrumb-item>线路详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button
          class="fh"
          type="primary"
          @click="$router.go(-1)"
        >返回</el-button>
      </el-header>

      <el-main>
        <el-tooltip
          v-for="(item,index) in tableData"
          :key="index"
          class="item"
          effect="dark"
          content="点击查看实时可视数据"
          placement="bottom"
        >
          <div
            class="electricInfo"
            @click="getStudents(item)"
          >
            <p class="mc">
              <span>名称：</span>
              <span>{{ item.name }}</span>
            </p>
            <p class="xh">
              <span>型号：</span>
              <span v-if="item.type == 0">[F]总路单相</span>
              <span v-if="item.type == 1">[F]总路三相</span>
              <span v-if="item.type == 10">[F]支路单相</span>
              <span v-if="item.type == 11">[F]支路三相</span>
              <span v-if="item.type == 80">[T]总路单相</span>
              <span v-if="item.type == 81">[T]总路三相</span>
              <span v-if="item.type == 90">[T]支路单相</span>
              <span v-if="item.type == 91">[T]支路三相</span>
            </p>
            <p class="sbh">
              <span>设备号：</span>
              <span>{{ hexCharCodeToStr(item.nid) }}</span>
            </p>
            <p class="xl">
              <span>线路：</span>
              <span>{{ item.mid }}</span>
            </p>
            <p class="wz">
              <span>位置：</span>
              <span>{{ item.local }}</span>
            </p>
            <p class="zt">
              <span>状态：</span>
              <span
                v-if="item.nn == '01'"
                style="color: #008080;"
              >合闸</span>
              <span
                v-if="item.nn == '0'||item.nn == '00'"
                style="color: #f56c6c;"
              >分闸</span>
            </p>
            <i :style="item.statu == 1?'color:#008080':'color:#F56C6C'">{{ item.statu == 1?'在线':'离线' }}</i>
            <!-- <i
              class="el-icon-loading"
              v-if="item.nn == '01'"
              style="color: #008080;"
            ></i>
            <i
              class="el-icon-loading"
              v-if="item.nn == '0'||item.nn == '00'"
              style="color: #f56c6c;"
            ></i> -->
          </div>
        </el-tooltip>
        <!-- dialog -->
        <el-dialog
          title="线路可视化"
          width="60%"
          :visible.sync="dialogVisible1"
          :before-close="handleDialogClose"
        >
          <charts
            :id="'echars'+1"
            :pageNum="index"
            :options="echarsOption"
            v-for="(item,index) in echarsOption"
            :key="index"
          ></charts>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              @click="handleDialogClose"
              type="primary"
            >关 闭</el-button>
          </span>
        </el-dialog>
      </el-main>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
  </div>
</template>
  
  <script>
import charts from "../../components/echars";
import copyright from "../../components/copyright";
import Qs from "qs";
import $ from "jquery";
export default {
  name: "dataMonitorInfo",
  components: {
    charts,
    copyright
  },
  data() {
    return {
      // 电箱id
      nid: "",
      // 列表数据
      tableData: [],
      // dialog
      dialogVisible1: false,
      // echars 数据
      echarsOption: [
        {
          lineName: "",
          times: [],
          dy: [],
          dl: []
        }
      ],
      echarsOption1: [
        {
          lineName: "",
          times: [],
          dy: [],
          dl: []
        }
      ],
      echarsOption2: [
        {
          lineName: "",
          times: [],
          dy: [],
          dl: []
        },
        {
          lineName: "",
          times: [],
          dy: [],
          dl: []
        },
        {
          lineName: "",
          times: [],
          dy: [],
          dl: []
        }
      ],
      // 临时获取单个分录信息
      fitem: {}
    };
  },
  watch: {
    count(newCount, oldCount) {
      if (newCount.type != "jing") {
        if (newCount.type == "nfs") {
          clearInterval(this.Interval);
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              (this.tableData[i].nid =
                newCount.nid && this.tableData[i].mid == newCount.mid)
            ) {
              if (newCount.zl == "00") {
                this.tableData[i].g = false;
                this.$message.success("分闸成功");
              } else {
                this.tableData[i].g = true;
                this.$message.success("和闸成功");
              }
            }
          }
        }
      }
    }
  },
  methods: {
    // 初始化获取所有分路
    getAllShunt() {
      let type = "post";
      let url = this.urlb + "/api/pc/getmzInfo";
      let data = {
        nid: this.nid,
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        this.tableData = res.data.data;
      });
    },
    // 关闭 loading1
    handleDialogClose() {
      this.dialogVisible1 = false;
      this.$router.go(0);
    },
    // 打开loading1
    getStudents(item) {
      let _this = this;
      _this.fitem = item;
      if (item.statu == 0) {
        _this.$message.warning("当前电箱不在线");
      } else {
        // _this.dialogVisible1 = true;
        //         _this.linkEhars();
        this.$router.push({ path: '/dataMonitorInfoecharts', query: { nid: this.nid, fitem: this.fitem } })

      }
    },
    // 获取echars瞬时数据
    linkEhars() {
      // let types = "post";
      // let url = this.urla + "/push/mach/duqushunshi";
      // let data = {
      //   uid: localStorage.getItem("uid"),
      //   nid: this.nid,
      //   aa: this.fitem.mid
      // };
      // this.myAjax(types, url, data, res => {
      //   if (res.data.code == 89) {
      //     this.$message.warning("设备处于设置状态");
      //   } else if (res.data.code == 111) {
      //     this.$message.warning("设备不在线");
      //   } else if (res.data.code == "104") {
      let _this = this;
      if (_this.dialogVisible1) {
        let n = 0;
        let interval = setInterval(function () {
          n++;
          if (n < 10) {
            _this.readEhars();
          } else if (n < 30) {
            if (n % 3 == 0) {
              _this.readEhars();
            }
          } else if (n < 60) {
            if (n % 5 == 0) {
              _this.readEhars();
            }
          } else if (n < 360) {
            if (n % 10 == 0) {
              _this.readEhars();
            }
          } else {
            clearInterval(interval);
          }
        }, 1000);
      }
      // }
      // });
    },
    // 读取echars瞬时数据
    readEhars() {
      let instance = this.$axios.create();
      let data = {
        uid: localStorage.getItem("uid"),
        nid: this.nid,
        aa: this.fitem.mid
      };
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        url: this.urlb + "/api/mach/duqushunshi",
        data: Qs.stringify(data)
      }).then(res => {
        // console.log(res)
        // console.log(this.$store.state.socketData)

        // vv: 226.4
        // bb: 0.001
        // aa: 0.731
        // kk: 0.1521
        // kr: 0.0155
        // tt: 42
        // lsp: 0.1518
        // ld: 0.002
        // sta: 0

        // vv1: 225.1
        // vv2: 224.4
        // vv3: 220.1
        // bb: 0.001
        // aa1: 0
        // aa2: 1.647
        // aa3: 1.719
        // kk1: 0
        // kk2: 0.2767
        // kk3: 0.3065
        // kv1: 0
        // kv2: 0.2432
        // kv3: 0.2152
        // kz: 0.5833
        // kvz: 0.4585
        // tt: 47
        // lsp: 4.4081
        // ld: 0
        // sta: 0
        // stb: 0
        // stc: 0


        // if (res.data.type == 1) {
        //   (this.echarsOption1[0].lineName =
        //     res.data.info.name + "-" + res.data.info.local + "-" + res.data.aa),
        //     this.echarsOption1[0].times.push(
        //       new Date(res.data.time * 1000).Format("hh:mm:ss")
        //     );
        //   this.echarsOption1[0].dy.push(res.data.data.vv);
        //   this.echarsOption1[0].dl.push(res.data.data.daa);
        //   this.echarsOption = this.echarsOption1;
        // } else {
        //   (this.echarsOption2[0].lineName =
        //     res.data.info.name + "-" + res.data.info.local + "-" + res.data.aa),
        //     this.echarsOption2[0].times.push(
        //       new Date(res.data.time * 1000).Format("hh:mm:ss")
        //     );
        //   this.echarsOption2[0].dy.push(res.data.data.vv1);
        //   this.echarsOption2[0].dl.push(res.data.data.aa1);
        //   (this.echarsOption2[1].lineName =
        //     res.data.info.name + "-" + res.data.info.local + "-" + res.data.aa),
        //     this.echarsOption2[1].times.push(
        //       new Date(res.data.time * 1000).Format("hh:mm:ss")
        //     );
        //   this.echarsOption2[1].dy.push(res.data.data.vv2);
        //   this.echarsOption2[1].dl.push(res.data.data.aa2);
        //   (this.echarsOption2[2].lineName =
        //     res.data.info.name + "-" + res.data.info.local + "-" + res.data.aa),
        //     this.echarsOption2[2].times.push(
        //       new Date(res.data.time * 1000).Format("hh:mm:ss")
        //     );
        //   this.echarsOption2[2].dy.push(res.data.data.vv3);
        //   this.echarsOption2[2].dl.push(res.data.data.aa3);
        //   this.echarsOption = this.echarsOption2;
        // }
      });
    }
  },
  computed: {
    count() {
      return this.$store.state.socketData;
    }
  },
  mounted() { },
  created() {
    this.nid = this.$route.query.nid;
    this.getAllShunt();
  }
};
</script>
  
 <style lang="less" scoped>
.dataMonitorInfo .el-header .el-breadcrumb /deep/ .el-breadcrumb__inner.is-link,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
.dataMonitorInfo {
  overflow: hidden;
  height: 100%;
  .el-header {
    .el-breadcrumb {
      line-height: 60px;
      float: left;
    }
    .fh {
      padding: 9px 20px;
      margin-top: 12px;
      float: right;
    }
  }

  .el-main {
    height: 100%;
    padding: 0;
    .electricInfo {
      float: left;
      width: 22%;
      height: 220px;
      border-radius: 4px;
      border: 1px solid #e6e6e6;
      margin-left: 2%;
      margin-bottom: 50px;
      position: relative;
      .xl {
        .mm {
          color: #008080;
        }
      }
      p {
        margin-top: 15px;
        text-align: left;
        padding-left: 18%;
        span:first-child {
          display: inline-block;
          width: 60px;
        }
        span:last-child {
          color: #a8a6a6;
        }
      }
      i {
        position: absolute;
        top: 10px;
        right: 15px;
      }
      &:hover {
        box-shadow: 0px 0px 15px #d0d0d0;
        transition: 0.5s;
        cursor: pointer;
      }
    }
  }
  .el-footer {
  }
}
</style>
  