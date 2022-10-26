<template>
  <!--用户管理模块-->
  <div class="app-container">
    <!--搜索框-->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item >
          <el-input v-model="searchObj.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="创建日期范围" v-model="searchObj.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="searchObj.date2" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-button type="primary" size="medium" icon="el-icon-search" @click="getList()">查询</el-button>
      </el-form>
    </div>


    <el-table :data="tableData" border  style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              :highlight-current-row="true"
    >
      <el-table-column
        type="index"
        fixed
        width="50"
        key="1">
      </el-table-column>

      <el-table-column fixed prop="avatar" label="头像" width="120px">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="width: 80px;height: 80px;">
        </template>
      </el-table-column>
      <el-table-column fixed prop="userName" label="用户名" width="120px"></el-table-column>
      <el-table-column fixed prop="nickName" label="昵称" width="100px"></el-table-column>

      <el-table-column fixed prop="phone" label="手机号" width="120px"></el-table-column>
      <el-table-column fixed prop="email" label="邮箱" width="180px"></el-table-column>
      <el-table-column fixed prop="sex" label="性别" width="80px">
        <template slot-scope="scope">
          {{scope.row.sex === 1 ? '男' : '女'}}
        </template>
      </el-table-column>

      <el-table-column fixed prop="isDeleted" label="是否注销" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDeleted===0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.isDeleted===1" type="warning">封禁</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed label="状态" width="80px">
        <template slot-scope="scope">
          <el-switch
            :active-value="0"
            :inactive-value="1"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="lockUser(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed prop="createTime" label="创建日期"></el-table-column>
      <el-table-column fixed prop="updateTime" label="上次修改密码时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleClick(scope.row)" style="margin: 3px 0">用户信息</el-button>
          <el-button type="primary" size="mini" @click="selectOrder(scope.row)" style="margin: 3px 0">查询订单</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--分页-->



  </div>
</template>

<script>
export default {
  name: 'index',
  created() {
    this.init()
  },
  methods: {
    //排序
    onSortChange({ prop, order }) {
      //调用后端api排序
    },
    //处理操作中的按钮事件
    handleClick(val){
      console.log(val)
      let userId = val.userId
      this.$router.push({
        path:`/user/detail/${userId}`,
      })
    },
    //查询
    getList(){

    },
    lockUser(val){
      this.$api.reqLockUser(val)
        .then(res=>{
          if (res.code === 200) {
            this.$message.success(res.msg)
          }else {
            this.$message.error(res.msg)
          }
        }).catch(err=>{
          this.$message.warning(err)
      })
    },
    selectOrder(val){
      let userId = val.userId
      this.$router.push({
        name:'order',
        query:{
          userId:userId
        }
      })
    },
    init(page = 1){
      this.currentPage = page
      this.$api.reqGetAllUser({
        currentPage:this.currentPage,
        pageSize:this.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.total = res.data.total
        }
      })
    }

  },

  data() {
    return {
      value: true,
      tableData: [{}],
      currentPage: 1, // 当前页
      pageSize: 3, // 每页记录数
      searchObj: {
        //username用户名、time创建时间
      }, // 条件封装的对象
      list: [], // 每页数据集合
      total: 0, // 总数据数
      multipleSelection: [] // 批量选择复选框的值
    }
  }
}
</script>

<style scoped>
.el-col-2{
  text-align: center;
}
</style>
