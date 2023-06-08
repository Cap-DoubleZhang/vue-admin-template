import request from '@/utils/request'

export function getUserRoles(query) {
  return request({
    url: `user-role/userRole`,
    method: 'get',
    params: query
  })
}

export function saveUserRoles(data) {
  return request({
    url: `user-role/userRole`,
    method: 'post',
    data
  })
}
