<template>
  <div class="app-container">

    <!--个人信息-->
    <div class="info">
      <el-descriptions class="margin-top" title="用户个人信息" :column="4" :size="size" border>
        <template slot="extra">
          <el-button type="primary" size="small">修改用户信息</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            用户Id
          </template>
          <el-tag size="small">{{ userInfo.userId }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ userInfo.userName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            购买订单总量
          </template>
          {{ userInfo.orderNum }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-money"></i>
            总消费
          </template>
          {{ userInfo.orderTotalPrice }}元
        </el-descriptions-item>

      </el-descriptions>

    </div>

    <!--搜索框-->


    <!--订单-->
   <div class="order" >
     <el-card style="width: 1440px;height: 100%;margin: 20px auto">
       <el-card style="width: 1400px;height: 70px;margin: 0 auto" shadow="none">
         <div style="margin-top: 10px">
           <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
           <span class="font-small">用户所有订单</span>
         </div>
       </el-card>

       <el-card shadow="hover" v-for="item in productList">
         <div class="demo-image__placeholder">
           <div class="block">
             <span class="demonstration" style="text-align: center">{{ item.productName }}</span>
             <el-image :src="item.productPicture">
               <div slot="placeholder" class="image-slot">
                 加载中<span class="dot">...</span>
               </div>
             </el-image>
           </div>
         </div>
       </el-card>
     </el-card>
   </div>



  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      size:'',
      userInfo:{},
      userId:'',
      productList:[{}]
    }
  },
  created() {
    this.userId = this.$route.params.userId
    this.init()
  },
  methods:{
    //根据userId查询后端数据库，获取自身的订单信息和自身的信息
    init(){
      this.$api.reqGetUserOrderInfo(this.userId)
        .then(res=>{
          console.log(res)
          if (res.code === 200) {
            this.userInfo = res.data
            this.productList = res.data.productEntityList
          }
      })
    }
  }
}
</script>

<style scoped>
.el-card{
  display: inline-flex;
  width: 300px;
  height: 300px;
  margin: 10px;
}
</style>
