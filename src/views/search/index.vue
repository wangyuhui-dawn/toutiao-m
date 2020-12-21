<template>
<div class="search-container">
    <!--搜索栏-->
    <van-search
            v-model="searchText"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch(searchText)"
            @cancel="$router.back()"
            @focus="isResultShow=false"
            background="#3296fa"
    />
    <!--Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。-->
    <!--搜索栏-->
    <!--搜索结果-->
    <search-results v-if="isResultShow" :search-text="searchText" ></search-results>
    <!--搜索结果-->

    <!--联想建议-->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"></search-suggestion>
    <!--怎么知道输入的内容发生变化了呢 不管怎样 先要知道输入的内容 所以将输入的内容传给联想建议组件-->
    <!--联想建议-->

    <!--历史记录-->
    <!--模板中的$event表示事件参数-->
    <search-history v-else :search-histories="searchHistories" @search="onSearch" @update-histories="searchHistories=$event"></search-history>
    <!--历史记录-->


</div>
</template>

<script>
    import SearchSuggestion from './components/search-suggestion'
    import SearchHistory from './components/search-history'
    import SearchResults from './components/search-results'
    import {getItem,setItem} from "@/utils/storage";
    import {getSearchHistories} from "@/api/search";
    import {mapState} from 'vuex'
    export default {
        name: "SearchIndex",
        data() {
            return {
                searchText: '',//搜索的文本
                isResultShow:false,//控制搜索结果的显示和隐藏
                searchHistories:[]//搜索历史数据
            }
        },
       mounted(){
            this.loadSearchHistories()
        },
        watch:{
          searchHistories(){
              setItem('search-histories',this.searchHistories)
          }
        },
        methods:{
            onSearch(searchText){
                /*把输入框设置为你要搜索的文本*/
                this.searchText=searchText
                const index=this.searchHistories.indexOf(searchText)
                if(index!==-1){
                    /*把重复项删除*/
                    this.searchHistories.splice(index,1)
                }
                /*把最新的搜索历史记录放到顶部*/
                this.searchHistories.unshift(searchText)
                console.log('onSearch');
                /*如果用户已登录  则把搜索历史记录存储到线上*/
                //提示   只要我们调用获取搜索结果的数据接口，后端会给我们自动存储用户的搜索历史记录
                //如果没有登录，则把搜索历史记录存储到本地
              /*  setItem('search-histories',this.searchHistories)*/
                /*展示搜索结果*/
                this.isResultShow=true
            },
            async loadSearchHistories(){
                //因为后端帮我们存储的用户搜索记录太少了(只有四条)
                //所以我们让后端返回的历史记录和本地的历史记录合并到一起
                //如果用户已登录
               const searchHistories=getItem('search-histories')||[]//如果有获取，没有就是空数组
               /* if(this.user){
                    const {data}=await getSearchHistories()
               /!*
               * 合并数组 ：[...数组1，...数组2]
               * 把set转为数组[...Set对象]
               * 数组去重：[...new Set([...数组1，...数组2])]
               * *!/
                /!*    console.log(data.data.keywords)*!/
                    searchHistories=[...new Set([...searchHistories,...data.data.keywords])]
                }*/

              this.searchHistories=searchHistories
            }
        },
        components:{
            SearchSuggestion,
            SearchHistory,
            SearchResults
        },
        computed:{
            ...mapState(['user'])
        }
    }
</script>

<style scoped lang="less">
.search-container{
    .van-search__action{
        color:#fff;
    }
}
</style>
