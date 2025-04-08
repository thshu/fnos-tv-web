<script setup>
import flvjs from 'flv.js';
import Hls from 'hls.js';
import {getCurrentInstance, onMounted, ref} from "vue";

import Artplayer from "./ArtPlayer.vue";
import {onBeforeRouteLeave, onBeforeRouteUpdate} from "vue-router";
import artplayerPluginDanmuku from "artplayer-plugin-danmuku";

const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;

let art = null;
const guid = ref(null);
const episode_guid = ref(null);
const gallery_type = ref(null);
const EpisodeList = ref(null);
const StreamList = ref(null);
const QualityData = ref(null);
const playInfo = ref(null);
const showModal = ref(false);
const loading = ref(true);
const urlBase = ref(null);
const url = ref(null);
const timerList = ref([]);
const emojos = ref(null);

const qualitySelector = ref([]);

guid.value = proxy.$route.query.guid
episode_guid.value = proxy.$route.query.episode_guid
gallery_type.value = proxy.$route.query.gallery_type

var danmu_setting = window.localStorage.danmu_setting;
if (danmu_setting === undefined) {
  danmu_setting = JSON.stringify({
    value: {
      speed: 8.5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
      opacity: 0.5, // 弹幕透明度，范围在[0 ~ 1]
      fontSize: '3%', // 字体大小，支持数字和百分比
      color: '#FFFFFF', // 默认字体颜色
      mode: 0, // 默认模式，0-滚动，1-静止
      margin: [10, '75%'], // 弹幕上下边距，支持数字和百分比
      antiOverlap: true, // 是否防重叠
      useWorker: true, // 是否使用 web worker
      synchronousPlayback: true, // 是否同步到播放速度
      theme: 'light', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
      heatmap: false, // 是否开启弹幕热度图, 默认为 false
      beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送
      emitter: false,
      mount: undefined

    }
  })

}
danmu_setting = JSON.parse(danmu_setting).value

const setting = ref({
  url: "",
  id: "",
  customType: {
    m3u8: function (video, url) {
      var hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
    },
    flv: function (video, url) {
      const flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: url
      })
      flvPlayer.attachMediaElement(video)
      flvPlayer.load()
    },
    mkv: function (video, url) {
      const flvPlayer = flvjs.createPlayer({
        type: 'mkv',
        url: url
      })
      flvPlayer.attachMediaElement(video)
      flvPlayer.load()
    },
    mp4: function (video, url) {
      const flvPlayer = flvjs.createPlayer({
        type: 'mkv',
        url: url
      })
      flvPlayer.attachMediaElement(video)
      flvPlayer.load()
    }
  },
  title: "",
  hotkey: true,
  poster: '',
  volume: 0.5,
  isLive: false,
  muted: false,
  autoplay: false,
  lock: true,
  pip: false,
  autoSize: false,
  autoMini: true, // 当播放器滚动到浏览器视口以外时，自动进入 迷你播放 模式
  screenshot: !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
  setting: true,
  loop: true,
  flip: false,    // 是否显示视频翻转功能，目前只出现在 设置面板 和 右键菜单 里
  playbackRate: false,
  aspectRatio: true,
  fastForward: true,
  fullscreen: true,
  fullscreenWeb: !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
  subtitleOffset: false,
  miniProgressBar: false,
  mutex: true,
  backdrop: true,
  playsInline: true,
  autoPlayback: true,
  airplay: true,
  theme: '#23ade5',
  lang: navigator.language.toLowerCase(),
  // whitelist: [(ua) => /iPhone/gi.test(ua)],
  moreVideoAttr: {
    crossOrigin: 'anonymous',
  },
  settings: [],
  controls: [
    // {
    //     position: 'right',
    //     index: 15,
    //     html: '<img width="18" heigth="18" src="./images/download.svg">',
    //     tooltip: '下载视频',
    //     style: {
    //         color: 'red',
    //     },
    //     click: function () {
    //         const a = document.createElement('a');
    //         a.setAttribute('href', url.value);
    //         a.setAttribute('target', "_blank");
    //         a.setAttribute('download', "001.mp4");
    //         a.click();
    //     },
    // }


  ],
  quality: [],
  icons: {
    loading: '<img width="60" heigth="60" src="./images/loading.gif">',
    state: '<img width="60" heigth="60" src="./images/play2.svg">',
    indicator: '<img width="16" heigth="16" src="./images/indicator.svg">',
  },
  plugins: [
    artplayerPluginDanmuku(danmu_setting)
  ],
})

const ArtplayerStyle = {
  width: '100%',
  // 用 vw 单位保持 16:9：100vw * 9 / 16 = 56.25vw
  height: '56.25vw',
  // 可选：不让它超过视口高度，避免滚动
  maxHeight: 'calc(100vh - 150px)',
  margin: '0 auto',
}

const loadDanmuku = () => () => new Promise(resolve => {
  let danmuku = `/danmu/get?douban_id=${playInfo.value.douban_id}&episode_number=${playInfo.value.episode_number}`;
  fetch(danmuku)
      .then(res => res.json())
      .then(json => resolve(json[playInfo.value.episode_number]))
})

// 切换清晰度
async function switchQuality(item, $dom, event) {

}

async function GetEpisodeList() {
  let api = "/api/v1/episode/list/" + episode_guid.value;
  let res = await COMMON.requests("GET", api)
  if (res.data.code === 0) {
    EpisodeList.value = res.data.data;
  }
}

// 获取播放信息
async function GetPayInfo() {
  let api = "/api/v1/play/info";
  let _data = {
    "item_guid": episode_guid.value
  }
  let res = await COMMON.requests("POST", api, _data)
  if (res.data.code === 0) {
    playInfo.value = res.data.data.item;
  }
}

async function GetStreamList() {
  let api = "/api/v1/stream/list/" + episode_guid.value;
  let res = await COMMON.requests("GET", api)
  if (res.data.code === 0) {
    StreamList.value = res.data.data;
  }
}

// 获取清晰度
async function GetQuality() {
  let api = "/api/v1/play/quality"
  let _data = {
    "media_guid": StreamList.value.video_streams[0].media_guid
  }
  let res = await COMMON.requests("POST", api, _data);
  if (res.data.code === 0) {
    QualityData.value = res.data.data;
    let oneList = []
    let twoDict = {}
    let selector = []
    for (let i = 0; i < res.data.data.length; i++) {
      if (oneList.includes(res.data.data[i].resolution)) {
        if (!twoDict[res.data.data[i].resolution].includes(res.data.data[i].bitrate)) {
          twoDict[res.data.data[i].resolution].push(res.data.data[i].bitrate)
        }
      } else {
        oneList.push(res.data.data[i].resolution)
        twoDict[res.data.data[i].resolution] = [res.data.data[i].bitrate]
      }
    }

    for (const item of oneList) {
      let Bases = {
        html: item,
        selector: [],

      }
      for (const _item of twoDict[item]) {
        Bases.selector.push(
            {
              html: _item,
            }
        )
      }
      selector.push(Bases)
    }
    qualitySelector.value = selector

  }
}

async function GetPalyUrl() {
  let api = "/api/v1/play/play"
  let _data = {
    "media_guid": StreamList.value.video_streams[0].media_guid,
    "video_guid": StreamList.value.video_streams[0].guid,
    "video_encoder": StreamList.value.video_streams[0].codec_name,
    "resolution": QualityData.value[0].resolution,
    "bitrate": StreamList.value.video_streams[0].bps,
    "startTimestamp": playInfo.value.watched_ts,
    "audio_encoder": "aac",
    "audio_guid": StreamList.value.audio_streams[0].guid,
    "subtitle_guid": "",
    "channels": StreamList.value.audio_streams.find(o=>o.codec_name === "aac").channels
  };
  let res = await COMMON.requests("POST", api, _data)
  if (res.data.code === 0) {
    urlBase.value = res.data.data.play_link;
    url.value = COMMON.fnHost +  res.data.data.play_link;
  }
}

async function SendPlayRecord() {
  if (art.currentTime >= 5) {
    let api = "/api/v1/play/record"
    let data = {
      "item_guid": episode_guid.value,
      "media_guid": StreamList.value.video_streams[0].media_guid,
      "video_guid": StreamList.value.video_streams[0].guid,
      "audio_guid": StreamList.value.audio_streams[0].guid,
      "subtitle_guid": "",
      "resolution": QualityData.value[0].resolution,
      "bitrate": QualityData.value[0].bitrate,
      "ts": Math.floor(art.currentTime),
      "duration": art.duration,
      "play_link": urlBase.value
    }
    let res = await COMMON.requests("POST", api, data)
  }
}

async function GetEmoji() {
  try {
    let api = "/danmu/getEmoji?douban_id=" + playInfo.value.douban_id
    let res = await fetch(api)
    let res_json = await res.json()
    emojos.value = res_json
  } catch {
    emojos.value = []
  }

}

async function addArtConfig(_art, key, v) {
  try {
    _art[key].remove(v.name)
  } catch (err) {
  }
  _art[key].add(v)
}

async function UpdateControl(_art) {
  console.log(1)

  let 倍速 = {
    name: '倍速',
    position: 'right',
    html: '倍速',
    selector: [
      {
        html: 0.5,
      },
      {
        html: 0.8,
      },
      {
        html: 1,
      }, {
        html: 1.2,
      }, {
        html: 1.5,
      }, {
        html: 1.8,
      }, {
        html: 2,
      }, {
        html: 2.5,
      }, {
        html: 2.8,
      }, {
        html: 3,
      },
    ],
    onSelect: function (item, $dom) {
      art.playbackRate = item.html;
      return `${item.html}`;
    },
  }
  let 下一集 = {
    name: '下一集',
    position: 'left',
    index: 11,
    html: '<img width="22" heigth="22" src="./images/next.svg">',
    tooltip: '下一集',
    style: {
      color: 'green',
    },
    click: function () {
      play_next()
    }
  }
  for (let item of [倍速, 下一集]) {
    await addArtConfig(_art, 'controls', item)
  }
}


async function ready() {
  art.seek = playInfo.value.watched_ts
  await UpdateControl(art);
  art.plugins.artplayerPluginDanmuku.reset();
  art.plugins.artplayerPluginDanmuku.load(loadDanmuku());
}

const artF = async (data) => {
  art = data;
  art.on('restart', () => {
    ready();
    url.value = encodeURI(art.url);
  });
  art.on('ready', ready);
  art.on('video:ratechange', () => {
    localStorage.playbackRate = art.playbackRate;
  });
  art.on("video:timeupdate", () => {
    var params = new URLSearchParams(window.location.search);
    if (params.get("gallery_type") === "tv") {
      var duration = art.duration;
      var tail_time = EpisodeList.value.tail_time;
      if (tail_time > duration / 3) {
        return
      }
      art.storage.name = 'skip';
      var is_skip = art.storage.get('skip');
      art.storage.name = 'artplayer_settings';

      if ((art.currentTime + tail_time) > duration && (is_skip === undefined || is_skip)) {
        art.currentTime = 1
        next_set()
      }
    }


  })
  art.on('video:ended', () => {
    next_set()
  });

  art.on('artplayerPluginDanmuku:config', (option) => {
    art.storage.name = 'danmu_setting';
    var o = JSON.parse(JSON.stringify(option))
    delete o.danmuku;
    delete o.mount;
    art.storage.set("value", o);
    art.storage.name = 'artplayer_settings';
  });
  art.on('artplayerPluginDanmuku:visible', (danmu) => {
    const $ref = danmu.$ref;
    let text = $ref.textContent;
    // 正则表达式，用于匹配被中括号括起来的内容
    const regex = /\[([^\]]+)\]/g;
    // 用于存储匹配结果的数组
    let matches = [];
    // 使用正则表达式的 exec 方法匹配所有符合条件的内容
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }

    // 从对象转换为 Map，提高查找性能
    const emojosMap = new Map(Object.entries(emojos.value));

    // 一次性替换所有匹配项
    matches.forEach(match => {
      const emojo = emojosMap.get(`[${match}]`);
      if (emojo !== undefined) {
        text = text.replace(`[${match}]`, `<img src="${emojo}" style="width: ${danmu.fontSize}px;"/>`);
      }
    });
    $ref.innerHTML = text;
  });
  // art.on('pause', () => {
  //   if_play.value = false;
  // });
  // art.on('play', () => {
  //   if_play.value = true;
  // });


}

async function getInstance(_art) {
  await artF(_art);
  art = _art;
  art.id = episode_guid.value
  art.url = url.value
}

const onMountedFun = async () => {
  loading.value = true;
  await GetPayInfo();
  await GetEmoji();
  await GetEpisodeList();
  await GetStreamList();
  await GetQuality();
  await GetPalyUrl()
  loading.value = false;
  timerList.value.push(setInterval(SendPlayRecord, 10000))
};

onBeforeRouteUpdate(async (to, from) => {
  guid.value = to.query.id;
  gallery_type.value = to.query.gallery_type;
  episode_guid.value = to.query.season_id;
  await onMountedFun();
});

onBeforeRouteLeave((to, from) => {
  for (var t of timerList.value) {
    clearInterval(t);
  }
});

onMounted(async () => {
  await onMountedFun();


})

</script>

<template>
  <div v-if="loading" class="load"></div>
  <div v-else class="content">
    <n-grid cols="1" item-responsive responsive="screen">
      <n-grid-item span="12 m:12 l:9 xl:9 2xl:9">
        <div class="player">
          <Artplayer class="art-player" @get-instance="getInstance" :option="setting" :style="ArtplayerStyle"/>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>


<style scoped>
h1 {
  padding: auto;
}


.player .art-player {
  background-color: black;
  width: 100%;
  aspect-ratio: 16/9;
}

.data-content {
  font-size: 16px;
}

.data-title {
  font-size: 1.4em;
  margin-bottom: 6px;
  font-weight: 500;
}

.season-title {
  font-size: 1.2em;
  margin-bottom: 4px;
}

.showContainer {
  padding-top: 8px;
  padding-bottom: 8px;
}

.show-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.data-header {
  display: flex;
  justify-content: space-between;
}

.show-card-list {
  display: flex;
  gap: 20px;
}

.show-title {
  font-size: 1.2em;
}

.show-img img {
  border-radius: 4px;
  width: 160px;
  aspect-ratio: 11/16;
}

.show-name {
  width: 160px;
  text-overflow: ellipsis;
  overflow: hidden;
}


.view-card-list {
  justify-content: space-between;
  display: flex;
  gap: 20px;
}

.view-card-list img {
  border-radius: 4px;
  width: 160px;
  aspect-ratio: 11/16;
}

.card-show-title {
  font-size: 1.2em;
  font-weight: 400;
  padding-bottom: 16px;
}

.view-item-title {
  font-size: 1.2em;
  padding-bottom: 8px;
}

.card-shows {
  margin-bottom: 20px;
}

.view-item {
  text-align: center;
}


.view-card-list .view-item {
  transform: translateY(0) scale(1);
  transition: all .2s ease-in-out;
}

.view-card-list .view-item:hover {
  transform: translateY(-4px) scale(0.95);
  transition: all .2s ease-in-out;
}

.view-item-header {
  position: absolute;
  width: 95%;
  padding-left: 4px;
}


.view-item-tag-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.view-item-tag-list .count {
  background-color: #2d8cf0 !important;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  color: white;
  padding: 4px;
  text-align: center;
}

.rating {
  color: yellow;
}

.show_like .show-item img {
  width: 120px;
  aspect-ratio: 9/12;
  border-radius: 2px;
}

.show_like .show-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}


.episode-card-item {
  display: flex;
  gap: 10px;
}

.episode-card-list img {
  width: 100%;
  max-width: 400px;
  min-width: 200px;
  max-height: 120px;
  aspect-ratio: 12/9;
}

.episode-card-list .episode-overview,
.view-item-overview {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.play-list {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
}

.play-list .play-item {

  list-style: none;
}

img.play-icon {
  width: 60px;
  height: 60px;
}

.art-video-player .art-mask .art-state {
  position: absolute;
  bottom: 65px;
  right: 30px;
}

@media (max-width: 767px) {
  img.play-icon {
    width: 40px;
    height: 40px;
  }
}
</style>