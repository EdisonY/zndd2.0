<template>
  <div :class="{'has-logo':showLogo}">
      
    <img src="../../../assets/basie/logo.png" class="logo">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        :router="true"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }      
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      this.$store.state.app.sidebar.opened = true
      return !this.sidebar.opened
    }
  }
}
</script>
<style>
.logo{width: 100%;}
.el-submenu__title{background: #192038 !important;}
.el-submenu__title i{color: #fff;}
#app .sidebar-container .el-submenu__title:hover{background-color:#192038 !important}
#app .sidebar-container .el-menu,#app .sidebar-container .el-submenu .el-menu-item{background-color: #000 !important;}
#app .sidebar-container .el-submenu .el-menu-item:hover,#app .sidebar-container .el-submenu .el-menu-item.is-active{background-color: #121626 !important;border:1px solid #29304D;border-left: 4px solid #333FFF;border-radius: 0 4px 4px 0;}
#app .sidebar-container .el-submenu .el-menu-item{min-width: 0px !important;height: 42px;margin: 7px 0;line-height: 38px;border:1px solid #000;border-left: 4px solid #000;font-size: 16px;}
</style>
