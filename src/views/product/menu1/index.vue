<template>
  <div class="app-container">
    <!--查询框-->
    <el-card class="filter-container" >
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
        <el-form :inline="true" :model="searchObj" label-width="140px" size="small" ref="form">
          <el-form-item label="输入搜索：">
            <el-input v-model="searchObj.keyword" placeholder="商品名称" style="width: 193px;"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input v-model="searchObj.productId" placeholder="商品货号" style="width: 193px"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select v-model="categoryOption" placeholder="请选择商品分类" clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否为主图：">
            <el-select v-model="mainImgOption" placeholder="请选择商品分类" clearable>
              <el-option
                v-for="item in mainImgList"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="searchObj.status" clearable placeholder="请选择">
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--数据列表的表头-->
    <el-card class="operate-container"  style="margin-top: 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        size="mini"
        style="float:right"
        @click="handleAddProduct()"
      >
        添加
      </el-button>
    </el-card>

    <!--商品列表的表-->
    <div class="table-container">
      <el-table :data="productList"
                border
                style="width: 100%"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
        <el-table-column type="index" label="序号" width="80"/>
        <el-table-column  label="商品编号" width="150">
          <template slot-scope="scope">{{ scope.row.productId }}</template>
        </el-table-column>
        <el-table-column  label="商品图片" width="180">
          <template slot-scope="scope"><img :src="scope.row.productPicture" style="height: 80px"></template>
        </el-table-column>
        <el-table-column  label="商品名称" width="300">
          <template slot-scope="scope">
            <p>{{ scope.row.productName }}</p>
            <!--TODO-->
            <!--            <p>品牌：{{scope.row.brandName}}</p>-->
          </template>
        </el-table-column>
        <el-table-column  label="价格" width="200">
          <template slot-scope="scope">
            <p>
              <el-tag>
                当前价格：￥{{ scope.row.sellingPrice }}
              </el-tag>

            </p>
            <p>
              <el-tag type="danger">
                原价：￥{{ scope.row.price }}
              </el-tag>
            </p>
            <!--            <p>货号：{{scope.row.productSn}}</p>-->
          </template>
        </el-table-column>
        <el-table-column  label="标签" width="200">
          <template slot-scope="scope">
            <p>是否上架：
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handlePublishStatusChange(scope.$index, scope.row)"
              >
              </el-switch>
            </p>
            <!--TODO-->
            <p>设为首页主图：
              <el-switch
                @change="handleMainImgChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.mainImg">
              </el-switch>
            </p>
            <!--TODO-->
            <!--            <p>推荐：
                          <el-switch
                            @change="handleRecommendStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.recommandStatus">
                          </el-switch>
                        </p>-->
          </template>
        </el-table-column>
        <el-table-column  label="库存" width="120">
          <template slot-scope="scope">
            {{scope.row.totalStocks}}
          </template>
        </el-table-column>
        <el-table-column  label="销量" width="120" prop="saleNum"></el-table-column>
        <el-table-column  label="操作" >
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleEditProductInfo(scope.$index, scope.row)">
                编辑
              </el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleShowLog(scope.$index, scope.row)">
                日志
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
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

    <!--编辑商品-->
    <div v-if="isOpen">
         <el-dialog
           title="编辑货品信息"
           :visible.sync="editProductInfo.dialogVisible"
           width="55%"
           @close="closeFunction">
           <!--商品名、商品详细信息、商品标题、商品配送费、商品主图、商品图片、原价、售卖价格、状态(不可更改)、上架时间(不可以改)、配送方式-->
           <el-form ref="form" :model="editProductInfo" label-width="80px">
             <el-form-item label="商品货号">
               <el-input disabled v-model="editProductInfo.productId"></el-input>
             </el-form-item>
             <el-form-item label="商品主图">
               <single-upload :img="editProductInfo.productPicture"/>
             </el-form-item>
             <el-form-item label="商品名称">
               <el-input v-model="editProductInfo.productName"></el-input>
             </el-form-item>
             <el-form-item label="商品标题">
               <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 10}" v-model="editProductInfo.productTitle"></el-input>
             </el-form-item>
             <el-form-item label="详细信息">
               <el-input type="textarea"  :autosize="{ minRows: 3}"  v-model="editProductInfo.content"></el-input>
             </el-form-item>
             <el-form-item label="库存">
               <el-input-number v-model="editProductInfo.totalStocks"/>
             </el-form-item>
             <el-form-item label="上架时间" >
               <el-date-picker
                 disabled
                 type="date"
                 v-model="editProductInfo.createTime"
                 style="width: 100%;
              "/>
             </el-form-item>
             <el-form-item label="商品原价">
               <el-input-number v-model.number="editProductInfo.price" :precision="2">
               </el-input-number>
             </el-form-item>
             <el-form-item label="当前售价">
               <el-input-number v-model.number="editProductInfo.sellingPrice" :precision="2"/>
             </el-form-item>
             <el-form-item label="商品图片">
               <!--至少需要5张-->
               <multi-upload :imgList="editProductInfo.productImg"/>
             </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="editProductInfo.dialogVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="handleEditProductConfirm">确 定</el-button>
          </span>
         </el-dialog>
       </div>
  </div>
</template>

<script>
const defaultSearchObj = {
  keyword: null,
  currentPage: 1,
  pageSize: 10,
  //上架状态
  //publishStatus: null,
  //状态
  status: null,
  productId: null,
  categoryId: null,
  mainImg:null
}
import singleUpload from '@/components/Upload/singleUpload'
import multiUpload from '@/components/Upload/multiUpload'
export default {
  name: 'index',
  components:{
    singleUpload,multiUpload
  },
  mounted() {
    this.$bus.$on('updateImg',(val)=>{
      this.editProductInfo.productPicture = val
    })
    this.$bus.$on('addImgList',(val)=>{
      Object.assign(this.editProductInfo.productImg,val)
    })
  },
  watch:{
    categoryOption(val){
      console.log(val)
      this.searchObj.categoryId = val
    },
    mainImgOption(val){
      this.searchObj.mainImg = val
    }
  },
  data() {
    return {
      isOpen:true,
      //编辑商品信息
      editProductInfo: {
        dialogVisible: false,
        productId: null,
        productPicture:'',
        price:null,
        sellingPrice:null,
        productImg:[],
        productTitle:'',
        content:'',
        productName:'',
        createTime:'',
        totalStocks:null
      },
      total: null,
      listLoading: true,
      //查询对象
      searchObj: Object.assign({}, defaultSearchObj),
      //上架与否
      publishStatusOptions: [{
        value: 0,
        label: '上架'
      }, {
        value: 1,
        label: '下架'
      }],
      //审核通过没有
      verifyStatusOptions: [{
        value: 1,
        label: '审核通过'
      }, {
        value: 0,
        label: '未审核'
      }],
      //商品是否为主图
      mainImgOption:null,
      mainImgList:[{ label:'是', key:1 },{label:'否',key:0}],
      //商品分类
      categoryList: [],
      categoryOption:null,
      productList: []
    }
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return '审核通过'
      } else {
        return '未审核'
      }
    }
  },
  created() {
    this.init()
    this.getCategory()
  },
  methods: {
    //弹窗关闭时的函数，控制弹窗的销毁和创建，避免数据缓存！
    closeFunction(){
      this.isOpen = false
      this.init()
    },
    //初始化数据
    init(page = 1) {
      this.searchObj.currentPage = page
      this.$api.reqGetAllProduct(this.searchObj)
        .then(res => {
          if (res.code === 200) {
            this.productList = res.data.productList
            this.total = res.data.total
          }
        })
    },
    //查询
    handleSearchList() {
      this.init()
    },
    //查询重置
    handleResetSearch() {
      Object.assign(this.searchObj,defaultSearchObj)
      this.categoryOption = 0
    },
    //添加商品
    handleAddProduct() {
      this.$router.push('/product/menu2')
    },
    //多选修改，不考虑
    handleSelectionChange() {

    },
    //处理每页的数量更改
    handleSizeChange(val) {
      this.init()
    },
    //处理页码改变
    handleCurrentChange(val) {
      this.init(val)
    },
    //修改商品:商品名、商品详细信息、商品配送费、商品主图、商品图片、原价、售卖价格、商品标题、状态、上架时间(不可以改)、配送方式
    handleEditProductInfo(index, row) {
      this.isOpen = true
      this.editProductInfo.dialogVisible = true
      Object.assign(this.editProductInfo,row)
      //如果为空，要将它置为[]，否则合并数组会出错
      if (this.editProductInfo.productImg == null) {
        this.editProductInfo.productImg = []
      }
    },
    //确定修改商品
    handleEditProductConfirm() {
      this.$api.reqUpdateProduct(this.editProductInfo)
        .then(res=>{
          if (res.code === 200) {
            this.$message.success('更新成功！')
            this.editProductInfo.dialogVisible = false
            this.isOpen = false
            //刷新网页数据
            this.init()
          }else {
            this.$message.error(res.msg)
          }
        }).catch(err=>{
          this.$message.warning(err)
      })
    },
    //商品上架,修改status=0为上架，status=1为下架
    handlePublishStatusChange(index,val) {
      let obj = {
        productId:val.productId,
        status:val.status
      }
      this.$api.reqUpdateStatus(obj)
        .then(res=>{
          if (res.code === 200) {
            this.$message.success(res.msg)
            //刷新数据
            this.init()
          }else {
            this.$message.error(res.msg)
          }
        }).catch(err=>{
        this.$message.warning(err)
      })
    },
    //更新商品信息
    handleUpdateProduct() {

    },
    //展示审核商品的详情
    handleShowVerifyDetail() {

    },
    //设置为首页展示的大图，修改mainImg=1为主图，0不是主图
    handleMainImgChange(index,val){
      let obj = {
        productId:val.productId,
        mainImg:val.mainImg,
        categoryId:val.categoryId
      }
      this.$api.reqSetMainImg(obj)
        .then(res=>{
          this.$message.success(res.msg)
          //刷新数据
          this.init()
      })
    },
    //获取种类
    getCategory(){
      this.$api.reqGetCategory()
        .then(res=>{
          if (res.code === 200) {
            let obj = []
            Object.assign(obj, res.data)
            this.categoryList = obj
          }else {
            this.$message.error(res.msg)
          }
        }).catch(err=>{
          this.$message.error(err)
      })
    },
    handleShowLog(index, val) {
      this.$router.push('menu1/log/productId=' + val.productId)
    }
  }
}
</script>

<style scoped>

</style>
