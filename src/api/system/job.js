import request from '@/utils/request'

// 获取作业
export function getJobDetails(query) {
  return request({
    url: 'jobDetail/pageList',
    method: 'get',
    params: query
  })
}

// 新增/编辑作业
export function saveJobDetail(data) {
  return request({
    url: 'jobDetail/save',
    method: 'post',
    data
  })
}

// 删除作业
export function deleteJobDetail(data) {
  return request({
    url: `jobDetail/delete`,
    method: 'delete',
    data
  })
}

// 新增/编辑触发器
export function saveJobTrigger(data) {
  return request({
    url: 'jobTrigger/save',
    method: 'post',
    data
  })
}

// 删除触发器
export function deleteJobTrigger(data) {
  return request({
    url: `jobTrigger/delete`,
    method: 'delete',
    data
  })
}

// 启动所有作业
export function startAllJob(data) {
  return request({
    url: `jobDetail/startAllJob`,
    method: 'post',
    data
  })
}

// 暂停所有作业
export function pauseAllJob(data) {
  return request({
    url: `jobDetail/pauseAllJob`,
    method: 'post',
    data
  })
}

// 暂停作业
export function pauseJob(data) {
  return request({
    url: `jobDetail/pauseJob`,
    method: 'post',
    data
  })
}

// 启动作业
export function startJob(data) {
  return request({
    url: `jobDetail/startJob`,
    method: 'post',
    data
  })
}

// 暂停触发器
export function pauseTrigger(data) {
  return request({
    url: `jobTrigger/pauseTrigger`,
    method: 'post',
    data
  })
}

// 启动触发器
export function startTrigger(data) {
  return request({
    url: `jobTrigger/startTrigger`,
    method: 'post',
    data
  })
}

// 强制唤醒作业调度器
export function cancelSleep(data) {
  return request({
    url: `jobTrigger/cancelSleep`,
    method: 'post',
    data
  })
}

// 强制触发所有作业持久化
export function persistAll(data) {
  return request({
    url: `jobTrigger/persistAll`,
    method: 'post',
    data
  })
}
