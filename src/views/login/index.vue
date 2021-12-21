<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
            <img src="../../assets/basie/logoLogin.png" alt="">
            <h3 class="title">智能调度</h3>
            <p>Interlligent scheduling</p>
      </div>

      <div class="bgLogin">
        <p>账号密码登录</p>
        <el-form-item prop="username">
            <el-input
                placeholder="账号"
                prefix-icon="el-icon-user"
                ref="username"
                v-model="loginForm.username"
                name="username">
            </el-input>
        </el-form-item>

        <el-form-item prop="password">
            <el-input
                placeholder="密码"
                prefix-icon="el-icon-lock"
                ref="password"
                type="password"
                v-model="loginForm.password"
                name="password">
            </el-input>
        </el-form-item>

        <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>

      </div>

      <div class="tips" v-if="tips">您输入的账号或密码错误，请重新输入！<i class="el-icon-circle-close"></i></div>

    </el-form>
    <p class="copyright">@2020 交控科技 京ICP备08007677号 城市轨道交通列车通信与运行控制国家工程实验室</p>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度应大于等于6位！'))
      } else {
        callback()
      }
    }
    return {
        loginForm:{
            username:'',
            password:''
        },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      useMemo:{
        grant_type:'password',
        scope:'all',
        client_id:'web_client',
        client_secret:'123456',
        username:'',
        password:''
      },
      loading: false,
      tips:false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
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
        // this.$api.get('http://172.51.217.203:10080/oauth/token',this.useMemo).then(res => { 
        //     console.log(res);
        // })
      var self = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
            self.loading = true
            self.tips = false
            self.useMemo.username = self.loginForm.username
            self.useMemo.password = self.loginForm.password

            self.$api.get('/api/iids-msa-authen/oauth/token',self.useMemo).then(res => { 
                if(res.success){
                    self.$notify.success({
                        title: '登录成功',
                        message: res.message
                    });
                    window.localStorage.setItem('token',res.data)
                    self.$api.get('/api/iids-msa-authen/oauth/check_token',{token:res.data}).then(ress => { 
                        if(ress){
                            window.localStorage.setItem('userInfo',JSON.stringify(ress.userInfo))
                            self.ws.initWebSocket()
                            self.$router.push({ path: self.redirect || '/' })
                        }else{
                            self.$notify.success({
                                title: '登录成功',
                                message: res.message
                            });
                        }
                    })
                }
            }).catch(err => {
                self.tips = true
                self.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
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
    width: 296px;
    color: #8F9BB3;
    border-radius: 8px;

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
    color: #8F9BB3;
    position: relative;
    z-index: 2;
    display: block;
    margin-bottom: 30px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background:url(../../assets/basie/loginbg.jpg) no-repeat center center;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding-top: 200px;
    text-align: center;
  }

  .tips {
    font-size: 18px;
    color: #A82A04;
    margin-bottom: 10px;
    height: 58px;
    line-height: 58px;
    background: #F7D8CF;
    opacity: .6;
    border-radius: 4px;
    margin-top: 10px;
    i{
        font-weight: bold;
        font-size: 24px;
        margin-left: 10px;
        vertical-align: middle;
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
    color: #fff;

    .title {
      font-size: 48px;
      color: $light_gray;
      margin: 20px auto -10px auto;
      text-align: center;
      font-weight: bold;
    }
    p{font-size: 18px;}
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
  
  .bgLogin{width: 100%;height: 100%;position: relative;margin-top: 40px;}
  .bgLogin::after{background: #121626;opacity: .6;position: absolute;border-radius: 4px;z-index: 1;width: 100%;height: 100%;content: '';display: block;left: 0;top: 0;}
  .el-button,.bgLogin p{position: relative;z-index: 2;}
  .el-button{background: #333FFF;border-color: #333FFF;font-size: 16px;width: 296px !important;margin-bottom: 40px !important;border-radius: 8px;}
  .bgLogin p{color: #fff;font-size: 18px;padding: 20px 0;font-weight: bold;}
}
.login-container .el-input{height: 42px !important;}
</style>
<style>
.login-container .el-input .el-input__inner{height: 42px !important;border-radius: 8px;}
.login-container .el-form-item__error{right: 44px !important;}
.copyright{position: absolute;right: 20px;bottom: 20px;color: #fff;font-size: 14px;}
</style>
