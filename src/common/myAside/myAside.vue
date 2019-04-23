<template>
  <div class="myAside">
    <div class="header-logo" @click="toIndex">
        <h3> <span style="color: #f40;">HP</span> · <span style="color: #2b99ff;">广现专才考核系统</span></h3>
    </div>
    <el-menu 
            :default-active="$route.path"
            class="el-menu-vertical-demo" 
            @open="handleOpen" 
            @close="handleClose" 
            router
        >
            <template v-for="(item, index) in $router.options.routes" v-if="!item.hidden">
                <el-submenu :index="index+''" v-if="!item.leaf">
                    <template slot="title">
                        <i :class="item.icon" style="font-size: 18px;"></i>
                        <span slot="title">{{item.name}}</span>
                    </template>
                    <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
                </el-submenu>
            </template>
    </el-menu>

    <div class="footer-info">
        <span>Copyright © 2019.</span><span style="color: #2b99ff;">广现专才</span><span>All rights reserved.</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myAside',
    data() {
      return {
        isCollapse: false
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      toIndex () {
          this.$router.push({path: '/index'})
      }
    }
  }

</script>

<style scoped>
.myAside {
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
}
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
  }
.header-logo {
    height: 50px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    box-shadow: 0px 2px 4px #ddd;
    cursor: pointer;
}
.footer-info {
    background: #fff;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
}
</style>
