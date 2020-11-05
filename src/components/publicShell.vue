<template>
  <!-- 公共头部 -->
  <div class="publicShell">
    <el-container class="shell">
      <el-header>
        <el-row>
          <el-col
            :span="10"
            class="headLeft"
          >
            <div class="grid-content bg-purple-dark">
              <img
                @click="jumpHome"
                class="logo"
                src="../../public/static/images/logo.png"
                alt="xxxxx"
              />
              <p class="logoText">云控智能用电管理系统</p>
              <i
                class="el-icon-s-operation stb"
                @click="stb"
              ></i>
              <p class="v">2.0.0</p>
            </div>
          </el-col>
          <el-col
            :span="14"
            class="headRight"
          >
            <!-- 查看使用文档 -->
            <div class="topfun">
              <a
                target="_blank"
                href="/shouce.pdf"
              ><img
                  style="width: 26px;vertical-align: middle;"
                  src="../../public/static/images/wendang.png"
                  alt=""
                ></a>
              <span class="funspan">文档</span>
            </div>

            <div
              class="topfun"
              @click="jumpHome"
            >
              <!-- <i class="el-icon-s-home lookpdf"></i> -->
              <img
                style="width: 26px;vertical-align: middle;"
                src="../../public/static/images/daping.png"
                alt=""
              >
              <span class="funspan">大屏</span>
            </div>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="点击返回首页"
              placement="bottom"
            >
              <img
                @click="jumpHome"
                class="sy"
                src="../../public/static/images/home4.jpg"
                alt="xxxxx"
              />
            </el-tooltip> -->
            <div
              class="grid-content bg-purple-dark"
              style="float:right"
            >
              <el-dropdown
                class="personal"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <img
                    class="userImg"
                    :src="'http://api.yumaoyou.cn/' + userImg"
                    alt="xxx"
                  />
                  {{ userNanme }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item
                    divided
                    command="signOut"
                  >退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="shell1">
        <el-aside :class="!isCollapse?'kgLeft1':'kgLeft2'">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#fff"
            text-color="#000"
            active-text-color="#188f85"
            style="border-right:0;"
            unique-opened
            router
            :collapse="isCollapse"
          >
            <template v-for="item in routers">
              <template v-if="item.twoTitle">
                <el-submenu
                  :index="item.oneTitle"
                  :key="item.oneTitle"
                  style="text-align: left;"
                >
                  <template slot="title">
                    <img
                      :src="item.imgSrc"
                      alt
                      style="width:20px;margin-right:10px;"
                    />
                    <span>{{ item.oneTitle }}</span>
                  </template>
                  <el-menu-item
                    v-for="(item,index) in item.twoTitle"
                    :key="index"
                    :index="item.path"
                  >{{ item.title }}</el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item
                  :index="item.path"
                  :key="item.path"
                  style="text-align: left;"
                >
                  <img
                    :src="item.imgSrc"
                    alt
                    style="width:20px;margin-right:10px;"
                  />
                  <span slot="title">{{ item.oneTitle }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

  <script>
export default {
  name: "publicShell",
  data() {
    return {
      // 左侧导航 - 收起 / 关闭
      isCollapse: false,
      // 用户名称
      userNanme: "",
      // 用户头像
      userImg: "",
      // 路由串
      routers: [
        {
          oneTitle: "用电监测",
          imgSrc: require("../../public/static/images/z1.png"),
          twoTitle: [
            {
              title: "数据监测",
              path: "/dataMonitor"
            }
            // {
            //   title: "漏电自检记录",
            //   path: "/electricLeakageRecord"
            // }
          ]
        },
        {
          oneTitle: "远程控制",
          imgSrc: require("../../public/static/images/z2.png"),
          twoTitle: [
            {
              title: "定时开关",
              path: "/timeSwitch"
            },
            {
              title: "手动开关",
              path: "/manualSwitch"
            },
            // {
            //   title: "漏保自检",
            //   path: "/notCoveredChecking"
            // },
            {
              title: "阈值设置",
              path: "/thresholdSet"
            }
          ]
        },
        {
          oneTitle: "电器电箱",
          imgSrc: require("../../public/static/images/z3.png"),
          twoTitle: [
            {
              title: "电箱信息",
              path: "/electricBoxInfo"
            },
            {
              title: "线路信息",
              path: "/electricImplementInfo"
            }
          ]
        },
        {
          oneTitle: "综合报警",
          imgSrc: require("../../public/static/images/z4.png"),
          twoTitle: [
            {
              title: "报警分类",
              path: "/alarmProcessingwy"
            },
            {
              title: "已检修报警信息",
              path: "/Overhaul"
            },
            {
              title: "已删除报警信息",
              path: "/oldDeleted"
            }
          ]
        },
        {
          oneTitle: "报警分析",
          imgSrc: require("../../public/static/images/z5.png"),
          twoTitle: [
            {
              title: "分析预览",
              path: "/analysisPreview"
            },
            {
              title: "走势分析",
              path: "/trendAnalysis"
            }
          ]
        },
        {
          oneTitle: "能耗分析",
          imgSrc: require("../../public/static/images/z8.png"),
          twoTitle: [
            {
              title: "综合能耗",
              path: "/trend"
            },
            {
              title: "线路能耗",
              path: "/wave"
            },
            {
              title: "能耗波动",
              path: "/LineEnergyConsumption"
            },
            {
              title: "无功功率",
              path: "/reactivePower"
            }
          ]
        },
        {
          oneTitle: "能耗波动",
          imgSrc: require("../../public/static/images/波动.png"),
          twoTitle: [
            // {
            //   title: "电量波动",
            //   path: "/electricBox"
            // },
            // {
            //   title: "线路波动",
            //   path: "/lineWave"
            // },
            {
              title: "温度波动",
              path: "/lineWendu"
            },
            {
              title: "总无功电量波动",
              path: "/lineTotalReactive"
            },
            {
              title: "象限无功总电量波动",
              path: "/lineQuadrantReactive"
            },
            {
              title: "反向有功总电量波动",
              path: "/lineReverseActive"
            },
            {
              title: "电压波动",
              path: "/lineVoltage"
            },
            {
              title: "电流波动",
              path: "/lineCurrent"
            },
            {
              title: "有功功率波动",
              path: "/lineActive"
            },
            {
              title: "无功功率波动",
              path: "/lineReactive"
            },
            {
              title: "漏电流波动",
              path: "/lineLeakageCurrent"
            },
            {
              title: "总功率波动",
              path: "/lineThreePhasePower"
            },
            {
              title: "总无功功率波动",
              path: "/lineThreephaseNoPower"
            }
          ]
        },
        {
          oneTitle: "用户报告",
          imgSrc: require("../../public/static/images/z7.png"),
          twoTitle: [
            {
              title: "分析报表",
              path: "/usersReport"
            }
          ]
        },
        {
          oneTitle: "系统管理",
          imgSrc: require("../../public/static/images/z7.png"),
          twoTitle: [
            {
              title: "角色管理",
              path: "/roleManagement"
            },
            {
              title: "电箱计数",
              path: "/electricBoxCount"
            }
          ]
        }
      ]
    };
  },
  methods: {
    openpdf() {
      // let url = require('../../public/static/客户管理用户手册.pdf')
      // window.open(url, "_blank")
      this.$router.push({ path: '/shouce' })
    },
    // 点击logo / 文字跳转到对应的首页
    jumpHome() {
      this.$router.push("/home");
    },
    // 收起 / 展开 - 左侧导航
    stb() {
      this.isCollapse = !this.isCollapse;
    },
    // 导航跳转
    jump(path) {
      this.$router.push({
        path: path
      });
    },
    // 个人操作-头部右上角
    handleCommand(command) {
      if (command == "signOut") {
        localStorage.clear();
        this.$router.push({
          path: "/"
        });
      }
    }
  },
  mounted() { },
  created() {
    this.userNanme = localStorage.getItem("username");
    this.userImg = localStorage.getItem("himg");
  }
};
</script>
  
 <style lang="less" scoped>
.publicShell {
  height: 100%;
  .shell {
    .shell1 {
      height: 60%;
      ::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      ::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #dddee0;
      }
      ::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #fff;
      }
    }
    .kgLeft1 {
      width: 200px !important;
      animation: 1s;
    }
    .kgLeft2 {
      width: 65px !important;
      animation: 1s;
    }
    height: 100%;
    .el-header {
      // background: teal
      // background: #87d5d566
    }
    .el-header,
    .el-footer {
      text-align: center;
      line-height: 60px;
      height: 60px;
      border-bottom: 1px solid teal;
      .headLeft {
        height: 60px;
        text-align: left;
        .logo {
          display: block;
          width: 40px;
          height: 40px;
          margin-top: 10px;
          cursor: pointer;
          float: left;
        }
        .logoText {
          float: left;
          font-size: 16px;
          font-weight: 600;
          margin: 0 20px;
        }
        .stb {
          font-size: 20px;
          color: #008080;
          cursor: pointer;
          display: inline-block;
          line-height: 62px;
          float: left;
        }
        .v {
          float: left;
          line-height: 66px;
          font-size: 12px;
          // color: #ccc;
          color: black;
          margin-left: 20px;
        }
      }
      .headRight {
        text-align: right;
        .topfun {
          display: inline-block;
          text-align: left;
          line-height: 45px;
          margin-right: 20px;
          cursor: pointer;
          .funspan {
            display: block;
            line-height: 0;
          }
        }
        .topfun:hover {
          color: teal;
        }
        .sy {
          width: 35px;
          border-radius: 50%;
          vertical-align: middle;
          cursor: pointer;
          margin-right: 20px;
        }
        .personal {
          cursor: pointer;
        }
        .userImg {
          width: 30px;
          height: 30px;
          vertical-align: middle;
          border-radius: 50%;
        }
      }
    }
    .el-aside {
      text-align: center;
      height: 100%;
      border-right: 1px solid #e6e6e6;
      overflow-x: hidden;
      .el-submenu .el-menu-item {
        padding-left: 50px !important;
        text-align: left;
      }
    }

    .el-main {
      color: #333;
      text-align: center;
      padding: 0;
    }
  }
}
.lookpdf {
  font-size: 26px;
  margin-right: 1rem;
  vertical-align: middle;
}
.lookpdf:hover {
  color: teal;
}
</style>
  