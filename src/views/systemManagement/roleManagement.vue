<template>
  <!-- 系统管理 - 角色管理 -->
  <div class="roleManagement">
    <el-container style="height: 100%;">
      <!-- 上部 -->
      <el-header>
        <div class="bread">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-button
          type="primary"
          @click="addEdits"
        >+ 添加角色</el-button>
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
            type="index"
            align="center"
            label="序号"
            mini-width="50"
          ></el-table-column>

          <el-table-column
            label="日期"
            min-width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ new Date(scope.row.time*1000).Format('yy-MM-dd') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="nick"
            show-overflow-tooltip
            label="分账号昵称"
            align="center"
            min-width="120"
          ></el-table-column>

          <el-table-column
            prop="username"
            show-overflow-tooltip
            label="分账号用户名"
            align="center"
            min-width="150"
          ></el-table-column>

          <!-- <el-table-column
            prop="phone"
            show-overflow-tooltip
            label="管理员联系方式"
            align="center"
            min-width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.c == 1">超级管理员</span>
              <span v-else-if="scope.row.c == 2">管理员</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="e"
            show-overflow-tooltip
            label="管理员账号"
            align="center"
            min-width="80"
          ></el-table-column>-->
          <el-table-column
            prop="phone"
            show-overflow-tooltip
            label="分账号联系方式"
            align="center"
            min-width="80"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            label="操作"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:#008080;"
                icon="el-icon-edit"
                title="绑定设备"
                @click="bindeq(scope.row)"
              >绑定</el-button>
              <el-button
                type="text"
                style="color:#008080;"
                icon="el-icon-view"
                title="查看绑定设备"
                @click="lookbindeq(scope.row)"
              >查看</el-button>
              <el-button
                type="text"
                style="color:#008080;"
                icon="el-icon-refresh-right"
                title="密码重置"
                @click="resetpassword(scope.row)"
              >重置</el-button>
              <el-button
                type="text"
                style="color:#F56C6C;"
                icon="el-icon-delete"
                title="删除账号"
                @click="deletes(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 添加 loading -->
        <el-dialog
          title="添加分账号"
          :visible.sync="dialogVisible"
          width="35%"
          :before-close="handleClose"
        >
          <el-form
            ref="addEditsData"
            :rules="rules"
            :model="addEditsData"
            label-width="150px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="分账号昵称"
              prop="nickname"
            >
              <el-input
                v-model="addEditsData.nickname"
                placeholder="请输入分账号昵称"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="分账号用户名"
              prop="username"
            >
              <el-input
                v-model="addEditsData.username"
                placeholder="请输入分账号用户名"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="分账号联系方式"
              prop="userphone"
            >
              <el-input
                v-model="addEditsData.userphone"
                placeholder="请输入分账号联系方式"
              ></el-input>
            </el-form-item>

            <!-- <el-form-item label="管理员类型" prop="AdministratorsType" style="text-align: left;">
              <el-radio-group v-model="addEditsData.AdministratorsType">
                <el-radio label="超级管理员" value="1"></el-radio>
                <el-radio label="管理员" value="1"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="管理员账号" prop="AdministratorsZ">
              <el-input v-model="addEditsData.AdministratorsZ" placeholder="请输入管理员账号"></el-input>
            </el-form-item>
            <el-form-item label="管理员密码" prop="AdministratorsM">
              <el-input
                type="password"
                v-model="addEditsData.AdministratorsM"
                placeholder="请输入管理员密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="管理员联系电话" prop="phoneNumber">
              <el-input v-model="addEditsData.phoneNumber" placeholder="请输入管理员联系电话"></el-input>
            </el-form-item>-->
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="handleClose">取 消</el-button>
            <el-button
              type="primary"
              @click="isOk('addEditsData')"
            >确 定</el-button>
          </span>
        </el-dialog>

        <!-- 查看 loading -->
        <el-dialog
          title="查看绑定设备"
          :visible.sync="dialogVisible2"
          width="60%"
          :before-close="handleClosebind"
        >
          <el-table
            ref="multipleTable"
            :data="tableData1"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              prop="mzname"
              show-overflow-tooltip
              label="主机名称"
              align="center"
              min-width="150"
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

            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color:#F56C6C;"
                  @click="unbindeq(scope.$index, scope.row)"
                >解除绑定</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="handleClosebind">取 消</el-button>
            <!-- <el-button type="primary" @click="isBind('addEditsData')">确 定</el-button> -->
          </span>
        </el-dialog>
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
import copyright from "../../components/copyright";
export default {
  name: "roleManagement",
  components: {
    copyright
  },
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入管理员用户名"));
      } else {
        const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的用户名"));
        }
      }
    };
    return {
      // 角色id
      uid: "",
      // 列表数据
      tableData: [],
      // 查看绑定数据
      tableData1: [],
      // 已选择电箱数据
      multipleSelection: [],
      // 已选电箱计数
      selectionBoxCount: [],
      zlist: [],
      // 已选择设备的ID
      selectIdList: [],
      // 要绑定的管理员id
      id: "",
      // 分页
      fenYe: {
        currentPage: 1, // 当前页数
        total: null // 共多少页
      },
      // 添加 / 编辑 - 数据
      addEditsData: {
        username: "", // 管理员用户名
        nickname: "", // 管理员昵称
        userphone: "" // 管理员类型
        // AdministratorsZ: "", // 管理员账号
        // AdministratorsM: "", // 管理员密码
        // phoneNumber: "" // 手机号
      },
      // 添加 / 编辑 - 数据容错
      rules: {
        username: [{ required: true, validator: checkPhone, trigger: "blur" }],
        nickname: [
          { required: true, message: "请输入管理员昵称", trigger: "blur" }
        ],
        userphone: [
          { required: true, message: "请输入管理员联系方式", trigger: "blur" }
        ]
        // AdministratorsZ: [
        //   { required: true, message: "请输入管理员账号", trigger: "blur" }
        // ],
        // AdministratorsM: [
        //   { required: true, message: "请输入管理员密码", trigger: "blur" }
        // ],
        // phoneNumber: [
        //   { required: true, validator: checkPhone, trigger: "blur" }
        // ]
      },
      // 添加 - loading
      dialogVisible: false,

      // 查看 - loading
      dialogVisible2: false
    };
  },
  methods: {
    // 初始化获取列表
    getList() {
      let type = "post";
      let url = this.urla + "/api/pc/subAdminUserList";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        // console.log(res);
        this.tableData = res.data.data;
        // this.tableData = res.data.data.data;
        // this.fenYe.total = res.data.data.total;
        // for (let i = 0; i < this.tableData.length; i++) {
        //   this.tableData[i].anzhuang = new Date(
        //     this.tableData[i].anzhuang * 1000
        //   ).Format("yy-MM-dd hh:mm");
        // }
      });
    },
    // 分页 - 当前页数
    handleCurrentChange(val) {
      // this.getList(val);
    },
    // 编辑 / 添加 - 角色
    addEdits(row) {
      if (row.id) {
        this.uid = row.id;
        this.dialogVisible = true;
      } else {
        this.uid = "";
        Object.keys(this.addEditsData).forEach(
          key => (this.addEditsData[key] = "")
        );
        this.dialogVisible = true;
      }
    },
    // 关闭添加loading
    handleClose() {
      this.dialogVisible = false;
      this.$refs.addEditsData.resetFields();
      this.uid = "";
      Object.keys(this.addEditsData).forEach(
        key => (this.addEditsData[key] = "")
      );
    },

    // 关闭绑定loading
    handleClosebind() {
      this.dialogVisible2 = false;
      this.getList(1);
    },

    // 判断已选电箱计数 和 列表数据想对比 - 给出已选的样式打钩
    allContrast() {
      this.selectionBoxCount.forEach(row1 => {
        this.tableData1.forEach(row2 => {
          if (row1.id == row2.id) {
            this.$refs.multipleTable.toggleRowSelection(row2);
            this.zlist.push(row2);
          }
        });
      });
    },

    // 添加角色接口
    addrole() {
      let type = "post";
      let url = this.urla + "/api/pc/addSubAdminUser";
      let data = {
        uid: localStorage.getItem("uid"),
        username: this.addEditsData.username,
        nick: this.addEditsData.nickname,
        phone: Number(this.addEditsData.userphone)
      };

      this.myAjax(type, url, data, res => {
        // console.log(res);
        if (res.data.code == 36) {
          this.$message({
            showClose: true,
            message: "添加管理员成功",
            type: "success"
          });
          this.getList();
          this.dialogVisible = false;
        } else if (res.data.code == 37) {
          this.$message({
            showClose: true,
            message: "添加管理员失败",
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "用户名重复",
            type: "warning"
          });
        }
      });
    },

    // 管理员点击绑定设备
    bindeq(row) {
      this.$router.push({ name: "roleBindEq", params: row });
      // this.userid = row.id;
      // this.dialogVisible2 = true;
    },

    // 查看绑定设备
    lookbindeq(row) {
      this.id = row.id;
      this.dialogVisible2 = true;

      let type = "post";
      let url = this.urla + "/api/pc/zuoMachList";
      let data = {
        uid: localStorage.getItem("uid"),
        fid: row.id
      };

      this.myAjax(type, url, data, res => {
        this.tableData1 = res.data.data;
      });
    },

    // 解除设备绑定
    unbindeq(index, row) {

      this.$confirm("此操作将解除设备绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let type = "post";
          let url = this.urla + "/api/pc/delZuoMachList";
          let data = {
            uid: localStorage.getItem("uid"),
            fid: this.id,
            xid: row.mid
          };

          this.myAjax(type, url, data, res => {
            if (res.data.code == 41) {
              this.$message({
                showClose: true,
                message: "解除绑定成功",
                type: "success"
              });
              this.tableData1.splice(index, 1)
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 管理员绑定设备接口
    bingEqList() {
      let type = "post";
      let url = this.urla + "/api/pc/subAdminUserBindMach";
      let data = {
        uid: localStorage.getItem("uid"),
        fid: this.userid,
        list: this.arrToString(this.selectIdList)
      };
      this.myAjax(type, url, data, res => {
        // console.log(res);
        if (res.data.code == 41) {
          this.$message({
            showClose: true,
            message: "绑定成功"
          });

          this.getList(1);
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

    // 列表选择 - √
    handleSelectionChange(val) {
      let a = new Set(this.zlist);
      let b = new Set(val);
      let he = new Set([...b].filter(x => !a.has(x)));
      this.multipleSelection = Array.from(he);
    },

    // 确定 - 添加角色/编辑
    isOk(addEditsData) {
      this.$refs[addEditsData].validate(valid => {
        if (valid) {
          if (this.uid) {
            this.dialogVisible = true;
          } else {
            this.addrole();
          }
        }
      });
    },

    // 确定 - 绑定设备
    isBind(addEditsData) {
      this.multipleSelection.forEach(val => {
        this.selectIdList.push(val.id);
      });
      // console.log(this.arrToString(this.selectIdList));
      this.bingEqList();
    },

    // 密码重置
    resetpassword(row) {
      // console.log(row)
      this.$confirm('此操作将重置该账号密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let type = 'post'
        let url = this.urla + "/api/pc/rePassword"
        let data = {
          uid: localStorage.getItem('uid'),
          zuid: row.id
        }
        this.myAjax(type, url, data, res => {
          // console.log(res)
          if (res.data.code == 43) {
            // this.$message({
            //   type: 'success',
            //   message: '密码重置成功!'
            // });
            this.$notify({
              title: '密码重置成功',
              message: '重置密码为默认密码12345678',
              type: 'success',
              duration: 0
            });
          } else {
            this.$notify({
              title: '密码重置失败',
              message: '重置密码与默认密码相同',
              type: 'error',
              duration: 0
            });
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });
      });
    },

    // 删除
    deletes(row) {
      // console.log(row);
      if (row.id) {
        this.$confirm("您确定要删除该角色么？", "删除确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message.success("您已成功删除该角色");
            let type = "post";
            let url = this.urla + "/api/pc/delSubAdminUser";
            let data = {
              uid: 1,
              fid: row.id
            };
            this.myAjax(type, url, data, res => {
              // console.log(res);
              this.getList();
            });
          })
          .catch(() => {
            // this.$message.error(res.data.message + ",请联系管理员");
          });
      } else {
        this.$message.warning("该条信息有误,请联系管理员");
      }
    }
  },
  mounted() { },
  created() {
    this.getList(1);
    // this.geteqList(1);
  }
};
</script>
  
<style lang="less" scoped>
.roleManagement .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
// .roleManagement /deep/ .el-dialog__body {
//   padding-right: 65px;
// }
.roleManagement {
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
  }
  .el-footer {
  }
}
</style>
  