<template>
    <div class="login_container">
     <div class="login_box">
         <!-- 头像区域 -->
         <div class="avater_box">
             <img src="@/assets/340.jpg" alt="">
         </div>
         <!-- 登录表单区域 -->
         <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="username" >
                <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input prefix-icon="
               iconfont icon-3702mima" v-model="loginForm.password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
         </el-form>
     </div>
    </div>
</template>

<script>
import {login_ios} from '@/api/index.js'
export default {
    data () {
        return {
            // 登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                username: [{
                    required: true,
                    message: '请输入登录名称',
                    trigger: 'blur'
                },
                {
                 min: 3, 
                 max: 10, 
                 message: '长度在 3 到 10 个字符', 
                 trigger: 'blur'   
                }],
                // 验证密码是否合法
                password: [
                   { required: true, 
                   message: '请输入登录密码', 
                   trigger: 'blur' 
                   },
                   { min: 6, 
                   max: 15, 
                   message: '长度在 6 到 15 个字符', 
                   trigger: 'blur' 
                   } 
                ]
            }
        }
    },
    methods: {
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields()
        },
        login () {
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) {
                    return alert('登录失败')
                } else {
                    const {data: res} =await login_ios(this.loginForm)
                    if(res.meta.status != 200) {
                        return this.$message.error('登录失败！')
                    } else {
                        console.log(res,898989)
                        
                        this.$message.success('登录成功')
                        window.sessionStorage.setItem('token', res.data.token)
                        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                        this.$router.push('/home')
                    }
                }
            })
        }

    }
}
</script>
<style lang="less" scoped>
 .login_container {
     height: 100%;
     background-color: #2b4b6b;
 }
 .login_box {
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%,-50%);
     width: 450px;
     height: 300px;
     background-color: #fff;
     border-radius: 5px;

     .avater_box{
         width: 130px;
         height: 130px;
        border:1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
     }
 }
 .login_form{
     position: absolute;
     bottom: 0;
     width: 100%;
     padding: 0 20px;
     box-sizing: border-box;
     .btns {
         display: flex;
         justify-content: flex-end;
     }
 }
</style>
