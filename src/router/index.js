import Vue from 'vue'
import Router from 'vue-router'

import home from 'components/home/home'
import index from 'components/home/pages/index/index'
// 登录
import login from 'components/login/login'
// 辅导员管理
import teacher from 'components/teacher/teacher'
// 班级管理
import stuClass from 'components/class/class'
// 辅导员班级管理 
import teaClass from 'components/class/teaClass/teaClass'
// 学生管理
import students from 'components/students/students'
// 职位管理
import position from 'components/position/position'
import stuPosition from 'components/position/pages/stuPosition'
// 赏罚管理
import rewards from 'components/rewards/rewards'
//学生赏罚管理
import stuRewards from 'components/rewards/stuRewards/stuRewards'
// 税率调整
import tax from 'components/tax/tax'
// 等级管理
import level from 'components/level/level'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login,
      hidden: true,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/',
      name: '首页',
      component: home,
      hidden: true,
      redirect: '/index',
      children: [
        {path: 'index', name: '', component: index, meta: {title: '首页'}}
      ]
    },
    {
      path: '/',
      name: '辅导员',
      icon: 'iconfont icon-jiaoshiguanli',
      component: home,
      meta: {
        title: '辅导员管理'
      },
      children: [
        {path: 'teacher', name: '辅导员管理', component: teacher, meta: {title: '辅导员管理'}}
      ]
    },
    {
      path: '/',
      name: '班级',
      icon: 'iconfont icon-banjiguanli',
      component: home,
      meta: {
        title: '班级管理'
      },
      children: [
        {path: 'stuClass', name: '班级管理', component: stuClass, meta: {title: '班级管理'}},
        {path: 'teaClass', name: '辅导员班级管理', component: teaClass, meta: {title: '辅导班级管理'}}
      ]
    },
    {
      path: '/',
      name: '学生',
      icon: 'iconfont icon-xuexiao_xuesheng',
      component: home,
      meta: {
        title: '学生管理'
      },
      children: [
        {path: 'students', name: '学生管理', component: students, meta: {title: '学生管理'}}
      ]
    },
    {
      path: '/',
      name: '职位',
      icon: 'iconfont icon-zhiwei',
      component: home,
      meta: {
        title: '职位管理'
      },
      children: [
        {path: 'position', name: '职位管理', component: position, meta: {title: '职位管理'}},
        {path: 'stuPosition', name: '学生职位管理', component: stuPosition, meta: {title: '学生职位管理'}}
      ]
    },
    {
      path: '/',
      name: '赏罚',
      icon: 'iconfont icon-jiangli2',
      component: home,
      meta: {
        title: '赏罚管理'
      },
      children: [
        {path: 'rewards', name: '赏罚管理', component: rewards, meta: {title: '赏罚管理'}},
        {path: 'stuRewards', name: '学生赏罚管理', component: stuRewards, meta: {title: '学生赏罚管理'}}
      ]
    },
    {
      path: '/',
      name: '税率',
      hidden: true,
      icon: 'iconfont icon-servicejinkoubaoshui',
      component: home,
      meta: {
        title: '税率管理'
      },
      children: [
        {path: 'tax', name: '税率管理', component: tax, meta: {title: '税率管理'}}
      ]
    },
    {
      path: '/',
      name: '等级',
      icon: 'iconfont icon-tubiaolunkuo-',
      component: home,
      meta: {
        title: '等级管理'
      },
      children: [
        {path: 'level', name: '等级管理', component: level, meta: {title: '等级管理'}}
      ]
    }
  ]
})
