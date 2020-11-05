<template>
  <!-- 电器电箱 - 电器信息 -->
  <div class="electricImplementInfo">
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
            class="dianxiang"
          >
            <el-select
              v-model="form.region"
              filterable
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in options"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+'] ' + item.mzname + ' [' + item.jianzhu +']'"
                :value="item.mzid"
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
            min-width="50"
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

          <!-- <el-table-column
            prop="code"
            show-overflow-tooltip
            label="产品迭代"
            align="center"
            min-width="60"
          ></el-table-column>

          <el-table-column
            prop="banben"
            show-overflow-tooltip
            label="版本号"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="mozu"
            show-overflow-tooltip
            label="模组名称"
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

          <el-table-column
            prop="mzid"
            show-overflow-tooltip
            label="电箱号"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="fen"
            show-overflow-tooltip
            label="分机个数"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="txfs"
            show-overflow-tooltip
            label="通讯方式"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="timer"
            show-overflow-tooltip
            label="定时器数量"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="btnstatu"
            show-overflow-tooltip
            label="设置状态"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="heartime"
            show-overflow-tooltip
            label="心跳时间"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="neng"
            show-overflow-tooltip
            label="是否使能"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="jihuo"
            show-overflow-tooltip
            label="激活时间"
            align="center"
            min-width="100"
          ></el-table-column>

          <el-table-column
            prop="jianzhu"
            show-overflow-tooltip
            label="安装地址"
            align="center"
            min-width="100"
          ></el-table-column> -->

          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <i
                title="修改电箱名称和地址"
                class="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>

        <!-- 更新线路和地址弹框 -->
        <el-dialog
          :visible.sync="dialogFormVisible"
          width="40%"
          @close='closeupdate'
        >
          <el-form :model="form">
            <el-form-item
              label="线路名称"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="线路地址"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.address"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="medium"
              @click="dialogFormVisible = false"
            >取 消</el-button>

            <el-button
              size="medium"
              type="primary"
              @click="submitForm"
            >确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
      <!-- 尾部 -->
      <el-footer>
      </el-footer>
      <!-- 底部版权 -->
      <copyright></copyright>
    </el-container>
  </div>
</template>
  
  <script>
import copyright from "../../components/copyright";
export default {
  name: "electricImplementInfo",
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
      // 列表数据
      tableData: [],
      // 弹框
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 弹框表单
      form: {
        name: '',
        address: ''
      },
      // 要修改的电箱
      nid: '',
      // 修改的线路
      min: '',
    };
  },
  methods: {
    // 初始化获取列表
    getList(page) {
      let type = "post";
      let url = this.urlb + this.api_4 + "getNetedMachedList";
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.form.region
      };
      this.myAjax(type, url, data, res => {
        // console.log(res)
        // let arr1 = ['一', '二'];
        this.tableData = res.data.data;
        for (let i = 0; i < this.tableData.length; i++) {
          // 版本号         
          // this.tableData[i].code = arr1[this.tableData[i].code - 1] + '代';
          // 版本号
          // this.tableData[i].banben = this.tableData[i].banben ? this.hexCharCodeToStr(this.tableData[i].banben) : '- -';
          // 模组名称
          // this.tableData[i].mozu = this.tableData[i].mozu ? this.hexCharCodeToStr(this.tableData[i].mozu) : '- -';

          // 电箱号
          // this.tableData[i].nid = this.hexCharCodeToStr(this.tableData[i].nid);
          // 线路类型
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

          this.tableData[i].mid = parseInt(this.tableData[i].mid, 16)

          // 通讯方式
          // this.tableData[i].fen = this.tableData[i].fen + '台';
          // 通讯方式
          // if (this.tableData[i].txfs == '00') {
          //   this.tableData[i].txfs = 'WIFI';
          // } else if (this.tableData[i].txfs == '01') {
          //   this.tableData[i].txfs = '以太网';
          // } else {
          //   this.tableData[i].txfs = '4G';
          // }
          // 定时器数量
          // this.tableData[i].timer = this.tableData[i].timer + '个';
          // 设置状态
          // if (this.tableData[i].btnstatu == '01') {
          //   this.tableData[i].btnstatu = '已设';
          // } else if (this.tableData[i].btnstatu == '00') {
          //   this.tableData[i].btnstatu = '未设';
          // } else {
          //   this.tableData[i].btnstatu = '- -';
          // }
          // 心跳时间
          // this.tableData[i].heartime = this.tableData[i].heartime ? this.tableData[i].heartime + 's' : '- -';
          // 能否使能
          // if (this.tableData[i].neng == '01') {
          //   this.tableData[i].neng = '使能'
          // } else if (this.tableData[i].neng == '00') {
          //   this.tableData[i].neng = '不使能'
          // } else {
          //   this.tableData[i].neng = '- -'
          // }
          // 激活时间
          // this.tableData[i].jihuo = new Date(
          //   this.tableData[i].jihuo * 1000
          // ).Format("yy-MM-dd hh:mm:ss");
        }
      });
    },
    // 初始化获取下拉数据 - 所有设备
    getOptions() {
      let type = "post";
      let url = this.urlb + this.api_4 + "getNetdSimpleList";
      let data = {
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.options = res.data.data;
        this.form.region = this.options[0].mzid
        this.getList(1)
      });
    },
    // 更新电箱名字和安装地址按钮
    handleEdit(index, row) {
      // console.log(index, row);
      this.dialogFormVisible = true
      this.nid = row.nid
      this.mid = row.mid
    },

    // 提交修改电箱名称和地址
    submitForm() {
      let type = 'post'
      let url = this.urla + this.api_4 + 'upMachedNameAndLocalInfo'
      let data = {
        uid: localStorage.getItem('uid'),
        nid: this.nid,
        mid: this.mid,
        local: this.form.address,
        name: this.form.name
      }
      this.myAjax(type, url, data, res => {
        if (res.data.code == 31) {
          this.dialogFormVisible = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          });
          this.getList(1);
        } else {
          this.$message({
            showClose: true,
            message: '修改失败',
            type: 'error'
          });
        }
      })
    },

    // 定位电箱号
    getOnedx(val) {
      this.getList(1)
    },
    // 重置
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      this.form.region = this.options[0].mzid
      this.getList(1);
    },
    // 关闭修改电箱和地址
    closeupdate() {
      this.form.name = ''
      this.form.address = ''
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      this.getList(val);
    },
  },
  mounted() { },
  created() {
    this.getOptions();

    // this.getList(1);
  }
};
</script>
  
 <style lang="less" scoped>
.electricImplementInfo .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.electricImplementInfo {
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
      .dianxiang {
        width: 360px;
        .el-select {
          width: 100%;
        }
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
  