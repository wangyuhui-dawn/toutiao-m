<template>
    <div class="login-container">
        <!--导航栏-->
        <van-nav-bar
                class="app-nav-bar"
                title="注册/登录"
                left-arrow
                @click-left="$router.back()"
        />
        <!--导航栏-->
        <!--登录表单-->
        <!--
           基于vant的表单验证
           1.使用van-form组件包裹所有的表单项van-field
           2.给van-form绑定submit事件
             当表单提交的时候会触发submit事件
             提示：只有 表单验证通过，他才会调用submit
             3.使用field rules属性定义校验规则
        -->
        <van-form :show-error="false" :show-error-message="false" @failed="onFailed" @submit="onLogin" validate-first
        ref="loginFormRef">
            <van-field
                    v-model="user.mobile"
                    icon-prefix="toutiao"
                    left-icon="shouji"
                    name="mobile"
                    center
                    placeholder="请输入手机号"
                    :rules="formRules.mobile"
            />
            <van-field
                    v-model="user.code"
                    icon-prefix="toutiao"
                    clearable
                    name="code"
                    center
                    left-icon="yanzhengma"
                    placeholder="请输入验证码"
                    :rules="formRules.code"
            >
                <template #button>
                    <van-count-down :time="60000"  format="ss s" v-if="isCountShow" @finish="isCountShow=false"/>
                    <van-button size="small" round class="send-btn" @click.prevent="onSendSms" v-else :loading="isSendSmsLoading">发送验证码</van-button>
                </template>
            </van-field>
            <div class="login-btn-wrap">
                <van-button type="info" block class="login-btn">登录</van-button>
            </div>
        </van-form>
        <!--登录表单-->
    </div>
</template>
<script>
    import {login,sendSms} from '@/api/user'
    import { Toast } from 'vant';
    export default {
        name: "LoginIndex",
        data(){
            return {
                user:{
                    mobile:'',//手机号
                    code:''//验证码
                },
                formRules:{
                    mobile:[
                        {
                            required:true,
                            message:'请输入手机号'
                        },
                        {
                            pattern:/^1[3|4|5|7|8][0-9]{9}$/,
                            message:'手机号格式错误'
                        }
                    ],
                    code:[
                        {
                            required:true,
                            message:'请输入验证码'
                        },
                        {
                            pattern:/^\d{6}$/,
                            message:'验证码格式错误'
                        }
                    ]
                },
                isCountShow:false,//控制倒计时的显示与隐藏
                isSendSmsLoading:false//控制按钮加载状态的显示与隐藏
            }
        },
        methods:{
            async onLogin(){
                Toast.loading({
                    message: '登录中...',//提示文本
                    forbidClick: true,//禁止背景点击
                    duration:0//持续时间 0就是不消失
                });
                /*
                * 1.找到数据接口
                * 2.封装请求方法
                * 3.请求调用登录
                * 4.处理相应结果
                * */
                try{
                    const {data}=await login(this.user)
                    console.log(res);
                    Toast.success('登录成功')
                    this.$store.commit('setUser',data.data)
                }catch (e) {
                    console.log(e);
                    console.log('登录失败',e);
                    Toast.fail('登录失败,手机号或验证码错误')
                }
            },
            onFailed(err){
                if(err.errors[0]){
                    Toast({
                        message:err.errors[0].message,
                        position:'top'
                    })
                }
              /*  console.log(err);*/
            },
            async onSendSms(){
                try{
                    //校验手机号
                    const data=await this.$refs.loginFormRef.validate('mobile')
                    /*验证通过，请求发送验证码*/
                    this.isSendSmsLoading=true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
                    const res=await sendSms(this.user.mobile)
                    console.log(res);
                    /*   console.log(data);//undefined*/
                    /*短信发出去了，隐藏发送按钮，显示倒计时*/
                    this.isCountShow=true
                    /*倒计时结束，显示发送按钮，隐藏倒计时  监听倒计时组件的finish事件*/
                }catch (err) {
                    //try 里面任何代码的错误都会进入catch
                    //不同的错误需要有不同的提示，那就需要判断了
                  let message='';
                  if(err&&err.response&&err.response.status===429){
                      /*发送验证码错误*/
                      message='发送太频繁了,请稍后重试!'
                  }else if(err.name==='mobile'){
                      /*校验手机号错误*/
                      message=err.message
                  }else{
                      /*未知情况*/
                      message='发送失败,请稍后重试!'
                  }
                    Toast({
                        message,
                        position:'top'
                    })
                }
                //校验通过->请求发送验证码->用户接收短信->输入验证码->请求登录
                //请求发送验证码->隐藏发送按钮->显示倒计时
                //倒计时结束->显示发送按钮，隐藏倒计时

                // 无论发送验证码成功还是失败，最后都要关闭发送按钮的 loading 状态
                this.isSendSmsLoading=false
            }
        }
    }
</script>
<style scoped lang="less">
.login-container{
    .send-btn{
        width:76px;
        height: 23px;
        background-color: #ededed;
        .van-button__text{
            font-size: 11px;
            color: #666666;
        }
    }
    .login-btn-wrap {
        padding: 25px 16px;
        .login-btn {
            background-color: #6db4fb;
            border: none;
            .van-button__text {
                font-size: 15px;
            }
        }
    }
}
</style>
