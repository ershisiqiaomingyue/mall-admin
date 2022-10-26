<template>
  <!--添加商品-->
  <div class="app-container" style="margin-top: 50px">
    <el-card style="margin: 0 auto;width: 1123px;" >
      <div class="table-container">
         <el-table :data="categoryList"
                   border
                   style="width: 100%"
                   :header-cell-style="{'text-align':'center'}"
                   :cell-style="{'text-align':'center'}"
         >
           <!--不考虑-->
           <el-table-column  type="selection" width="60"/>
           <el-table-column  label="分类编号" width="150" prop="categoryId"/>
           <el-table-column  label="分类名称" width="200" prop="categoryName"/>
           <el-table-column  label="商品数量" width="200" prop="productNumber"/>
           <el-table-column  label="修改时间" width="200" prop="updateTime"/>
           <el-table-column  label="状态" width="120">
             <template slot-scope="scope">
               <el-switch
                 v-model="scope.row.status"
                 :active-value="0"
                 :inactive-value="1"
                 @change="handleStatusChange(scope.$index, scope.row)"
               />
             </template>
           </el-table-column>
           <el-table-column label="操作" width="150">
             <template slot-scope="scope">
               <el-button @click="handleUpdate(scope.row)" size="small" plain>修改</el-button>
             </template>
           </el-table-column>
         </el-table>

        <div class="pagination-container" style="text-align: center;margin-top: 20px">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[5,10,15]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <div v-if="isOpen">
      <el-dialog
        title="编辑货品信息"
        :visible.sync="category.dialogVisible"
        width="30%"
        @close="closeFunction">
        <el-form ref="form" :model="category" label-width="80px">
          <el-form-item label="分类编号">
            <el-input disabled v-model="category.categoryId"></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="category.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input-number v-model="category.productNumber"/>
          </el-form-item>
          <el-form-item label="修改时间" >
            <el-date-picker
              disabled
              type="date"
              v-model="category.updateTime"
              style="width: 100%;
              "/>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="category.status"
              :active-value="0"
              :inactive-value="1"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="category.dialogVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="commit">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  name: 'index',
  created() {
    this.init()
  },
  data(){
    return{
      isOpen:false,
      categoryList:[],
      currentPage:1,
      pageSize:10,
      total:6,
      category:{
        dialogVisible:false,
        categoryId: null,
        categoryName:null,
        productNumber:null,
        updateTime:null,
        status:0,
      }
    }
  },
  methods:{
    //初始化数据
    init(){
      this.$api.reqGetCategoryList()
        .then(res=>{
          let obj = []
          Object.assign(obj,res.data)
          this.categoryList = obj
        })
    },
    //处理种类的状态，如果状态修改为1，则该种类的所有商品将下架
    handleStatusChange(index,val){
      this.$confirm('强烈不建议设置此项，如果修改此项，将会造成不可预料的结果！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log(val)
        this.$api.reqUpdateCategoryStatus(val)
          .then(res=>{
            this.$message.success(res.msg)
            this.init()
          })
      })
    },
    //打开更新种类的信息的弹窗
    handleUpdate(val){
      this.isOpen = true
      this.category.dialogVisible = true
      Object.assign(this.category,val)
    },
    closeFunction(){

    },
    //确认修改
    commit(){
      this.$confirm('不建议执行该操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.reqUpdateCategory(this.category)
          .then(res=>{
            if (res.code === 200) {
              this.$message.success('修改成功!')
              //消除缓存的影响，导致第二次打开弹窗出现上次的缓存
              this.isOpen = false
              //关闭弹窗
              this.category.dialogVisible = false
              //重新获取数据
              this.init()
            }else {
              this.$message.error(res.msg)
            }
          })
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
    //数量较小，不需要分页！
    handleSizeChange(){

    },
    handleCurrentChange(){

    }
  }
}
</script>

<style scoped>

</style>
