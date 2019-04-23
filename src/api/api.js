import axios from 'axios'
import { Message } from 'element-ui'

// http requser 拦截器
axios.interceptors.request.use((config) => {
    // token 配置

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
                Message.error('未授权，请重新登录')
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

 export function get(url, params = {}) {
     return new Promise((resolve, rejects) => {
         axios.get(url).then((res) => {
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

}
