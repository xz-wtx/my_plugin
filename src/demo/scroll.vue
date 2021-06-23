<!--vue使用--->
<template>
    <div style="height: 100%">

        <sm_xz_scroll  @draw_up="drawUp" @draw_down="drawDown" >

              <template v-slot:first>
                <div>首部数据</div>
              </template>

              <template v-slot:content >
                <li  v-for="(data,index) in dataList" :key="index">{{data.title}}</li>
              </template>

              <template v-slot:floor>
                <div>尾部数据</div>
              </template>


        </sm_xz_scroll>

    </div>
</template>

<script>

    import sm_xz_scroll from "../../plugin/scroll/sm_xz_scroll";
    export default {
        name: "test",
      components:{
        sm_xz_scroll
      },
        data(){
            return{
                len:0,
                count:10,
                dataList:[]
            }
        },
        methods:{
          //callback 1下次是否有数据，2提示，3是否空数据
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
                    callback(false,"我是有底线的！",this.dataList.length<=0)
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
        /*height: 60%;*/
    }
    /deep/ .draw{
        /*height: 80%;*/
    }
</style>

