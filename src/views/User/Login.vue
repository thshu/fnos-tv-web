<script setup>
import VueCookies from 'vue-cookies';
import {ref, getCurrentInstance, onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
// 获取 Vue 实例
const instance = getCurrentInstance();
const COMMON = instance.appContext.config.globalProperties.$COMMON;
const router = useRouter();
const content = ""
const ConfigData = ref(null)
const user = ref({
  "username": "",
  "password": "",
  "app_name": "trimemedia-web"
})
let title = COMMON.title
const route = useRoute()


async function LoginUser() {
  let api = "/api/v1/login"
  let res = await COMMON.requests("POST", api, false, user.value)
  VueCookies.set('authorization', res.token)
  COMMON.ShowMsg('登录成功！')
  await router.push('/');
}

async function NasLogin(code) {
  let api = "/api/v1/auth"
  let data = {
    "source": "Trim-NAS",
    "code": code
  }
  let res = await COMMON.requests("POST", api, false, data)
  VueCookies.set('authorization', res.token)
  COMMON.ShowMsg('登录成功！')
  window.opener.location.href = '/' // 父窗口跳转
  window.close() // 关闭当前窗口
}

async function getConfig() {
  let api = '/api/v1/sys/config'
  ConfigData.value = await COMMON.requests("GET", api);
  if (ConfigData.value !== undefined) {
    localStorage.setItem("title", ConfigData.value.server_name)
  }
}

async function GetFnUrl(){
  const instance = axios.create()
  let api = "/api/getFnUrl"
  let res = await instance.get(api)
  return res.data;
}

async function OpenNasLogin() {
  let fnUrl = await GetFnUrl();
  window.open(`${fnUrl}/signin?client_id=${ConfigData.value.nas_oauth.app_id}&redirect_uri=${window.location.href}`, '_blank', 'width=600,height=400')
}

onMounted(async () => {
  await getConfig();
  if (route.query.code !== undefined) {
    await NasLogin(route.query.code);
  }
})

watch(() => route.query.code, (code) => {
  console.log('code 值变化了:', code)
})

</script>

<template>
  <n-layout-content class="login-page">
    <div class="container">
      <div class="top">
        <div class="header"><span class="title">{{ title }}</span></div>
        <div class="desc">{{ content }}</div>
      </div>
      <div class="main">
        <div class="md-card login-card">
          <div class="md-card-flex">
            <div class="md-card-header-text">
              <!--<div class="md-title add-title">登录</div>-->
            </div>
          </div>
          <div class="create-post-from">
            <div class="form-control">
              <div class="icon">
                <i class='bx bx-envelope'></i>
              </div>
              <input v-model="user.username" type="text" name="账号" placeholder="账号" required="">
            </div>
            <div class="form-control">
              <div class="icon">
                <i class='bx bx-key'></i>
              </div>
              <input v-model="user.password" type="password" name="密码" placeholder="密码" required=""
                     autocomplete="off">
            </div>
            <div class="form-control">
              <button class="btn login-btn" @click="LoginUser">登录</button>
            </div>
            <div class="form-control">
              <button class="btn login-btn" @click="OpenNasLogin" style="background: #1A1E23">NAS登录</button>
            </div>
            <!-- <div class="tool">
                <h4></h4>
                <h4 @click="RegistUser()">注册账号</h4>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </n-layout-content>
</template>

<style scoped>
.tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.md-title {
  font-size: 25px;
  margin-bottom: 10px;
}

.md-card.login-card {
  padding-top: 40px;
}

.btn {
  display: inline-block;
  color: #fff;
  text-decoration: none;
  font-family: inherit;
  width: 100px;
  background: red;
  border: none;
  padding: 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.login-btn {
  width: 100%;
}


.login-page {
  background-image: url(https://wework.qpic.cn/wwpic/893131_WTVcr3SmScqHmY2_1675911425/0);
  height: 100vh;
}

.container {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 110px 0 144px;
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  background-position-y: center;
}

.container .top {
  text-align: center;
}

.container .top .header {
  height: 44px;
  line-height: 44px;
}

.container .top .header .logo {
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
  border-style: none;
}

.container .top .header .title {
  position: relative;
  top: 2px;
  color: white;
  font-weight: 600;
  font-size: 33px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
}

.container .top .desc {
  margin-top: 12px;
  margin-bottom: 40px;
  color: white;
  font-size: 14px;
}

.md-card {
  border: 1px solid #0c0b0b;
  position: relative;
  z-index: 1;
  border-radius: 5px;
  transition: .3s cubic-bezier(.4, 0, .2, 1);
  transition-property: color, background-color;
  will-change: color, background-color;
  padding: 20px;
  background-color: #121111;
  color: white;
}

.form-control {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.form-control .icon {
  margin-right: 5px;
}

.icon i {
  font-size: 26px;
  color: red;
}

input,
input:focus {
  border: 0;
  border-bottom: 1px solid #b4becb;
  width: 100%;
  padding: 3px;
  font-size: 16px;
  outline: none;
}


@media (min-width: 1200px) {

  .container .main {
    width: 25%;
    margin: 0 auto;
  }
}


@media (min-width: 980px) {
  .container .main {
    width: 25%;
    margin: 0 auto;
  }
}


@media (min-width: 768px) and (max-width: 979px) {
  .container .main {
    width: 50%;
    margin: 0 auto;
  }
}


@media (max-width: 767px) {
  .container .main {
    width: 90%;
    margin: 0 auto;
  }

}
</style>