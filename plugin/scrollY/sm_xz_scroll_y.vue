<!--横向滑动-->
<template>
  <div class="scroll_y_div">
    <div class="lateral-sliding" id="abc">
      <div v-for="data in internalList" :key="data.name" class="lateral-sliding-item">
        <div :class="data.name===active.name?'cover_internalTitle ':'cover_internalTitle internalTitle '"
             :style="{
              'width':data.width===undefined?'100px':data.width+'px',
              'color':data.name===active.name?activeColor:color,
              'backgroundColor':data.name===active.name?activeBackgroundColor:backgroundColor,
              'fontSize':fontSize,
               'textAlign':textAlign,
                'padding':padding,
              }" @click="internalClick(data)">
          <slot :data="data" name="type"></slot>

        </div>
      </div>
    </div>

    <slot name="content"></slot>
  </div>

</template>

<script>
export default {
  name: "sm_xz_scroll_y",
  emits: ["internalClick"],
  props: {
    //列表
    internalList: {
      type: Array,
      default: () => []
    },
    //激活选中
    internalActive: {
      type: String,
      default: ''
    },
    //还原
    restore: {
      type: Boolean,
      default: true
    },
    //选中字体颜色
    activeColor:{
      type: String,
      default: 'red'
    },
    //未选中字体颜色
    color:{
      type: String,
      default: '#acabab'
    },
    //选中背景
    activeBackgroundColor:{
      type: String,
      default: '#dedede'
    },
    //未选中背景
    backgroundColor:{
      type: String,
      default: '#fffefe'
    },
    //字体大小
    fontSize:{
      type: String,
      default: '14px'
    },
    //字体居中
    textAlign:{
      type: String,
      default: 'center'
    },
    //字体
    padding:{
      type: String,
      default: '5px 0px 5px 0px'
    }
  },
  data() {
    return {
      scrollLeftY:0,
      active:{},

      scrollLeft: "scrollLeft",
      newInternalActiveName: "newInternalActive"
    }
  },
  created() {

    if(this.restore){
      sessionStorage.removeItem(this.scrollLeft)
      sessionStorage.removeItem(this.newInternalActiveName)
      for (let i = 0; i < this.internalList.length; i++) {
        if(this.internalActive.name===this.internalList[i].name){
          this.active=this.internalActive;
          break;
        }else{
          this.scrollLeftY+=this.internalList[i].width===undefined?100:this.internalList[i].width
        }
      }
    }else {
      let newInternalActive=sessionStorage.getItem(this.newInternalActiveName);
      this.active =newInternalActive===null||newInternalActive===undefined? this.internalActive:JSON.parse(newInternalActive);
    }
  },
  mounted() {
    this.scroll();
    //监听滚动调
    let page = document.getElementById('abc')
    page.addEventListener('scroll', this.handleScroll, true)

  },

  methods: {
    internalClick(value) {
      this.active = value
      this.$emit("internalClick", value);
      if(!this.restore){
        sessionStorage.setItem(this.newInternalActiveName, JSON.stringify(value))
        sessionStorage.setItem(this.scrollLeft, this.scrollLeftY)
      }

    },

    scroll() {

      //还原横向滚动位置
      this.$nextTick(() => {
        if (this.internalList.length !== 0) {
            let scrollY = sessionStorage.getItem(this.scrollLeft);
            if (scrollY !== undefined && scrollY !== null) {
              this.scrollLeftY = parseInt(scrollY);
            }
        }
        window.document.getElementById("abc").scrollLeft =  this.scrollLeftY;
        this.$emit("internalClick",this.active)
      })
    },
    handleScroll() {
      this.scrollLeftY = document.getElementById("abc").scrollLeft;
    }
  }
}
</script>

<style scoped>
.scroll_y_div {
  width: 100%;
}

.cover_internalTitle {

}

.internalTitle {


}

.lateral-sliding {
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;

}

.lateral-sliding-item {
  display: flex;
  margin-right: 8px;

}

::-webkit-scrollbar {
  display: none;
}
</style>
