<!--vue使用--->
<template>
    <div style="height: 100%">

        <sm_xz_scroll  @draw_up="drawUp" @draw_down="drawDown">
            <li  v-for="(data,index) in dataList" :key="index">{{data.title}}</li>
            <!--      <div style="text-align: center">暂无数据</div>-->
        </sm_xz_scroll>

    </div>
</template>

<script>

    
    export default {
        name: "test",
        data(){
            return{
                len:0,
                count:10,
                dataList:[{title:1},{title:2},{title:3},{title:4},{title:4},{title:12},{title:15},{title:6},{title:7}]
            }
        },
        methods:{
            drawUp(callback){
                let _this=this;
                setTimeout(function () {

                    _this.dataList=[]
                    _this.count+=30;
                    for (let i =_this.count-10; i <(_this.count+30); i++) {
                        _this.dataList.push({title:i})
                    }
                    callback(true)
                },1000);
            },
            drawDown(callback){
                if(this.len>6){
                    callback(false,"我是有底线的！")
                    return
                }
                this.len++
                let _this=this;
                setTimeout(function () {
                    for (let i =_this.count; i <(_this.count+30); i++) {
                        _this.dataList.push({title:i})
                    }
                    _this.count=_this.count+30;
                    callback(true)
                },1000);
            }
        }
    };
</script>
<style scoped>
    li {
        list-style: none;
        float: left;
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
    }
    /*强行改变高度*/
    /deep/ .onscroll{
        height: 60%;
    }
    /deep/ .draw{
        height: 80%;
    }
</style>

