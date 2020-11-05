<template>
  <div id="app">
    <router-view />
  </div>
</template>

  <script>
export default {

  // 监听报警信息
  watch: {
    count(newCount, oldCount) {
      // console.log(newCount,oldCount)
      if (newCount.type == "jing") {
        this.$notify.warning({
          title:
            newCount.desc +
            "-" +
            new Date(newCount.time * 1000).Format("yy-MM-dd hh:mm:ss"),
          type: "warning",
          duration: 0,
          message:
            ("i",
              { style: "color: teal" },
              "[" +
              this.getString1(this.hexCharCodeToStr(newCount.nid)) +
              newCount.mzname +
              "]" +
              " - 线路" +
              newCount.aa +
              " : " +
              newCount.beizhu)
        });
      }
    }
  },

  computed: {
    count() {
      return this.$store.state.socketData;
    }
  },

  created() {
    this.socket();
  },
};
</script>
<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }
}
.el-dialog__header {
  line-height: 0;
}
.el-table {
  .el-button {
    padding: 0;
  }
}
.el-table td,
.el-table th {
  font-size: 12px !important;
}
.el-table th {
  background: #fafafa !important;
}
.el-input__inner {
  height: 34px !important;
  line-height: 34px !important;
}
.el-select-dropdown__item {
  text-align: left;
}
.el-footer {
  height: 34px !important;
}
.el-footer /deep/ .el-pagination__editor.el-input .el-input__inner {
  height: 28px !important;
}
</style>
