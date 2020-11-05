<template>
  <!-- 用电检测 - 漏电自检记录 -->
  <div class="electricLeakageRecord">
    <el-container style="height: 100%;">
      <el-header>
        <el-form ref="form" :model="form" label-width="80px">
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
      <el-main>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            prop="date"
            show-overflow-tooltip
            label="设备号"
            align="center"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="mid"
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
            prop="address"
            show-overflow-tooltip
            label="名称"
            align="center"
            min-width="100"
          ></el-table-column>
          <el-table-column           
            show-overflow-tooltip
            label="型号"
            align="center"
            min-width="120"
          >
          <template slot-scope="scope">
              <span v-if="scope.row.statu == 1">[带漏电]总路单相</span>
              <span v-else-if="scope.row.statu == 2">[带漏电]支路单相</span>
              <span v-else-if="scope.row.statu == 3">[带漏电]总路三相</span>
              <span v-else-if="scope.row.statu == 4">[带漏电]总路单相</span>
              <span v-else-if="scope.row.statu == 5">[无漏电]总路单相</span>
              <span v-else-if="scope.row.statu == 6">[无带漏电]支路单相</span>
              <span v-else-if="scope.row.statu == 7">[无带漏电]总路三相</span>
              <span v-else-if="scope.row.statu == 8">[无带漏电]总路单相</span>
              <span v-else style="color:#cccccc;">- -</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="anzhuang"
            show-overflow-tooltip
            label="安装时间"
            align="center"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="address"
            show-overflow-tooltip
            label="状态"
            align="center"
            min-width="60"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.statu == 1" style="color:#008080;">在线</span>
              <span v-if="scope.row.statu == 0" style="color:#E6A23C;">离线</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
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
import $ from "jquery";
export default {
  name: "electricLeakageRecord",
  data() {
    return {
      // 检索
      form: {
        region: "1"
      },
      // 获取所有设备
      options: [
        {
          id: "1",
          text: "219办公室"
        },
        {
          id: "2",
          text: "210办公室"
        },
        {
          id: "3",
          text: "211总经办"
        }
      ],
      // 列表数据
      tableData: [
        {
          date:"4GL405KG5UYF",
          mid:"02",
          address:"照明",
          statu:"2",
          anzhuang:"2020-03-04 08:37:51",
          statu:"1",
        },
        {
          date:"4GL415KK5UYF",
          mid:"01",
          address:"插座",
          statu:"2",
          anzhuang:"2020-03-05 09:35:51",
          statu:"1",
        },
        {
          date:"4GL409KG5UYF",
          mid:"03",
          address:"空调",
          statu:"2",
          anzhuang:"2020-03-04 08:37:51",
          statu:"1",
        }
      ],
      // 分页
      fenYe: {
        currentPage: 1, // 当前页数
        total: null // 共多少页
      },
    };
  },
  methods: {
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urla + "/appv1/usdpc1/userLogin";
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
      let url = "urlc/appv1/Pc/getmzlist";
      let data = {
        uid: localStorage.getItem('uid'),
        page: page
      };
      this.myAjax(type, url, data, res => {
        this.tableData = res.data.data.data;
        this.fenYe.total = res.data.data.total;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].anzhuang = new Date(
            this.tableData[i].anzhuang * 1000
          ).Format("yy-MM-dd hh:mm");
        }
        console.log(res.data.data);
      });
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
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
.electricLeakageRecord {
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
  }
  .el-footer {
    height: 40px !important;
  }
  #student {
    width: 100%;
    height: 300px;
  }
}
</style>
  