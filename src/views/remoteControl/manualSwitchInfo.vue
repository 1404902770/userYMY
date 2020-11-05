<template>
  <!-- 远程控制 - 手动开关 - 分路详情 -->
  <div class="manualSwitchInfo">
    <el-container style="height: 100%;">
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>手动开关</el-breadcrumb-item>
          <el-breadcrumb-item>操作分路</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 点击播放提示音 -->
        <!-- <audio  autoplay="autoplay" id="auto" src=""></audio> -->
        <!-- <input type="button" value="点击播放" @click="playSound('http://data.huiyi8.com/2017/gha/03/17/1702.mp3')"> -->
        <el-button
          class="fh"
          type="primary"
          @click="$router.go(-1)"
        >返回</el-button>
      </el-header>
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
            label="设备号"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ hexCharCodeToStr(scope.row.nid) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="名称"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="线路"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <span>线路{{ scope.row.mid }}</span>
            </template>
          </el-table-column>

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
            min-width="100"
          >
            <template slot-scope="scope">
              <span style="color:#F56C6C">分闸</span>
              <el-switch
                @change="automaticManual1(scope.row,scope.$index)"
                v-model="scope.row.g"
              ></el-switch>
              <span style="color:#008080">合闸</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
  </div>
</template>
  
<script>
import Qs from "qs";
import ElementUI from "element-ui";
import copyright from "../../components/copyright";
import $ from 'jquery'
export default {
  name: "manualSwitchInfo",
  components: {
    copyright
  },
  data() {
    return {
      nid: "", // 设备id
      mid: "", // 线路
      iId: "0", // 分合闸时用
      // 列表数据
      tableData: [],
      Interval: "",

      // 判断操作的数组中那个
      state: ''
    };
  },
  methods: {
    // 播放提示音
    playSound(src) {
      // console.log(src)
      var auto = $("#auto");
      auto.attr("src", src);
    },

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
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].nn == "00") {
            this.tableData[i].g = false;
          } else {
            this.tableData[i].g = true;
          }
        }
      });
    },
    // 分闸 / 合闸
    automaticManual1(row, t) {
      this.state = t
      // console.log(t)
      // console.log(this.tableData[t])
      this.mid = row.mid;
      this.$confirm("是否要执行此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ElementUI.Loading.service({
            fullscreen: true,
            text: "正在执行...",
            background: "rgba(0,0,0,.4)"
          });
          this.Interval = setInterval(() => {
            this.automaticManual2(t);
          }, 3000);
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消操作"
          });
        });
    },
    // 分闸 / 合闸 - 循环执行
    automaticManual2(t) {

      let instance = this.$axios.create();
      instance({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        url: this.urla + "/api/mach/getRandom",
        data: Qs.stringify({
          uid: localStorage.getItem("uid"),
          nid: this.nid,
          mid: this.mid,
          mlo: this.tableData[t].g == false ? "00" + this.mid + "00" : "00" + this.mid + "01"
        })
      }).then(res => {
        if (res.data.code == 110) {
          clearInterval(this.Interval);
          this.$message.warning("设备不在线");
        }
      }).catch(err => {
        // console.log(err)
      })


      // let _this = this;
      // let type = "post";
      // let url = _this.urla + "/api/mach/getRandom";
      // let data = {
      //   uid: localStorage.getItem("uid"),
      //   nid: this.nid,
      //   mid: this.mid,
      //   mlo:
      //     this.tableData[t].g == false
      //       ? "00" + this.mid + "00"
      //       : "00" + this.mid + "01"
      // };
      // this.myAjax(type, url, data, res => {
      //   // console.log(res);
      //   if (res.data.code == 110) {
      //     clearInterval(this.Interval);
      //     this.$message.warning("设备不在线");
      //   }
      // });
    }
  },
  watch: {
    count(newCount, oldCount) {
      if (newCount.type != "jing") {
        if (newCount.type == "nfs") {
          clearInterval(this.Interval);
          // console.log(newCount.data);
          // console.log(newCount.data.substr(newCount.data.length - 4, 2));
          if (newCount.data.substr(newCount.data.length - 4, 2) == "00") {

            this.$message.success("分闸成功");
            ElementUI.Loading.service({}).close()

            this.tableData[this.state].g = false

            let a = []
            this.tableData.forEach(val => {
              a.push(val)
            })
            this.tableData = a

            // let a = this.tableData
            // let b = JSON.stringify(a)
            // this.tableData = JSON.parse(b)

          } else {

            this.$message.success("合闸成功");
            ElementUI.Loading.service({}).close()

            this.tableData[this.state].g = true

            let a = []
            this.tableData.forEach(val => {
              a.push(val)
            })
            this.tableData = a

            // let a = this.tableData
            // let b = JSON.stringify(a)
            // this.tableData = JSON.parse(b)

          }

          // for (let i = 0; i < this.tableData.length; i++) {
          //   console.log(newCount)
          //   console.log(this.tableData[i].mid)
          //   if (this.tableData[i].mid == newCount.mid) {
          // this.getAllShunt();
          //     ElementUI.Loading.service({}).close();
          //     if (newCount.zl == "00") {
          // this.$message.success("分闸成功");
          //     } else {
          //       this.$message.success("和闸成功");
          //     }
          //   }
          // }
        } else if (newCount.type == "nff") {
          clearInterval(this.Interval);
          this.$message.warning("操作失败");
        }
      }
    }
  },
  computed: {
    count() {
      // console.log(this.$store.state.socketData)
      return this.$store.state.socketData;
    }
  },
  mounted() {
    // 定时播放提示音
    // setInterval(()=>{
    //   this.playSound('http://data.huiyi8.com/2017/gha/03/17/1702.mp3')
    // },2000)

  },
  created() {
    this.nid = this.$route.query.nid;
    this.getAllShunt();
  }
};
</script>
  
 <style lang="less" scoped>
.manualSwitchInfo {
  overflow: hidden;
  height: 100%;
  .el-header {
    .el-breadcrumb {
      line-height: 60px;
      float: left;
    }
    .fh {
      padding: 9px 20px;
      margin: 12px 0;
      float: right;
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    .el-switch,
    .is-checked {
      margin: -1px 4px 0 4px;
    }
  }
}
</style>
  