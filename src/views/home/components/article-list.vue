<template>
    <div class="article-list">
        <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh" :success-text="successText"
        :success-duration="1500">
        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <article-item v-for="(article,index) in articles" :key="index" :article="article"></article-item>
           <!-- <van-cell v-for="(article,index) in articles" :key="index" :title="article.title" />-->
        </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
    import {getArticles} from "@/api/article";
    import ArticleItem from '@/components/article-item'
    export default {
        name: "ArticleList",
        props:{
            channel:{
                type:Object,
                required:true
            }
        },
        components:{
            ArticleItem
        },
        data(){
            return {
                articles: [],//数据列表
                loading: false,//控制加载中的loading状态
                finished: false,//控制加载结束的状态，当加载结束，不在触发加载更多
                pretimestamp:null,//获取下一页数据的时间戳
                isRefreshLoading:false,
                successText:''//下拉刷新成功的提示文本
            }
        },
        methods:{
            async onLoad() {
                // 异步更新数据
                // 1.请求获取数据
                const {data}=await getArticles({
                    channel_id:this.channel.id,
                    timestamp:this.pretimestamp||Date.now(),//时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳,timeStamp相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
                    with_top:1
                })
                /*console.log(data);*/
                //2.把数据放到list数组中  //注意是push进去的
                const {results}=data.data
                this.articles.push(...results)//合并数组
                // 3.设置本次加载状态结束,他才可以判断是否需要加载下一次，否则就会永远的停在这里
                this.loading=false
                // 4.数据全部加载完成
                if(results.length){
                    //更新获取下一页数据的页码
                    this.pretimestamp=data.data.pre_timestamp
                }else{
                    //没有数据了，把加载状态设置结束，不再触发加载更多
                    this.finished=true
                }
            },
            async onRefresh(){
               /* console.log('onRefresh');*/
                //下拉刷新，组件自己就会展示loading状态
                //1.请求获取数据
                const {data}=await getArticles({
                    channel_id:this.channel.id,
                    timestamp:Date.now(),
                    with_top:1
                })
                // 2.把数据放到数据列表中(往顶部追加)
                const {results}=data.data
                this.articles.unshift(...results)

                 //3.关闭刷新的状态loading
                this.isRefreshLoading=false
                //展示更新成功的文字提示
                this.successText=`更新了${results.length}篇文章`
              /*  this.$toast(`更新了${results.length}篇文章`);*/
            }
        }
    }
</script>

<style scoped lang="less">
.article-list{
  position:fixed;
    left: 0px;
    right: 0px;
    bottom: 56px;
    top: 90px;
    overflow-y: auto;
}
</style>
