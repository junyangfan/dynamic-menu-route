import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//安装 element-ui 并使用
import ElementUI from "element-ui"
//引入element-ui里的样式
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


Vue.config.productionTip = false

//只要页面切换就执行的钩子
//根据权限动态添加路由(我们的路由要分成两部分：一部分是有权限的，另一部分是没有权限的)
router.beforeEach(async (to,from,next)=>{
  //判断当前有没有获取过权限，如果获取过了，就不要再获取了
  if(!store.state.hasRules){
    //获取权限，调用获取权限的接口，去action中获取数据
    await store.dispatch('getMenuList')
    //获得store中的异步方法
    let r = await store.dispatch('getAuthRoute')
    router.addRoutes(r) //history.resplace()
    next(); 
  }else{
    //如果已经获取了权限就可以访问页面了
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
