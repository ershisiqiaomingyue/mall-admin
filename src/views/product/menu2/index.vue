<template>
  <!--商品分类-->
  <div class="app-container" style="margin-top: 50px">
    <el-card style="width: 700px;margin: 0 auto" >
      <div style="margin-bottom: 30px">
        <el-steps :active="active" align-center space="50%"  finish-status="success" process-status="process">
          <el-step title="步骤 1" description="添加商品的基本信息"></el-step>
          <el-step title="步骤 2" description="添加商品的图片信息"></el-step>
        </el-steps>
      </div>
      <div v-show="showStatus[0]">
        <el-form :model="product" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="商品分类：">
            <el-select v-model="categoryOption"
                       placeholder="请选择商品分类"
                       clearable>
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称：" prop="productName">
            <el-input v-model="product.productName"></el-input>
          </el-form-item>
          <el-form-item label="标题：" prop="productTitle">
            <el-input type="textarea" v-model="product.productTitle" placeholder="请输入商品的简要描述"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍：">
            <el-input
              :autoSize="true"
              v-model="product.content"
              type="textarea"
              placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="是否上架：" >
            <el-switch
              :active-value="0"
              :inactive-value="1"
              v-model="product.status">
            </el-switch>
          </el-form-item>
          <el-form-item label="设为首页推荐：">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="product.mainImg">
            </el-switch>
          </el-form-item>
<!--          <el-form-item label="商品货号：">
            <el-input v-model="product.productSn"></el-input>
          </el-form-item>-->
          <el-form-item label="商品原价：">
            <el-input v-model="product.price"></el-input>
          </el-form-item>
          <el-form-item label="当前售价：">
            <el-input v-model="product.sellingPrice"></el-input>
          </el-form-item>
          <el-form-item label="商品库存：">
            <el-input v-model="product.totalStocks"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" plain size="medium" @click="prevStep()">上一步</el-button>
            <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品相关图片</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="showStatus[1]" v-if="isOpen">
        <el-form :model="product" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="商品主图">
            <single-upload :img="product.productPicture"/>
          </el-form-item>

          <el-form-item label="商品图片">
            <!--至少需要5张-->
            <multi-upload :imgList="product.productImg"/>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" plain size="medium" @click="prevStep()">上一步</el-button>
            <el-button type="primary" size="medium" @click="commit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>


    </el-card>


  </div>
</template>

<script>

import singleUpload from '@/components/Upload/singleUpload'
import multiUpload from '@/components/Upload/multiUpload'

const defaultProduct = {
  productId:null, productName:null, categoryId:null, status:0, productPicture:null, productImg:[],
  mainImg:0, sellingPrice: null, price:null, productTitle: null, content:null
}

export default {
  name: 'index',
  components:{
    singleUpload,multiUpload
  },
  data() {
    return {
      isOpen:false,
      loading:true,
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        productTitle: [{required: true, message: '请输入商品标题', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
        requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
      },
      active: 0,
      product: Object.assign({},defaultProduct),
      categoryList:[],
      categoryOption:null,
      showStatus:[true,false]
    };
  },
  watch:{
    categoryOption(val){
      this.product.categoryId = val
    }
  },
  created() {
    this.getCategory()
    console.log(this.categoryList)
  },
  mounted() {
    this.$bus.$on('updateImg',(val)=>{
      this.product.productPicture = val
    })
    this.$bus.$on('addImgList',(val)=>{
      Object.assign(this.product.productImg,val)
    })
  },
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    handleNext(){
      if (this.active < this.showStatus.length - 1) {
        this.isOpen = true
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    commit() {
      console.log(this.product)
      this.$confirm('是否要添加该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$api.reqAddProduct(this.product)
          .then(res=>{
            if (res.code === 200) {
              this.isOpen = false;
              this.product = Object.assign({},defaultProduct)
              this.$message.success('添加成功！')
              this.$router.push('/product/menu1')
            }else {
              this.$message.error(res.msg)
            }
          }).catch(err=>{
            this.$message.error(err)
        })
      })
    },
    //获取种类
    getCategory(){
      this.$api.reqGetCategory()
        .then(res=>{
          if (res.code === 200) {
            let obj = []
            Object.assign(obj,res.data)
            this.categoryList = obj
            console.log(this.categoryList)
          }else {
            this.$message.error(res.msg)
          }
        }).catch(err=>{
        this.$message.error(err)
      })
    },
  }
}
</script>

<style scoped>

</style>
