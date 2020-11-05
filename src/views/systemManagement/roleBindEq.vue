<template>
  <!-- 系统管理 - 电箱计数 -->
  <div class="electricBoxCount">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <div class="bread">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>
              绑定设备 /
              <span style="color:teal">{{user.nick}}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-button
          type="primary"
          @click="isBind('addEditsData')"
        >确 定</el-button>
        <el-button
          type="primary"
          @click="lookeq"
        >查 看</el-button>
        <el-button
          type="primary"
          @click="back"
        >返 回</el-button>

        <!-- <el-button type="primary" @click="dialogVisible = true" :disabled="show3">
          <i class="el-icon-search"></i>
          <span v-if="zcode==36">您还未选择线路计数</span>
          <span v-else>查看已选线路计数</span>
        </el-button>
        <el-button type="primary" @click="determineAdd" :disabled="show1">
          <i class="el-icon-circle-plus-outline"></i>
          确定添加线路计数
        </el-button>
        <el-button @click="getList(1)">重置 / 刷新</el-button>-->
      </el-header>
      <!-- 中部 -->
      <el-main>
        <!-- 列表 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 70%;flex:2"
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

        <div class="showinfo">
          <template v-for="(item,index) in showlist">
            <p
              class="detail"
              :key="index"
            >
              {{'['+hexCharCodeToStr(item.nid)+']'}}
              {{item.name}}
              {{item.mzname}}
              {{'线路'+item.mid}}
              {{item.local}}
            </p>
          </template>
        </div>

        <el-drawer
          title="我是标题"
          :visible.sync="drawer"
          :with-header="false"
        >
          <span>我来啦!</span>
        </el-drawer>

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
      // 已选电箱计数
      selectionBoxCount: [],
      zlist: [],
      he: [],

      // 已选择设备的ID
      selectIdList: [],
      // 要绑定的管理员id
      user: {},
      // 查看选择的设备
      drawer: false,
      // 分页
      fenYe: {
        currentPage: 1, // 当前页数
        total: null // 共多少页
      },

      showlist: []
    };
  },
  methods: {
    // 初始化获取 - 已选电箱计数
    getSelectionBoxCount(page) {
      let arr = this.user.list.split(",");

      arr.forEach(val1 => {
        this.tableData.forEach(val2 => {
          if (val1 == val2.id) {
            this.selectionBoxCount.push(val2);
          }
        });
      });
      // console.log(this.selectionBoxCount)
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
    // 获取所有设备 - 列表
    geteqList(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/zhanshisuoyuodianxiang";
      let data = {
        uid: localStorage.getItem("uid"),
        page: Number(page) - 1
      };
      this.myAjax(type, url, data, res => {

        this.tableData = res.data.data;
        this.fenYe.total = res.data.total;
        let _this = this;
        setTimeout(() => {
          _this.allContrast();
          _this.multipleSelection = [];
        }, 1000);

        this.getSelectionBoxCount();
      });
    },
    // 列表选择 - √
    handleSelectionChange(val) {
      this.showlist = val
      // val.forEach(val => {
      //   this.showlist.push(val)
      // })
      console.log(this.showlist)

      let a = new Set(this.zlist);
      let b = new Set(val);
      let he = new Set([...b].filter(x => !a.has(x)));
      this.multipleSelection = Array.from(he);
      // console.log(this.multipleSelection)
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.geteqList(val);
    },

    // 管理员绑定设备接口
    bingEqList() {
      this.multipleSelection.forEach(val => {
        this.selectIdList.push(val.id);
      });
      // console.log(this.multipleSelection);
      // console.log(this.selectIdList);

      let type = "post";
      let url = this.urla + "/api/pc/subAdminUserBindMach";
      let data = {
        uid: localStorage.getItem("uid"),
        fid: this.user.id,
        list: this.arrToString(this.selectIdList)
      };
      this.myAjax(type, url, data, res => {
        // console.log(res);
        if (res.data.code == 41) {
          this.$message({
            showClose: true,
            message: "绑定成功",
            type: "success"
          });
          this.$router.go(-1)
          this.dialogVisible2 = false;
        } else {
          this.$message({
            showClose: true,
            message: "绑定失败",
            type: "error"
          });
        }
      });
    },

    // 确定 - 绑定设备
    isBind(addEditsData) {
      this.bingEqList();
    },

    // 查看选择设备
    lookeq() {
      this.drawer = true
    },

    // 返回按钮
    back() {
      this.$router.go(-1);
    }
  },

  mounted() { },
  created() {
    this.user = this.$route.params;
    this.geteqList(1);
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
    .bread {
      display: inline-block;
      float: left;
      margin-top: 22px;
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    display: flex;
    .showinfo {
      flex: 1;
      height: 100%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #dddee0;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #fff;
      }
      .detail {
        margin: 10px 0;
      }
    }
  }
  .el-footer {
  }
}
</style>
  