// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// el ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// vuex
import store from './store/index'

// 组件网站标题
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('token');
  }
  let token = sessionStorage.getItem('token');
  if (!token && to.path != '/login') {
    next({ path: '/login' });
  } else {
    next();
  }
})

// api
import {server} from 'api/api'
Vue.prototype.$server = server

// 倒计时退出
var times = 3300
function logOut () {
  times -- ;
  if (times == 0) {
    console.log('token已过期')
    console.log(router)
    sessionStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push({path: '/login'})
    alert('登录验证已过期，请重新登录')
    // 重置
    times = 3300
  } 
}
setInterval(logOut, 1000)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
