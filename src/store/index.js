import Vue from 'vue'
import Vuex from 'vuex'
import {getItem,setItem} from '@/utils/storage'
Vue.use(Vuex)
const USER_KEY='toutiao-user'
export default new Vuex.Store({
  state: {
    //响应式数据
   /* user:JSON.parse(window.localStorage.getItem('user')) //当前用户的登录状态(token等数据)*/
    user:getItem(USER_KEY)
  },
  mutations: {
    setUser(state,data){
      state.user=data
      //为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，实现数据的持久化
   /*   window.localStorage.setItem('user',JSON.stringify(state.user))*/
      setItem(USER_KEY,state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
