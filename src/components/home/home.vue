<template>
    <div class="home">
        <el-row>
            <!-- 侧栏 -->
            <el-col :span="4">
                <my-aside></my-aside>
            </el-col>
            <el-col :span="20">
                <!-- 头部 -->
                <div class="header">
                    <div class="router-info">
                        <h3>{{routerName}}</h3>
                    </div>
                    <div class="user-info">
                        <div class="user-avatar">
                            <img class="user-avater-img" src="https://www.tanshangbiao.cn/project/images/default-avatar.jpeg" width="40px" height="40px" alt="">
                        </div>
                        <div class="user-name">
                            <el-dropdown>
                                <span class="el-dropdown-link" style="cursor: pointer;">
                                    username<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>人信息</el-dropdown-item>
                                    <el-dropdown-item divided>退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
                <!-- 内容 -->
                <div class="main">
                    <router-view></router-view>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import myAside from 'common/myAside/myAside'
export default {
    name: 'home',
    components: {
        myAside
    },
    data () {
        return {
            routerName: '首页'
        }
    },
    watch: {
        // 路由名称监听
        $route: {
            handler (val, ) {
                this.routerName = val.meta.title || '首页'
            }
        }
    },
    created () {
        // 初始路由title
        this.routerName = this.$route.meta.title
    }
}
</script>

<style scoped>
.header {
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    box-shadow: 0px 2px 4px #ddd;
    
}
.header .router-info {
    float: left;
    display: flex;
    align-items: center;
    padding: 10px;
    height: 100%;
}
.header .user-info {
    float: right;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 5px 20px;
}
.user-avatar {
    margin-right: 5px;
}
.user-avater-img {
    border-radius: 50%;
}
.main {
    padding: 10px;
}
</style>
