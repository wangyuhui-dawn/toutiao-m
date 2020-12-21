<template>
    <div class="search-results">
        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />
        </van-list>
    </div>
</template>

<script>
    import {getSearchResult} from "@/api/search";
    export default {
        name: "search-results",
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
                page:1,//页数
                per_page:10,
            }
        },
        props:{
          searchText:{
              type:String,
              required:true
          }
        },
        methods:{
            async onLoad() {
                // // 异步更新数据
                // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
                // setTimeout(() => {
                //     for (let i = 0; i < 10; i++) {
                //         this.list.push(this.list.length + 1)
                //     }
                //
                //     // 加载状态结束
                //     this.loading = false
                //
                //     // 数据全部加载完成
                //     if (this.list.length >= 40) {
                //         this.finished = true
                //     }
                // }, 1000)
                //1.请求获取数据
                const{data}=await getSearchResult({
                    page:this.page,
                    per_page:this.per_page,
                    q:this.searchText
                })
                console.log(data);
                //2.将数据放到数据列表中
                const {results}=data.data
                this.list.push(...results)
                //3.关闭本次loading
                this.loading=false
                //4.判断是否还有数据
                if(results.length){
                    //如果有，则更新获取下一页数据的页码
                    this.page++
                }else{
                    //如果没有，则把finished设置为true  关闭加载更多
                    this.finished=true
                }



            }
        }
    }
</script>

<style scoped lang="less">
    .search-results{
        position: fixed;
        right: 0px;
        left: 0px;
        top: 60px;
        bottom: 0px;
        overflow-y: auto;
    }
</style>
