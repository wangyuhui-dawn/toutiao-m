<template>
<div class="my-container">
<van-cell-group class="my-info" v-if="user">
    <van-cell
    center class="base-info"
    :border="false">
        <van-image
                class="avatar"
                slot="icon"
                width="50"
                height="50"
                round
                fit="cover"
                :src="currentUser.photo"
        />
        <div slot="title" class="name">{{currentUser.name}}</div>
        <van-button
                size="small"
                round
                class="update-btn"
        >编辑资料</van-button>
    </van-cell>
    <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
                  <div class="count">{{currentUser.art_count}}</div>
                <div class="text">头条</div>
            </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
                <div class="count">{{currentUser.follow_count}}</div>
                <div class="text">关注</div>
            </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
                <div class="count">{{currentUser.fans_count}}</div>
                <div class="text">粉丝</div>
            </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
                <div class="count">{{currentUser.like_count}}</div>
                <div class="text">获赞</div>
            </div>
        </van-grid-item>
    </van-grid>
</van-cell-group>
    <div class="not-login" v-else>
        <div @click="$router.push('/login')">
            <img src="./shouji.png" class="mobile">
        </div>
        <div class="text">
            登录/注册
        </div>
    </div>

    <van-grid :column-num="2" class="nav-grid mb-4">
        <van-grid-item icon-prefix="toutiao" text="收藏" icon="shoucang" class="nav-grid-item"/>
        <van-grid-item icon-prefix="toutiao" text="历史" icon="lishi" class="nav-grid-item"/>
    </van-grid>
    <van-cell title="消息通知" is-link to="/" />
    <van-cell title="小智同学" is-link to="/" class="mb-4"/>
    <van-cell v-if="user" title="退出登录" class="logout-cell" @click="loginOut"/>

</div>
</template>

<script>
    import {mapState} from 'vuex'
    /*import {getUserInfo} from "@/api/user"*/
    export default {
        name: "MyIndex",
        data(){
            return {
                currentUser:{
                    name:'随便来逛逛',
                    photo:'https://img.yzcdn.cn/vant/cat.jpeg',
                    art_count:50,
                    follow_count:189,
                    fans_count:256,
                    like_count:8456
                }
            }
        },
        mounted(){
            // this.loadCurrentUser()
        },
        computed:{
            ...mapState(['user'])
        },
        methods:{
            loginOut(){
                /*提示用户确认退出*/
                /*确认->处理退出*/
                this.$dialog.confirm({
                    title: '退出登录',
                    message: '确认退出登录？'
                })
                    .then(() => { //确认执行这里
                        // on confirm
                        //清除用户登录状态
                      this.$store.commit('setUser',null)
                    })
                    .catch(() => {
                        // on cancel
                    });
            }
           /* async loadCurrentUser(){
                const res=await getUserInfo();
                console.log(res);
            }*/

        }
    }
</script>

<style scoped lang="less">
.my-container{
   .my-info{
       background: url("./banner.png") no-repeat;
       background-size: cover;
       .base-info{
           box-sizing: border-box;
           height: 115px;
           padding-top: 38px;
           padding-bottom: 11px;
           background-color: unset;
           .avatar{
               box-sizing: border-box;
               width: 66px;
               height: 66px;
               border: 1px solid #fff;
               margin-right: 11px;
           }
           .name{
               color: white;
               font-size: 15px;
           }
           .update-btn{
               /*不设置宽，由内容撑开*/
               height: 16px;
               font-size: 10px;
               color: #666666;
           }
       }
       .data-info{
           .data-info-item{
               height:65px;
               color: #ffffff;
               .text-wrap{
                   display: flex;
                   flex-direction: column;
                   justify-content: center;
                   align-items: center;
                   .count{
                       font-size: 18px;
                   }
                   .text{
                       font-size: 11px;
                   }
               }
           }
       }
       /deep/ .van-grid-item__content{
           background-color: unset;
       }
   }
    .not-login{
        background: url("./banner.png");
        background-size: cover;
        height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .mobile{
            width: 66px;
            height: 66px;
        }
        .text{
            color:#fff;
            font-size: 14px;
        }
    }
    /deep/.nav-grid{
        .nav-grid-item{
            height: 70px;
           .toutiao{
                font-size: 22px;
            }
            .toutiao-shoucang{
                color:#eb5253;
            }
            .toutiao-lishi{
                color:#ff9d1d
            }
            .van-grid-item__text{
                font-size: 14px;
                color:#333333;
            }
        }
    }
    .logout-cell{
        text-align: center;
        color: #d86262;
    }
    .mb-4{
        margin-bottom: 4px;
    }
}

</style>
