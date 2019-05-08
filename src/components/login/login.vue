<template>
    <div class="login">
        <div class="l-main">
            <div class="l-title">
                <h3 style="margin-bottom: 15px;"> <span style="color: #f40;">HP</span> · <span style="color: #2b99ff;">广现专才考核系统</span></h3>
            </div>
            <div class="l-content">
                <form>
                    <div class="form-group">
                        <input type="text" name="telephone" v-model="loginInfo.telephone" class="form-control" maxlength="11" placeholder="请输入手机号码">
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" v-model="loginInfo.password" class="form-control" placeholder="请输入密码">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn" @click="login()">登录</button>
                        <!-- <p class="forget-paw">忘记密码</p> -->
                    </div>
                </form>
            </div>
        </div>
        <div class="l-footer">
            <p>Copyright © 2019.广现专才All rights reserved.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'login',
    data () {
        return {
            loginInfo: {
                telephone: '',
                password: ''
            }
        }
    },
    methods: {
        login () {
            if (this.loginInfo.telephone == '') {
                this.tips('请输入手机号码', 'error')
                return
            } else if (this.loginInfo.password == '') {
                this.tips('请输入密码', 'error')
                return
            } else {

                let params = new URLSearchParams
                params.append('telephone', this.loginInfo.telephone)
                params.append('password', this.loginInfo.password)

                axios.post('/login', params).then((res) => {
                    if (res.data.status) {
                        this.tips('登录成功', 'success')
                        // token
                        sessionStorage.setItem('token', res.data.token)
                        // 用户信息
                        // 到期时间转换
                        res.data.expiration ='token到期时间:'+ this.formatDate(res.expiration)
                        let user = {
                            expiration: res.data.expiration,
                            teacher: res.data.teacher
                        }
                        localStorage.setItem('user', JSON.stringify(user))
                        this.$router.push({path: '/index'})
                    } else {
                        this.tips('手机号码或者密码错误,请检查', 'error')
                    }
                }).catch((err) => {
                    console.log(err)
                })

            }
        },
        formatDate (value) {
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? ('0' + MM) : MM;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            let m = date.getMinutes();
            m = m < 10 ? ('0' + m) : m;
            let s = date.getSeconds();
            s = s < 10 ? ('0' + s) : s;
            return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        },
        tips (_val, _type) {
            this.$message({
                message: _val || '成功',
                type: _type || 'success'
            })
        }
    }
}
</script>

<style scoped>
.login {
    width: 100%;
    height: 100%;
    background-image: url("https://www.tanshangbiao.cn/project/images/bg-3.jpeg");
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
}
.l-main {
    width: 320px;
    background: #fff;
    box-shadow: 0px 2px 4px #ddd;
    text-align: center;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 4px;
}
.form-group {
    margin-bottom: 15px;
}
.form-control {
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;

}
.btn {
    width: 196px;
    padding: 6px 0px;
    background: #2b99ff;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 4px;
}
.forget-paw {
    text-align: right;
    cursor: pointer; 
    margin-right: 45px;
    color: #666;
}
.forget-paw:hover {
    transition: all .5s;
    color: #2b99ff;
}
.l-footer {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    font-size: 14px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
