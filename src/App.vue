<script setup>
import {getCurrentInstance, onMounted, ref, watch} from 'vue'
import VueCookies from 'vue-cookies';
import {darkTheme} from "naive-ui";

import {useMediaDbData} from './store.js'
import {useRoute} from "vue-router";

const MediaDbData = useMediaDbData()

// 获取 Vue 实例
const instance = getCurrentInstance();
const COMMON = instance.appContext.config.globalProperties.$COMMON;
let UserInfo = ref({})
let load = ref(true)
let title = COMMON.title
let collapsed = ref(false);
const dark = ref(false);
const theme = ref(null);
const data = ref(null)
const MediaDbSum = ref({})
const MediaDbInfo = ref({})
const ConfigData = ref({})
const route = useRoute();
const options = ref([
  {
    label: '注销登录',
    key: "out"
  },
])

if (COMMON.isMo) {
  collapsed.value = true;
}
const them = VueCookies.get("dark");
const collapsedItem = VueCookies.get("collapsed");
if (them === "true") {
  dark.value = true;
  theme.value = darkTheme;
}
if (collapsedItem === "true") {
  collapsed.value = true;
}


// 获取用户信息
async function GetUserInfo() {
  if (VueCookies.get('authorization') !== null) {
    let api = '/api/v1/user/info'
    UserInfo.value = await COMMON.requests("GET", api, true);
  }
  load.value = false;
}

async function getConfig() {
  let api = '/api/v1/sys/config'
  ConfigData.value = await COMMON.requests("GET", api);
  if (ConfigData.value !== undefined) {
    localStorage.setItem("title", ConfigData.value.server_name)
  }
}

async function GetMediaDbList() {
  let api = '/api/v1/mediadb/list'
  data.value = await COMMON.requests("GET", api, true);
  MediaDbData.list = data.value
}

async function GetMediaDbSum() {
  let api = '/api/v1/mediadb/sum'
  MediaDbSum.value = await COMMON.requests("GET", api, true);
}

async function GetMediaDbInfos() {
  let api = '/api/v1/item/list'

  if (data.value !== undefined) {
    for (let _d of data.value) {
      let guid = _d.guid;
      let _data = {
        "ancestor_guid": guid,
        "tags": {
          "type": [
            "Movie",
            "TV",
            "Directory",
            "Video"
          ]
        },
        "exclude_grouped_video": 1,
        "sort_type": MediaDbData.sort_type,
        "sort_column": MediaDbData.sort_column,
        "page_size": MediaDbSum.value[guid]
      }
      let res = await COMMON.requests("POST", api, true, _data);
      MediaDbInfo.value[guid] = res
      MediaDbData.info[guid] = res
    }
  }


}


const reF = async () => {
  await onMountedFun();
};


function toggDrawer() {
  collapsed.value = !collapsed.value;
  VueCookies.set("collapsed", collapsed.value);
}

function Home() {
  instance.$router.push({
    path: "/",
  })
}

function toggDark() {
  if (this.theme == null) {
    this.theme = darkTheme;
    VueCookies.set("dark", "true", 60 * 60 * 24 * 30);
    this.dark = true;
    return
  }
  if (this.theme.name === "dark") {
    this.theme = null;
    VueCookies.set("dark", "false", 60 * 60 * 24 * 30);
    this.dark = false;
  } else {
    this.theme = darkTheme;
    VueCookies.set("dark", "true", 60 * 60 * 24 * 30);
    this.dark = true;
  }
}

function handleSelect(key) {
  if (key === "out") {
    VueCookies.remove("authorization");
    COMMON.ShowMsg("注销登录成功！")
    setTimeout(function () {
      location.reload();
    }, 1000)
  }
}

async function runFunByPath(path, fun) {
  if (route.path !== path) {
    await fun()
  }
}

async function onMountedFun() {
  // 获取配置
  await getConfig();

  // 获取用户信息
  // await runFunByPath('/login', GetUserInfo)
  await GetUserInfo();
  // if (VueCookies.get("authorization")) {

  // 获取每个分类的数量
  // await runFunByPath('/login', GetMediaDbSum)
  await GetMediaDbSum();

  // 获取分类列表
  // await runFunByPath('/login', GetMediaDbList)
  await GetMediaDbList();

  // 获取每个分类的列表
  // await runFunByPath('/login', GetMediaDbInfos)
  await GetMediaDbInfos();
  // }

  document.title = title;
  load.value = false;
}

onMounted(async () => {
  await onMountedFun();
})

// 监听路由变化
watch(
    () => route.fullPath,
    async (newPath, oldPath) => {
      if (newPath === "/") {
        await onMountedFun();
      }
    }
);


</script>

<template>
  <div v-if="load" class="load"></div>
  <n-config-provider preflight-style-disabled=true :theme="theme" v-else>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-layout v-if="route.path !== '/login'" :class='[dark ? "dark" : "light", "home"]'>
            <n-layout-header bordered>
              <div class="header-content">
                <n-space>
                  <div @click="toggDrawer">
                    <n-button circle>
                      <i class='bx bx-menu'></i>
                    </n-button>
                  </div>
                  <div @click="Home" class="title">
                    {{ title }}
                  </div>
                </n-space>
                <n-space justify="end">
                  <n-button quaternary @click="toggDark()" circle>
                    <template #icon>
                      <i v-if="dark" class='bx bx-sun'></i>
                      <i v-else class='bx bx-moon'></i>
                    </template>
                  </n-button>

                  <n-dropdown trigger="hover" placement="bottom-start" :options="options"
                              @select="handleSelect">
                    <n-avatar circle size="medium" :style="{backgroundColor:'#468DF1'}">
                      {{ UserInfo !== undefined ? UserInfo.username : '' }}

                    </n-avatar>
                  </n-dropdown>
                </n-space>
              </div>
            </n-layout-header>
            <n-layout position="absolute" style="top: 60px;" has-sider>
              <n-layout-sider :collapsed="collapsed" collapse-mode="width" :collapsed-width="0" :width="240"
                              :native-scrollbar="false" bordered>
                <div class="sider-item">
                  <div class="sider-item-title">个人中心</div>
                  <div class="navigation">
                    <ul class="nav-links">
                      <li>
                        <router-link to="/">
                                                    <span class="icon">
                                                        <i class='bx bx-home'></i>
                                                    </span>
                          <span class="title">主页</span>
                        </router-link>
                      </li>
                      <!--                      <li>-->
                      <!--                        <router-link to="/star">-->
                      <!--                                                    <span class="icon">-->
                      <!--                                                        <i class='bx bx-star'></i>-->

                      <!--                                                    </span>-->
                      <!--                          <span class="title">收藏</span>-->
                      <!--                        </router-link>-->
                      <!--                      </li>-->
                    </ul>
                  </div>
                </div>
                <div class="sider-item gallery-list">
                  <div class="sider-item-title">媒体库</div>
                  <div class="navigation more">
                    <ul class="nav-links">
                      <li v-for="(item, index) in data" :key="index">
                        <router-link :to="{
                                                    path: '/list', query: {
                                                        gallery_uid: item.guid,
                                                        gallery_type: item.category
                                                    }
                                                }">
                                                    <span v-if="item.category === 'Movie'" class="icon">
                                                        <i class='bx bxs-movie'></i>
                                                    </span>
                          <span v-else class="icon">
                                                        <i class='bx bx-desktop'></i>
                                                    </span>
                          <span :data-id="item.gallery_uid" class="title">{{ item.title }}</span>
                          <span class="title"
                                style="position: absolute;right: 1em;font-size: 1em;">{{ MediaDbSum[item.guid] }}</span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </n-layout-sider>
              <n-layout :native-scrollbar="false">
                <router-view/>
              </n-layout>
            </n-layout>
          </n-layout>
          <router-view v-else/>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>

</template>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  background-position: top left;
}

p {
  margin: 0;
  padding: 0;
}

ul li .title,
.sider-item-title {
  white-space: nowrap;
  font-size: 1.5em;
}


.load {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 4px solid #2d8cf0;
  border-radius: 50%;
  border-bottom-color: transparent;
  z-index: 1;
  height: 100px;
  width: 100px;
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-left: -50px;
  margin-top: -50px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.gallery-img {
  width: 100%;
  aspect-ratio: 355/200;
}

.title {
  font-size: 1.5em;
}

.content {
  padding: 12px;
}

a,
a:hover {
  text-decoration: none;
}

a {
  color: black;

}

.dark a {
  color: #fff;
}

.home {
  min-height: 100vh;
  width: -webkit-fill-available;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
  font-size: 15px;
}

.n-layout-header {
  max-width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  height: 60px;
  line-height: 60px;
  position: sticky;
  top: 0;
  z-index: 2;
}

.header-content {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

span.n-avatar {
  position: relative;
  top: 8px;
}

.navigation ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation ul li {
  position: relative;
  list-style: none;
  width: 100%;
}

.navigation ul li:hover {
  background: rgba(0, 0, 0, .1);
}

.navigation ul li a {
  position: relative;
  width: 100%;
  display: flex;
  text-decoration: none;
  color: black;
  font-weight: 500;
}

.navigation ul {
  overflow: visible;
}

.navigation ul li a .icon i {
  position: relative;
  display: block;
  min-width: 80px;
  font-size: 26px;
  line-height: 65px;
  text-align: center;
}


.navigation ul li a .title {
  position: relative;
  display: block;
  height: 60px;
  line-height: 60px;
  white-space: nowrap;
  font-size: 1.3em;
}

.sider-item-title {
  font-size: 1.4em;
  font-weight: 400;
  padding: 20px;
}


.dark .navigation ul li a .title,
.dark .navigation ul li a .icon {
  color: hsla(0, 0%, 100%, .7);
}

.light .navigation ul li a .title,
.light .navigation ul li a .icon {
  color: black;
}

.dark .navigation ul li:hover,
.light .navigation ul li:hover {
  background: rgba(0, 0, 0, .1);
}

.dark .navigation ul li a.active {
  background-color: #2d8cf0 !important;
}

.light .navigation ul li a.active .title,
.light .navigation ul li a.active .icon {
  color: #2d8cf0 !important;
}

.light .navigation.more ul li a.active .title,
.light .navigation.more ul li a.active .icon {
  display: block;
  color: black;
}

.n-layout-footer {
  text-align: center;
}
</style>
