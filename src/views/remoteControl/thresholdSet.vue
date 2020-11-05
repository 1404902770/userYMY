<template>
  <!-- 远程控制 - 阈值设置 -->
  <div class="thresholdSet">
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
            prop="selects1"
          >
            <el-select
              v-model="form.selects1"
              filterable
              placeholder="请选择电箱设备号"
              @change="getLines"
            >
              <el-option
                v-for="(item,index) in options1"
                :label="'['+getString1(hexCharCodeToStr(item.mzid))+']' + item.mzname"
                :value="item.mzid"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="线路"
            prop="selects2"
          >
            <el-select
              v-model="form.selects2"
              filterable
              placeholder="请选择线路"
            >
              <el-option
                v-for="(item,index) in options2"
                :label="item.name"
                :value="item.mid"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-button
            type="primary"
            @click="submitForm1"
          >阈值设置</el-button>

          <el-button @click="resetForm1('form')">重置 / 刷新</el-button>
        </el-form>
      </el-header>
      <!-- 中部 -->
      <el-main>
        <div v-show="mainSh">
          <el-form
            :model="ruleForm"
            :rules="rules2"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <p class="titleName">阈值设置</p>
            <div class="mshell1">
              <el-form-item
                label="欠压报警"
                prop="vl1"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.vl1"
                  placeholder="请输入欠压报警"
                  @keyup.native="ruleForm.vl1 = oninput(ruleForm.vl1,1)"
                ></el-input>
                <span>V</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="tl1"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.tl1"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="过压告警"
                prop="vh1"
                class="form_item2"
              >
                <el-input
                  v-model="ruleForm.vh1"
                  placeholder="请输入过压告警"
                  @keyup.native="ruleForm.vh1 = oninput(ruleForm.vh1,1)"
                ></el-input>
                <span>V</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="th1"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.th1"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="过压报警"
                prop="vh2"
                class="form_item2"
              >
                <el-input
                  v-model="ruleForm.vh2"
                  placeholder="请输入过压报警"
                  @keyup.native="ruleForm.vh2 = oninput(ruleForm.vh2,1)"
                ></el-input>
                <span>V</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="th2"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.th2"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="动作"
                prop="dvk"
                class="form_item3"
              >
                <el-radio-group v-model="ruleForm.dvk">
                  <el-radio label="01">断电</el-radio>
                  <el-radio label="00">不断电</el-radio>
                </el-radio-group>
              </el-form-item>

            </div>
            <div
              class="mshell1"
              style="border-right:0;"
            >
              <el-form-item
                label="电流预警"
                prop="cl1"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.cl1"
                  placeholder="请输入电流预警"
                  @keyup.native="ruleForm.cl1 = oninput(ruleForm.cl1,1)"
                ></el-input>
                <span>A</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="t1"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.t1"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="动作"
                prop="al"
                class="form_item3"
              >
                <el-radio-group v-model="ruleForm.al">
                  <el-radio label="01">断电</el-radio>
                  <el-radio label="00">不断电</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                label="电流告警"
                prop="cl2"
                class="form_item2"
              >
                <el-input
                  v-model="ruleForm.cl2"
                  placeholder="请输入电流告警"
                  @keyup.native="ruleForm.cl2 = oninput(ruleForm.cl2,1)"
                ></el-input>
                <span>A</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="t2"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.t2"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="动作"
                prop="a2"
                class="form_item3"
              >
                <el-radio-group v-model="ruleForm.a2">
                  <el-radio label="01">断电</el-radio>
                  <el-radio label="00">不断电</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                label="电流报警"
                prop="cl3"
                class="form_item2"
              >
                <el-input
                  v-model="ruleForm.cl3"
                  placeholder="请输入电流报警"
                  @keyup.native="ruleForm.cl3 = oninput(ruleForm.cl3,1)"
                ></el-input>
                <span>A</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="t3"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.t3"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="动作"
                prop="a3"
                class="form_item3"
              >
                <el-radio-group v-model="ruleForm.a3">
                  <el-radio label="01">断电</el-radio>
                  <el-radio label="00">不断电</el-radio>
                </el-radio-group>
              </el-form-item>

            </div>
            <div class="mshell1">
              <el-form-item
                label="漏电电流"
                prop="l1"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.l1"
                  placeholder="请输入漏电电流"
                  @keyup.native="ruleForm.l1 = positiveInteger(ruleForm.l1)"
                ></el-input>
                <span>mA</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="tl2"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.tl2"
                  placeholder="请输入稳定时间"
                  @keyup.native="ruleForm.tl2 = positiveInteger(ruleForm.tl2)"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="动作"
                prop="dz"
                class="form_item3"
              >
                <el-radio-group v-model="ruleForm.dz">
                  <el-radio label="01">断电</el-radio>
                  <el-radio label="00">不断电</el-radio>
                </el-radio-group>
              </el-form-item>

            </div>
            <div
              class="mshell1"
              style="border-right:0;"
            >
              <el-form-item
                label="温度报警"
                prop="wendu"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.wendu"
                  placeholder="请输入温度报警"
                  @keyup.native="ruleForm.wendu = positiveInteger(ruleForm.wendu)"
                ></el-input>
                <span>°C</span>
              </el-form-item>

              <el-form-item
                label="稳定时间"
                prop="wendut"
                class="form_item1"
              >
                <el-input
                  v-model="ruleForm.wendut"
                  placeholder="请输入稳定时间"
                ></el-input>
                <span>S</span>
              </el-form-item>

              <el-form-item
                label="动作"
                prop="wendul"
                class="form_item3"
              >
                <el-radio-group v-model="ruleForm.wendul">
                  <el-radio label="01">断电</el-radio>
                  <el-radio label="00">不断电</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-main>
      <!-- 下部 -->
      <el-footer>
        <div
          v-show="mainSh"
          class="form_item4"
        >
          <el-button @click="resetForm2('ruleForm')">重置</el-button>
          <el-button
            type="primary"
            @click="submitForm2('ruleForm')"
          >确定添加</el-button>
        </div>
      </el-footer>
      <!-- 底部版权 -->
      <div style="height:28px">
        <copyright></copyright>
      </div>
    </el-container>
  </div>
</template>
  
<script>
import copyright from "../../components/copyright";

export default {
  name: "thresholdSet",
  components: {
    copyright
  },
  data() {
    return {
      // 检索
      form: {
        selects1: "", // 设备
        selects2: "" // 线路
      },
      // 获取所有设备
      options1: [],
      // 获取改线路下的所有线路
      options2: [],
      // 添加定时器字段
      ruleForm: {
        vl1: "", // 欠压预警值
        tl1: "", // 欠压预警持续时间
        vh1: "", // 过压预警
        th1: "", // 过压预警时间
        vh2: "", // 过压报
        th2: "", // 过压报警时间
        dvk: "", // 过压报警超过设定时间的动作
        cl1: "", // 电流预警
        t1: "", // 电流预警时间
        al: "", // 预警动作
        cl2: "", // 电流告警
        t2: "", // 告警时间
        a2: "", // 告警动作
        cl3: "", // 电流报警
        t3: "", // 报警时间
        a3: "", // 报警动作
        l1: "", // 漏电流
        tl2: "", // 漏电流持续时间
        dz: "", // 漏电流动作
        wendu: "", // 温度
        wendut: "", // 温度持续时间
        wendul: " " // 温度动
      },
      // 校验 - 阈值参数
      rules2: {
        vl1: [{ required: true, message: "请输入欠压报警", trigger: "blur" }],
        tl1: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        vh1: [{ required: true, message: "请输入过压告警", trigger: "blur" }],
        th1: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        vh2: [{ required: true, message: "请输入过压报警", trigger: "blur" }],
        th2: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        dvk: [{ required: true, message: "请选择动作", trigger: "change" }],
        cl1: [{ required: true, message: "请输入电流预警", trigger: "blur" }],
        t1: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        al: [{ required: true, message: "请选择动作", trigger: "change" }],
        cl2: [{ required: true, message: "请输入电流告警", trigger: "blur" }],
        t2: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        a2: [{ required: true, message: "请选择动作", trigger: "change" }],
        cl3: [{ required: true, message: "请输入电流报警", trigger: "blur" }],
        t3: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        a3: [{ required: true, message: "请选择动作", trigger: "change" }],
        l1: [{ required: true, message: "请输入漏电电流", trigger: "blur" }],
        tl2: [{ required: true, message: "请输入稳定时间", trigger: "blur" }],
        dz: [{ required: true, message: "请选择动作", trigger: "change" }],
        wendu: [{ required: true, message: "请输入温度报警", trigger: "blur" }],
        wendut: [
          { required: true, message: "请输入稳定时间", trigger: "blur" }
        ],
        wendul: [{ required: true, message: "请选择动作", trigger: "change" }]
      },
      // 显示隐藏 - 阈值设置
      mainSh: false
    };
  },
  methods: {
    // 初始化获取
    getList(page) {
      let type = "post";
      let url = this.urlb + "/api/pc/allNeted";
      let data = {
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        this.options1 = res.data.data;
      });
    },
    // 根据设备号获取线路
    getLines(val) {
      this.form.selects2 = "";
      let type = "post";
      let url = this.urlb + "/api/pc/getmzInfo";
      let data = {
        nid: val,
        uid: localStorage.getItem('uid')
      };
      this.myAjax(type, url, data, res => {
        this.options2 = res.data.data;
      });
    },

    // 获取一台设备阈值
    getEqFaZhi() {
      let type = "post";
      let url = this.urla + "/api/mach/getWeiduanfazhiPlus";
      let data = {
        nid: this.form.selects1,
        aa: this.form.selects2,
        uid: localStorage.getItem("uid")
      };
      this.myAjax(type, url, data, res => {
        // console.log(res);
        if (res.data.code == 111) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "warning"
          });
          this.mainSh = false;
        } else if (res.data.code == 89) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "waring"
          });
          this.mainSh = false;
        } else {
          this.mainSh = true;
        }
      });
    },

    // 筛选字段 - 查询
    submitForm1() {
      if (this.form.selects1 && this.form.selects2) {
        this.getEqFaZhi();

        let type = "post";
        let url = this.urlb + "/api/pc/getMachedVal";
        let data = {
          uid: localStorage.getItem("uid"),
          nid: this.form.selects1,
          aa: this.form.selects2
        };
        this.myAjax(type, url, data, res => {
          this.ruleForm = res.data.data;
          this.ruleForm.vl1 = Number(this.ruleForm.vl1) / 10;
          this.ruleForm.vh1 = Number(this.ruleForm.vh1) / 10;
          this.ruleForm.vh2 = Number(this.ruleForm.vh2) / 10;
          this.ruleForm.cl1 = Number(this.ruleForm.cl1) / 1000;
          this.ruleForm.cl2 = Number(this.ruleForm.cl2) / 1000;
          this.ruleForm.cl3 = Number(this.ruleForm.cl3) / 1000;
          // this.mainSh = true;
        });
      } else {
        this.$message.warning("请输入查询条件");
        return false;
      }
    },
    // 筛选字段 - 重置
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      this.mainSh = false;
    },
    // 阈值字段 - 保存
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            Number(this.ruleForm.vl1) > 220 ||
            Number(this.ruleForm.vl1) < 170
          ) {
            this.$message.warning("欠压报警数值不能大于220V或小于170V");
            return false;
          }
          if (Number(this.ruleForm.tl1) > 30 || Number(this.ruleForm.tl1) < 1) {
            this.$message.warning("欠压报警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }
          if (
            Number(this.ruleForm.vh1) > 250 ||
            Number(this.ruleForm.vh1) < 220
          ) {
            this.$message.warning("过压告警数值不能大于250V或小于220V");
            return false;
          }
          if (Number(this.ruleForm.th1) > 30 || Number(this.ruleForm.th1) < 1) {
            this.$message.warning("过压告警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }
          if (
            Number(this.ruleForm.vh2) > 280 ||
            Number(this.ruleForm.vh2) < 220
          ) {
            this.$message.warning("过压报警数值不能大于280V或小于220V");
            return false;
          }
          if (Number(this.ruleForm.th2) > 30 || Number(this.ruleForm.th2) < 1) {
            this.$message.warning("过压报警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }

          if (
            Number(this.ruleForm.cl1) > 100 ||
            Number(this.ruleForm.cl1) < 0.01
          ) {
            this.$message.warning("电流预警数值不能大于100A或小于0.1A");
            return false;
          }
          if (Number(this.ruleForm.t1) > 30 || Number(this.ruleForm.t1) < 1) {
            this.$message.warning("电流预警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }
          if (
            Number(this.ruleForm.cl2) > 100 ||
            Number(this.ruleForm.cl2) < 0.01
          ) {
            this.$message.warning("电流告警数值不能大于100A或小于0.1A");
            return false;
          }
          if (Number(this.ruleForm.t2) > 30 || Number(this.ruleForm.t2) < 1) {
            this.$message.warning("电流告警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }
          if (
            Number(this.ruleForm.cl3) > 100 ||
            Number(this.ruleForm.cl3) < 0.01
          ) {
            this.$message.warning("电流报警数值不能大于100A或小于0.1A");
            return false;
          }
          if (Number(this.ruleForm.t3) > 30 || Number(this.ruleForm.t3) < 1) {
            this.$message.warning("电流报警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }

          if (
            Number(this.ruleForm.l1) > 100 ||
            Number(this.ruleForm.l1) < 0.01
          ) {
            this.$message.warning("漏电电流数值不能大于100mA或小于1mA");
            return false;
          }
          if (Number(this.ruleForm.tl2) > 30 || Number(this.ruleForm.tl2) < 1) {
            this.$message.warning("漏电电流稳定时间数值不能大于30秒或小于1秒");
            return false;
          }

          if (
            Number(this.ruleForm.wendu) > 127 ||
            Number(this.ruleForm.wendu) < 0
          ) {
            this.$message.warning("温度报警数值不能大于127°C或小于0°C");
            return false;
          }
          if (
            Number(this.ruleForm.wendut) > 30 ||
            Number(this.ruleForm.wendut) < 1
          ) {
            this.$message.warning("温度报警稳定时间数值不能大于30秒或小于1秒");
            return false;
          }
          let type = "post";
          let url = this.urla + "/api/mach/setDuanluqiAaFun";
          let data = {
            uid: localStorage.getItem("uid"),
            nid: this.form.selects1,
            aa: this.form.selects2
          };
          data.vl1 = this.ruleForm.vl1; // 欠压预警值
          data.tl1 = this.ruleForm.tl1; // 欠压预警持续时间
          data.vh1 = this.ruleForm.vh1; // 过压预警
          data.th1 = this.ruleForm.th1; // 过压预警时间
          data.vh2 = this.ruleForm.vh2; // 过压报
          data.th2 = this.ruleForm.th2; // 过压报警时间
          data.dvk = this.ruleForm.dvk; // 过压报警超过设定时间的动作
          data.cl1 = this.ruleForm.cl1; // 电流预警
          data.t1 = this.ruleForm.t1; // 电流预警时间
          data.al = this.ruleForm.al; // 预警动作
          data.cl2 = this.ruleForm.cl2; // 电流告警
          data.t2 = this.ruleForm.t2; // 告警时间
          data.a2 = this.ruleForm.a2; // 告警动作
          data.cl3 = this.ruleForm.cl3; // 电流报警
          data.t3 = this.ruleForm.t3; // 报警时间
          data.a3 = this.ruleForm.a3; // 报警动作
          data.l1 = this.ruleForm.l1; // 漏电流
          data.tl2 = this.ruleForm.tl2; // 漏电流持续时间
          data.dz = this.ruleForm.dz; // 漏电流动作
          data.wendu = this.ruleForm.wendu; // 温度
          data.wendut = this.ruleForm.wendut; // 温度持续时间
          data.wendul = this.ruleForm.wendul; // 温度动
          this.myAjax(type, url, data, res => {
            if (res.data.code == 119) {
              this.$message.success("阈值设置成功");
            } else {
              this.$message.warning(res.data.msg);
            }
          });
        } else {
          this.$message.warning("请输入必填参数");
          return false;
        }
      });
    },
    // 阈值字段 - 重置
    resetForm2(formName) {
      this.$refs[formName].resetFields();
    }
  },
  watch: {},
  computed: {},
  mounted() { },
  created() {
    this.getList(1);
  }
};
</script>
  
 <style lang="less" scoped>
.thresholdSet .el-header .el-form /deep/ .el-radio-button__inner {
  padding: 7px 10px !important;
}
.thresholdSet {
  overflow: hidden;
  height: 100%;
  .el-header {
    border-bottom: 1px solid #e6e6e6;
    .el-form {
      text-align: left;
      margin-top: 10px;
      .el-form-item {
        float: left;
      }
      .el-button {
        margin-top: 3px;
        padding: 9px 20px;
        margin-left: 20px;
      }
    }
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
    height: 100%;
    .el-form {
      text-align: left;
      margin-top: 10px;
      padding-left: 10px;
      .titleName {
        text-align: center;
        font-size: 18px;
        line-height: 60px;
        color: #008080;
        margin-left: -2%;
      }
      .mshell1 {
        overflow: hidden;
        float: left;
        width: 49%;
        border-right: 1px solid #f2f2f2;
        .form_item1 {
          float: left;
          width: 50%;
          .el-input {
            width: 80%;
          }
          span {
            display: inline-block;
            width: 20%;
            text-align: center;
          }
        }
        .form_item2 {
          clear: both;
          float: left;
          width: 50%;
          .el-input {
            width: 80%;
          }
          span {
            display: inline-block;
            width: 20%;
            text-align: center;
          }
        }
        .form_item3 {
          clear: both;
          float: left;
        }
      }
    }
  }
  .el-footer {
    height: 80px !important;
    margin-left: -2%;
    .form_item4 {
      text-align: center;
      .el-button {
        width: 120px;
      }
    }
  }
}
</style>
  