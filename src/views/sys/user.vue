<template>
  <div class="app-container">
    <el-row type="flex" class="filter-container">
      <el-input
        v-model="listQuery.keyWord"
        prefix-icon="el-icon-search"
        placeholder="关键词，多个关键词请使用空格分隔"
        style="width: 300px"
        size="mini"
        class="filter-item"
      />
      <el-button-group style="margin-left: 10px">
        <el-button
          class="filter-item"
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
      </el-button-group>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList" />
    </el-row>

    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column
        label="序号"
        prop="id"
        sortable="custom"
        align="center"
        width="138"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"> 编辑 </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-dropdown class="el-button--mini" @command="handleMore">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{ type: 'assignRoles', params: row }"
              >分配角色</el-dropdown-item>
              <el-dropdown-item
                :command="{ type: 'handleResetPassword', params: row }"
              >重置密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.userLoginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.userShowName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否在线" width="80px" align="center">
        <template slot-scope="{ row }">
          <el-button
            circle
            :style="{
              background: row.isOnline ? 'green' : 'gray',
              padding: '4px',
              'vertical-align': 'middle'
            }"
          />
          &nbsp;&nbsp;<span>{{ row.isOnline ? '在线' : '离线' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁用状态" width="100" align="center">
        <template slot-scope="{ row }">
          <el-switch
            slot="reference"
            v-model="row.isUse"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            @change="updateUserUse($event, row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="最近登录时间" width="160px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近登录IP" width="130px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lastLoginIP }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录次数" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.loginTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog
      title="创建用户"
      :visible.sync="dialogCreateUserFormVisible"
      style="margin-top: -100px"
    >
      <el-form
        ref="dataForm"
        :rules="createUserRules"
        :model="createUserModel"
        label-position="right"
        label-width="70px"
        style="width: 85%; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="userLoginName" class="filter-item">
          <el-input v-model="createUserModel.userLoginName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="userShowName">
          <el-input v-model="createUserModel.userShowName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="createUserModel.userPassword" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="createUserModel.descripts"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button type="primary" @click="createData()"> 确认 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="创建用户"
      :visible.sync="dialogCreateUserFormVisible"
      style="margin-top: -100px"
    >
      <el-form
        ref="createUserForm"
        :rules="createUserRules"
        :model="createUserModel"
        label-position="right"
        label-width="70px"
        style="width: 85%; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="userLoginName" class="filter-item">
          <el-input
            v-model="createUserModel.userLoginName"
            placeholder="请输入用户名"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="昵称" prop="userShowName">
          <el-input
            v-model="createUserModel.userShowName"
            placeholder="请输入昵称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="createUserModel.userPassword" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="createUserModel.descripts"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateUserFormVisible = false"> 关闭 </el-button>
        <el-button type="primary" @click="createData()"> 确认 </el-button>
      </div> </el-dialog><el-dialog
      title="编辑用户"
      :visible.sync="dialogUpdateUserFormVisible"
      style="margin-top: -100px"
    >
      <el-form
        ref="updateUserForm"
        :rules="updateUserRules"
        :model="updateUserModel"
        label-position="right"
        label-width="70px"
        style="width: 85%; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="userLoginName" class="filter-item">
          <el-input
            v-model="updateUserModel.userLoginName"
            disabled="true"
            placeholder="请输入用户名"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="昵称" prop="userShowName">
          <el-input
            v-model="updateUserModel.userShowName"
            placeholder="请输入昵称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="updateUserModel.descripts"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateUserFormVisible = false"> 关闭 </el-button>
        <el-button type="primary" @click="updateData()"> 确认 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="dialogResetPasswordVisible"
      style="margin-top: -100px"
    >
      <el-form
        ref="dataFormResetPassword"
        :rules="rulesReset"
        :model="resetPasswordTemp"
        label-position="right"
        label-width="80px"
        style="width: 85%; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="userLoginName" class="filter-item">
          <el-input
            v-model="resetPasswordTemp.userLoginName"
            placeholder="请输入用户名"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="resetPasswordTemp.newPassword"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="reNewPassword">
          <el-input
            v-model="resetPasswordTemp.reNewPassword"
            show-password
            placeholder="请输入确认密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetPasswordVisible = false"> 关闭 </el-button>
        <el-button type="primary" @click="updateUserNewPassword()"> 确认 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogUserRoleVisible" style="margin-top: -100px">
      <el-table ref="userRolesDataList" :data="userRolesData" border style="width: 100%">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column
          label="序号"
          prop="id"
          sortable="custom"
          align="center"
          width="138"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="角色名">
          <template slot-scope="{ row }">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色描述">
          <template slot-scope="{ row }">
            <span>{{ row.roleDesc }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserRoleVisible = false"> 关闭 </el-button>
        <el-button type="primary" @click="saveUserRoles"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'
import {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  updateUserIsUse,
  resetUserPassword
} from '@/api/system/user'
import { getUserRoles, saveUserRoles } from '@/api/system/userrole'
// import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination\

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  // directives: { waves },
  data() {
    return {
      // 列表key
      tableKey: 0,
      // 列表数据
      list: null,
      // 列表总条数
      total: 0,
      // 用户列表加载的动画
      listLoading: true,
      // 查询列表的条件
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: ''
      },
      // 查询用户的角色列表
      listUserRolesQuery: {
        userId: 0
      },
      // 创建用户框是否显示
      dialogCreateUserFormVisible: false,
      // 创建用户的实体类
      createUserModel: {
        userLoginName: '',
        userShowName: '',
        userPassword: '',
        descripts: ''
      },
      // 创建用户时的验证规则
      createUserRules: {
        // 用户登录名
        userLoginName: [{ required: true, message: '用户名不可为空.', trigger: 'blur' }],
        // 用户昵称
        userShowName: [{ required: true, message: '昵称不可为空.', trigger: 'blur' }],
        // 用户密码
        userPassword: [{ required: true, message: '密码不可为空.', trigger: 'blur' }]
      },
      // 编辑用户框是否显示
      dialogUpdateUserFormVisible: false,
      // 编辑用户的实体类
      updateUserModel: {
        userLoginName: '',
        userShowName: '',
        userPassword: '',
        descripts: ''
      },
      // 编辑用户时的验证规则
      updateUserRules: {
        // 用户登录名
        userLoginName: [{ required: true, message: '用户名不可为空.', trigger: 'blur' }],
        // 用户昵称
        userShowName: [{ required: true, message: '昵称不可为空.', trigger: 'blur' }]
      },
      // 重置密码实体类
      resetPasswordTemp: {
        id: 0,
        userLoginName: '',
        newPassword: '',
        reNewPassword: ''
      },
      // 重置密码框是否显示
      dialogResetPasswordVisible: false,
      dialogStatus: '',
      // 弹出编辑框的Title
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      // 重置密码时的验证规则
      rulesReset: {
        userLoginName: [{ required: true, message: '用户名不可为空.', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '新密码不可为空.', trigger: 'blur' },
          { min: 6, message: '不可小于6位字符.', trigger: 'blur' }
        ],
        reNewPassword: [
          { required: true, message: '确认密码不可为空.', trigger: 'blur' },
          { min: 6, message: '不可小于6位字符.', trigger: 'blur' }
        ]
      },
      // 用户角色编辑框是否显示
      dialogUserRoleVisible: false,
      // 保存用户角色
      userRoles: {
        userId: 0
      },
      // 回显用户角色
      userRolesData: {
        id: 0,
        roleName: '',
        promiss: false
      }
    }
  },
  created() {
    this.getList()
  },
  updated() {
    this.toggleSelection(this.userRolesData)
  },
  methods: {
    getList() {
      getUsers(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: 0,
        userLoginName: '',
        userShowName: '',
        descripts: ''
      }
    },
    // 新增用户弹出框
    handleCreate() {
      this.resetTemp()
      this.dialogCreateUserFormVisible = true
      this.$nextTick(() => {
        this.$refs['createUserForm'].clearValidate()
      })
    },
    // 创建用户
    createData() {
      this.$refs['createUserForm'].validate(valid => {
        if (valid) {
          saveUser(this.createUserModel).then(() => {
            this.getList()
            this.dialogCreateUserFormVisible = false
            this.$notify({
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑用户
    handleUpdate(row) {
      this.updateUserModel = Object.assign({}, row) // copy obj
      this.dialogUpdateUserFormVisible = true
      this.$nextTick(() => {
        this.$refs['updateUserForm'].clearValidate()
      })
    },
    // 编辑用户
    updateData() {
      this.$refs['updateUserForm'].validate(valid => {
        if (valid) {
          updateUser(this.updateUserModel).then(() => {
            this.getList()
            this.dialogUpdateUserFormVisible = false
            this.$notify({
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleResetPassword(row) {
      this.resetPasswordTemp.id = row.id
      this.resetPasswordTemp.userLoginName = row.userLoginName
      this.dialogResetPasswordVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormResetPassword'].clearValidate()
      })
    },
    updateUserUse($event, row) {
      let messgae = ''
      if ($event === 1) {
        messgae = `你确定禁用 ${row.userLoginName} 吗？`
        row.isUse = 0
      } else if ($event === 0) {
        messgae = `你确定启用 ${row.userLoginName} 吗？`
        row.isUse = 1
      }
      const arr = []
      arr.push(row.id)
      this.$confirm(messgae, '提示', {}).then(() => {
        updateUserIsUse({ ids: arr, isUse: $event }).then(() => {
          if ($event === 1) {
            row.isUse = 1
          } else if ($event === 0) {
            row.isUse = 0
          }
          this.$message({
            message: '更改成功.',
            type: 'success'
          })
        })
      })
    },
    handleDelete(row) {
      if (this.list.length <= 1) {
        this.$message({
          message: '不可再删除.',
          type: 'error'
        })
        return
      }
      const arr = []
      arr.push(row.id)
      this.$confirm(`你确定删除 ${row.userLoginName} 吗？`, '提示', {}).then(() => {
        deleteUser({ ids: arr }).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            message: '删除成功.',
            type: 'success'
          })
        })
      })
    },
    updateUserNewPassword() {
      this.$refs['dataFormResetPassword'].validate(valid => {
        if (valid) {
          resetUserPassword(this.resetPasswordTemp).then(() => {
            this.dialogResetPasswordVisible = false
            this.$message({
              message: '重置成功.',
              type: 'success'
            })
          })
        }
      })
    },
    getUserRolesList() {
      getUserRoles(this.listUserRolesQuery).then(response => {
        this.$nextTick(() => {
          this.userRolesData = response.data
          this.userRolesData.forEach(o => this.$refs.userRolesDataList.toggleRowSelection(o, true))
        })
      })
    },
    assignRoles(row) {
      this.dialogUserRoleVisible = true
      this.listUserRolesQuery.userId = row.id
      this.userRoles.userId = row.id
      this.getUserRolesList()
    },
    saveUserRoles() {
      const userRole = []
      this.$refs.userRolesDataList.selection.forEach(a => {
        userRole.push({
          userId: this.userRoles.userId,
          roleId: a.id
        })
      })
      saveUserRoles(userRole).then(() => {
        this.dialogUserRoleVisible = false
        this.$message({
          message: '操作成功.',
          type: 'success'
        })
      })
    },
    // 上传图片成功后
    uploadSuccess(respone) {
      this.temp.headPortrait = respone.data
      this.$message({
        message: '上传成功.',
        type: 'success',
        duration: 2000
      })
    },
    // 上传图片失败事件
    uploadError(respone) {
      this.$message({
        message: respone.errors,
        type: 'error',
        duration: 2000
      })
    },
    // 上传之前验证上传的是否为为图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        if (row.promiss) {
          // toggleRowSelection  这个方法是用来选中某一行（打勾）
          // row 是要选中的那一行
          // true 是为选中
          this.$refs.userRolesDataList.toggleRowSelection(row, true)
        }
      })
    },
    handleMore(command) {
      switch (command.type) {
        case 'handleResetPassword':
          this.handleResetPassword(command.params)
          break
        case 'assignRoles':
          this.assignRoles(command.params)
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container,
.el-row {
  padding-bottom: 20px;
}

.avatar-uploader .el-upload .avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover .avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
