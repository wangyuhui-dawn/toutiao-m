/*项目主入口文件 webpack打包入口*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/*加载全局样式*/
import './styles/index.less'
/*商品提示*/
Vue.config.productionTip = false
/*创建Vue根实例*/
/*把App根组件渲染到#app节点*/
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
