<template>
  <!-- 系统管理 - 电箱计数 -->
  <div class="electricBoxCount">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          :disabled="show3"
        >
          <i class="el-icon-search"></i>
          <span v-if="zcode==36">您还未选择线路计数</span>
          <span v-else>查看已选线路计数</span>
        </el-button>

        <el-button
          type="primary"
          @click="determineAdd"
          :disabled="show1"
        >
          <i class="el-icon-circle-plus-outline"></i>
          确定添加线路计数
        </el-button>

        <el-button @click="getList(1)">重置 / 刷新</el-button>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            min-width="50"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            type="index"
            label="序号"
            align="center"
            min-width="50"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="mzname"
            show-overflow-tooltip
            label="模组名称"
            align="center"
            min-width="150"
          ></el-table-column>

          <el-table-column
            prop="nid"
            show-overflow-tooltip
            label="模组编号"
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
            label="线路名称"
            align="center"
            min-width="150"
          ></el-table-column>

          <!-- <el-table-column show-overflow-tooltip label="设备型号" align="center" min-width="80">
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
          </el-table-column>-->
          <!-- <el-table-column
            prop="local"
            show-overflow-tooltip
            label="电箱地址"
            align="center"
            min-width="100"
          ></el-table-column>-->
          <el-table-column
            prop="mid"
            show-overflow-tooltip
            label="线路编号"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <span>{{ '线路' + scope.row.mid }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="jianzhu"
            show-overflow-tooltip
            label="安装地址"
            align="center"
            min-width="120"
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
          :total="fenYe.total?fenYe.total:1"
        ></el-pagination>
      </el-footer>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
    <!-- Dialog - 查看已选电箱计数 -->
    <el-dialog
      title="已选电箱计数"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="form"
        label-width
      >
        <el-form-item>
          <el-checkbox-group
            v-model="selectionBoxCountData"
            style="text-align: left;"
          >
            <el-checkbox
              v-for="(item,index) in selectionBoxCount"
              :key="index"
              :label="item.id"
              name="type"
            >{{ '['+getString1(hexCharCodeToStr(item.nid))+']' + item.name + '('+ item.mid + '线路' +')' }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button
          type="primary"
          @click="SeeSelected"
          :disabled="show2"
        >删除电箱</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import copyright from "../../components/copyright";
export default {
  name: "electricBoxCount",
  components: {
    copyright
  },
  data() {
    return {
      // 列表数据
      tableData: [],
      // 已选择电箱数据
      multipleSelection: [],
      // 分页
      fenYe: {
        currentPage: 1, // 当前页数
        total: null // 共多少页
      },
      // 确定添加电箱计数 - 按钮 - 显示与隐藏
      show1: true,
      // 已选电箱计数 - Dialog
      dialogVisible: false,
      // 查看已选电箱计数按钮的文字
      zcode: "",
      // 查看已选电箱计数按钮的禁用
      show3: true,
      // 已选电箱计数
      selectionBoxCount: [],
      // 删除 - 已选电箱计数
      selectionBoxCountData: [],
      // 删除 - Dialog - 电箱按钮
      show2: true,
      zlist: [],
      he: []
    };
  },
  methods: {
    // 初始化获取 - 已选电箱计数
    getSelectionBoxCount(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/yijingxuanzhongdexianlu";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        // 这里后期会改动 - 后台如果res.data[0]做了处理，删除||后边的
        let arr1 = [];
        res.data.data.map(val => {
          if (val != false) {
            arr1.push(val);
          }
        });
        if (res.data.data.code == 36) {
          this.zcode = 36;
          this.show3 = true;
          this.$message.warning("您还未选择电箱计数!");
        } else if (arr1.length < 1) {
          this.zcode = 36;
          this.show3 = true;
          this.$message.warning("您还未选择电箱计数!");
        } else {
          this.selectionBoxCount = arr1;
          this.show3 = false;
        }
      });
    },
    // 判断已选电箱计数 和 列表数据想对比 - 给出已选的样式打钩
    allContrast() {
      this.selectionBoxCount.forEach(row1 => {
        this.tableData.forEach(row2 => {
          if (row1.id == row2.id) {
            this.$refs.multipleTable.toggleRowSelection(row2);
            this.zlist.push(row2);
          }
        });
      });
    },
    // 初始化获取 - 列表
    getList(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/zhanshisuoyuodianxiang";
      let data = {
        uid: localStorage.getItem("uid"),
        page: Number(page) - 1,
        size: 13,
      };
      this.myAjax(type, url, data, res => {
        this.tableData = res.data.data;
        this.fenYe.total = res.data.total;
        let _this = this;
        setTimeout(() => {
          _this.allContrast();
          _this.multipleSelection = []
        }, 1000)
      });
    },
    // 列表选择 - √
    handleSelectionChange(val) {
      let a = new Set(this.zlist);
      let b = new Set(val);
      let he = new Set([...b].filter(x => !a.has(x)));
      this.multipleSelection = Array.from(he)
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
    },
    // 点击 - 确定添加电箱计数
    determineAdd() {
      this.$confirm("是否把已选择的电箱加入电箱计数?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arrId = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            arrId.push(this.multipleSelection[i].id);
          }
          let arrIdString = this.arrToString(arrId);
          let type = "post";
          let url = this.urlb + "/api/pc/tianjiaxindexianlu";
          let data = {
            uid: localStorage.getItem("uid"),
            line: arrIdString
          };
          this.myAjax(type, url, data, res => {
            if (res.data.code == 33) {
              let _this = this;
              _this.$message.success("添加成功!...3秒后刷新更新数据,如操作成功没有刷新数据请手动刷新");
              setTimeout(() => {
                _this.getList(1);
                _this.getSelectionBoxCount();
              }, 3000)
            } else {
              this.$message.warning("可是出现了重复,添加失败!");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消操作"
          });
        });
    },
    // 点击 - Dialog - 删除已选电箱计数
    SeeSelected() {
      this.$confirm("是否删除已选电箱?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arrIdString = this.arrToString(this.selectionBoxCountData);
          let type = "post";
          let url = this.urlb + "/api/pc/shanchuxuanzhongxianlu";
          let data = {
            uid: localStorage.getItem("uid"),
            line: arrIdString
          };
          this.myAjax(type, url, data, res => {
            if (res.data.code == 37) {
              this.dialogVisible = false;
              let _this = this;
              _this.$message.success("删除成功!...3秒后刷新更新数据,如操作成功没有刷新数据请手动刷新");
              setTimeout(() => {
                this.getSelectionBoxCount();
                this.getList(1);
              }, 3000)
            } else {
              this.$message.warning("删除失败!");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消操作"
          });
        });
    }
  },
  watch: {
    // 监听 - 已选择电箱数据 - 列表
    multipleSelection: {
      handler(newValue, oldValue) {
        if (this.multipleSelection.length > 0 && this.multipleSelection) {
          this.show1 = false;
        } else {
          this.show1 = true;
        }
      },
      deep: true
    },
    // 监听 - 已选择电箱数据 - loading(删除按钮)
    selectionBoxCountData: {
      handler(newValue, oldValue) {
        if (
          this.selectionBoxCountData.length > 0 &&
          this.selectionBoxCountData
        ) {
          this.show2 = false;
        } else {
          this.show2 = true;
        }
      },
      deep: true
    }
  },
  computed: {},
  mounted() { },
  created() {
    this.getList(1);
    this.getSelectionBoxCount();
  }
};
</script>
  
 <style lang="less" scoped>
.electricBoxCount .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.electricBoxCount /deep/ .el-dialog__body {
  padding-right: 65px;
}
.electricBoxCount {
  overflow: hidden;
  height: 100%;
  .el-header {
    text-align: right;
    line-height: 60px;
    .el-button {
      margin-top: 3px;
      padding: 9px 20px;
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
  }
  .el-footer {
  }
}
</style>
  