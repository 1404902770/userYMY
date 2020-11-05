<template>
  <div class="wrap">
    <div class="index">
      <div class="funwrap">
        <!-- 第一行 -->
        <div class="hang">
          <div class="fenlei">用电监测</div>
          <div
            class="item one"
            @click="gotoOther('/elewatch')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/电表.png"
                alt=""
              >
            </div>
            设备监测
          </div>
          <div
            class="item two"
            @click="gotoOther('/dataMonitor')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/dnzl.png"
                alt=""
              >
            </div>
            数据监测
          </div>
          <!-- <div class="item two"></div>
          <div class="item three"></div>
          <div class="item four"></div>-->
        </div>
        <!-- 第二行 -->
        <div class="hang">
          <div class="fenlei">远程控制</div>
          <div
            class="item three"
            @click="gotoOther('/timeSwitch')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/定时开关.png"
                alt=""
              >
            </div>
            定时开关
          </div>
          <div
            class="item two"
            @click="gotoOther('/manualSwitch')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/手.png"
                alt=""
              >
            </div>
            手动开关
          </div>
          <div
            class="item four"
            @click="gotoOther('/thresholdSet')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/阈值设置.png"
                alt=""
              >
            </div>
            阈值设置
          </div>
          <div
            class="item one"
            @click="gotoOther('')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/合闸.png"
                alt=""
              >
            </div>
            一键分/合闸
          </div>
          <!-- <div class="item four"></div> -->
        </div>
        <!-- 第三行 -->
        <div class="hang">
          <div class="fenlei">综合报警</div>
          <div
            class="item one"
            @click="gotoOther('/alarmProcessingwy')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/报警分类分析.png"
                alt=""
              >
            </div>
            报警分类
          </div>
          <div
            class="item four"
            @click="gotoOther('/analysisPreview')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/分析 (1).png"
                alt=""
              >
            </div>
            分析预览
          </div>
          <div
            class="item three"
            @click="gotoOther('/trendAnalysis')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/分析.png"
                alt=""
              >
            </div>
            分析走势
          </div>
          <div
            class="item two"
            @click="gotoOther('/oldDeleted')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/已删除.png"
                alt=""
              >
            </div>
            已删除报警信息
          </div>
          <!-- <div class="item four"></div> -->
        </div>
        <!-- 第四行 -->
        <div class="hang">
          <div class="fenlei">运维管理</div>
          <div
            class="item two"
            @click="gotoOther('')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/任务管理.png"
                alt=""
              >
            </div>
            任务管理
          </div>
          <div
            class="item four"
            @click="gotoOther('')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/单据.png"
                alt=""
              >
            </div>
            维修记录单
          </div>
          <!-- <div class="item three"></div>
          <div class="item four"></div>-->
        </div>
        <!-- 第五行 -->
        <div class="hang">
          <div class="fenlei">能耗分析</div>
          <div
            class="item four"
            @click="gotoOther('/trend')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/能耗.png"
                alt=""
              >
            </div>
            综合能耗
          </div>
          <div
            class="item three"
            @click="gotoOther('/wave')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/线路.png"
                alt=""
              >
            </div>
            线路能耗
          </div>
          <div
            class="item one"
            @click="gotoOther('/LineEnergyConsumption')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/波动.png"
                alt=""
              >
            </div>
            能耗波动
          </div>
          <div
            class="item two"
            @click="gotoOther('')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/分时统计.png"
                alt=""
              >
            </div>
            分时段用电
          </div>
          <div
            class="item two"
            @click="gotoOther('')"
          >
            <div class="IMG">
              <img
                class="center-block"
                src="../../public/static/images/报表.png"
                alt=""
              >
            </div>
            用能及电费报表
          </div>
        </div>

        <!-- <div class="hang"></div>
        <div class="hang"></div>
        <div class="hang"></div>
        <div class="hang"></div>
        <div class="hang"></div>-->
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {

    };
  },

  // 事件集
  methods: {
    // 点击跳转相关功能页
    gotoOther(path) {
      this.$router.push({ path });
    }
  },
  // 初始化数据 - 在dom加载完成后
  mounted() { },
  // 初始化数据 - 在dom加载完成前
  created() { }
};
</script>
  
 <style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: relative;
  .index {
    width: 100%;
    height: 100%;
    background: url("../../public/static/images/1.jpg") no-repeat;
    background-size: 100% 100%;
    .funwrap {
      width: 95%;
      max-width: 800px;
      height: 90%;
      max-height: 550px;
      color: white;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .hang {
        display: flex;
        height: 19%;
        margin-bottom: 1%;
        .fenlei {
          min-width: 112px;
          background: #253867;
          font-weight: 600;
          line-height: 400%;
          padding: 2%;
          font-size: 18px;
          margin-right: 1%;
        }
        .item {
          flex: 1;
          margin-right: 1%;
          text-align: center;
          padding-top: 30px;
          font-size: 15px;
          cursor: pointer;
          .IMG {
            height: 50%;
            img {
              height: 85%;
            }
            .center-block {
              display: block;
              margin-right: auto;
              margin-left: auto;
            }
          }
        }
        .one {
          background: #0a9891;
        }
        .two {
          background: #9e3f80;
        }
        .three {
          background: #7d4dae;
        }
        .four {
          background: #aa543b;
        }
        .item:hover {
          box-shadow: 0 0 5px #fff;
        }
      }
    }
  }
}
</style>
  