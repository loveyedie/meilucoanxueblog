<template>
  <div class="afly-body-bg afly-login-container">
    <div class="afly-wrapper">
      <header class="afly-header">
        <div class="afly-header-top"></div>
      </header>
      <div class="afly-login-box">
        <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
          <h3 class="title">梅落残雪</h3>
          <p class="desc">系统登录</p>
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on"
                      placeholder="密码" />
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </el-form-item>

          <el-form-item prop="code">
            <span class="svg-container">
              <svg-icon icon-class="code" />
            </span>
            <el-input name="code" type="text" class="afly-code-input" v-model="loginForm.code" autoComplete="on"
                      placeholder="验证码" />
            <img class="afly-form-code" @click="changCode" :src="picCode"/>
          </el-form-item>

          <el-button type="primary" style="width:100%;" class="btn-black" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>

          <div class="tips">-- OR --</div>

          <el-button type="text" style="width:100%;" class="btn-link" :loading="loading" @click.native.prevent="gotoReg">注册</el-button>

        </el-form>

      </div>

      <nav-footer class="afly-login-footer"></nav-footer>

    </div>
  </div>

</template>

<script>
import { isvalidUsername } from "../../utils/validate"
import NavFooter from '../front/components/NavFooter.vue'

export default {
  components: {NavFooter},
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("用户名不能小于5位"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length > 5) {
        callback(new Error("验证码不能超过4位"));
      } else if(value.length < 1){
        callback(new Error("验证码不能为空"));
      }else{
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        code:''
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode}
        ]
      },
      pwdType: "password",
      picCode: '/api/code?v=' + Date.now(),
      loading: false,
      showDialog: false
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("UserLoginForm", this.loginForm)
            .then((res) => {
              this.loading = false;
              console.log(res);
              this.$router.push({ path: "/" });
              // this.showDialog = true
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    gotoReg(){
        this.$router.push({path: '/reg'})
    },
    changCode(){
        this.picCode = '/api/code?v=' + Date.now()
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.afly-login-container {
  @include relative;
  height: 100vh;
  /*background-color: $bg;*/
  .afly-login-box{height:50vh;}
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    /*color: $light_gray;*/
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 48px;
    width: 85%;
  }
  .afly-code-input{width: 40%}
  .tips {
    font-size: 14px;
    text-align: center;
    color: #666;
    margin: 20px auto;
  }
  .desc{
    font-size: 16px;
    color: #666;
     text-align: center;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #333;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 5px;
    color: #454545;
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
  .afly-form-code{
    position: absolute;
    right: 10px;
    top:6px;
    background: #ccc;
    width: 120px;
    height: 40px;
  }
  .afly-login-footer{position: absolute; bottom: 0; width: 100%;}
}
</style>
