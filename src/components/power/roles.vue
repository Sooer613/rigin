<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesUser">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index1 === 0 ? 'bdtop' :'','vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' :'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRightsById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="delRightsById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRolesUser(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRoles(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRight(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addRoleClose">
      <!-- 主体内容 -->
      <el-form :model="addRole" :rules="addRoleRules" ref="addRoleRef" label-width="auto">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="50%" @close="editRoleClose">
      <!-- 主体内容 -->
      <el-form :model="editRole" :rules="editRoleRules" ref="editRoleRef" label-width="auto">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="distRightVisible" width="50%" @close="distRightClose">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="delkeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="distRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import {
  getRole_ios,
  addRole_ios,
  queryRole_ios,
  editRole_ios,
  delRole_ios,
  delRights_ios,
  getRights_ios,
  allotRights_ios
} from '@/api/index.js'
export default {
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 添加角色的验证规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDes: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 添加角色对话框的显示与隐藏
      addRoleVisible: false,
      // 添加角色参数
      addRole: { roleName: '', roleDesc: '' },
      // 编辑角色对话框的显示与隐藏
      editRoleVisible: false,
      // 查询到的角色信息
      editRole: {},
      // 编辑角色的验证规则
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDes: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3~10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      //分配权限对话框的显示与隐藏
      distRightVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点 ID 值数组
      delkeys: [],
      // 当前即将分配权限角色的 id
      roleid: ''
    }
  },
  methods: {
    async getRoleList() {
      const { data: res } = await getRole_ios()
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    },
    addRolesUser() {
      this.addRoleVisible = true
    },
    addRoleClose() {
      this.$refs.addRoleRef.resetFields()
      this.addRole.roleName = ''
      this.addRole.roleDesc = ''
    },
    addUser() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        // 发送请求
        const { data: res } = await addRole_ios(this.addRole)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        } else {
          this.$message.success('添加角色成功')
          this.getRoleList()
          this.addRoleVisible = false
        }
      })
    },
    async editRolesUser(id) {
      // 发送请求,根据 ID 查询角色
      const { data: res } = await queryRole_ios(id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      } else {
        this.editRole = res.data
      }
      this.editRoleVisible = true
    },
    editRoleClose() {
      this.$refs.editRoleRef.resetFields()
    },
    editUser() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        // 发送请求
        const { data: res } = await editRole_ios(this.editRole)
        if (res.meta.status !== 200) {
          this.$message.error('编辑角色信息失败')
        } else {
          this.$message.success('编辑角色信息成功')
          this.getRoleList()
        }
        this.editRoleVisible = false
      })
    },
    async delRoles(id) {
      // 弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除,则返回 confirm
      // 如果用户取消删除,则返回 cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('取消了删除')
      } else {
        // 发送请求
        const { data: res } = await delRole_ios(id)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.getRoleList()
        }
      }
    },
    async delRightsById(role, rightId) {
      // 弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除,则返回 confirm
      // 如果用户取消删除,则返回 cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('取消了删除')
      } else {
        // 发送请求
        const { data: res } = await delRights_ios({
          roleId: role.id,
          rightId: rightId
        })
        if (res.meta.status !== 200) {
          this.$message.error('删除权限失败')
        } else {
          this.$message.success('删除权限成功')
          // this.getRoleList()
          role.children = res.data
        }
      }
    },
    async showSetRight(role) {
      this.roleid = role.id
      // 获取所有权限的数据
      const { data: res } = await getRights_ios()
      if (res.meta.status !== 200)
        return this.$message.error('获取权限数据失败')
      this.$message.success('获取权限数据成功')
      this.rightsList = res.data
      this.getTreeKeys(role, this.delkeys)
      this.distRightVisible = true
    },
    // 通过递归,获取角色下所有三级权限的 id 并保存到 delkeys 数组中
    getTreeKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getTreeKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    distRightClose() {
      this.delkeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      // 发送请求
      const { data: res } = await allotRights_ios({
        roleId: this.roleid,
        rids: idStr
      })
      if(res.meta.status !== 200) return this.$message.error('授权失败')
      this.$message.success('授权成功')
      this.getRoleList()
      this.distRightVisible = false
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>
<style scoped>
</style>