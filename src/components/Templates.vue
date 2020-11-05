<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>
  
  <script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "我是一个新的模板"
    };
  },
  // 数据监听
  watch: {},
  // dom/方法/属性监听
  computed:{},
  // 事件集
  methods: {},
  // 初始化数据 - 在dom加载完成后
  mounted() {},
  // 初始化数据 - 在dom加载完成前
  created() {}
};
</script>
  
 <style lang="less" scoped>
</style>
  