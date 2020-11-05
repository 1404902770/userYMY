import Vue from "vue";
import Router from "vue-router";

// ElementUI框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    // 整体架子
    {
      path: "/publicShell",
      name: "publicShell",
      component: resolve =>
        require(['@/components/publicShell.vue'], resolve),
      meta: {
        title: '首页',
        requiresAuth: true
      },
      // 重定向
      redirect() {
        return '/dataMonitor'
      },
      children: [
        // 用电监测 - 数据监测
        {
          path: "/dataMonitor",
          name: "dataMonitor",
          component: resolve =>
            require(['@/views/electricMonitor/dataMonitor.vue'], resolve),
          meta: {
            title: '用电检测 - 数据监测',
            requiresAuth: true
          }
        },
        // 用电监测 - 数据监测 - 详情
        {
          path: "/dataMonitorInfo",
          name: "dataMonitorInfo",
          component: resolve =>
            require(['@/views/electricMonitor/dataMonitorInfo.vue'], resolve),
          meta: {
            title: '用电监测 - 数据监测 - 详情',
            requiresAuth: true
          }
        },
        // 用电监测 - 数据监测 - 详情
        {
          path: "/dataMonitorInfoecharts",
          name: "dataMonitorInfoecharts",
          component: resolve =>
            require(['@/views/electricMonitor/dataMonitorInfoecharts.vue'], resolve),
          meta: {
            title: '用电监测 - 数据监测 - 详情',
            requiresAuth: true
          }
        },
        // 用电监测 - 漏电自检记录
        {
          path: "/electricLeakageRecord",
          name: "electricLeakageRecord",
          component: resolve =>
            require(['@/views/electricMonitor/electricLeakageRecord.vue'], resolve),
          meta: {
            title: '用电检测 - 漏电自检记录',
            requiresAuth: true
          }
        },
        // 远程控制 - 定时开关 
        {
          path: "/timeSwitch",
          name: "timeSwitch",
          component: resolve =>
            require(['@/views/remoteControl/timeSwitch.vue'], resolve),
          meta: {
            title: '远程控制 - 定时开关',
            requiresAuth: true
          }
        },
        // 远程控制 - 手动开关
        {
          path: "/manualSwitch",
          name: "manualSwitch",
          component: resolve =>
            require(['@/views/remoteControl/manualSwitch.vue'], resolve),
          meta: {
            title: '远程控制 - 手动开关',
            requiresAuth: true
          }
        },
        // 远程控制 - 手动开关 - 分路详情
        {
          path: "/manualSwitchInfo",
          name: "manualSwitchInfo",
          component: resolve =>
            require(['@/views/remoteControl/manualSwitchInfo.vue'], resolve),
          meta: {
            title: '远程控制 - 手动开关 - 分路详情',
            requiresAuth: true
          }
        },
        // 远程控制 - 阈值设置
        {
          path: "/thresholdSet",
          name: "thresholdSet",
          component: resolve =>
            require(['@/views/remoteControl/thresholdSet.vue'], resolve),
          meta: {
            title: '远程控制 - 阈值设置',
            requiresAuth: true
          }
        },
        // 远程控制 - 漏保自检  
        {
          path: "/notCoveredChecking",
          name: "notCoveredChecking",
          component: resolve =>
            require(['@/views/remoteControl/notCoveredChecking.vue'], resolve),
          meta: {
            title: '远程控制 - 漏保自检',
            requiresAuth: true
          }
        },
        // 电器电箱 - 电箱信息
        {
          path: "/electricBoxInfo",
          name: "electricBoxInfo",
          component: resolve =>
            require(['@/views/electricalApplianceBox/electricBoxInfo.vue'], resolve),
          meta: {
            title: '电器电箱 - 电箱信息',
            requiresAuth: true
          }
        },
        // 电器电箱 - 电器信息
        {
          path: "/electricImplementInfo",
          name: "electricImplementInfo",
          component: resolve =>
            require(['@/views/electricalApplianceBox/electricImplementInfo.vue'], resolve),
          meta: {
            title: '电器电箱 - 电器信息',
            requiresAuth: true
          }
        },
        // 综合报警 - 报警分类  
        {
          path: "/alarmProcessingwy",
          name: "alarmProcessingwy",
          component: resolve =>
            require(['@/views/alarmProcessing/alarmProcessingwy.vue'], resolve),
          meta: {
            title: '报警分类 报警处理',
            requiresAuth: true
          }
        },
        // 综合报警 - 已经检修报警信息  
        {
          path: "/Overhaul",
          name: "Overhaul",
          component: resolve =>
            require(['@/views/alarmProcessing/Overhaul.vue'], resolve),
          meta: {
            title: '综合报警 - 已经检修报警信息',
            requiresAuth: true
          }
        },
        // 综合报警 - 已经删除报警信息
        {
          path: "/oldDeleted",
          name: "oldDeleted",
          component: resolve =>
            require(['@/views/alarmProcessing/oldDeleted.vue'], resolve),
          meta: {
            title: '综合报警 - 已经删除报警信息',
            requiresAuth: true
          }
        },
        // 报警分析 - 分析预览
        {
          path: "/analysisPreview",
          name: "analysisPreview",
          component: resolve =>
            require(['@/views/alarmAnalysis/analysisPreview.vue'], resolve),
          meta: {
            title: '报警分析 - 分析预览',
            requiresAuth: true
          }
        },
        // 报警分析 - 走势分析
        {
          path: "/trendAnalysis",
          name: "trendAnalysis",
          component: resolve =>
            require(['@/views/alarmAnalysis/trendAnalysis.vue'], resolve),
          meta: {
            title: '报警分析 - 走势分析',
            requiresAuth: true
          }
        },
        // 能耗分析 - 能耗趋势    
        {
          path: "/trend",
          name: "trend",
          component: resolve =>
            require(['@/views/energyConsumption/trend.vue'], resolve),
          meta: {
            title: '能耗分析 - 能耗趋势 ',
            requiresAuth: true
          }
        },
        // 能耗分析 - 线路能耗
        {
          path: "/LineEnergyConsumption",
          name: "LineEnergyConsumption",
          component: resolve =>
            require(['@/views/energyConsumption/LineEnergyConsumption.vue'], resolve),
          meta: {
            title: '能耗分析 - 线路能耗',
            requiresAuth: true
          }
        },
        // 能耗分析 - 能耗波动
        {
          path: "/wave",
          name: "wave",
          component: resolve =>
            require(['@/views/energyConsumption/wave.vue'], resolve),
          meta: {
            title: '能耗分析 - 能耗波动',
            requiresAuth: true
          }
        },
        // 能耗分析 - 无功功率
        {
          path: "/reactivePower",
          name: "reactivePower",
          component: resolve =>
            require(['@/views/energyConsumption/reactivePower.vue'], resolve),
          meta: {
            title: '能耗分析 - 无功功率',
            requiresAuth: true
          }
        },
        // 系统管理 - 角色管理
        {
          path: "/roleManagement",
          name: "roleManagement",
          component: resolve =>
            require(['@/views/systemManagement/roleManagement.vue'], resolve),
          meta: {
            title: '系统管理 - 电箱计数',
            requiresAuth: true
          }
        },
        ,
        // 系统管理 - 角色绑定设备
        {
          path: "/roleBindEq",
          name: "roleBindEq",
          component: resolve =>
            require(['@/views/systemManagement/roleBindEq.vue'], resolve),
          meta: {
            title: '系统管理 - 电箱计数',
            requiresAuth: true
          }
        },
        // 系统管理 - 电箱计数
        {
          path: "/electricBoxCount",
          name: "electricBoxCount",
          component: resolve =>
            require(['@/views/systemManagement/electricBoxCount.vue'], resolve),
          meta: {
            title: '系统管理 - 电箱计数',
            requiresAuth: true
          }
        },

        // 电量波动 - 电箱波动
        {
          path: "/electricBox",
          name: "electricBox",
          component: resolve =>
            require(['@/views/volatility/electricBox.vue'], resolve),
          meta: {
            title: '电量波动 - 电箱波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路波动
        {
          path: "/lineWave",
          name: "lineWave",
          component: resolve =>
            require(['@/views/volatility/lineWave.vue'], resolve),
          meta: {
            title: '电量波动 - 线路波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路温度
        {
          path: "/lineWendu",
          name: "lineWendu",
          component: resolve =>
            require(['@/views/volatility/lineWendu.vue'], resolve),
          meta: {
            title: '电量波动 - 线路温度',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路总无功波动
        {
          path: "/lineTotalReactive",
          name: "lineTotalReactive",
          component: resolve =>
            require(['@/views/volatility/lineTotalReactive.vue'], resolve),
          meta: {
            title: '电量波动 - 线路总无功波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 象限无功总电量波动
        {
          path: "/lineQuadrantReactive",
          name: "lineQuadrantReactive",
          component: resolve =>
            require(['@/views/volatility/lineQuadrantReactive.vue'], resolve),
          meta: {
            title: '电量波动 - 象限无功总电量波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路反向有功总电量波动
        {
          path: "/lineReverseActive",
          name: "lineReverseActive",
          component: resolve =>
            require(['@/views/volatility/lineReverseActive.vue'], resolve),
          meta: {
            title: '电量波动 - 线路反向有功总电量波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路电压波动
        {
          path: "/lineVoltage",
          name: "lineVoltage",
          component: resolve =>
            require(['@/views/volatility/lineVoltage.vue'], resolve),
          meta: {
            title: '电量波动 - 线路电压波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路电流波动
        {
          path: "/lineCurrent",
          name: "lineCurrent",
          component: resolve =>
            require(['@/views/volatility/lineCurrent.vue'], resolve),
          meta: {
            title: '电量波动 - 线路电流波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路有功功率波动
        {
          path: "/lineActive",
          name: "lineActive",
          component: resolve =>
            require(['@/views/volatility/lineActive.vue'], resolve),
          meta: {
            title: '电量波动 - 线路有功功率波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路无功功率波动
        {
          path: "/lineReactive",
          name: "lineReactive",
          component: resolve =>
            require(['@/views/volatility/lineReactive.vue'], resolve),
          meta: {
            title: '电量波动 - 线路无功功率波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 线路漏电流波动
        {
          path: "/lineLeakageCurrent",
          name: "lineLeakageCurrent",
          component: resolve =>
            require(['@/views/volatility/lineLeakageCurrent.vue'], resolve),
          meta: {
            title: '电量波动 - 线路漏电流波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 三象限线路总功功率波动
        {
          path: "/lineThreePhasePower",
          name: "lineThreePhasePower",
          component: resolve =>
            require(['@/views/volatility/lineThreePhasePower.vue'], resolve),
          meta: {
            title: '电量波动 - 三象限线路总功功率波动',
            requiresAuth: true
          }
        },
        // 电量波动 - 三象限线路总无功功率波动
        {
          path: "/lineThreephaseNoPower",
          name: "lineThreephaseNoPower",
          component: resolve =>
            require(['@/views/volatility/lineThreephaseNoPower.vue'], resolve),
          meta: {
            title: '电量波动 - 三象限线路总无功功率波动',
            requiresAuth: true
          }
        },
        // 用户报表 - 用户报表
        {
          path: "/usersReport",
          name: "usersReport",
          component: resolve =>
            require(['@/views/usersReport/usersReport.vue'], resolve),
          meta: {
            title: '用户报表 - 用户报表',
            requiresAuth: true
          }
        }
      ]
    },
    // 3D - 线路能耗
    {
      path: "/tDenergyConsumption",
      name: "tDenergyConsumption",
      component: resolve =>
        require(['@/views/threeDechars/tDenergyConsumption.vue'], resolve),
      meta: {
        title: '3D - 线路能耗',
        requiresAuth: true
      }
    },
    // 首页
    {
      path: "/home",
      name: "home",
      component: resolve =>
        require(['@/views/home - 原版.vue'], resolve),
      meta: {
        title: '数据统计',
        requiresAuth: true
      }
    },
    // 功能页
    {
      path: "/index",
      name: "index",
      component: resolve =>
        require(['@/views/index.vue'], resolve),
      meta: {
        title: '数据统计',
        requiresAuth: true
      }
    },
    // 登录
    {
      path: "/",
      name: "login",
      component: resolve =>
        require(['@/views/login.vue'], resolve),
      meta: {
        title: '登录'
      },
    },
    // 404
    {
      path: "*",
      name: "404",
      component: resolve =>
        require(['@/views/_404.vue'], resolve),
      meta: {
        title: '404'
      },
    }
  ],
  // 前进后退是定位到原来位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + '- 裕茂优管理系统'
  } else {
    document.title = '裕茂优管理系统'
  }
  //获取localStorage里面的token
  let token = localStorage.getItem("token");
  //判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      localStorage.clear();
      ElementUI.Message.error("登录已失效，请重新登录");
      next({
        path: '/',
        query: { redirect: to.fullPath }  // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    }
  } else {
    next();// 没有启动守卫 - 随他去吧
  }
})

export default router