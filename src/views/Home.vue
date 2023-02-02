<template>
  <div>
    <!-- <router-view></router-view> -->
    <el-menu default-active="2" class="el-menu-vertical-demo" :router="true">
      <template v-for="m in menuList">
        <!-- 渲染肯定是不能写死的，所以我使用之前封装过的递归组件，具体内容参考我的文章<Vue 递归组件(构建树形菜单)> -->
        <ReSubMenu :data="m" :key="m.auth" v-if="m.children"></ReSubMenu>
        <el-menu-item v-else :key="m.auth" :index="m.path">{{m.name}}</el-menu-item>
      </template>
    </el-menu>
    <router-view></router-view>
  </div>
  
</template>
<script>
//导入vuex中的方法，具体参考我的文章
import { mapState } from "vuex";
import ReSubMenu from "./ReSubMenu";
export default {
  name: "home",
  computed: {
    //根据后端传过来的数据来渲染Home
    ...mapState(["menuList"])
  },
  components: {
    ReSubMenu
  }
};
</script>