import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socketData:[],
  },
  mutations: {
    setsocketData (state,sdata){
      state.socketData = sdata;
    }
  },
  actions: {}
});
