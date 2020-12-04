/*请求模块*/
import axios from 'axios'
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


/*响应拦截器*/
/*导出*/
export default request
