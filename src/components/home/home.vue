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
                                    {{userInfo.teacher.teaName}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <span @click="handlechangePwd()">修改密码</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item divided>
                                        <span  @click="logout()">退出登录</span>
                                    </el-dropdown-item>
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
        <el-dialog
            title="修改密码"
            :visible.sync="isChangPwdShow"
            width="30%"
            :before-close="handleClose">
            <div class="content">
                <el-form label-width="80px">
                    <el-form-item label="电话">
                        <el-input disabled name="telephone" v-model="changePwdInfo.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="原密码">
                        <el-input name="oldPassword" type="password" v-model="changePwdInfo.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input name="newPassword" type="password" v-model="changePwdInfo.newPassword"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isChangPwdShow = false">取 消</el-button>
                <el-button type="primary" @click="changePwd()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import myAside from 'common/myAside/myAside';
export default {
    name: 'home',
    components: {
        myAside
    },
    data () {
        return {
            routerName: '首页',
            userInfo: {},  // 用户信息
            isChangPwdShow: false,
            changePwdInfo: {
                telephone: '',
                oldPassword: '',
                newPassword: '',
            }
        }
    },
    methods: {
        handleClose () {
            this.isChangPwdShow = true
        },
        changePwd () {
            if (this.changePwdInfo.oldPassword == '') {
                this.tips('请输入原密码', 'warning');
                return;
            } else if (this.changePwdInfo.newPassword == '') {
                this.tips('请输入新密码', 'warning');
                return
            } else if (this.changePwdInfo.oldPassword == this.changePwdInfo.newPassword) {
                this.tips('新旧密码不能一样', 'warning');
                return
            } else if (this.changePwdInfo.oldPassword.length < 6 && this.changePwdInfo.newPassword.length < 6) {
                this.tips('密码长度不能小于六位', 'warning');
                return;
            } else {
                this.$loading({
                    lock: true,
                    text: 'Loading'
                });
                console.log(this.changePwdInfo)
                let parmas = new URLSearchParams;
                parmas.append('telephone', this.changePwdInfo.telephone);
                parmas.append('newPassword', this.changePwdInfo.newPassword);
                parmas.append('oldPassword', this.changePwdInfo.oldPassword);

                this.$server.updatePassword(parmas).then((res) => {
                    console.log(res)
                    if (res.status) {
                        this.tips('修改成功，请重新登录', 'success');
                        this.isChangPwdShow = false;
                        this.$router.push({path: '/login'});
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('token');
                        this.$loading().close();
                    } else {
                        this.tips('修改失败', 'error');
                        this.isChangPwdShow = false;
                        this.$loading().close();
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        handlechangePwd () {  // 修改密码
            this.isChangPwdShow = true
            console.log(this.userInfo)
            this.changePwdInfo.telephone = this.userInfo.teacher.telephone

        },
        logout () {  // 退出登录
            this.$confirm('是否退出登录吗？, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '成功退出!'
                });
                sessionStorage.removeItem('token')
                localStorage.removeItem('user')
                this.$router.push({path: '/login'})

            }).catch(() => {
                  
            });
        },
        tips (_val, _type) {
            this.$message({
                message: _val || '成功',
                type: _type || 'success'
            })
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

        // 获取用户信息
        this.userInfo = JSON.parse(localStorage.getItem('user')) || {teacher: {teaName: 'username'}}
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
