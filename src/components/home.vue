<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="signout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧 -->
      <el-aside :width="isCollapse?' 64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- <el-row class="tac"> -->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + items.path"
                v-for="items in item.children"
                :key="items.id"
                @click="saveNavState('/' + items.path)"
              >
                <i class="el-icon-s-grid"></i>
                <span>{{items.authName}}</span>
                <!-- {{items.path}} -->
              </el-menu-item>
            </el-submenu>
          </el-menu>
        <!-- </el-row> -->
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
           
<script>
import { menu_ios } from '@/api/index.js'
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的路由
      activePath: ''
    }
  },
  methods: {
    signout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await menu_ios()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      // 保存路由的激活状态
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>