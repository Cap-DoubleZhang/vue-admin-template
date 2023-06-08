import request from '@/utils/request'

export function getRoleMenus(query) {
  return request({
    url: `role-menu/roleMenus`,
    method: 'get',
    params: query
  })
}

export function saveRoleMenus(data) {
  return request({
    url: `role-menu/rolemenu`,
    method: 'post',
    data
  })
}

export function getCurrentUserRoleMenus(query) {
  return request({
    url: `menu/currentUserRoleMenus`,
    method: 'get',
    params: query
  })
}
