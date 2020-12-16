<template>
    <div class="channel-edit">
        <van-cell center :border="false">
            <div slot="title" class="channel-title">我的频道</div>
            <van-button type="danger" size="small" round  plain @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
            <van-grid-item
                    v-for="(channel,index) in userChannels"
                    :key="index"
                    :text="channel.name"
                    class="grid-item"
                    :class="{active:index===active}"
                    :icon="(isEdit&&index!==0)?'clear':''"
                    @click="onUserChannelClick(index,channel)"/>
        </van-grid>
        <van-cell  center :border="false">
            <div slot="title" class="channel-title">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10">
            <van-grid-item
                    v-for="(channel,index) in recommendChannels"
                    :key="index"
                    :text="channel.name"
                    class="grid-item"
                    @click="onAdd(channel)"/>
        </van-grid>
    </div>
</template>

<script>
    import {getAllChannels,addUserChannel,deleteUserChannel} from "@/api/channel";
    import {mapState} from 'vuex'
    import {setItem} from "@/utils/storage";

    export default {
        name: "channel-edit",
        props:{
            userChannels:{
                //短横线到组件中都会变为驼峰命名法
                type:Array,
                rquired:true
            },
            active:{
                type:Number,
                required:true
            }
        },
        data() {
            return {
                allChannels: [], //所有频道数据列表
                isEdit:false  //控制关闭按钮的显示与隐藏
            }
        },
        mounted(){
            this.loadAllChannels();
        },
        methods:{
            async loadAllChannels(){
                const {data}=await getAllChannels();
               this.allChannels=data.data.channels
            },
           async onAdd(channel){
                this.userChannels.push(channel)
                //todo  数据持久化
                if(this.user){
                    //登录了，发请求将数据持久化
                    await addUserChannel({
                        channels:[
                            {
                                id:channel.id,
                                seq:this.userChannels.length
                            }
                        ]
                    })
                }else{
                    //没有登录，将数组存入本地存储中
                    console.log('本地');
                    setItem('user-channels',this.userChannels)
                }
            },
            onUserChannelClick(index,channel){
                if(this.isEdit&&index!==0){
                    //如果是编辑状态，则删除
                    //由于推荐是不能删除的，默认存在的，所以对它不进行删除操作
                    this.deleteChannel(index,channel);
                }else {
                    //如果是非编辑状态，则切换频道
                    this.toggleChannel(index);
                }

            },
            async deleteChannel(index,channel){
                /*如果删除的是当前激活频道之前的频道*/
                if(index<=this.active){
                    this.$emit('update-active',this.active-1)
                }
                this.userChannels.splice(index,1);
                /*由于userChannel变化了,计算属性会重新计算值 也就是推荐频道会变化*/
                /*console.log('删除频道');*/
                //数据持久化
                if(this.user){
                    //登录了,持久化到线上
                   await deleteUserChannel(channel.id)
                }else{
                    //没有登录，持久化到本地
                    setItem('user-channels',this.userChannels)
                }
            },
            toggleChannel(index){
                /*把激活的标签index传给父组件home*/
                this.$emit('update-active',index)
                /*关闭弹出层*/
                this.$emit('closePopup')

                // console.log('切换频道');
            }
        },
        computed:{
            ...mapState(['user']),
            //推荐的频道列表
            //计算属性会观测内部数据的变化而变化（重新求值）
            recommendChannels(){
                //思路  所有频道-我的频道=剩下的推荐频道
                //filter方法 过滤数据，根据方法返回的布尔值true来收集数据
                //filter方法查找满足条件的所有元素
                return this.allChannels.filter(channel=>{
                    //判断channel是否属于用户频道
                    //find方法查找满足条件的单个元素
                    return !this.userChannels.find(userChannel=>{
                        //找到满足该条件的元素
                        return userChannel.id===channel.id
                        //用户频道(我的频道)  和  所有频道
                    })
                })
            }
        }
    }
</script>

<style scoped lang="less">
.channel-edit{
    padding-top:54px;
    .channel-title{
        font-size: 16px;
        color: #333333;
    }
    .grid-item{
        width: 80px;
        height: 43px;
        /deep/.van-grid-item__content{
            background-color: #f4f5f6;
            .van-grid-item__text{
                font-size: 14px;
                color:#222;
                margin-top: unset;
            }
        }
        /deep/.van-grid-item__icon{
            position: absolute;
            top: -8px;
            right:-8px;
            font-size: 20px;
            color: #ccc;
        }
    }
    .active{
        /deep/.van-grid-item__text{
            color: red !important;
        }
    }
}
</style>
