<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本信息" name="baseInfo">
              <div class="user-activity">
                <div class="box-center" style="width: 100%">
                  <el-form
                    ref="dataFormBaseInfo"
                    :rules="rulesBaseInfo"
                    :model="user"
                    label-position="right"
                    label-width="90px"
                    style="width: 85%; margin-left: 50px"
                  >
                    <el-form-item label="登录名" prop="userLoginName">
                      <el-input v-model="user.userLoginName" disabled />
                    </el-form-item>
                    <el-form-item label="昵称" prop="userShowName">
                      <el-input v-model="user.userShowName" placeholder="请输入昵称" />
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input
                        v-model="user.descripts"
                        type="textarea"
                        placeholder="请输入描述"
                        :autosize="{ minRows: 3, maxRows: 4 }"
                        maxlength="200"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updateBaseInfo()"> 确认保存 </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="更改密码" name="updatePassword">
              <div class="user-activity">
                <div class="box-center" style="width: 100%">
                  <el-form
                    ref="dataFormPassword"
                    :rules="rulesPassword"
                    :model="password"
                    label-position="right"
                    label-width="100px"
                    style="width: 85%; margin-left: 50px"
                  >
                    <el-form-item label="原密码" prop="oldPassword">
                      <el-input
                        v-model="password.oldPassword"
                        show-password
                        placeholder="请输入原密码"
                      />
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input
                        v-model="password.newPassword"
                        show-password
                        placeholder="请输入新密码"
                      />
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="reNewPassword">
                      <el-input
                        v-model="password.reNewPassword"
                        show-password
                        placeholder="请输入确认新密码"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updatePassword()"> 确认保存 </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getUserInfo, updateUserPassword, saveUser } from '@/api/system/user'

export default {
  data() {
    return {
      user: {
        userLoginName: '',
        userShowName: '',
        descripts: ''
      },
      password: {
        oldPassword: '',
        newPassword: '',
        reNewPaswword: ''
      },
      activeTab: 'baseInfo',
      rulesBaseInfo: {
        userLoginName: [{ required: true, message: '用户名不可为空.', trigger: 'blur' }],
        userShowName: [{ required: true, message: '昵称不可为空.', trigger: 'blur' }]
      },
      rulesPassword: {
        oldPassword: [
          { required: true, message: '原密码不可为空.', trigger: 'blur' },
          { min: 6, message: '原密码不可小于6位字符.', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不可为空.', trigger: 'blur' },
          { min: 6, message: '新密码不可小于6位字符.', trigger: 'blur' }
        ],
        reNewPassword: [
          { required: true, message: '确认新密码不可为空.', trigger: 'blur' },
          { min: 6, message: '确认新密码不可小于6位字符.', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserInfo().then(response => {
        this.user = response.data
      })
    },
    updateBaseInfo() {
      this.$refs['dataFormBaseInfo'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.user)
          saveUser(tempData).then(() => {
            this.getUser()
            this.$notify({
              message: '更改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更改密码方法
    updatePassword() {
      this.$refs['dataFormPassword'].validate(valid => {
        if (valid) {
          updateUserPassword(this.password).then(() => {
            this.$message({
              message: '操作成功.',
              type: 'success',
              duration: 2000
            })
            this.password = {
              oldPassword: '',
              newPassword: '',
              reNewPaswword: ''
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
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
