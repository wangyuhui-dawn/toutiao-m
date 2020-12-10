<template>
<div class="home-container">
    <!--导航栏-->
    <van-nav-bar class="app-nav-bar">
        <van-button slot="title" type="info" icon-prefix="toutiao" icon="sousuo" round class="search-btn">搜索</van-button>
    </van-nav-bar>
    <!--文章频道列表-->
    <van-tabs v-model="active" class="channel-tabs">
        <!--tabs 组件 只有你第一次查看标签页的时候 才会渲染里面的内容  标签内容懒渲染-->
        <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id" class="tab-item">
            <!--文章列表-->
            <article-list :channel="channel"></article-list>
        </van-tab>
    </van-tabs>
</div>
</template>

<script>
    import {getUserChannel} from "@/api/user";
    import ArticleList from './components/article-list'
    export default {
        name: "HomeIndex",
        data(){
            return {
                active:0,//控制被激活的标签
                channels:[]
            }
        },
        components:{
            ArticleList
        },
        mounted(){
            this.loadChannels()
        },
        methods:{
            async loadChannels(){
                const {data}=await getUserChannel()
              /*  console.log(data);*/
                this.channels=data.data.channels
            }
        }
    }
</script>

<style scoped lang="less">
.home-container{
    /deep/.van-nav-bar__title{
        max-width: none;
    }
    .search-btn{
        width: 277px;
        height: 32px;
        background-color: #5babfb;
        border: none;
        .van-button__icon{
            font-size: 16px;
        }
        .van-button__text{
            font-size: 14px;
        }
    }
    .channel-tabs{
        /deep/.van-tab{
            border-right:1px solid #edeff3 ;
            border-bottom: 1px solid #edeff3;
        }
       /deep/ .van-tabs__line{
           bottom: 20px;
            width: 15px;
            height: 3px;
            background-color: #3296fa;
        }
    }
}
</style>
