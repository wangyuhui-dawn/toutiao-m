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
        <h1 class="title">杜兰特伤愈回来，狂砍31分，6记3分</h1>
        <van-cell center class="user-info">
            <div slot="title" class="name">天涯小浪客</div>
            <van-image
                    src="https://img.yzcdn.cn/vant/cat.jpeg"
                    slot="icon"
                    round
                    class="avatar"
                    fit="cover"
            />
            <div slot="label" class="pubdata">14小时前</div>
            <van-button slot="default"
                        type="info"
                        round
                        size="small"
                        class="follow-button"
                        icon="plus"
            >关注</van-button>
        </van-cell>
        <div class="markdown-body">
            <p>hello</p>
            <p>llll</p>
        </div>
    </div>
</template>

<script>
    /*在组件中获取动态路由参数
    *方式1：this.$route.params.articleId
    *方式2  props传参   推荐   在路由表中添加props :true
    * */
    import './github-markdown.css'
    export default {
        name: "ArticleIndex",
        props:{
            articleId:{
                type:String,
                required:true
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
        .pubdata{
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
</style>
