/*项目主入口文件 webpack打包入口*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
/*加载全局样式(最好放到最后，方便去覆盖第三方样式)*/
import './styles/index.less'
/*自动设置rem基准值(html标签字体大小)*/
import 'amfe-flexible'
/*商品提示*/
Vue.config.productionTip = false
/*全局注册Vant中的组件*/
Vue.use(Vant)
/*创建Vue根实例*/
/*把App根组件渲染到#app节点*/
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
