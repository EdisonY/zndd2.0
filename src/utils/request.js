import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { Notification } from 'element-ui';
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)


service.interceptors.response.use((response) => {
    // 响应做些什么
    console.log(response);
    return response.data;
}, (err) => {
    // 状态码
    console.log(err);
    switch (err.response.status) {
        case 404:
        case 400:
            Message({ type: 'error', message: '客户端请求有语法错误，不能被服务器所理解' });
            break;
        case 403:
            Message.error({message:'权限不足,请联系管理员!'});
        case 504:
        case 505:
        case 500:
            Message({ type: 'error', message: '服务器发生不可预期的错误'});
            Notification.success({
                title: '注意',
                message: '服务器连接成功！'
            })
            break;
        default:
            Message.error({ message: '未知错误!'});
    }
})

// response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//     response => {
//         const res = response.data
//         console.log(response + '------------');
//         // if the custom code is not 20000, it is judged as an error.
//         if (res.code !== 20000) {
//             Message({
//             message: res.message || 'Error',
//             type: 'error',
//             duration: 5 * 1000
//             })

//             // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//             if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//             // to re-login
//             MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//                 confirmButtonText: 'Re-Login',
//                 cancelButtonText: 'Cancel',
//                 type: 'warning'
//             }).then(() => {
//                 store.dispatch('user/resetToken').then(() => {
//                 location.reload()
//                 })
//             })
//             }
//             return Promise.reject(new Error(res.message || 'Error'))
//         } else {
//             return res
//         }
//     },
//     error => {
//         console.log('err' + error) // for debug
//         Message({
//             message: error.message,
//             type: 'error',
//             duration: 5 * 1000
//         })
//         return Promise.reject(error)
//     }
// )

function apiAxios(method,url,params){
    return new Promise((resolve,reject) => {
        // if (params) {
        //   params = filterNull(params)
        // }
        axios({
            method: method,
            url: url,
            data: method === 'POST' || method === 'PUT' ? params : null,
            params: method === 'GET' || method === 'DELETE' ? params : null,
            baseURL: axios.default.baseUrl,
            withCredentials: true
        }).then(res => {
            resolve(res.data)  
        }).catch(err => {
            Notification.error({
                title: '服务器错误',
                message: err.response.data.message
            })
            // Notification.error({
            //     title: '警告',
            //     message: '服务器连接超时！尝试重新连接...'
            // })
            // console.log(err.response.data.message);
            reject(err)
        })
    })
}

// 返回在vue模板中的调用接口
export default {
    get: function (url, params) {
        return apiAxios('GET', url, params)
    },
    post2: function (url, params) {
        return apiAxios('POST', url, qs.stringify(params) )
    },
    post: function (url, params) {
        return apiAxios('POST', url, params )
    },
    put: function (url, params) {
        return apiAxios('PUT', url, params)
    },
    delete: function (url, params) {
        return apiAxios('DELETE', url, params)
    }
}

// export default service
