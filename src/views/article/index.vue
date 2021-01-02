<template>
    <div class="article-container">
        <!--导航栏-->
        <van-nav-bar
                class="app-nav-bar"
                title="文章详情"
                left-arrow
                @click-left="$router.back()"
        />
        <!--导航栏-->
        <h1 class="title">{{article.title}}</h1>
        <van-cell center class="user-info">
            <div slot="title" class="name">{{article.aut_name}}</div>
            <van-image
                    :src="article.aut_photo"
                    slot="icon"
                    round
                    class="avatar"
                    fit="cover"
            />
            <div slot="label" class="pubdate">{{article.pubdate|relativeTime}}</div>
            <van-button slot="default"
                        :type="article.is_followed?'default':'info'"
                        round
                        size="small"
                        class="follow-button"
                        :icon="article.is_followed?'':'plus'"
                        @click="handleFollow"
                        :loading="isFollowLoading"
            >{{article.is_followed?'已关注':'关注'}}</van-button>
        </van-cell>
        <div class="markdown-body" v-html="article.content" ref="articleContent">
        </div>
        <!--底部区域-->
        <div class="article-bottom">
            <van-button class="comment-btn" type="default" round size="small">
                写评论
            </van-button>
            <van-icon color="#777" name="comment-o" info="123"></van-icon>
            <van-icon
                    :color="article.is_collected?'orange':'#777'"
                    :name="article.is_collected?'star':'star-o'"
                    @click="onCollect"
            ></van-icon>
            <van-icon :color="article.attitude===1?'hotpink':'#777'" :name="article.attitude===1?'good-job':'good-job-o'" @click="onLike"></van-icon>
            <van-icon color="#777777" name="share" ></van-icon>
        </div>
        <!--底部区域-->
    </div>
</template>

<script>
    /*在组件中获取动态路由参数
    *方式1：this.$route.params.articleId
    *方式2  props传参   推荐   在路由表中添加props :true
    * */
    import './github-markdown.css'
    import {getArticleById,addCollect,deleteCollect,addLike,deleteLike} from "@/api/article"
    import { ImagePreview } from 'vant'
    import{addFollow,deleteFollow} from "@/api/user";

    export default {
        name: "ArticleIndex",
        props:{
            articleId:{
                type:[String,Object,Number],
                required:true
            }
        },
        data() {
            return {
                article: {},
                isFollowLoading:false
            }
        },
        mounted(){
            this.loadArticle();
        },
        methods:{
            async loadArticle(){
                const {data}=await getArticleById(this.articleId)
                // console.log(data);
                this.article=data.data

                //数据改变影响视图更新(DOM数据)不是立即的
                //所以如果需要在修改数据之后马上操作被该数据影响的视图DOM，需要把这个代码放到$nextTick中

                //this.$nextTick是Vue提供的一个方法
                this.$nextTick(()=>{
                  this.handleImagePreview()
                })
            },
            handleImagePreview(){
                //1.获取文章内容DOM容器
                const articleContent=this.$refs.articleContent
                //2.得到所有的img标签
                const imgs=articleContent.querySelectorAll('img')
               /* console.log(img);*/
                //3.循环img列表，给img注册点击事件
                const imgPath=[]//收集所有图片路径
                imgs.forEach((img,index)=>{
                   imgPath.push(img.src)
                    img.onclick=function () {
                        //4.在事件处理函数中调用ImagePreview()预览
                        ImagePreview({
                            images:imgPath,//预览图片路径列表
                            startPosition:index//起始位置
                        })
                    }
                })
            },
           async handleFollow(){
                this.isFollowLoading=true
                if(this.article.is_followed){
                    //如果关注了，取消关注
                    await deleteFollow(this.article.aut_id)
                }else{
                    //如果没有关注，关注
                    await addFollow(this.article.aut_id)
                }
                this.article.is_followed=!this.article.is_followed
               this.isFollowLoading=false
            },
            async onCollect(){
                this.$toast.loading({
                    message:'操作中...',
                    duration:0,   //表示提示不会消失，如果设置为1000 ,则展示1秒后消失
                    forbidClick:true
                })
                if(this.article.is_collected){
                    //如果收藏了，取消收藏
                    await deleteCollect(this.articleId)
                }else{
                    //如果没有收藏，收藏
                    await addCollect(this.articleId)
                }
                this.article.is_collected=!this.article.is_collected
                this.$toast.success(`${this.article.is_collected?'':'取消'}收藏成功`)
            },
            async onLike(){
                this.$toast.loading({
                    message:'操作中...',
                    duration:0,   //表示提示不会消失，如果设置为1000 ,则展示1秒后消失
                    forbidClick:true
                })
                if(this.article.attitude===1){
                    //已点赞，取消点赞
                    await deleteLike(this.articleId)
                    this.article.attitude=-1
                }else{
                    //没有点赞，点赞
                    await addLike(this.articleId)
                    this.article.attitude=1
                }
                this.$toast.success(`${this.article.attitude===1?'':'取消'}点赞成功`)
            }
        }
    }
</script>

<style scoped lang="less">
.title{
    padding: 14px;
    color: #3a3a3a;
    font-size: 20px;
    background-color: #fff;
    margin: unset;
}
    .user-info{
        .avatar{
            width: 35px;
            height: 35px;
            margin-right: 8px;
        }
        .name{
            font-size: 12px;
            color:#333333;
        }
        .pubdate{
            font-size: 11px;
            color:#b4b4b4
        }
        .follow-button{
            width: 85px;
            height: 29px;
        }
    }
.markdown-body{
    padding: 14px;
    background-color: #fff;
}
    .article-bottom{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        height: 44px;
        border-top: 1px solid #d8d8d8;
        background-color: #fff;
        .comment-btn{
            width: 141px;
            height: 23px;
            border:1px solid #eeeeee;
            font-size: 15px;
            line-height:23px;
            color:#a7a7a7;
        }
        .van-icon{
            font-size: 20px;
            .van-info{
                font-size: 11px;
                background-color: #e22829;
            }
        }
    }
</style>
