import axios from 'axios'
import { Message } from 'element-ui'
import { POINT_CONVERSION_HYBRID } from 'constants';

// http requser 拦截器
axios.interceptors.request.use((config) => {
    // token 配置

    config.headers = {
        'token': sessionStorage.getItem('token')
    }
    return config
}, (err) => {
    alert('请求超时')
    return Promise.resolve(err)
})

// 响应拦截， 异常处理
axios.interceptors.response.use((data) => {
    return data
}, (err) => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                Message.error('错误请求')
            break;
            case 401:
                Message.error('操作权限不足')
                break;
            case 403:
                Message.error('拒绝访问')
                break;
            case 404:
                Message.error('请求错误,未找到该资源')
                break;
            case 405:
                Message.error('请求方法未允许')
                break;
            case 408:
                Message.error('请求超时')
                break;
            case 500:
                Message.error('服务器端出错')
                break;
            case 501:
                Message.error('网络未实现')
                break;
            case 502:
                Message.error('网络错误')
                break;
            case 503:
                Message.error('服务不可用')
                break;
            case 504:
                Message.error('网络超时')
                break;
            case 505:
                Message.error('http版本不支持该请求')
                break;
            default:
                Message.error(`连接错误${err.response.status}`)
        }
    } else {
        Message.error('服务器连接失败')
    }
})

/**
 *  封装 get 方法
 *  @returns { Promise }
 */

 export function get(url, params) {
     return new Promise((resolve, rejects) => {
         axios.get(url, {params: params}).then((res) => {
             resolve(res.data)
         }).catch((err) => {
             rejects(err)
         })
     })
 }

 /**
  *  封装 post 方法
  *  @returns { Promise }
  */

export function post(url, params ={}) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        })
    })
} 

/**
 *  api导出
 */
export const server = {
    /**
     * writer: 谭上彪
     * blog: www.tanshangbiao.cn
     */
    
     /**
      * token 登录
      * 接口地址： /login
      * 字段： telephone & password
      */
    // login (paramsObj) {
    //     return post('/login', paramsObj)
    // },
    /**
     * 
     * @param {Object} paramsObj 修改密码
     * 接口地址 /update/password
     * 字段 telephone newPassword oldPassword
     */
    updatePassword (paramsObj) {
        return post('/update/password', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 获取辅导信息
     * methods get
     * 
     */
    getTeaList (paramsObj) {
        return get('/teacher/list')
    },
    /**
     * 
     * @param {Object} paramsObj 删除辅导员信息
     * method get 
     * 
     */
    delTeaByteaUUID (paramsObj) {
        return get('/teacher/delete/'+ paramsObj.teaUUID)
    },
    /**
     *  获取全部年级列表
     *  接口地址 /class/get/grade
     */
    getAllGeadeList () {
        return get('/class/get/grade')
    },  
    /**
     * 
     * @param {Object} paramsObj 获取班级列表
     * methods get 
     * 字段 currentPage
     */
    getClassList (paramsObj) {
        return get('/class/query/class/' + paramsObj.currentPage)
    },
    /**
     * 
     * @param {Object} paramsObj 通过teaUUID获取年级
     * method get 
     * 接口地址 /class/get/grade
     */
    getGradeListByteaUUID (paramsObj) {
        return get('/class/get/grade?teaUUID=' + paramsObj.teaUUID)
    },
    /**
     * 
     * @param {Object} paramsObj 通过教师id和年级id 获取学生列表
     * method get
     * 接口地址 /class/list/by/tea/
     */
    getClassListByTeaUUID (paramsObj) {
        return get('/class/list/by/tea/'+ paramsObj.teaUUID + '/' + paramsObj.grade)
    },
    /**
     * 
     * @param {Object} paramsObj 通过年级查找班级
     * 接口地址 /class/list/by/{grade}/{currentPage}
     */
    getClassListByGrade(paramsObj) {  
        return get('/class/list/by/' + paramsObj.grade+'/'+ paramsObj.currentPage)
    },
    /**
     * 
     * @param {Object} paramsObj 更新班级信息
     * method post
     */
    upDateClassInfo (paramsObj) {
        return post('/class/update/class', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 添加班级
     * method post
     * 
     */
    addClassInfo (paramsObj) {
        return post('/class/add/class', paramsObj)
    },
    /**
     * 获取职位列表
     */
    getPositionList () {
        return get('/position/list')
    },
    /**
     * 
     * @param {Object} paramsObj 更新职位信息
     * method post
     */
    upDatePositionList (paramsObj) {
        return post('/position/update', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 添加职位信息
     * method post
     */
    addPosInfo (paramsObj) {
        return post('/position/add', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 根据班级获取学生列表
     * method get 
     * 字段
     * classUUID
     * pageNum
     * 接口地址  /student/list/{classUUID}/{pageNum}
     */
    getStuClassByClassUUID (paramsObj) {
        return get('/student/list/'+ paramsObj.classUUID + '/' + paramsObj.pageNum)
    },
    /**
     * 
     * @param {Object} paramsObj 查看学生职位信息
     * method get 
     * 字段 stuUUID
     * 接口地址 /position/getStuPositionInfo/{stuUUID}
     */
    getPosInfoBystuUUID (paramsObj) {
        return get('/position/getStuPositionInfo/' + paramsObj.stuUUID)
    },
    /**
     * 
     * @param {Object} paramsObj 学生职位升降
     * method post 
     * 接口地址 /position/record/update
     */
    upOrDownStuPos (paramsObj) {
        return post('/position/record/update', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 给学生添加新职位
     * method post
     * 接口地址 /position/record/add
     */
    addStuNewPos (paramsObj) {
        return post('/position/record/add', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 获取绩效分
     * 接口地址 /performance/get/stu/performance/by/{classUUID}/{date}/{pageNum}
     */
    getPerformanceByClassUUID (paramsObj) {
        return get('/performance/get/stu/performance/by/'+ paramsObj.classUUID+'/'+ paramsObj.date + '/' + paramsObj.pageNum)
    },
    /**
     * 
     * @param {Object} paramsObj 给学生添加绩效分
     * method post
     * 
     */
    addPerformanceScore (paramsObj) {
        return post('/performance/add', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 调整绩效分
     * method post
     * 接口地址 /performance/update/score
     */
    updatePerformanceScore (paramsObj) {
        return post('/performance/update/score', paramsObj)
    },
    /**
     * 
     * @param {Object} paramsObj 统计上个月的情况
     * method get
     * 接口地址 /statistics/checkIn/
     */
    lastMonStatistics (paramsObj) {
        return get('/statistics/checkIn/'+paramsObj.classUUID)
    },
    statisticsClassRecordInfo (paramsObj) {
        return get('/stipulation/record/statistics', paramsObj)
    },
    // writer: 潘光亮
    /**
     * 
     *  查看赏罚分类信息列表
     */
    
    getAward (paramsObj) {//获取赏罚分类信息列表
        return get('/stipulation/classify/list')
    },
    isClassify (paramsObj) {//查看赏罚分类信息列表
        return get('/stipulation/list/'+paramsObj.pagesNum)
    },
    inquire (paramsObj) {//sID查询赏罚分类信息
        return get('/stipulation/get/'+paramsObj.pagesNum)
    },
    isaddRegulations (paramsObj) {//增加赏罚分类信息列表
        return post('/stipulation/add',paramsObj)
    },
    isHandleEdit (paramsObj){ //修改赏罚分类信息
        return post('/stipulation/update',paramsObj)
    },
    recordAdd (paramsObj){
        return post('/stipulation/record/add',paramsObj)
    },
    inquireInfo(paramsObj){
        return post('/stipulation/record/list',paramsObj)
    },

    /**
     * 
     *  学生操作
     */
    classinfo (paramsObj) {
        return get('/student/list/'+paramsObj.classUUID+'/'+paramsObj.pageNum)
    },
    handleCurrentChange(paramsObj){
        return get('/student/list/'+paramsObj.classUUID+'/'+paramsObj.pageNum)
    },
    grade (paramsObj) {//获取对应年级
        return get('/class/get/grade/',paramsObj)
    },
    Gradeinfo (paramsObj) {//获取对应年级
        return get('/class/list/by/tea/'+paramsObj.teaUUID+'/'+paramsObj.grade)
    },
    isClassUUID (paramsObj) {//获取班级id
        return get('/class/query/class/'+paramsObj.currentPage)
    },
    thisAmend(paramsObj){
        return post('/student/update',paramsObj)
    },
    handleDelete(paramsObj){
        return get('/student/delete/'+paramsObj.stuUUID)
    },
    isDetails(paramsObj){ //详情
        return get('/stipulation/get/'+paramsObj.pagesNum)
    },


    Level(paramsObj){   //获取等级列表
        return get('/level/level/list')
    },
    ensureLevel(paramsObj){  //修改等级基本工资
        return post('/level/update/salary',paramsObj)
    },
    adjustment(){  //等级调整
        return get('/level/update')
    }
}   
