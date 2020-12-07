/*请求模块*/
import axios from 'axios'
import store from '@/store'
/*可以使用自定义配置新建一个 axios 实例*/
const request=axios.create({
    baseURL:'http://ttapi.research.itcast.cn/'
})
/*
* axios({
*
* })
* request({
*
* })
* 就相当于axios（{
* }）
*
*
* */
/*请求拦截器*/
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    /*config本次请求相关的数据*/
     const {user}=store.state
    /*如果用户已登录，统一给接口设置token信息*/
    if(user){
        config.headers.Authorization=`Bearer ${user.token}`
    }
    /*处理完之后把config返回,否则请求就会停在这里*/
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

/*响应拦截器*/
/*导出*/
export default request
