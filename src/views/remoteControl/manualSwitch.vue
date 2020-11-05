<template>
  <!-- 远程控制 - 手动开关 -->
  <div class="manualSwitch">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
        >
          <el-form-item label="电箱设备号">
            <el-select
              v-model="form.region"
              filterable
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in options"
                :label="item.text"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-button
            type="primary"
            @click="getOnedx"
            style="float:left;margin-left:10px;"
          >查询</el-button>

          <el-button
            @click="resetForm1('form')"
            style="float:left;"
          >重置 / 刷新</el-button>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <!-- 列表 -->
        <div v-show="tag ==1? true:false">
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

            <!-- <el-table-column
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
          </el-table-column> -->

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
                >操作分路</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 线路 -->
        <div v-show="tag ==0? true:false">
          <el-table
            :data="tableData1"
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
        </div>

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
import ElementUI from "element-ui";
import copyright from "../../components/copyright";
export default {
  name: "manualSwitch",
  components: {
    copyright
  },
  data() {
    return {
      // 检索
      form: {
        region: ""
      },
      // 获取所有设备
      options: [],
      // 电箱列表数据
      tableData: [],
      // 线路列表数据
      tableData1: [],
      // 分页
      fenYe: {
        currentPage: 1, // 当前页数
        total: null // 共多少页
      },
      tag: 1
    };
  },
  methods: {
    // 初始化获取列表
    getList(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/getmzlist";
      let data = {
        uid: localStorage.getItem("uid"),
        page: Number(this.fenYe.currentPage) - 1
      };
      this.myAjax(type, url, data, res => {
        this.tableData = res.data.data;
        this.fenYe.total = res.data.total;
        for (let i = 0; i < this.tableData.length; i++) {
          this.options.push({
            id: this.tableData[i].nid,
            text:
              "[" +
              this.getString1(this.hexCharCodeToStr(this.tableData[i].nid)) +
              "]" +
              this.tableData[i].mzname
          });
          this.tableData[i].anzhuang = new Date(
            this.tableData[i].anzhuang * 1000
          ).Format("yy-MM-dd hh:mm:ss");
        }
      });
    },
    // 查询 - 下拉获取线路
    getOnedx(val) {
      if (this.form.region) {
        this.tag = 0

        let type = "post";
        let url = this.urlb + "/api/pc/getmzInfo";
        let data = {
          nid: this.form.region,
          uid: localStorage.getItem('uid')
        };
        this.myAjax(type, url, data, res => {
          this.tableData1 = res.data.data;
          for (let i = 0; i < this.tableData1.length; i++) {
            if (this.tableData1[i].nn == "00") {
              this.tableData1[i].g = false;
            } else {
              this.tableData1[i].g = true;
            }
          }
        });
      } else {
        this.$message.warning("请选择要查询的电箱设备号!");
      }
    },
    // 重置
    resetForm1(formName) {
      this.tag = 1
      // this.$refs[formName].resetFields();
      this.options = []
      this.form.region = ''
      this.getList(1);
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
    },
    // 操作分路
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
            path: "/manualSwitchInfo",
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
  mounted() { },
  created() {
    this.getList(1);
  }
};
</script>
  
 <style lang="less" scoped>
.manualSwitch .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.manualSwitch {
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
    .el-switch,
    .is-checked {
      margin: -1px 4px 0 4px;
    }
  }
  .el-footer {
  }
}
</style>
  