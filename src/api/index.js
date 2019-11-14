import axios from 'axios'
// 配置请求的跟路径
// axios.defaults.baseURL = 'http://klxin.cn:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://192.168.82.58:8888/api/private/v1/'
axios.defaults.baseURL = 'http://192.168.82.65:8888/api/private/v1/'

// 登录接口
export let login_ios = function(params) {
    return axios.post('login', params)
}

// 用户数据接口
export let menu_ios = function() {
    return axios.get('menus')
}

// 获取用户列表数据
export let user_ios = function(params) {
    return axios.get('users', params)
}

// 修改用户状态接口
export let state_ios = function(params) {
    return axios.put(`users/${params.params.id}/state/${params.params.mg_state}`)
}

// 添加用户接口
export let addUser_ios = function(params) {
    return axios.post('users', params)
}

// 根据 id 查询用户信息接口
export let queryUser_ios = function(params) {
    return axios.get(`users/${params}`)
}

// 编辑用户接口
export let modifyUser_ios = function(params) {
    return axios.put(`users/${params.id}`, params)
}

// 删除用户接口
export let removeUser_ios = function(params) {
    return axios.delete(`users/${params}`)
}

// 获取权限列表接口
export let getRightsList_ios = function() {
    return axios.get(`rights/list`)
}

// 获取角色列表接口
export let getRole_ios = function() {
    return axios.get('roles')
}

// 添加角色接口
export let addRole_ios = function(params) {
    return axios.post('roles', params)
}

// 根据 id 查询角色接口
export let queryRole_ios = function(params) {
    return axios.get(`roles/${params}`)
}

// 编辑角色接口
export let editRole_ios = function(params) {
    return axios.put(`roles/${params.roleId}`, { roleName: params.roleName, roleDesc: params.roleDesc })
}

// 删除角色接口
export let delRole_ios = function(params) {
    return axios.delete(`roles/${params}`)
}

// 删除角色指定权限的接口
export let delRights_ios = function(params) {
    return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`)
}

// 获取所有权限的接口
export let getRights_ios = function() {
    return axios.get('rights/tree')
}

// 角色授权接口
export let allotRights_ios = function(params) {
    return axios.post(`roles/${params.roleId}/rights`, { rids: params.rids })
}