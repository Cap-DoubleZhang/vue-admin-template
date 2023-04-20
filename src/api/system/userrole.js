import request from '@/utils/request'

export function getUserRoles(query) {
  return request({
    url: `user-role/user-role`,
    method: 'get',
    params: query
  })
}

export function saveUserRoles(data) {
  return request({
    url: `user-role/save`,
    method: 'post',
    data
  })
}
