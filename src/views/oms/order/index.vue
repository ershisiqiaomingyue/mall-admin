<template>
  <div class="app-container">
    <!--搜索框-->
    <el-card class="filter-container" style="margin: 30px auto;width: 1200px;height: 200px;">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            size="small"
            style="float: right"
            type="primary"
            @click="handleSearchList()"
          >
            查询
          </el-button>
          <el-button
            size="small"
            style="float: right;margin-right: 15px"
            @click="handleResetSearch()"
          >
            重置
          </el-button>
        </div>
        <div style="margin-top: 30px;margin-left: 100px">
          <el-form  :inline="true" :model="searchObj" label-width="140px" size="small" ref="form">
            <el-form-item label="订单时间范围">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchObj.startTime" style="width: 100%;" value-format="yyyy-MM-dd"/>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchObj.endTime" style="width: 100%;" value-format="yyyy-MM-dd"/>
              </el-col>
            </el-form-item>
            <br/>
            <el-form-item label="查询用户Id：">
              <el-input v-model="searchObj.userId" placeholder="请输入用户名" style="width: 193px"></el-input>
            </el-form-item>

            <el-form-item label="订单编号：">
              <el-input v-model="searchObj.orderId" placeholder="请输入编号" style="width: 193px"></el-input>
            </el-form-item>

          </el-form>
        </div>
      </el-card>

    <el-table :data="orderList" border  style="width: 1200px;margin: 0 auto"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :highlight-current-row="true"
    >
      <el-table-column  type="selection" width="60"/>
      <el-table-column
        type="index"
        label="序号"
        fixed
        width="50"
        key="1"/>
      <el-table-column fixed prop="orderId" label="订单编号" width="180px"/>
      <el-table-column fixed prop="userName" label="下单用户" width="120px"/>
      <el-table-column fixed prop="userId" label="用户Id" width="80px"/>
      <el-table-column fixed prop="phone" label="下单人手机号" width="150px"/>

      <el-table-column fixed prop="orderTime" label="下单时间" width="200px" value-format="yyyy-MM-dd HH:mm:ss"/>
      <el-table-column fixed prop="status" label="订单状态" width="80px"/>
      <el-table-column fixed prop="totalPrice" label="订单金额" width="80px"/>

<!--      <el-table-column fixed prop="pay" label="是否支付" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay===0" type="success">已支付</el-tag>
          <el-tag v-if="scope.row.pay===1" type="warning">未支付</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="selectOrder(scope.row)">查看订单</el-button>
          <el-button type="danger" size="mini" @click="deleteOrder(scope.row)" icon="el-icon-delete"/>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container" style="text-align: center;margin-top: 20px">
      <el-pagination
        :current-page.sync="searchObj.currentPage"
        :page-size="searchObj.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
        background
        layout="total, sizes,prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
//订单编号、下单人、订单时间
const defaultSearchObj = {
  //基础参数
  currentPage: 1,
  pageSize: 10,
  //查询参数
  startTime:null,
  endTime:null,
  userId:null,
  orderId:null,
}
export default {
  name: 'index',
  data(){
    return{
      searchObj: Object.assign({}, defaultSearchObj),
      orderList:[],
      total:null
    }
  },
  created() {
    if (this.$route.query.userId !== null) {
      this.searchObj.userId = this.$route.query.userId
    }
    this.init()
  },
  methods:{
    //初始化数据
    init(){
      this.$api.reqGetOrderList(this.searchObj)
        .then(res=>{
          if (res.code === 200) {
            this.orderList = res.data.orderList
            this.total = res.data.total
          }
        })
    },
    //搜索
    handleSearchList(){
      console.log(this.searchObj)
      this.init()
    },
    //重置
    handleResetSearch(){
      Object.assign(this.searchObj,defaultSearchObj)
      this.categoryOption = null
    },
    //进入订单页面
    selectOrder(val){
      this.$router.push('/oms/order/detail/orderId=' + val.orderId)
    },
    //pageSize变化调用的函数
    handleSizeChange(){
      this.init()
    },
    //页码改变调用的函数
    handleCurrentChange(){
      this.init()
    },
    //删除订单，设置订单表的状态为1即可
    deleteOrder(val){

    }
  }
}
</script>

<style scoped>
.el-col-2{
  text-align: center;
}

</style>
