import Vue from 'vue'
import Vuex from 'vuex'

import {authRoutes} from './router'

//下载axios   npm i axios
//引入
import axios from "axios"

//重难点代码  很难理解 需要多看几遍慢慢理解
let formatMenuList = (menuList) => {
  //定义一个数组
  let arr = [];
  function r(pid) {
    //filter过滤数组，返回一个满足要求的数组
    return menuList.filter(menu => {
      //格式化菜单变成我们需要的结果
      if (menu.pid === pid) {
        //把后端返回的所有路径权限都放到数组中
        arr.push(menu.auth)
        let children = r(menu.id);
        menu.children = children.length ? children : null;
        return true;
      }
    })
  }
  //返回一个对象
  return { m: r(-1), a: arr };
}
//重难点代码
let getNeedRoutes = (auth)=>{ //['cart','cart-list'....]
  function r(authRoutes){
    return authRoutes.filter(route=>{
      if(auth.includes(route.name)){
        if(route.children){ //如果有儿子
          //找到儿子继续看子路由的权限
          route.children = r(route.children)
        }
        return true;  //有权限就返回
      }
    })
  }
  return r(authRoutes);
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuList: [],//存放菜单数据
    authList: [],//iview角色 admin
    hasRules: false//表示没有获取过权限，获取完毕后，把状态改成true
    
  },
  mutations: {
    //把传递过来的数据给state
    set_menuList(state, m) {
      state.menuList = m;
    },
    //把传递过来路由传给state并改变状态
    set_authList(state, a) {
      state.authList = a;
      state.hasRules = true;
    }
  },
  getters: {

  },
  actions: {
    //异步  async await 参考我的文章<异步解决方案>
    async getMenuList({ commit }) {
      //去server.js(后端api)获取数据
      let { data } = await axios.get('http://localhost:3000/role');
      // let menuList = data.menuList
      //把获取的数据传入上面写的方法里，转换格式
      // menuList = formatMenuList(menuList)
      //当把权限获取后改变上面的代码
      let { m, a } = formatMenuList(data.menuList);
      //配置完全局路由(main.js)后，可自己打印出来看一下
      // console.log(menuList);
      //打印看一下
      // console.log(m,a);
      //以下两行代码就可以让data里面有数据
      commit('set_menuList',m)
      commit('set_authList',a)
    },
    async getAuthRoute({commit,state}){
      //要拿到所有的权限的路由列表
      let r = getNeedRoutes(state.authList)
      //当前需要动态添加的路由
      return r;
    }
  }
})
