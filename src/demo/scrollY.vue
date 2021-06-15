<template>
  <div>
    <sm_xz_scroll_y :restore="true"
                    @internalClick="internalClick"
                    :internalList="internalList"
                    :internal-active="internalActive"
                    activeColor="red"
                    color="#acabab"
                    activeBackgroundColor="#dedede"
                    backgroundColor="#fffefe">

          <template v-slot:type="data">
            <div>{{ data.data.title }}</div>
          </template>

            <template v-slot:content>
              内容
            </template>
    </sm_xz_scroll_y>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      internalActive: {name:"tabCapita",title:'桌均（基于收入）',width:130},
      internalList:[
        {name:"businessAmount",title:'营业额'},
        {name:"businessIncome",title:'营业收入'},
        {name:"businessDiscount",title:'营业优惠'},
        {name:"openTab",title:'开台数'},
        {name:"ridership",title:'客流量'},
        {name:"tabCapita",title:'桌均（基于收入）',width:130},
        {name:"perCapita",title:'人均（基于收入）',width:130},
        {name:"newMember",title:'新增会员卡',width:130},
      ],
    }
  },
  methods:{
    internalClick(value){
      console.log(value)
    }
  }
};
</script>
<style scoped>

</style>

