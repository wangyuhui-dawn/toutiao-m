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
            <article-list
                    :channel="channel"></article-list>
        </van-tab>
        <div slot="nav-right" class="wap-nav-wrap" @click="isChannelEditShow=true">
            <van-icon name="wap-nav" />
        </div>
    </van-tabs>
    <van-popup  :style="{height: '100%'}" v-model="isChannelEditShow" position="bottom"   closeable close-icon-position="top-left" get-container="body">
        <!--模板中的$event表示事件参数-->
         <channel-edit
                 :user-channels="channels"
                 @closePopup="isChannelEditShow=false"
                 @update-active="onUpdateActive"
                 :active="active"></channel-edit>
    </van-popup>
</div>
</template>

<script>
    import {getUserChannel} from "@/api/user";
    import ArticleList from './components/article-list'
    import ChannelEdit from './components/channel-edit'
    import {mapState} from 'vuex'
    import {getItem} from "@/utils/storage";
    export default {
        name: "HomeIndex",
        data(){
            return {
                active:0,//控制被激活的标签
                channels:[],
                isChannelEditShow:true
            }
        },
        components:{
            ArticleList,
            ChannelEdit
        },
        mounted(){
            this.loadChannels()
        },
        computed:{
            ...mapState(["user"])
        },
        methods:{
            async loadChannels(){
                let channels=[]
                if(this.user){
                    /*已登录，请求获取线上的用户频道列表数据*/
                    const {data}=await getUserChannel()
                    channels=data.data.channels
                }else{
                    /*没有登录，判断是否有本地存储的用户频道列表数据*/
                    const localUserChannels=getItem('user-channels')
                    /*如果有本地存储的频道列表则使用*/
                    if(localUserChannels){
                        channels=localUserChannels
                    }else{
                        /*用户没有登录，也没有本地存储的频道，那就请求获取默认推荐的频道列表*/
                        const {data}=await getUserChannel()
                        channels=data.data.channels
                    }
                }
              /*  console.log(data);*/
               /* this.channels=data.data.channels*/
                /*把处理好的数据放到模板中以供使用*/
                this.channels=channels
            },
            onUpdateActive(index){
                /*console.log(index);*/
                this.active=index

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
    .wap-nav-wrap{
        position: fixed;
        right: 0;
        width: 33px;
        height: 43px;
        background-color:#fff;
        opacity: 0.9;
        display: flex;
        justify-content: center;
        align-items: center;
        .van-icon{
            font-size: 24px;
        }
        &:before{
            content: '';
            width: 1px;
            height: 43px;
            background:url("./line.png") no-repeat;
            background-size: contain;
            position: absolute;
            left: 0px;
            top: 0px;
        }
    }
}
</style>
