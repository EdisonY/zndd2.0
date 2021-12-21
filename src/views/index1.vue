<template>
    <div class="index">
        <h2>
            城市轨道交通行车能力设计与检验平台11
            <span>Urban rall translt capacity design and Inspection platfrom</span>
        </h2>
        <div class="login-container">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                <!-- <el-form-item prop="username">
                    <span class="svg-container">
                        <i class="el-icon-star-on" />
                    </span>
                    <el-input
                        ref="username"
                        v-model="loginForm.line"
                        placeholder="Username"
                        name="username"
                        type="text"
                        tabindex="1"
                        auto-complete="on"
                    />
                </el-form-item> -->
                <el-form-item prop="username">
                    <span class="svg-container">
                    <svg-icon icon-class="user" />
                    </span>
                    <el-input
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="Username"
                        name="username"
                        type="text"
                        tabindex="1"
                        auto-complete="on"
                    />
                </el-form-item>

                <el-form-item prop="password">
                    <span class="svg-container">
                    <svg-icon icon-class="password" />
                    </span>
                    <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                </el-form-item>
                <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>
            </el-form>
        </div>
        <img src="../assets/basie/logo.png" class="logo">
        <p>@2020 交控科技 京ICP备08007677号 城市轨道交通列车通信与运行控制国家工程实验室</p>
    </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
export default {
    name: 'index',
    components:{
        
    },
    data () {
        // const validateUsername = (rule, value, callback) => {
        // if (!validUsername(value)) {
        //     callback(new Error('Please enter the correct user name'))
        // } else {
        //     callback()
        // }
        // }
        // const validatePassword = (rule, value, callback) => {
        // if (value.length < 6) {
        //     callback(new Error('The password can not be less than 6 digits'))
        // } else {
        //     callback()
        // }
        // }
        return {
            loginForm: {
                line:'北京7号线',
                username: '北京7号线',
                password: '111111'
            },
            loginRules: {
                // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    created () {
        
    },
    methods:{
        showPwd(){
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            var self = this
            this.loading = true
            setTimeout(()=>{
                self.$router.push({ path: 'add' || 'add' })
            },2000)
        }
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
//   min-height: 100%;
//   width: 100%;
//   background-color: $bg;
//   overflow: hidden;

  .login-form {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>


<style scoped>
@keyframes myfirst{
    0%{background-size: 100% 100%;}
    50%{background-size: 120% 120%;}
    100%{background-size: 100% 100%;}
}

.index{width: 100%;height: 100vh;background: url(../assets/basie/loginbg.jpg) no-repeat center center;background-size: 100% 100%;position: relative;animation: myfirst 30s linear infinite;}
.index h2{color: #fff;font-size: 50px;position: absolute;top: 50%;font-weight: bold;left: 40%;transform: translate(-50%,-50%);text-shadow: 1px 1px 1px #000;text-align: center;}
.index h2 span{display: block;font-size: 18px;font-weight: normal;}
.index p{position: absolute;right: 40px;bottom: 20px;color: #fff;}
.index .login-container{position: absolute;width: 300px;right: 200px;top: 50%;transform: translate(0,-50%);}
.login-container .el-form-item{display: block;margin-bottom: 22px;}
.index .logo{left: 20px;bottom: 20px;transform: translate(0,0);}
</style>
