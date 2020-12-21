<template>
    <div class="search-suggestion">
       <van-cell icon="search"
                 v-for="(suggestion,index) in suggestions"
                 :key="index"
                 @click="$emit('search',suggestion)"
       >
           <div slot="title" v-html="highlight(suggestion)"></div>
       </van-cell>
    </div>
</template>

<script>
    import {getSuggestion} from "@/api/search";
    import {debounce} from 'lodash'
    export default {
        name: "search-suggestion",
        data() {
            return {
                suggestions:[]//联想建议数据列表
            }
        },
        props:{
            searchText:{
                type:String,
                required:true
            }
        },
        watch:{
            searchText:{
                /*当数据发生变化则会执行handler处理函数*/
                handler:debounce(async function(){
                    const{data}=await getSuggestion(this.searchText)
                    /*console.log(data);*/
                    this.suggestions=data.data.options
                },500),//意思是半秒内只能执行一次这个函数     debounce(function(){},时间)
                //该回调将会在侦听开始之后被立即调用
                immediate:true
              /* async handler(){
                    /!*console.log('hello');*!/
                    //找到数据接口

                   //请求获取数据
                    //模板绑定展示
                },*/


            }
        },
        methods:{
            highlight(suggestion){
                //a   /a/gi  vue /vue/gi
                //正则表达式 /中间的内容/
                //都会当做正则匹配模式字符来对待
                //   /this.searchText/gi就是错误的
                /*
                * RegExp是正则表达式的构造函数
                * 参数 1 字符串
                * 参数2  匹配模式
                * 返回值 正则对象
                * */
                return suggestion.replace(new RegExp(this.searchText,'gi'),`<span style="color:red">${this.searchText}</span>`)
            }
        }

    }
</script>

<style scoped>

</style>
