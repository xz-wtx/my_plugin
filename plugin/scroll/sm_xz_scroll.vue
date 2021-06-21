<!--上下拉刷新-->
<template>
  <div style="height: 100%">
    <div id="first">
      <slot name="first"></slot>
    </div>

    <div class="scroll_div" id="scroll_div">
      <aside class="main" v-if="!pc">
        <div class="draw" id="draw" :style="{background:background}">
          <ul id="ul">  <!--ul不能指定高度-->
            <li class="draw_up">
              <div class="box">加载中
                <div class="loader-03">
                </div>
              </div>
            </li>
            <slot name="content"></slot>

            <li class="draw_down">{{hint==='加载中'?'':hint}}
              <div v-if="hint==='加载中'" class="box">加载中
                <div class="loader-03">
                </div>
              </div>
            </li>

          </ul>
        </div>
      </aside>


      <div id="onscroll" class="onscroll" v-if="pc">
        <li class="draw_up">
          <div class="box">加载中
            <div class="loader-03">
            </div>
          </div>
        </li>

        <slot name="content"></slot>

        <li class="draw_down">{{hint==='加载中'?'':hint}}
          <div v-if="hint==='加载中'" class="box">加载中
            <div class="loader-03">
            </div>
          </div>
        </li>

      </div>
    </div>

    <div id="floor" >
      <slot name="floor"></slot>
    </div>

  </div>

</template>

<script>
export default {
  name: "sm_xz_scroll",
  props:{
    h_up:{//下拉多少触发加载
      type:Number,
      default:200,
    },
    h_down:{//上拉多少触发加载
      type:Number,
      default:-100,
    },
    p_down:{//上拉多少触发加载
      type:Number,
      default:20,
    },
    //是否首次加载
    first_load:{
      type:Boolean,
      default:true,
    },
    //背景颜色
    background:{
      type:String,
      default:"#ececec",
    },
  },
  data() {
    return {
      //h5
      ul: {},
      startY: 0, // 刚触碰到屏幕的时的手指信息
      centerY: 0, // 用来记录每次触摸时上一次的偏移距离
      oldCenterY: 0, // 用来记录上次触摸时上一次的偏移距离
      startTime: 0,//开始时间
      endTime: 0,//结束时间
      //pc
      pc: false,

      hint:'',//提示
      bool: true,//请求方法是否执行完成，
      title1:"上拉加载更多",
      draw_up:{},
      draw_down:{},

    }
  },

  created() {
    this.pc = this.isPC();
  },
  mounted() {
    if (this.pc) {
      this.onscroll();
    } else {
      let draw = document.querySelector('#draw');
      this.ul = draw.children[0];
      this.ul.addEventListener('touchstart', this.touchstart, {passive: true});
      this.ul.addEventListener('touchmove', this.touchmove, {passive: true});
      this.ul.addEventListener('touchend', this.touchend);
    }

    //动态计算高度
    this.$nextTick(() => {
      this.draw_up=document.getElementsByClassName("draw_up")[0];
      this.draw_down=document.getElementsByClassName("draw_down")[0];

      let first=document.getElementById("first").offsetHeight;
      let floor=document.getElementById("floor").offsetHeight;
      document.querySelector('#scroll_div').style.height="calc(100% - "+(first+floor)+"px)";
       if(!this.pc) {
         document.querySelector('#draw').style.height = "calc(100% - " + (first + floor) + "px)";
       }

      this.firstLoad();
    })
  },

  methods: {

    /**
     * 是否首次加载数据
     */
    firstLoad(){
      if(this.first_load){
        let _this=this;
        document.getElementsByClassName("draw_up")[0].style.display = "block";
        _this.hint="加载中"
          _this.$emit("draw_up", (bool, vv) => {
            _this.hint =bool? _this.title1 :vv;
            _this.draw_down.style.display = "block";
            _this.draw_up.style.display = "none";
          });
        }
    },

    //pc端
    //滚动条
    onscroll() {
      let _this = this;
      let obj = document.getElementById("onscroll");
      //this.hint = '加载中';
      obj.onscroll = function (e) {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        let scrollTop = obj.scrollTop;
        //变量windowHeight是可视区的高度
        let windowHeight = obj.clientHeight;
        //变量scrollHeight是滚动条的总高度
        let scrollHeight = obj.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight >= scrollHeight - _this.p_down) {
          //到了这个就可以进行业务逻辑加载后台数据了
          _this.hint = '加载中';
          if (_this.bool) {
            _this.draw_down.style.display = "block";
            _this.bool = false;
            _this.$emit("draw_down", (val, vv) => {
              _this.bool = true;
              _this.hint =val? _this.title1 :vv;
            });
          } else {
            e.preventDefault()
          }
        }
      }
    },


    //移动端
    touchstart(e) {
      this.startY = e.changedTouches[0].clientY;
      this.oldCenterY = this.centerY;
      this.startTime = new Date().getTime();
    },
    touchmove(e) {
      // 清除过渡
      this.ul.style.transition = 'none';
      // 获取差值
      let tempY = e.changedTouches[0].clientY - this.startY + this.centerY;
      if (tempY > this.h_up) {
        tempY = this.h_up;
      }
      this.ul.style.transform = 'translateY( ' + (tempY) + 'px)';

    },
    touchend(e) {
      this.centerY = e.changedTouches[0].clientY - this.startY + this.centerY;
      let _this = this;
      this.endTime = new Date().getTime();
      let s1 = (_this.endTime - _this.startTime);
      let s2 = 0;
      let jl = e.changedTouches[0].clientY - this.startY;
      if (jl > 50 || jl < -50) {//移动距离小于50不进行惯性计算
        //时间和惯性（可调）
        if (50 < s1 && s1 <= 90) {
          s2 = 1500;
        } else if (80 < s1 && s1 <= 100) {
          s2 = 1100
        } else if (100 < s1 && s1 <= 140) {
          s2 = 600
        } else if (140 < s1 && s1 <= 160) {
          s2 = 300;
        } else if (160 < s1 && s1 <= 170) {
          s2 = 100;
        } else {
          s2 = 30;
        }
      }
      this.centerY = this.oldCenterY > this.centerY ? this.centerY - s2 : this.centerY + s2;
      _this.ul.style.transition = 'transform .50s';
      _this.ul.style.transform = 'translateY(' + (this.centerY) + 'px)';
      _this.rebound();
    },
    rebound() {

      let _this = this;
      // 获取差值
      //移动距离>0=向上回弹到0
      if (this.centerY > 0) {
        if (this.centerY > this.h_up / 2) {
          _this.draw_up.style.display = "block";
          if (this.bool) {//一次只发送一个请求
            this.bool = false;
            this.$emit("draw_up", (val, vv) => {
              _this.bool = true;
              _this.draw_up.style.display = "none";
              _this.hint =val? _this.title1 :vv;
            });
          }
        }
        this.centerY = 0;
        // 添加过渡
        this.ul.style.transition = 'transform .7s';
        this.ul.style.transform = 'translateY(' + (this.centerY) + 'px)';
      } else {
        //计算ul-div宽度=回弹距离
        let u_clientHeight = 0;
        let d_clientHeight = 0;
        let centerY = 0;
        u_clientHeight = document.querySelector('#ul').clientHeight;
        d_clientHeight = document.querySelector('#draw').clientHeight;
        centerY = d_clientHeight - u_clientHeight;
        //移动距离<回弹距离=不操作
        if (this.centerY < centerY) {
          if (centerY > 0) {
            this.centerY = 0;
            this.ul.style.transform = 'translateY(' + this.centerY + 'px)';
            return;
          }
          //移动距离<回弹距离=重新计算回弹距离
          if (this.centerY < centerY + this.h_down) {
            _this.draw_down.style.display = "block";
            this.hint ='加载中';
            if (this.bool) {//一次只发送一个请求
              this.bool = false;
              this.$emit("draw_down", (val, vv) => {
                _this.bool = true;
                _this.hint =val? _this.title1 :vv;
              });
            }
            u_clientHeight = document.querySelector('#ul').clientHeight;
            d_clientHeight = document.querySelector('#draw').clientHeight;
            centerY = d_clientHeight - u_clientHeight;
          }
        }
        if (this.centerY < centerY) {
          this.centerY = centerY;
          // 添加过渡
          this.ul.style.transition = 'transform .7s';
          this.ul.style.transform = 'translateY(' + (_this.centerY) + 'px)';
        }
      }
    },

    //是否是pc端
    isPC() {
      return (!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
    },

  },


};
</script>

<style  >
/* 样式初始化 */
* {
  margin: 0;
  padding: 0;
}
html, body, #app{
  height: 100%;
}
aside {
  height: 100%;
  width: 100%;
}

/* 列表的父盒子，限制宽高 */
/* 注意设置overflow: hidden;样式后，超出这个盒子的ul将不会显示 */
.draw {
  width: 100%;
  overflow: hidden;
  position: fixed;
}

/* li 设置了浮动， 所以 ul 要清除浮动 */
ul:after {
  content: "";
  display: block;
  visibility: hidden;
  height: 0;
  clear: both;
}

ul {
  zoom: 1;
}

li {
  width: 100%;
}

.draw_up {
  display: none;
  color: darkgrey;
  font-size: 14px;
  text-align: center;
}

.draw_down {
  display: none;
  color: darkgrey;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 5px;
}

.draw_NoData {
  display: none;
  width: 100%;
  text-align: center;
  justify-content: center;
  color: darkgrey;
  font-size: 14px;
  padding-bottom: 30px;
}

/*pc*/
.onscroll {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #ececec
}

.onscroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.onscroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #d6d6d6;
}

.onscroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.box {
  color: rgba(200, 200, 200, 0.5);
  padding: 1em;
  vertical-align: top;
  text-align: center;
}
[class*="loader-"] {
display: inline-block;
width: 1em;
height: 1em;
color: inherit;
vertical-align: middle;
pointer-events: none;
}
.loader-03 {
border: .2em solid currentcolor;
border-bottom-color: transparent;
border-radius: 50%;
-webkit-animation: 1s loader-03 linear infinite;
animation: 1s loader-03 linear infinite;
position: relative;
}
@-webkit-keyframes loader-03 {
0% {
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
}
100% {
-webkit-transform: rotate(360deg);
transform: rotate(360deg);
}
}
@keyframes loader-03 {
0% {
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
}
100% {
-webkit-transform: rotate(360deg);
transform: rotate(360deg);
}
}

/*指定高度，强行改变高度*/
/*/deep/ .onscroll{*/
/*  height: 60%;*/
/*}*/
/*/deep/ .draw{*/
/*  height: 80%;*/
/*}*/



</style>
