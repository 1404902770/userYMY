<template>
  <!-- 远程控制 - 漏保自检 -->
  <div class="notCoveredChecking">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="电箱设备号">
            <el-select v-model="form.region" filterable placeholder="请选择电箱设备号">
              <el-option
                v-for="(item,index) in options"
                :label="item.text"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <!-- 列表 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            prop="a"
            show-overflow-tooltip
            label="设备号"
            align="center"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="b" show-overflow-tooltip label="名称" align="center" min-width="60"></el-table-column>
          <el-table-column prop="d" show-overflow-tooltip label="线路" align="center" min-width="60"></el-table-column>
          <el-table-column prop="f" show-overflow-tooltip label="型号" align="center" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.f == 1">[带漏电]总路单相</span>
              <span v-else-if="scope.row.f == 2">[带漏电]支路单相</span>
              <span v-else-if="scope.row.f == 3">[带漏电]总路三相</span>
              <span v-else-if="scope.row.f == 4">[带漏电]总路单相</span>
              <span v-else-if="scope.row.f == 5">[无漏电]总路单相</span>
              <span v-else-if="scope.row.f == 6">[无带漏电]支路单相</span>
              <span v-else-if="scope.row.f == 7">[无带漏电]总路三相</span>
              <span v-else-if="scope.row.f == 8">[无带漏电]总路单相</span>
              <span v-else style="color:#cccccc;">- -</span>
            </template>
          </el-table-column>
          <el-table-column prop="c" show-overflow-tooltip label="状态" align="center" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.c == 1">在线</span>
              <span v-if="scope.row.c == 2">离线</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="e"
            show-overflow-tooltip
            label="安装时间"
            align="center"
            min-width="100"
          ></el-table-column>
          
          <el-table-column show-overflow-tooltip label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <p>
                <span style="color:#F56C6C">手动自检</span>
                <el-switch @change="automaticManual(scope.row)" v-model="scope.row.g"></el-switch>    
                <span style="color:#008080">自动自检</span>
              </p>
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
          :page-size="15"
          :total="fenYe.total"
        ></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>
  
  <script>
export default {
  name: "notCoveredChecking",
  data() {
    return {
      // 检索
      form: {
        region: "0"
      },
      // 获取所有设备
      options: [
        {
          id: "0",
          text: "全部"
        },
        {
          id: "1",
          text: "4GL405025U2N36"
        },
        {
          id: "2",
          text: "4GL405335U2N47"
        },
        {
          id: "3",
          text: "4GL405235U2N86"
        }
      ],
      // 列表数据
      tableData: [
        {
          id: 1,
          a: "4GL415KG5UYF",
          b: "202办公室",
          c: "1",
          d: "线路02",
          e: "2020-03-28 09:49:47",
          f: "1",
          g: true
        },
        {
          id: 2,
          a: "4GL425KG5UYF",
          b: "203办公室",
          c: "1",
          d: "线路01",
          e: "2020-03-28 09:49:47",
          f: "2",
          g: true
        },
        {
          id: 3,
          a: "4GL435KG5UYF",
          b: "204办公室",
          c: "1",
          d: "线路03",
          e: "2020-03-28 09:49:47",
          f: "3",
          g: false
        },{
          id: 1,
          a: "4GL445KG5UYF",
          b: "205办公室",
          c: "1",
          d: "线路02",
          e: "2020-03-28 09:49:47",
          f: "4",
          g: true
        },
        {
          id: 2,
          a: "4GL455KG5UYF",
          b: "206办公室",
          c: "1",
          d: "线路02",
          e: "2020-03-28 09:49:47",
          f: "5",
          g: false
        },
        {
          id: 3,
          a: "4GL465KG5UYF",
          b: "207办公室",
          c: "2",
          d: "线路01",
          e: "2020-03-28 09:49:47",
          f: "6",
          g: true
        },{
          id: 1,
          a: "4GL475KG5UYF",
          b: "208办公室",
          c: "1",
          d: "线路04",
          e: "2020-03-28 09:49:47",
          f: "7",
          g: true
        },
        {
          id: 2,
          a: "4GL485KG5UYF",
          b: "209办公室",
          c: "2",
          d: "线路05",
          e: "2020-03-28 09:49:47",
          f: "8",
          g: true
        }
      ],
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
      let url = "";
      let data = {
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        console.log(res.data.data);
      });
    },
    // 初始化获取列表
    getList(page) {
      let type = "post";
      let url = "";
      let data = {
        uid: 1,
        page: page
      };
      this.myAjax(type, url, data, res => {
        // this.tableData = res.data.data.data;
        // this.fenYe.total = res.data.data.total;
        // for (let i = 0; i < this.tableData.length; i++) {
        //   this.tableData[i].anzhuang = new Date(
        //     this.tableData[i].anzhuang * 1000
        //   ).Format("yy-MM-dd hh:mm");
        // }
        console.log(res);
      });
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
    },
    // 自动自检 - 手动自检
    automaticManual(row) {  
      let text = '';  
      if(row.g){
        text = '手动自检'
      } else {
        text = '自动自检'
      }
      this.$confirm("您确定要" + text +"？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // let type = "post";
          // let url = "";
          // let data = {
          //   id: row.id
          // };
          // this.myAjax(type, url, data, res => {
          //   this.$message.success(res.data.message);
          //   this.getList(1);
          // });
          this.$message.success('切换成功');
        })
        .catch(() => {
          row.g = !row.g;
          this.$message.warning("已取消操作");
        });
    }
  },
  mounted() {},
  created() {
    // this.getList(1);
    // this.getOptions();
  }
};
</script>
  
 <style lang="less" scoped>
.notCoveredChecking .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.notCoveredChecking {
  overflow: hidden;
  height: 100%;
  .el-header {
    .el-form {
      text-align: left;
      margin-top: 10px;
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    .el-switch,.is-checked {
      margin: -1px 4px 0 4px;
    }
  }
  .el-footer {
    height: 50px !important;
  }
}
</style>
  