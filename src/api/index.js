import request from '@/utils/request.js'

export default {

  //获取所有用户
  reqGetAllUser(data) {
    return request({
      url: 'admin/queryAllUser',
      method: 'post',
      data
    })
  },
  //获取用户和订单的信息：用户消费多少钱，购买多少商品.....
  reqGetUserOrderInfo(data) {
    return request({
      url: `admin/getUserOrderInfo/${data}`,
      method: 'get'
    })
  },
  //获取所有的商品
  reqGetAllProduct(data) {
    return request({
      url: 'admin/queryAllProduct',
      data,
      method: 'post'
    })
  },
  //上传图片
  reqUploadImgList(data){
    return request({
      url:'/api/oss/file/uploadFiles',
      method:'post',
      data,
      headers:{
        'Content-Type':false
      }
    })
  },
  reqUpdateProduct(data) {
    return request({
      url:'/admin/update',
      method:'post',
      data
    })
  },
  reqGetCategory(){
    return request({
      url: '/admin/getCategory',
      method:'get'
    })
  },
  reqSetMainImg(data){
    return request({
      url:'/admin/setMainImg',
      method:'post',
      data
    })
  },
  reqUpdateStatus(data) {
    return request({
      url:'/admin/updateProductStatus',
      method:'post',
      data
    })
  },
  reqAddProduct(data){
    return request({
      url:'/admin/addProduct',
      method:'post',
      data
    })
  },
  reqGetCategoryList(){
    return request({
      url:'/admin/getCategoryList',
      method:'get'
    })
  },
  reqUpdateCategory(data){
    return request({
      url:'/admin/updateCategory',
      method:'post',
      data
    })
  },
  reqGetOrderList(data){
    return request({
      url:'/admin/getOrderList',
      method:'post',
      data
    })
  },
  reqGetOrderByOrderId(data){
    return request({
      url:`/admin/getOrderDetail/${data}`,
      method:'get'
    })
  },
  reqLockUser(data){
    return request({
      url: '/admin/lockUser',
      method:'post',
      data
    })
  },
  reqUpdateCategoryStatus(data){
    return request({
      url:'/admin/updateCategoryStatus',
      data,
      method:'post'
    })
  }
}
