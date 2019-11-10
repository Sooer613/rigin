<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="userLists.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="modifyUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userLists.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="userLists.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 主体内容 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="modifyVisible" width="50%" @close="modifyDialogClose">
      <el-form :model="modifyObj" :rules="modifyFormRules" ref="modifyFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="modifyObj.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyObj.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modifyObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import {
  user_ios,
  state_ios,
  addUser_ios,
  queryUser_ios,
  modifyUser_ios,
  removeUser_ios
} from '@/api/index.js'
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    // 验证手机的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的手机'))
      }
    }

    return {
      // 用户列表的参数对象
      userLists: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 用户列表数据
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      modifyVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 查询到的用户信息
      modifyObj: {},
      // 修改信息的表单验证规则
      modifyFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await user_ios({ params: this.userLists })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    async userChange(userinfo) {
      const { data: res } = await state_ios({ params: userinfo })
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    handleSizeChange(newSize) {
      this.userLists.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.userLists.pagenum = newPage
      this.getUserList()
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求
        const { data: res } = await addUser_ios(this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('创建用户失败')
        } else {
          this.$message.success('创建用户成功')
          this.addDialogVisible = false
          this.getUserList()
        }
      })
    },
    async modifyUser(id) {
      const { data: res } = await queryUser_ios(id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      } else {
        this.modifyObj = res.data
      }
      this.modifyVisible = true
    },
    modifyDialogClose() {
      this.$refs.modifyFormRef.resetFields()
    },
    modifyUserForm() {
      this.$refs.modifyFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求
        const { data: res } = await modifyUser_ios(this.modifyObj)
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败')
        } else {
           this.$message.success('更新用户信息成功')
           this.modifyVisible = false
           this.getUserList()
        }
        
      })
    },
    async removeUser(id){
      // 弹框提示
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // 如果用户确认删除,则返回 confirm 
        // 如果用户取消删除,则返回 cancel 
        if(confirmResult !== 'confirm' ) {
          this.$message.info('取消了删除')
        } else {
          // 发送请求
          const {data:res} = await removeUser_ios(id)
          if (res.meta.status !== 200) {
            this.$message.error('删除失败')
          } else {
            this.$message.success('删除成功')
            this.getUserList()
          }
        }
         
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
<style scoped>
</style>