<template>
  <!-- 登录 -->
  <div class="login">
    <video
      src="../../public/static/images/homeBJ.mp4"
      autoplay="autoplay"
      loop="loop"
      muted="muted"
      height="100%"
      width="100%"
      style="opacity: .4;"
    ></video>
    <img
      src="../../public/static/images/home6.png"
      alt
      style="margin-top: 8%;position: absolute;left: 27%;"
    />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <!-- <div>
        <img
          style="width:60px;height:60px;opacity: 0.6;"
          src="../../public/static/images/logo.png"
          alt
        />
      </div>-->
      <el-form-item
        prop="accountNumber"
        class="z2"
      >
        <img
          class="lb"
          src="../../public/static/images/lb_3.png"
          alt
        />
        <el-input
          v-model="ruleForm.accountNumber"
          placeholder="请输入用户名"
          class="z1"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="Password"
        class="z2"
      >
        <img
          class="lb"
          src="../../public/static/images/lb_1.png"
          alt
        />
        <el-input
          type="password"
          v-model="ruleForm.Password"
          placeholder="请输入密码"
          class="z1"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="verificationCode"
        class="z2"
      >
        <img
          class="lb"
          src="../../public/static/images/lb_2.png"
          alt
        />
        <el-input
          v-model="ruleForm.verificationCode"
          placeholder="请输入验证码"
          style="width: 60%;float: left;"
        ></el-input>
        <el-tooltip
          class="item"
          effect="light"
          content="点击更新"
          placement="bottom"
        >
          <p
            class="yzm"
            @click="ghyzm"
            v-loading="loading"
          >
            <span>{{ num1 }}</span>
            <span>{{ fh }}</span>
            <span>{{ num2 }}</span>
            <span>=</span>
            <span>?</span>
          </p>
        </el-tooltip>
      </el-form-item>
      <el-form-item style="margin-bottom:0;">
        <el-button
          type="primary"
          class="dl"
          @click="submitForm('ruleForm')"
        >登录</el-button>
      </el-form-item>
      <!-- <el-form-item class="AdministratorsTeacher">
            <el-button type="text" @click="AdministratorsTeacher(1)" v-if="at == 1">管理员登录</el-button>
            <el-button type="text" @click="AdministratorsTeacher(2)" v-else-if="at ==2">老师登录</el-button>
      </el-form-item>-->
    </el-form>

    <div style="position:Fixed;bottom:0;width:100%;height:8%">
      <p class="usebrowser">推荐使用：Chrome(谷歌浏览器)、360浏览器，不支持IE浏览器</p>

      <el-footer class="copyright">
        <p>
          <img src="../../public/static/images/jinghui.png" />Copyright © 2019-2020 &nbsp;&nbsp;
          <img
            style="width:20px;height:20px"
            src="../../public/static/images/logo.png"
          />裕茂优科技秦皇岛有限公司 &nbsp;&nbsp;官方网站：
          <a
            style="color:white"
            href="http://www.yumaoyou.com"
          >www.yumaoyou.com</a>
        </p>
      </el-footer>
    </div>
  </div>
</template>
  
  <script>
import $ from "jquery";
import Qs from "qs";
import ElementUI from "element-ui";
import md5 from "js-md5";
import footered from "../components/copyright";
export default {
  name: "login",
  data() {
    return {
      // 账号密码验证码
      ruleForm: {
        accountNumber: "",
        Password: "",
        verificationCode: ""
      },
      // 表单格式判定
      rules: {
        accountNumber: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        Password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      loading: false, // loading
      num1: "", // 第一个数
      num2: "", // 第二个数
      fh: "", // 验证码符号  +  -  *  /
      yzms: "" // 正确的验证码
    };
  },
  components: {
    footered
  },
  // 是件集合
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        let _this = this;
        if (valid) {
          if (_this.ruleForm.verificationCode) {
            if (Number(_this.ruleForm.verificationCode) != _this.yzms) {
              _this.ruleForm.verificationCode = "";
              _this.ghyzm();
              _this.$message.warning("验证码有误,请重新填写");
              return false;
            } else {
              ElementUI.Loading.service({
                fullscreen: true,
                background: "rgba(0,0,0,.4)"
              });
              let instance = this.$axios.create();
              instance({
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "post",
                url: "/b/site/sign-in",
                data: Qs.stringify({
                  username: _this.ruleForm.accountNumber,
                  password: md5(md5(_this.ruleForm.Password))
                })
              }).then(res => {
                // console.log(res)
                if (res.data.code == 4) {
                  setTimeout(function () {
                    localStorage.setItem("token", "ztoken"); // 测试token
                    localStorage.setItem("uid", res.data.data.uid); // 用户id：用户的唯一标识
                    localStorage.setItem("type", res.data.data.type); // 1、企业用户；2、个人用户；3、定制用户
                    localStorage.setItem("username", res.data.data.username); // 用户名
                    localStorage.setItem("nick", res.data.data.nick); // 昵称
                    localStorage.setItem("himg", res.data.data.himg); // 户头像
                    ElementUI.Loading.service({}).close();
                    _this.socket();
                    _this.$router.push("/home");
                  }, 1000);
                } else if (res.data.code == 5) {
                  ElementUI.Loading.service({}).close();
                  _this.$message.warning("密码错误");
                  _this.ghyzm();
                } else if (res.data.code == 3) {
                  ElementUI.Loading.service({}).close();
                  _this.$message.warning("用户名未知");
                  _this.ghyzm();
                } else if (res.data.code == 2) {
                  ElementUI.Loading.service({}).close();
                  _this.$message.warning("用户名输入错误");
                  _this.ghyzm();
                } else {
                  ElementUI.Loading.service({}).close();
                  _this.$message.warning(res.data.message);
                  _this.ghyzm();
                }
              });
            }
          } else {
            _this.$message.warning("请填写验证码");
            return false;
          }
        }
      });
    },
    // // 管理员 - 老师
    // AdministratorsTeacher(type) {
    //   if (type == 1) {
    //     this.at = 2;
    //     this.$message.success("已选择管理员登录");
    //   } else {
    //     this.at = 1;
    //     this.$message.success("已选择老师登录");
    //   }
    // },
    // 更新验证码
    ghyzm() {
      let _this = this;
      _this.ruleForm.verificationCode = "";
      let num1 = Math.ceil(Math.random() * 10);
      let num2 = Math.ceil(Math.random() * 10);
      let num3 = Math.ceil(Math.random() * 3);
      _this.num1 = num1;
      _this.num2 = num2;
      if (num3 == 1) {
        _this.fh = "+";
        _this.yzms = num1 + num2;
      } else if (num3 == 2) {
        _this.fh = "-";
        if (num1 < num2) {
          _this.yzms = num2 - num1;
          _this.num1 = num2;
          _this.num2 = num1;
        } else {
          _this.yzms = num1 - num2;
        }
      } else if (num3 == 3) {
        _this.fh = "*";
        _this.yzms = num1 * num2;
      } else {
        _this.fh = "+";
        _this.yzms = num1 + num2;
      }
      _this.loading = true;
      setTimeout(function () {
        _this.loading = false;
      }, 1000);
    }
  },
  mounted() {
    this.ghyzm();
  },
  // 初始化数据
  created() {
    //回车键直接登录
    let that = this;
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.submitForm("ruleForm");
        return false;
      }
    };
  }
};
</script>
  
<style lang="less" scoped>
.el-footer.copyright {
  height: 28px !important;
}
.el-footer.copyright p {
  color: white;
  font-size: 12px;
  border-top: 1px solid #e6e6e6;
  line-height: 30px;
  img {
    vertical-align: middle;
    margin-right: 5px;
  }
}
.login {
  height: 100%;
  background: url("../../public/static/images/home1.jpg") center no-repeat
    no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  video {
    position: fixed;
    top: 0;
    left: 0;
    object-fit: fill;
  }
  .el-form {
    display: block;
    width: 550px;
    background: url("../../public/static/images/home31.png") center no-repeat
      no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    margin: auto;
    padding: 70px 20px 30px 20px;
    // padding: 49px 20px 30px 20px;
    margin-top: 4%;
    position: absolute;
    top: 25%;
    left: 34.5%;
    .el-form-item {
      margin-bottom: 18px;
      width: 70%;
      margin: auto;
      margin-top: 20px;
      .lb {
        display: block;
        float: left;
        width: 24px;
        margin: 8px 0 0 10px;
      }
      .z1 {
        width: 90%;
        float: right;
      }
    }
    .yzm {
      float: left;
      height: 40px;
      line-height: 40px;
      width: 31%;
      color: #0ff1ff;
      font-size: 14px;
      cursor: pointer;
      letter-spacing: 5px;
    }
    .z2 {
      background: url(../../public/static/images/home5.png) center no-repeat
        no-repeat;
      background-size: 100% 100%;
    }
  }
  .usebrowser {
    color: white;
    padding: 10px 0;
    background: rgba(5, 130, 222, 0.6);
    width: 50%;
    margin: 0 auto;
    border-radius: 10px;
  }
}
.login /deep/ .el-form-item__content {
  line-height: 0 !important;
}
.login /deep/ .el-button--primary {
  color: #fff;
  background-color: #0582de;
  border-color: #0782e0;
  width: 140px;
  margin-top: 40px;
}
.login /deep/ .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 30px;
  background: transparent !important;
  border: 0 !important;
  color: #0fc4f6 !important;
}
</style>
  