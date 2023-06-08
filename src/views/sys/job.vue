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
          @click="getList"
        >
          查询
        </el-button>
      </el-button-group>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate">
          新增作业
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete">
          删除
        </el-button>
      </el-col>
    </el-row>

    <el-table :key="tableKey" :data="list" border fit style="width: 100%" size="mini">
      <el-table-column type="expand" fixed>
        <template #default="scope">
          <el-table
            style="margin-left: 48px; width: calc(100% - 48px)"
            :data="scope.row.jobTriggers"
            border
            size="small"
          >
            <el-table-column label="操作" width="200" align="center" show-overflow-tooltip>
              <template #default="scope">
                <el-tooltip content="编辑触发器">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    text
                    @click="openEditJobTrigger(scope.row)"
                  />
                </el-tooltip>
                <el-tooltip content="删除触发器">
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    text
                    @click="delJobTrigger(scope.row)"
                  />
                </el-tooltip>
                <el-tooltip content="更多操作" placement="top">
                  <el-dropdown class="el-button--mini" @command="jobTriggerMore">
                    <el-button type="primary" size="mini">
                      <i class="el-icon-more-outline" />
                      <!-- <i class="el-icon-arrow-down el-icon--right" /> -->
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="{ type: 'openAddJobTrigger', params: scope.row }"
                      >启动触发器</el-dropdown-item>
                      <el-dropdown-item
                        :command="{ type: 'openAddJobTrigger', params: scope.row }"
                      >暂停触发器</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-tooltip>
              </template>
            </el-table-column>
            <!-- <el-table-column type="index" label="序号" width="55" align="center" /> -->
            <el-table-column
              prop="triggerId"
              label="触发器编号"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column prop="triggerType" label="类型" show-overflow-tooltip />
            <el-table-column prop="assemblyName" label="程序集" show-overflow-tooltip />
            <el-table-column prop="args" label="参数" show-overflow-tooltip />
            <el-table-column prop="description" label="描述" width="120" show-overflow-tooltip />
            <el-table-column
              prop="status"
              label="状态"
              width="100"
              align="center"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag v-if="scope.row.status == 0" type="warning" effect="plain"> 积压 </el-tag>
                <el-tag v-if="scope.row.status == 1" type="" effect="plain"> 就绪 </el-tag>
                <el-tag v-if="scope.row.status == 2" type="success" effect="plain">
                  正在运行
                </el-tag>
                <el-tag v-if="scope.row.status == 3" type="danger" effect="plain"> 暂停 </el-tag>
                <el-tag v-if="scope.row.status == 4" type="danger" effect="plain"> 阻塞 </el-tag>
                <el-tag v-if="scope.row.status == 5" type="" effect="plain">
                  由失败进入就绪
                </el-tag>
                <el-tag v-if="scope.row.status == 6" type="danger" effect="plain"> 归档 </el-tag>
                <el-tag v-if="scope.row.status == 7" type="danger" effect="plain"> 崩溃 </el-tag>
                <el-tag v-if="scope.row.status == 8" type="danger" effect="plain"> 超限 </el-tag>
                <el-tag v-if="scope.row.status == 9" type="danger" effect="plain">
                  无触发时间
                </el-tag>
                <el-tag v-if="scope.row.status == 10" type="danger" effect="plain"> 未启动 </el-tag>
                <el-tag v-if="scope.row.status == 11" type="danger" effect="plain">
                  未知作业触发器
                </el-tag>
                <el-tag v-if="scope.row.status == 12" type="danger" effect="plain">
                  未知作业处理程序
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="起始时间"
              width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="endTime"
              label="结束时间"
              width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="lastRunTime"
              label="最近运行时间"
              width="140"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="nextRunTime"
              label="下一次运行时间"
              width="140"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="numberOfRuns"
              label="触发次数"
              width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="maxNumberOfRuns"
              label="最大触发次数"
              width="120"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="numberOfErrors"
              label="出错次数"
              width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="maxNumberOfErrors"
              label="最大出错次数"
              width="120"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="numRetries"
              label="重试次数"
              width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="retryTimeout"
              label="重试间隔ms"
              width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="startNow"
              label="是否立即启动"
              width="100"
              align="center"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag v-if="scope.row.startNow == true"> 是 </el-tag>
                <el-tag v-else type="info"> 否 </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="runOnStart"
              label="是否启动时执行一次"
              width="150"
              align="center"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag v-if="scope.row.runOnStart == true"> 是 </el-tag>
                <el-tag v-else type="info"> 否 </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="resetOnlyOnce"
              label="是否重置触发次数"
              width="120"
              align="center"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag v-if="scope.row.resetOnlyOnce == true"> 是 </el-tag>
                <el-tag v-else type="info"> 否 </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="更新时间"
              width="140"
              align="center"
              show-overflow-tooltip
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tooltip content="编辑作业" placement="top">
            <el-button
              v-auth="'sysJob:update'"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              text
              @click="editJobDetail(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除作业" placement="top">
            <el-button
              v-auth="'sysJob:delete'"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              text
              @click="delJobDetail(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="更多操作" placement="top">
            <el-dropdown class="el-button--mini" @command="more">
              <el-button type="primary" size="mini">
                <i class="el-icon-more-outline" />
                <!-- <i class="el-icon-arrow-down el-icon--right" /> -->
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ type: 'openAddJobTrigger', params: scope.row }"
                >新增触发器</el-dropdown-item>
                <el-dropdown-item
                  :command="{ type: 'openAddJobTrigger', params: scope.row }"
                >启动作业</el-dropdown-item>
                <el-dropdown-item
                  :command="{ type: 'openAddJobTrigger', params: scope.row }"
                >暂停作业</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="55" align="center" /> -->
      <el-table-column prop="jobId" label="作业编号" width="150">
        <template slot-scope="{ row }">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 5px">{{ row.jobId }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="groupName" label="组名称" show-overflow-tooltip />
      <el-table-column prop="jobType" label="类型" show-overflow-tooltip />
      <el-table-column prop="assemblyName" label="程序集" show-overflow-tooltip />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column
        prop="concurrent"
        label="执行方式"
        width="100"
        align="center"
        show-overflow-tooltip
      >
        <template #default="row">
          <el-tag v-if="row.concurrent == true" type="success"> 并行 </el-tag>
          <el-tag v-else type="warning"> 串行 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createFromScript"
        label="脚本创建"
        width="100"
        align="center"
        show-overflow-tooltip
      >
        <template #default="row">
          <el-tag v-if="row.createFromScript == true"> 是 </el-tag>
          <el-tag v-else type="info"> 否 </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="properties" label="额外数据" show-overflow-tooltip />
      <el-table-column
        prop="updatedTime"
        label="更新时间"
        width="160"
        align="center"
        show-overflow-tooltip
      />

      <el-table-column label="创建时间" width="160" align="center">
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
      :visible.sync="jobDetail.isShowDialog"
      :title="jobDetail.title"
      draggable
      width="1000px"
      style="margin-top: -100px"
    >
      <template #header>
        <div style="color: #fff">
          <!-- <el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle">
            <ele-Edit />
          </el-icon> -->
          <span> {{ jobDetail.title }} </span>
        </div>
      </template>
      <el-tabs v-model="jobDetail.selectedTabName">
        <el-tab-pane label="作业信息" name="jobInfo">
          <el-form ref="jobDetailForm" :model="jobDetail.info" size="mini" label-width="130px">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item
                  label="作业编号"
                  prop="jobId"
                  :rules="[{ required: true, message: '作业编号不能为空', trigger: 'blur' }]"
                >
                  <el-input
                    v-model="jobDetail.info.jobId"
                    placeholder="作业编号"
                    :disabled="jobDetail.isEdit"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item
                  label="组名称"
                  prop="groupName"
                  :rules="[{ required: true, message: '组名称不能为空', trigger: 'blur' }]"
                >
                  <el-input v-model="jobDetail.info.groupName" placeholder="组名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="执行方式" prop="concurrent">
                  <el-radio-group v-model="jobDetail.info.concurrent">
                    <el-radio :label="true">并行</el-radio>
                    <el-radio :label="false">串行</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item prop="includeAnnotations">
                  <template v-slot:label>
                    <div>
                      扫描特性触发器
                      <el-tooltip
                        raw-content
                        content="此参数只在新增作业时生效<br/>扫描定义在作业上的触发器"
                        placement="top"
                      >
                        <SvgIcon
                          name="fa fa-question-circle-o"
                          :size="16"
                          style="vertical-align: middle"
                        />
                      </el-tooltip>
                    </div>
                  </template>
                  <el-radio-group v-model="jobDetail.info.includeAnnotations">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="额外数据" prop="properties">
                  <el-input
                    v-model="jobDetail.info.properties"
                    placeholder="额外数据"
                    clearable
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="描述信息" prop="description">
                  <el-input
                    v-model="jobDetail.info.description"
                    placeholder="描述信息"
                    clearable
                    size="mini"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="脚本代码" :disabled="jobDetail.isEdit">
          <!-- <div ref="monacoEditorRef" style="width: 100%; height: 500px" /> -->
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="jobDetail.isShowDialog = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveJobDetail">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="jobTrigger.isShowDialog"
      :title="jobTrigger.title"
      draggable
      width="1000px"
      style="margin-top: -100px"
    >
      <template #header>
        <div style="color: #fff">
          <!-- <el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle">
            <ele-Edit />
          </el-icon> -->
          <span> {{ jobTrigger.title }} </span>
        </div>
      </template>
      <el-form ref="jobTriggerForm" :model="jobTrigger.info" size="mini" label-width="130px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="触发器编号" prop="triggerId" :rules="[{ required: true, message: '触发器编号不能为空', trigger: 'blur' }]">
              <el-input v-model="jobTrigger.info.triggerId" placeholder="触发器编号" clearable maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="触发器类型">
              <el-select v-model="jobTrigger.info.triggerType" style="width: 100%">
                <el-option value="Furion.Schedule.PeriodTrigger" label="间隔" />
                <el-option value="Furion.Schedule.CronTrigger" label="Cron表达式" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="间隔时间(ms)">
              <el-input-number v-model="jobTrigger.info.periodValue" placeholder="间隔时间(ms)" :min="100" :step="100" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="起始时间">
              <el-date-picker v-model="jobTrigger.info.startTime" type="datetime" placeholder="起始时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="结束时间">
              <el-date-picker v-model="jobTrigger.info.endTime" type="datetime" placeholder="结束时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="最大触发次数">
              <el-input-number v-model="jobTrigger.info.maxNumberOfRuns" placeholder="最大触发次数" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="最大出错次数">
              <el-input-number v-model="jobTrigger.info.maxNumberOfErrors" placeholder="最大出错次数" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="重试次数">
              <el-input-number v-model="jobTrigger.info.numRetries" placeholder="重试次数" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="重试间隔(ms)">
              <el-input-number v-model="jobTrigger.info.retryTimeout" placeholder="重试间隔(ms)" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="立即启动">
              <el-radio-group v-model="jobTrigger.info.startNow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="启动时执行一次">
              <el-radio-group v-model="jobTrigger.info.runOnStart">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item>
              <template v-slot:label>
                <div>
                  重置触发次数
                  <el-tooltip raw-content content="是否在启动时重置最大触发次数等于一次的作业<br/>解决因持久化数据已完成一次触发但启动时不再执行的问题" placement="top">
                    <SvgIcon name="fa fa-question-circle-o" :size="16" style="vertical-align: middle" />
                  </el-tooltip>
                </div>
              </template>
              <el-radio-group v-model="jobTrigger.info.resetOnlyOnce">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="描述信息" prop="description">
              <el-input v-model="jobTrigger.info.description" placeholder="描述信息" clearable type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="jobTrigger.isShowDialog = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveJobTrigger">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getJobDetails, saveJobDetail, deleteJobDetail, saveJobTrigger, deleteJobTrigger } from '@/api/system/job'

export default {
  name: 'ComplexTable',
  components: {
    monacoEditor
  },
  data() {
    return {
      tableKey: 0,
      // 列表
      list: null,
      // 列表条数
      total: 0,
      // 列表查询条件
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        keyWord: '',
        adminFlag: -1,
        isUse: -1
      },
      // 新增/编辑作业
      jobDetail: {
        isShowDialog: false, // 是否显示编辑框
        title: '新增作业', // 编辑框标题
        isEdit: false, // 是否为编辑状态
        selectedTabName: 'jobInfo', // 选中的标签页
        info: {
          id: 0, // 主键ID
          jobId: '', // 作业ID
          groupName: '', // 组名
          concurrent: true, // 执行方式
          includeAnnotations: true, // 扫描特型触发器
          properties: '', // 额外数据
          description: '', // 描述信息
          scriptCode: '123', // 脚本代码
          createFromScript: true // 是否为脚本创建的作业
        }
      },
      // 新增/编辑触发器
      jobTrigger: {
        isShowDialog: false, // 是否显示编辑框
        title: '新增触发器', // 编辑框标题
        info: {
          id: 0, // 主键ID
          jobId: '', // 作业ID
          triggerId: '', // 触发器ID
          triggerType: 'Furion.Schedule.PeriodTrigger', // 触发器类型
          periodValue: '', // 间隔时间(ms)
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          maxNumberOfRuns: '', // 最大触发次数
          maxNumberOfErrors: '', // 最大出错次数
          numRetries: '', // 重试次数
          retryTimeout: 1000, // 重试间隔(ms)
          startNow: true, // 立即启动
          runOnStart: true, // 启动时执行一次
          resetOnlyOnce: true, // 重置触发次数
          description: '' // 描述信息
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getJobDetails(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount
      })
    },
    // 点击新增事件
    handleCreate() {
      this.jobDetail.info = Object.assign({}, null) // copy obj
      this.jobDetail.isEdit = false
      this.jobDetail.isShowDialog = true
      this.jobDetail.selectedTabName = 'jobInfo'
    },
    // 新增/编辑作业
    saveJobDetail() {
      this.$refs['jobDetailForm'].validate(valid => {
        if (valid) {
          saveJobDetail(this.jobDetail.info).then(() => {
            this.getList()
            this.jobDetail.isShowDialog = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除作业
    delJobDetail(row) {
      const arr = []
      arr.push(row.id)
      if (this.list.length <= 1) {
        this.$message({
          message: '不可再删除.',
          type: 'error'
        })
        return
      }
      this.$confirm(`你确定删除吗？`, '提示', {}).then(() => {
        deleteJobDetail({ ids: arr }).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            message: '删除成功.',
            type: 'success'
          })
        })
      })
    },
    // 弹出编辑作业框
    editJobDetail(row) {
      this.jobDetail.info = Object.assign({}, row) // copy obj
      this.jobDetail.isEdit = true
      this.jobDetail.isShowDialog = true
      this.jobDetail.selectedTabName = 'jobInfo'
      // this.$nextTick(() => {
      //   this.$refs['updateUserForm'].clearValidate()
      // })
    },
    // 更多操作
    more(command) {
      switch (command.type) {
        case 'openAddJobTrigger':
          this.openAddJobTrigger(command.params)
          break
      }
    },
    openAddJobTrigger(row) {
      this.jobTrigger.info = Object.assign({}, null) // copy obj
      this.jobTrigger.info.jobId = row.jobId // copy obj
      this.jobTrigger.isShowDialog = true
    },
    saveJobTrigger() {
      this.$refs['jobTriggerForm'].validate(valid => {
        if (valid) {
          saveJobTrigger(this.jobTrigger.info).then(() => {
            this.getList()
            this.jobTrigger.isShowDialog = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    delJobTrigger(row) {
      const arr = []
      arr.push(row.id)
      this.$confirm(`你确定删除吗？`, '提示', {}).then(() => {
        deleteJobTrigger({ ids: arr }).then(() => {
          this.getList()
          this.$message({
            message: '删除成功.',
            type: 'success'
          })
        })
      })
    },
    openEditJobTrigger(row) {
      this.jobTrigger.info = Object.assign({}, row) // copy obj
      this.jobTrigger.info.jobId = row.jobId // copy obj
      this.jobTrigger.isShowDialog = true
    }
  }
}
</script>
<style scoped>
.filter-container,
.el-row {
  padding-bottom: 20px;
}

.option-wrapper {
  padding: 0 !important;
}
.w100{
  width: 100%;
}
</style>
