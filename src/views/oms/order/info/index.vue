<template>
  <div class="app-container">
<!--    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>-->
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：
          <template v-if="status === 0">
            <span style="color: red">已支付</span>
          </template>
          <template v-if="status === 1">未支付</template>
        </span>
        <div class="operate-button-container" v-show="status===0">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini">修改商品信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{orderId}}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{user.userName}}</el-col>
          <el-col :span="4" class="table-cell">微信支付</el-col>
          <el-col :span="4" class="table-cell">官网</el-col>
          <el-col :span="4" class="table-cell">正常订单</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">配送方式</el-col>
          <el-col :span="4" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="4" class="table-cell-title">订单可得抵扣币</el-col>
          <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
          <el-col :span="4" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">15天</el-col>
          <el-col :span="4" class="table-cell">100</el-col>
          <el-col :span="4" class="table-cell">100</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              placement="top-start"
              title="活动信息"
              width="200"
              trigger="hover"
              >
              <span slot="reference">单品促销,打折优惠：满3件，打7.50折,满减优惠：满1000.00元，减120.00元,满减优惠：满1000.00元，减120.00元,无优惠</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{user.nickName}}</el-col>
          <el-col :span="6" class="table-cell">{{user.phone}}</el-col>
          <el-col :span="6" class="table-cell">721000</el-col>
          <el-col :span="6" class="table-cell">陕西省-西安市</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productPicture" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
<!--            <p>品牌：{{scope.row.productBrand}}</p>-->
            <p>品牌：小米</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>原价：￥{{scope.row.originalPrice}}</p>
            <p>货号：暂无</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productAttr}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productNum}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.price*scope.row.productNum}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{totalPrice}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{totalPrice}}</el-col>
          <el-col :span="6" class="table-cell">￥0元</el-col>
          <el-col :span="6" class="table-cell">-￥0元</el-col>
          <el-col :span="6" class="table-cell">-￥0元</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥0元</el-col>
          <el-col :span="6" class="table-cell">-￥0元</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{totalPrice}}元</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{totalPrice}}元</span>
          </el-col>
        </el-row>
      </div>
      <!--<div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
     <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.historyList" border>
        <el-table-column label="操作者"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.operateMan}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  width="160" align="center">
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  width="120" align="center">
          <template slot-scope="scope">
            {{status}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态"  width="120" align="center">
          <template slot-scope="scope">
&lt;!&ndash;            {{scope.row.orderStatus | formatPayStatus}}&ndash;&gt;
            已付款
          </template>
        </el-table-column>
        <el-table-column label="发货状态"  width="120" align="center">
          <template slot-scope="scope">
&lt;!&ndash;            {{scope.row.orderStatus | formatDeliverStatus}}&ndash;&gt;
            已付款
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>-->
    </el-card>


    <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.receiverProvince"
                        :city="receiverInfo.receiverCity"
                        :area="receiverInfo.receiverRegion"
                        @selected="onSelectRegion">
          </v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改费用信息"
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"><template slot="prepend">￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-￥{{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.totalAmount+moneyInfo.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payAmount+moneyInfo.freightAmount-moneyInfo.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送站内信"
               :visible.sync="messageDialogVisible"
               width="40%">
      <el-form :model="message"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单"
               :visible.sync="closeDialogVisible"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
const defaultReceiverInfo = {
  orderId:null,
  receiverName:null,
  receiverPhone:null,
  receiverPostCode:null,
  receiverDetailAddress:null,
  receiverProvince:null,
  receiverCity:null,
  receiverRegion:null,
  status:null
};
export default {
  name: 'orderDetail',
  computed:{
    totalAmount(){
      return 100
    }
  },
  data() {
    return {
      id: null,
      order: {},
      user:{},
      orderTime:null,
      totalPrice:null,
      status:null,
      orderId:null,
      receiverDialogVisible:false,
      receiverInfo:Object.assign({},defaultReceiverInfo),
      moneyDialogVisible:false,
      moneyInfo:{
        orderId:null,
        freightAmount:0,
        discountAmount:0,
        status:null
      },
      messageDialogVisible:false,
      message: {
        title:null,
        content:null
      },
      closeDialogVisible:false,
      closeInfo:{
        note:null,
        id:null
      },
      markOrderDialogVisible:false,
      markInfo:{
        note:null
      },
      logisticsDialogVisible:false
    }
  },
  created() {
    let orderId = this.$route.params.orderId
    this.init(orderId)
  },
  methods: {
    init(val){
      this.$api.reqGetOrderByOrderId(val)
        .then(res=>{
          if (res.code === 200) {
            this.user = res.data.user
            this.order = res.data.orderDetail
            this.orderTime = res.data.orderTime
            this.totalPrice = res.data.totalPrice
            this.status = res.data.status
            this.orderId = res.data.orderId
          }
        })
    },
    onSelectRegion(data){
      this.receiverInfo.receiverProvince=data.province.value;
      this.receiverInfo.receiverCity=data.city.value;
      this.receiverInfo.receiverRegion=data.area.value;
    },
    showUpdateReceiverDialog(){
      this.receiverDialogVisible=true;
      this.receiverInfo={
        orderId:this.order.id,
        receiverName:this.order.receiverName,
        receiverPhone:this.order.receiverPhone,
        receiverPostCode:this.order.receiverPostCode,
        receiverDetailAddress:this.order.receiverDetailAddress,
        receiverProvince:this.order.receiverProvince,
        receiverCity:this.order.receiverCity,
        receiverRegion:this.order.receiverRegion,
        status:this.order.status
      }
    },
    handleUpdateReceiverInfo(){
      this.$confirm('是否要修改收货信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateReceiverInfo(this.receiverInfo).then(response=>{
          this.receiverDialogVisible=false;
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          getOrderDetail(this.id).then(response => {
            this.order = response.data;
          });
        });
      });
    },
    showUpdateMoneyDialog(){
      this.moneyDialogVisible=true;
      this.moneyInfo.orderId=this.order.id;
      this.moneyInfo.freightAmount=this.order.freightAmount;
      this.moneyInfo.discountAmount=this.order.discountAmount;
      this.moneyInfo.status=this.order.status;
    },
    handleUpdateMoneyInfo(){
      this.$confirm('是否要修改费用信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateMoneyInfo(this.moneyInfo).then(response=>{
          this.moneyDialogVisible=false;
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          getOrderDetail(this.id).then(response => {
            this.order = response.data;
          });
        });
      });
    },
    showMessageDialog(){
      this.messageDialogVisible=true;
      this.message.title=null;
      this.message.content=null;
    },
    handleSendMessage(){
      this.$confirm('是否要发送站内信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messageDialogVisible=false;
        this.$message({
          type: 'success',
          message: '发送成功!'
        });
      });
    },
    showCloseOrderDialog(){
      this.closeDialogVisible=true;
      this.closeInfo.note=null;
      this.closeInfo.id=this.id;
    },
    handleCloseOrder(){
      this.$confirm('是否要关闭?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids",[this.closeInfo.id]);
        params.append("note",this.closeInfo.note);
        closeOrder(params).then(response=>{
          this.closeDialogVisible=false;
          this.$message({
            type: 'success',
            message: '订单关闭成功!'
          });
          getOrderDetail(this.id).then(response => {
            this.order = response.data;
          });
        });
      });
    },
    showMarkOrderDialog(){
      this.markOrderDialogVisible=true;
      this.markInfo.id=this.id;
      this.closeOrder.note=null;
    },
    handleMarkOrder(){
      this.$confirm('是否要备注订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("id",this.markInfo.id);
        params.append("note",this.markInfo.note);
        params.append("status",this.order.status);
        updateOrderNote(params).then(response=>{
          this.markOrderDialogVisible=false;
          this.$message({
            type: 'success',
            message: '订单备注成功!'
          });
          getOrderDetail(this.id).then(response => {
            this.order = response.data;
          });
        });
      });
    },
    handleDeleteOrder(){
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids",[this.id]);
        deleteOrder(params).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          });
          this.$router.back();
        });
      })
    },
    showLogisticsDialog(){
      this.logisticsDialogVisible=true;
    }
  }
}
</script>

<style scoped>
.detail-container {
  width: 80%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #F2F6FC;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  background: #F2F6FC;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
