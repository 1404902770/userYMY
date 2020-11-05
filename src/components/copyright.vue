<template>
  <!-- 底部的版权 -->
  <el-footer class="copyright">
    <p>
      <img src="../../public/static/images/jinghui.png" />Copyright © 2019-2020 <img style="width:20px;height:20px" src="../../public/static/images/logo.png"/>裕茂优科技秦皇岛有限公司 All rights reserved.
      <span @click="JumpRecordNo">    
        冀ICP备19037449号-1
      </span>
      <span @click="JumpPrivacy">隐私政策</span>
    </p>
  </el-footer>
</template>
  
  <script>
export default {
  name: "copyright",
  data() {
    return {};
  },
  // 数据监听
  watch: {},
  // dom/方法/属性监听
  computed: {},
  // 事件集
  methods: {
    // 跳转备案号
    JumpRecordNo(){
      window.open('http://beian.miit.gov.cn');
    },
    // 跳转隐私
    JumpPrivacy(){
      window.open('http://www.yumaoyou.com/privacyStatement.html');
    }
  },
  // 初始化数据 - 在dom加载完成后
  mounted() {},
  // 初始化数据 - 在dom加载完成前
  created() {}
};
</script>
  
 <style lang="less" scoped>
.el-footer.copyright {
  height: 28px !important;
}
.el-footer.copyright p {
  color: #b1b1b1;
  font-size: 12px;
  border-top: 1px solid #e6e6e6;
  line-height: 30px;
  img {
    vertical-align: middle;
    margin-right: 5px;
  }
  span {
    
    margin-left: 5px;
    cursor: pointer;
    &:hover{
      color: #388d8d;
    }
  }
}
</style>
  