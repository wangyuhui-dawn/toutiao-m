/*
* 搜索相关请求模块
* */
import request from '@/utils/request'
/*
* 搜索获取联想建议
* */
  export const getSuggestion=q=>{
      return request({
          method:'GET',
          url:'/app/v1_0/suggestion',
          params:{
              q
          }
      })
  }
  /*
  * 获取搜索结果
  * */
  export const getSearchResult=params=>{
      return request({
          method:'GET',
          url:'/app/v1_0/search',
          params
      })
  }
  /*
  * 获取所有历史记录
  * */
  export const getSearchHistories=()=>{
      return request({
          method:'GET',
          url:'/app/v1_0/search/histories'
      })
  }
