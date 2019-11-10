import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://klxin.cn:8888/api/private/v1/'

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