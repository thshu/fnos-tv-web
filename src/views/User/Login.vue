<script setup>
import VueCookies from 'vue-cookies';
import {getCurrentInstance, onMounted, ref, watch, onUnmounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import QrcodeVue from 'qrcode.vue'


// 将组件注册到本地
defineOptions({
  components: {QrcodeVue}
})

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
const qrData = ref(null)
const isQr = ref(false)
const qrCode = ref(null)  // 存储二维码code
const qrCheckTimer = ref(null)  // 存储定时器


async function LoginUser() {
  let api = "/api/v1/login"
  let res = await COMMON.requests("POST", api, false, user.value)
  VueCookies.set('authorization', res.token, -1)
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
  VueCookies.set('authorization', res.token, -1)
  COMMON.ShowMsg('登录成功！')
  // 打开名为 home 的窗口（若存在，就返回它的引用）
  const parentWin = window.open('', 'home');
  if (parentWin) {
    parentWin.location.href = '/';
  }
  // window.location.href = '/' // 父窗口跳转
  window.close() // 关闭当前窗口
}

// 检查二维码登录状态
async function checkQrLoginStatus() {
  if (!qrCode.value) return;
  
  try {
    let api = `/api/v1/logincode/${qrCode.value}`
    let res = await COMMON.requests("GET", api, false)
    if (res.status === 'Success') {
      // 登录成功，清除定时器
      clearInterval(qrCheckTimer.value)
      qrCheckTimer.value = null
      
      // 设置token并跳转
      VueCookies.set('authorization', res.token, -1)
      COMMON.ShowMsg('登录成功！')
      await router.push('/')
    }
  } catch (error) {
    console.error('检查二维码登录状态失败:', error)
  }
}

// 开始监控二维码登录状态
function startQrLoginCheck() {
  // 清除可能存在的旧定时器
  if (qrCheckTimer.value) {
    clearInterval(qrCheckTimer.value)
    qrCheckTimer.value = null
  }
  
  // 每2秒检查一次登录状态
  qrCheckTimer.value = setInterval(checkQrLoginStatus, 2000)
}

// 停止监控二维码登录状态
function stopQrLoginCheck() {
  if (qrCheckTimer.value) {
    clearInterval(qrCheckTimer.value)
    qrCheckTimer.value = null
  }
  qrCode.value = null
}

async function getQr() {
  let api = "/api/v1/logincode/generate"
  let res = await COMMON.requests("PUT", api, false)
  let _code = res.code;
  if (_code === undefined || _code === null) {
    COMMON.ShowMsg('获取登录二维码失败！')
    return;
  }
  qrCode.value = _code  // 保存二维码code
  qrData.value = `fn://com.trim.tv/trim.media-center?platform=AndroidTV&osver=35&clientName=飞牛影视TV&code=${_code}&event=scanLogin&deviceName=${ConfigData.value.server_name}`
  startQrLoginCheck()  // 开始监控登录状态
}

// 监听二维码显示状态
watch(isQr, (newVal) => {
  if (newVal) {
    // 切换到二维码登录时，获取新的二维码
    getQr()
  } else {
    // 切换到账号登录时，停止监控
    stopQrLoginCheck()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopQrLoginCheck()
})

async function getConfig() {
  let api = '/api/v1/sys/config'
  ConfigData.value = await COMMON.requests("GET", api);
  if (ConfigData.value !== undefined) {
    localStorage.setItem("title", ConfigData.value.server_name)
  }
}

async function GetFnUrl() {
  const instance = axios.create()
  let api = "/api/getFnUrl"
  let res = await instance.get(api)
  return res.data;
}

async function OpenNasLogin() {
  let fnUrl = await GetFnUrl();
  window.name = 'home';
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
          <div class="card-header">
            <h2 class="card-title">{{ isQr ? '扫码登录' : '账号登录' }}</h2>
          </div>
          <div class="create-post-from" v-if="!isQr">
            <div class="form-control">
              <div class="icon">
                <i class='bx bx-user'></i>
              </div>
              <input v-model="user.username" type="text" name="账号" placeholder="请输入账号" required="">
            </div>
            <div class="form-control">
              <div class="icon">
                <i class='bx bx-lock-alt'></i>
              </div>
              <input v-model="user.password" type="password" name="密码" placeholder="请输入密码" required=""
                     autocomplete="off" @keyup.enter="LoginUser">
            </div>
            <div class="form-control">
              <button class="btn login-btn" @click="LoginUser">登录</button>
            </div>
          </div>
          <div class="qr-section" v-if="isQr">
            <div class="qr-generator" v-if="qrData">
              <qrcode-vue
                  :value="qrData"
                  :size="280"
                  :level="'M'"
                  :render-as="'canvas'"
                  :margin="1"
                  class="qr-code"
              />
              <div class="qr-tip">请使用飞牛影视扫描二维码登录</div>
            </div>
            <div v-if="!qrData" class="qr-wrapper loading">
              <span class="loading-text">二维码加载中...</span>
            </div>
          </div>
          <div class="login-options">
            <button class="btn option-btn" @click="OpenNasLogin">
              <i class='bx bx-server'></i>
              NAS登录
            </button>
            <button class="btn option-btn" @click="isQr = !isQr;isQr?getQr():null;">
              <i class='bx' :class="isQr ? 'bx-user' : 'bx-qr-scan'"></i>
              {{ isQr ? '账号登录' : '扫码登录' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </n-layout-content>
</template>

<style scoped>
.login-page {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://wework.qpic.cn/wwpic/893131_WTVcr3SmScqHmY2_1675911425/0);
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  min-height: 100dvh; /* 适配移动端动态视口高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); /* 适配刘海屏 */
}

.container {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.top {
  text-align: center;
  margin-bottom: 20px;
}

.header .title {
  color: white;
  font-size: 32px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-top: 8px;
}

.md-card.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.card-title {
  color: #333;
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

.create-post-from {
  width: 100%;
  flex-shrink: 0;
}

.form-control {
  margin-bottom: 16px;
  position: relative;
  width: 100%;
}

.form-control .icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
}

.form-control input {
  width: 100%;
  padding: 14px 12px 14px 40px; /* 增加输入框高度，提升触摸体验 */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px; /* 确保字体大小不小于16px，避免iOS自动缩放 */
  transition: all 0.3s;
  background: white;
  box-sizing: border-box;
  -webkit-appearance: none; /* 移除iOS默认样式 */
}

.login-btn {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: block;
}

.qr-section {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.qr-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.qr-code {
  width: 240px !important;
  height: 240px !important;
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.qr-code canvas {
  width: 240px !important;
  height: 240px !important;
}

.qr-wrapper.loading {
  width: 240px;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.loading-text {
  color: #666;
  font-size: 16px;
}

.qr-tip {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  flex-shrink: 0;
}

.login-options {
  width: 100%;
  margin-top: 20px;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn {
  padding: 12px 20px; /* 增加按钮高度 */
  font-size: 16px;
  height: 48px; /* 增加按钮高度，提升触摸体验 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent; /* 移除移动端点击高亮 */
}

.login-btn {
  width: 100%;
  background: #1890ff;
  color: white;
  font-weight: 500;
}

.login-btn:hover {
  background: #40a9ff;
}

.option-btn {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  min-width: 100px; /* 确保按钮有最小宽度 */
  padding: 12px 16px; /* 调整内边距，使文字显示更合理 */
}

.option-btn:hover {
  background: #e8e8e8;
}

.option-btn i {
  font-size: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 12px;
  }
  
  .md-card.login-card {
    width: 100%;
    max-width: 320px;
    padding: 16px;
    margin: 0 12px;
  }
  
  .header .title {
    font-size: 24px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .qr-code {
    width: 200px !important;
    height: 200px !important;
    padding: 8px;
  }
  
  .qr-code canvas {
    width: 200px !important;
    height: 200px !important;
  }
  
  .qr-wrapper.loading {
    width: 200px;
    height: 200px;
  }
  
  .login-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .option-btn {
    width: 100%;
    min-width: 120px; /* 在移动端增加最小宽度 */
    justify-content: center;
  }
  
  .form-control {
    margin-bottom: 12px;
  }
  
  .form-control input {
    font-size: 16px;
    padding: 12px 12px 12px 40px;
  }
  
  .btn {
    height: 44px;
    font-size: 15px;
  }
}

/* 针对超小屏幕的优化 */
@media (max-width: 360px) {
  .md-card.login-card {
    padding: 12px;
  }
  
  .header .title {
    font-size: 22px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .qr-code {
    width: 180px !important;
    height: 180px !important;
  }
  
  .qr-code canvas {
    width: 180px !important;
    height: 180px !important;
  }
  
  .qr-wrapper.loading {
    width: 180px;
    height: 180px;
  }
}
</style>