<script setup>
import flvjs from 'flv.js';
import Hls from 'hls.js';
import {getCurrentInstance, onBeforeUnmount, onMounted, ref} from "vue";

import Artplayer from "./ArtPlayer.vue";
import {onBeforeRouteLeave, onBeforeRouteUpdate} from "vue-router";
import VueCookies from "vue-cookies";
import {usePlayerData} from "@/store.js";
import sortedIndexBy from 'lodash-es/sortedIndexBy'
import artplayerPluginDanmuku from "artplayer-plugin-danmuku";
import axios from "axios";

const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;
const device = proxy.$device;

const PlayerData = usePlayerData()
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
const playUrl = ref(null);
const skipList = ref([])
const seasonConfig = ref({})
const showSetUp = ref(false)
const timerSendPlayRecord = ref(null);
const emojos = ref(null);
const allDanmaku = ref({})
const currentSubtitle = ref(null);
const use302Play = localStorage.getItem('use_302_play');
const use_302_play = ref(use302Play === null ? false : use302Play === 'true')
const danmuTitleData = ref({
  name: "danmuTitle",
  html: "弹幕加载中...",
  style: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#fff',
    fontSize: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '4px 8px',
    borderRadius: '4px',
  }
})
const danmuConfig = ref({
  loadedUntil: 0,
  segmentDuration: 10
})

const qualitySelector = ref([]);
const currentQuality = ref(null);

const IsFullscreen = () => {
  art.fullscreen
}

guid.value = proxy.$route.query.guid
episode_guid.value = PlayerData.episode_guid
gallery_type.value = proxy.$route.query.gallery_type

var danmu_setting = window.localStorage.danmu_setting;
if (danmu_setting === undefined) {
  danmu_setting = JSON.stringify({
    value: {
      speed: 8.5,
      opacity: 0.5,
      fontSize: window.innerWidth <= 768 ? '2.5%' : '3%',
      color: '#FFFFFF',
      mode: 0,
      margin: window.innerWidth <= 768 ? [5, '85%'] : [10, '75%'],
      antiOverlap: true,
      useWorker: true,
      synchronousPlayback: true,
      theme: 'light',
      heatmap: false,
      beforeEmit: (danmu) => !!danmu.text.trim(),
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
  height: window.innerWidth <= 768 ? '56.25vw' : '56.25vw',
  maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 100px)' : 'calc(100vh - 150px)',
  margin: '0 auto',
}

const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

function getDanmuparams() {
  let episode_number = playInfo.value.episode_number === undefined ? 1 : playInfo.value.episode_number;
  let season = playInfo.value.type !== "Movie";
  let title = season ? playInfo.value.tv_title : playInfo.value.title
  let season_number = season ? playInfo.value.season_number : 1
  return `douban_id=${playInfo.value.douban_id}&episode_number=${episode_number}&title=${title}&season_number=${season_number}&season=${season}&guid=${episode_guid.value}`
}

async function loadDanmuku() {
  danmuTitleData.value.html = `弹幕加载中...`
  art.layers.update(danmuTitleData.value)
  let episode_number = playInfo.value.episode_number === undefined ? 1 : playInfo.value.episode_number;
  let danmuku = `/danmu/get?${getDanmuparams()}`;
  fetch(danmuku)
      .then(res => res.json())
      .then(json => {
        allDanmaku.value = json;
        danmuTitleData.value.html = `弹幕加载完成，${json[episode_number].length ?? 0}条数据`
        // art.plugins.artplayerPluginDanmuku.load(json[episode_number])
        art.layers.update(danmuTitleData.value)
      }).catch(err => {
    danmuTitleData.value.html = `弹幕加载失败`
    art.layers.update(danmuTitleData.value)
  })
}

// 获取清晰度
async function GetQuality() {
  let api = "/api/v1/play/quality"
  let _data = {
    "media_guid": StreamList.value.video_streams[0].media_guid
  }
  let res = await COMMON.requests("POST", api, true, _data);
  QualityData.value = res;

  // 按分辨率分组，每个分辨率下按码率排序
  const qualityGroups = {};
  res.forEach(item => {
    if (!qualityGroups[item.resolution]) {
      qualityGroups[item.resolution] = [];
    }
    qualityGroups[item.resolution].push({
      bitrate: item.bitrate,
      progressive: item.progressive
    });
  });

  // 对每个分辨率组内的码率进行排序
  Object.keys(qualityGroups).forEach(resolution => {
    qualityGroups[resolution].sort((a, b) => b.bitrate - a.bitrate);
  });

  // 构建画质选择器数据
  const selector = [];
  const resolutions = Object.keys(qualityGroups).sort((a, b) => {
    const resolutionOrder = {'4k': 4, '1080': 3, '720': 2, '480': 1, '360': 0};
    return resolutionOrder[b] - resolutionOrder[a];
  });

  resolutions.forEach(resolution => {
    const qualities = qualityGroups[resolution];
    const baseItem = {
      html: resolution,
      selector: qualities.map(quality => ({
        html: `${resolution} (${(quality.bitrate / 1000000).toFixed(1)}Mbps)`,
        bitrate: quality.bitrate,
        resolution: resolution,
        progressive: quality.progressive
      }))
    };
    selector.push(baseItem);
  });

  qualitySelector.value = selector;

  // 设置默认画质为最高质量
  if (selector.length > 0 && selector[0].selector.length > 0) {
    currentQuality.value = selector[0].selector[0];
  }
}

// 切换清晰度
async function switchQuality(item, $dom, event) {
  // 处理选择器返回的数据结构
  const qualityData = item.selector ? item.selector[0] : item;
  if (!qualityData || !qualityData.bitrate || !qualityData.resolution) {
    console.error('Invalid quality item:', qualityData);
    return;
  }

  try {
    await mediaP("media.checkPlayLink", urlBase.value)
    let api = "/api/v1/media/p";
    let _data = {
      "req": "media.resetQuality",
      "reqid": "1234567890ABCDEF2s",
      "playLink": urlBase.value,
      "quality": {
        "resolution": qualityData.resolution,
        "bitrate": qualityData.bitrate
      },
      "startTimestamp": Math.floor(art.currentTime),
      "clearCache": true
    };

    art.loading.show = true;
    let res = await COMMON.requests("POST", api, true, _data);

    if (res.updateM3u8) {
      // 更新当前画质状态
      currentQuality.value = {
        resolution: qualityData.resolution,
        bitrate: qualityData.bitrate,
        html: `${qualityData.resolution} (${(qualityData.bitrate / 1000000).toFixed(1)}Mbps)`
      };

      // 更新播放器URL
      await art.switchQuality(url.value);
      COMMON.ShowMsg(`已切换到${qualityData.resolution} (${(qualityData.bitrate / 1000000).toFixed(1)}Mbps)`);

    }
  } catch (error) {
    console.error('Failed to switch quality:', error);
    COMMON.ShowMsg('画质切换失败，请重试');
  } finally {
    art.loading.show = false;
  }
}

async function GetEpisodeList() {
  let api = "/api/v1/episode/list/" + guid.value;
  EpisodeList.value = await COMMON.requests("GET", api, true)
}

// 获取播放信息
async function GetPayInfo(_guid) {
  let api = "/api/v1/play/info";
  let _data = {
    "item_guid": _guid
  }
  let res = await COMMON.requests("POST", api, true, _data)
  return res;
}

async function GetStreamList() {
  let api = "/api/v1/stream/list/" + episode_guid.value + '?before_play=1';
  StreamList.value = await COMMON.requests("GET", api, true)
}

async function GetChannels(s) {
  return s < 6 ? 2 : device.mediaCanPlay.audioChannels >= 6 ? 6 : 2
}

async function GetPalyUrlBy302() {
  let regex = /\d+-\d+-\S+/;
  // 获取远程挂载的视频信息
  let remote = StreamList.value.files.find(o => regex.test(o.path))
  if (remote !== null && use_302_play.value) {
    let _data = {
      path: remote.path
    }
    let res = await axios.get("/api/play", {
      params: _data,
      headers: {Authorization: VueCookies.get("authorization")}
    })
    if (res.data.code === 0) {
      url.value = res.data.data;
      playUrl.value = res.data.data
    }
  }
}

async function GetPalyUrl() {
  if (art !== null && art !== undefined) {
    art.loading.show = true;
  }
  let api = "/api/v1/play/play"
  let _channels = (StreamList.value.audio_streams.length !== 1 && StreamList.value.audio_streams.find(o => o.codec_name === "aac") !== undefined ? StreamList.value.audio_streams.find(o => o.codec_name === "aac") : StreamList.value.audio_streams[0]).channels;
  let regex = /\d+-\d+-\S+/;
  let local = StreamList.value.files.find(o => !regex.test(o.path))
  if (local === null || local === undefined) {
    local = StreamList.value.files[0];
  }
  let _data = {
    "media_guid": local.guid,
    "video_guid": StreamList.value.video_streams[0].guid,
    "video_encoder": StreamList.value.video_streams[0].codec_name,
    "resolution": QualityData.value[0].resolution,
    "bitrate": StreamList.value.video_streams[0].bps,
    "startTimestamp": playInfo.value.watched_ts,
    "audio_encoder": "aac",
    "audio_guid": StreamList.value.audio_streams[0].guid,
    "subtitle_guid": currentSubtitle.value ? currentSubtitle.value.guid : "",
    "channels": await GetChannels(_channels)
  };
  let res = await COMMON.requests("POST", api, true, _data)
  if (res !== null) {
    urlBase.value = res.play_link;
    url.value = COMMON.fnHost + res.play_link;
    playUrl.value = window.location.origin + url.value
    if (use_302_play.value) {
      await GetPalyUrlBy302();
    }
  } else {
    COMMON.ShowMsg("播放链接获取失败，请切换清晰度或尝试其他操作")
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
      "play_link": urlBase.value,
      "create_time": Math.floor(Date.now() / 1000),
      "playback_speed": art.playbackRate,
      "guid": guid.value,
    }
    await COMMON.requests("POST", api, true, data)
  }
}

async function GetSkipList() {
  // const instance = axios.create()
  // let api = "/api/skipList?guid=" + guid.value
  // let res = await instance.get(api)
  // if (res.data.code === 0) {
  //   skipList.value = res.data.data
  // }
}

async function mediaP(req, playLink) {
  let api = "/api/v1/media/p"
  let data = {
    "req": req,
    "reqid": "1234567890ABCDEF",
    "playLink": playLink
  }
  let res = await COMMON.requests("POST", api, true, data)
}

async function GetEmoji() {
  try {
    let api = "/danmu/getEmoji?" + getDanmuparams()
    let res = await fetch(api)
    let res_json = await res.json()
    emojos.value = res_json
  } catch {
    emojos.value = []
  }
}

async function putVideoConfig() {
  let sendData = {
    list: [],
    url: []
  }
  if (seasonConfig.value.list !== undefined) {
    for (let item of seasonConfig.value.list) {
      if (!(item.startTime === 0 && item.endTime === 0)) {
        if (item.endTime === null) {
          // 如果endtime为空，直接跳到最后
          item.endTime = art.duration
        }
        sendData.list.push(item)
      }
    }
  }
  if (seasonConfig.value.url !== undefined) {
    for (let item of seasonConfig.value.url) {
      if (item.url !== "" && item.url !== null && item.url !== undefined) {
        sendData.url.push(item)
      }
    }
  }
  try {
    let api = "/api/videoConfig?episode_guid=" + episode_guid.value + "&guid=" + guid.value
    let res = await axios.post(api, sendData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: VueCookies.get("authorization")
      },
    })
    let res_json = await res.json()
    skipList.value = sendData.list
    seasonConfig.value = sendData
    art.plugins.artplayerPluginDanmuku.load();
    void loadDanmuku()
  } catch {
  }
  showSetUp.value = false;

}

async function getVideoConfig() {
  try {
    let api = "/api/videoConfig?episode_guid=" + episode_guid.value + "&guid=" + guid.value
    let res = await axios.get(api, {headers: {Authorization: VueCookies.get("authorization")}})
    seasonConfig.value = await res.json();
    skipList.value = seasonConfig.value.list
  } catch (err) {
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
  let forData = []

  // 添加画质选择器
  if (qualitySelector.value.length > 0) {
    const qualityControl = {
      disable: (!art.fullscreen && COMMON.isMo),
      index: 1,
      name: '画质',
      position: 'right',
      html: currentQuality.value ?
          `${currentQuality.value.resolution} (${(currentQuality.value.bitrate / 1000000).toFixed(1)}Mbps)` :
          '画质',
      selector: qualitySelector.value.map(group => ({
        html: group.html,
        selector: group.selector.map(item => ({
          html: item.html,
          bitrate: item.bitrate,
          resolution: item.resolution,
          progressive: item.progressive
        }))
      })),
      onSelect: switchQuality
    };
    forData.push(qualityControl);
  }

  let 倍速 = {
    disable: (!art.fullscreen && COMMON.isMo),
    index: 2,
    name: '倍速',
    position: 'right',
    html: art.playbackRate + 'X',
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
      return `${item.html}X`;
    },
  }
  倍速.selector.forEach(item => {
    if (item.html === art.playbackRate) {
      item.default = true;
    }
  })
  forData.push(倍速)

  if (EpisodeList.value !== null && EpisodeList.value.length > 0) {
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
    forData.push(下一集)

    let 选集_selector = []
    for (let item of EpisodeList.value) {
      选集_selector.push(
          {
            default: playInfo.value.episode_number === item.episode_number,
            html: `第${item.episode_number}集：${item.title}`,
            episode_guid: item.guid
          }
      )
    }

    let 选集 = {
      disable: (!art.fullscreen && COMMON.isMo),
      name: '选集',
      index: 4,
      position: 'right',
      html: "选集",
      selector: 选集_selector,
      onSelect: async function (item, $dom, event) {
        episode_guid.value = item.episode_guid;
        await play();
        return "选集";
      }
    }
    forData.push(选集)
  }

  for (let item of forData) {
    await addArtConfig(_art, 'controls', item)
  }

  await addArtConfig(_art, 'setting', {
    name: "跳过片头片尾",
    html: '跳过片头片尾',
    tooltip: VueCookies.get('skip') === null ? "打开" : (VueCookies.get('skip') ? "打开" : "关闭"),
    switch: VueCookies.get('skip') === null ? true : VueCookies.get('skip'),
    onSwitch: function (item, $dom, event) {
      VueCookies.set('skip', !item.switch, -1);
      const nextState = !item.switch;
      item.tooltip = nextState ? '打开' : '关闭';
      return nextState;
    },
  })
  await addArtConfig(_art, 'setting', {
    name: '是否开启302',
    html: '是否开启302',
    tooltip: use_302_play.value ? '开启' : '关闭',
    switch: use_302_play.value,
    onSwitch: async function (item, $dom, event) {
      use_302_play.value = !item.switch;
      localStorage.use_302_play = use_302_play.value
      if (use_302_play.value) {
        await GetPalyUrlBy302();
      }
      if (!use_302_play.value) {
        url.value = COMMON.fnHost + urlBase.value;
        playUrl.value = window.location.origin + url.value
      }
      if (art) {
        await art.switchUrl(url.value);
      }
      item.tooltip = use_302_play.value ? '开启' : '关闭';
      return use_302_play.value;
    },
  })

}

async function play() {
  if (timerSendPlayRecord.value !== null) {
    clearInterval(timerSendPlayRecord.value)
  }
  let playLink = urlBase.value;
  if (episode_guid.value === null) {
    let guidPlayInfo = await GetPayInfo(guid.value)
    episode_guid.value = guidPlayInfo.item.guid
  }
  let _PayInfo = await GetPayInfo(episode_guid.value);
  playInfo.value = _PayInfo.item;
  await GetStreamList();
  await GetQuality();
  await GetPalyUrl();
  await GetEmoji();
  if (art !== null) {
    await art.switchUrl(url.value);
  }
  if (playLink !== null) {
    await mediaP("media.quit", playLink)
  }
}

async function play_next() {
  let episode_data = EpisodeList.value.find(o => o.episode_number === (playInfo.value.episode_number + 1))
  episode_guid.value = episode_data.guid
  await play()
}


async function ready() {
  if (timerSendPlayRecord.value !== null) {
    clearInterval(timerSendPlayRecord.value)
  }
  art.playbackRate = localStorage.playbackRate
  art.loading.show = false;
  timerSendPlayRecord.value = setInterval(SendPlayRecord, 10000)
  art.seek = playInfo.value.watched_ts

  danmuConfig.value.loadedUntil = playInfo.value.watched_ts;
  art.layers.update(danmuTitleData.value)
  allDanmaku.value = [];
  void loadDanmuku()
  await GetSkipList();
  await getVideoConfig();
  // if (!art.plugins.hasOwnProperty("artplayerPluginDanmuku")) {
  //   // 加载自己修改的弹幕js
  //   await import('../../../public/packages//artplayer-plugin-danmuku.js');
  //   art.plugins.add(window.artplayerPluginDanmuku(danmu_setting));
  // }
  // art.plugins.artplayerPluginDanmuku.config(danmu_setting)

  await UpdateControl(art);
  art.plugins.artplayerPluginDanmuku.reset();

  art.layers.update(
      {
        name: "title",
        html: `<div class="art-title">第${playInfo.value.episode_number}集${playInfo.value.title === undefined ? "" : ":" + playInfo.value.title}</div>`,
        style: {
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: '#fff',
          fontSize: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 8px',
          borderRadius: '4px',
        }
      }
  )

}

const artF = async (data) => {
  art = data;
  art.on('restart', () => {
    ready();
  });
  art.on('ready', ready);
  art.on('video:ratechange', () => {
    localStorage.playbackRate = art.playbackRate;
  });
  let lastSkipIndex = -1;
  let lastDanmuLoadedUntil = 0;
  art.on("video:timeupdate", () => {
    const currentTime = art.currentTime;

    // 跳过片头片尾
    if (skipList.value && skipList.value.length > 0) {
      const skipIndex = skipList.value.findIndex(
          o => currentTime > o.startTime && currentTime < o.endTime
      );
      const is_skip = VueCookies.get('skip') === 'true' || VueCookies.get('skip') === null;
      if (
          skipIndex !== -1 &&
          is_skip &&
          lastSkipIndex !== skipIndex
      ) {
        COMMON.ShowMsg("当前内容跳过");
        art.currentTime = skipList.value[skipIndex].endTime;
        lastSkipIndex = skipIndex;
        return; // 跳过后不再执行后续弹幕加载
      }
      if (skipIndex === -1) {
        lastSkipIndex = -1;
      }
    }

    // 弹幕分段加载
    let episode_number = playInfo.value.episode_number === undefined ? 1 : playInfo.value.episode_number;
    if (episode_number in allDanmaku.value) {
      let danmuList = allDanmaku.value[episode_number];
      let current = art.currentTime;
      if (current >= danmuConfig.value.loadedUntil) {
        // 避免重复加载同一段
        if (danmuConfig.value.loadedUntil === lastDanmuLoadedUntil) return;
        lastDanmuLoadedUntil = danmuConfig.value.loadedUntil;

        if (
            danmuConfig.value.loadedUntil === 0 ||
            (current - danmuConfig.value.loadedUntil) > (danmuConfig.value.segmentDuration * 2)
        ) {
          danmuConfig.value.loadedUntil = current - 5;
        }
        const startTime = danmuConfig.value.loadedUntil;
        const endTime = startTime + danmuConfig.value.segmentDuration;
        const startIndex = sortedIndexBy(danmuList, {time: danmuConfig.value.loadedUntil}, o => o.time);
        const segment = danmuList.slice(startIndex).filter(d => d.time < endTime);
        if (segment.length && !art.plugins.artplayerPluginDanmuku.isHide) {
          art.plugins.artplayerPluginDanmuku.load(segment); // 追加弹幕
        }
        danmuConfig.value.loadedUntil = endTime;
      }
    }
  });
  art.on('video:ended', () => {
    play_next()
  });
  art.on('fullscreen', async (state) => {
    await UpdateControl(art);
  });

  art.on('control', (state) => {
    art.layers.update(
        {
          disable: !state,
          name: "title",
          html: `<div class="art-title">第${playInfo.value.episode_number}集${playInfo.value.title === undefined ? "" : ":" + playInfo.value.title}</div>`,
          style: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: '#fff',
            fontSize: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '4px 8px',
            borderRadius: '4px',
          }
        }
    )
    danmuTitleData.value.disable = !state
    art.layers.update(danmuTitleData.value)
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
        text = text.replace(`[${match}]`, `<img v-lazy="${emojo}" style="height: 1em; width: auto; vertical-align: middle;"/>`);
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

const dynamicInputCreateBySkipTime = () => {
  return {
    startTime: 0,
    endTime: 0,
  }
}
const dynamicInputCreateByUrl = () => {
  return {
    url: ""
  }
}

async function getInstance(_art) {
  await artF(_art);
  art = _art;
  art.id = episode_guid.value
  art.url = url.value
}

const onMountedFun = async () => {
  loading.value = true;
  await getVideoConfig();
  if (gallery_type.value !== "Movie") {
    await GetEpisodeList();
  }
  await play()
  loading.value = false;
};

onBeforeRouteUpdate(async (to, from) => {
  guid.value = to.query.id;
  gallery_type.value = to.query.gallery_type;
  episode_guid.value = to.query.season_id;
  await onMountedFun();
});

onBeforeRouteLeave((to, from) => {
  if (timerSendPlayRecord.value) {
    clearInterval(timerSendPlayRecord.value)
    timerSendPlayRecord.value = null
  }
});

onBeforeUnmount(async () => {
  if (timerSendPlayRecord.value) {
    clearInterval(timerSendPlayRecord.value)
    timerSendPlayRecord.value = null
  }
})
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

        <div class="showContainer">
          <div class="data-header">
            <div class="header-left">
              <div class="season-title">
                {{ playInfo.title }}
              </div>
            </div>
            <div class="header-right">
              <n-button @click="showSetUp = !showSetUp;art.pause()" strong secondary circle>
                <i class='bx bx-cog'></i>
              </n-button>
              <n-button @click="showModal = !showModal;art.pause()" strong secondary circle>
                <i class='bx bx-dots-vertical-rounded'></i>
              </n-button>
            </div>
          </div>
          <div class="data-content">
            <div class="overview-text">
              简介：
              <p>{{ playInfo.overview }}</p>
            </div>
          </div>
        </div>

      </n-grid-item>
    </n-grid>
  </div>

  <n-modal v-model:show="showSetUp" title="跳过时间段整季可用，平台链接当前集可用" preset="dialog" draggable="true"
           :style="{ width: '30em', maxHeight: '30em', overflowY: 'auto' }">
    <n-form ref="formRef" :model="seasonConfig">
      <n-form-item path="age" label="跳过开始时间/跳过结束时间">
        <n-dynamic-input
            v-model:value="seasonConfig.list"
            placeholder="请输入跳过时间段"
            :on-create="dynamicInputCreateBySkipTime"
        >
          <template #default="{ value }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-input-number
                  v-model:value="value.startTime"
                  style="margin-right: 12px; width: 160px"
                  placeholder="请输入跳过开始时间"
              />
              <n-input-number
                  v-model:value="value.endTime"
                  style="margin-right: 12px; width: 160px"
                  placeholder="请输入跳过结束时间"
              />
            </div>
          </template>
        </n-dynamic-input>
      </n-form-item>
      <n-form-item label="平台链接">
        <n-dynamic-input
            v-model:value="seasonConfig.url"
            placeholder="请输入平台链接"
            :on-create="dynamicInputCreateByUrl"
        >
          <template #default="{ value }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-input
                  v-model:value="value.url"
                  style="margin-right: 12px;"
                  placeholder="请输入平台链接"
              />
            </div>
          </template>
        </n-dynamic-input>
      </n-form-item>
    </n-form>

    <template #action>
      <n-button @click="putVideoConfig">确认</n-button>
      <n-button @click="showSetUp = false">取消</n-button>
    </template>
  </n-modal>
  <n-modal transform-origin="center" v-model:show="showModal">
    <n-card style="width: 600px" title="外部播放器/播放时请不要关闭本网页，不然播放链接会过期" :bordered="false"
            size="huge" role="dialog" aria-modal="true">
      <template #header-extra>
        <n-button @click="showModal = !showModal" strong secondary circle>
          <i class='bx bx-x'></i>
        </n-button>
      </template>
      <ul class="play-list">
        <li class="play-item">
          <a :href="'iina://weblink/?url=' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/iina.webp" alt="">
              </template>
              IINA
            </n-tooltip>
          </a>
        </li>
        <li class="play-item">
          <a :href="'potplayer://' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/potplayer.webp" alt="">
              </template>
              Potplayer
            </n-tooltip>
          </a>
        </li>
        <li class="play-item">
          <a :href="'vlc://' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/vlc.webp" alt="">
              </template>
              vcl
            </n-tooltip>
          </a>
        </li>
        <li class="play-item">
          <a :href="'nplayer-' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/nplayer.webp" alt="">
              </template>
              nplayer
            </n-tooltip>
          </a>
        </li>
        <li class="play-item">
          <a :href="'infuse://x-callback-url/play?url=' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/infuse.webp" alt="">
              </template>
              infuse
            </n-tooltip>
          </a>
        </li>
        <li class="play-item">
          <a :href="'intent:' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/mxplayer.webp" alt="">
              </template>
              Mxplayer
            </n-tooltip>
          </a>
        </li>
        <li class="play-item">
          <a :href="'intent:' + playUrl" target="_blank">
            <n-tooltip trigger="hover">
              <template #trigger>
                <img class="play-icon" src="/images/mxplayer-pro.webp" alt="">
              </template>
              Mxplayer-Pro
            </n-tooltip>
          </a>
        </li>
      </ul>
    </n-card>
  </n-modal>

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

/* 移动端适配样式 */
@media (max-width: 768px) {
  .player .art-player {
    height: 56.25vw;
    max-height: calc(100vh - 100px);
  }

  .data-header {
    flex-direction: column;
    gap: 8px;
  }

  .header-right {
    display: flex;
    gap: 8px;
  }

  .data-content {
    font-size: 14px;
  }

  .season-title {
    font-size: 1.1em;
  }

  /* 调整外部播放器列表布局 */
  .play-list {
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-start;
  }

  .play-list .play-item {
    width: calc(33.33% - 16px);
    text-align: center;
  }

  img.play-icon {
    width: 48px;
    height: 48px;
  }

  /* 调整弹幕标题样式 */
  :deep(.art-title) {
    font-size: 14px !important;
    padding: 2px 6px !important;
  }

  /* 调整设置弹窗宽度 */
  :deep(.n-modal) {
    width: 90vw !important;
    max-width: 30em;
  }

  /* 调整控制栏按钮大小 */
  :deep(.art-control) {
    height: 40px !important;
  }

  :deep(.art-control .art-control-item) {
    width: 32px !important;
    height: 32px !important;
  }

  :deep(.art-control .art-control-item i) {
    font-size: 16px !important;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .play-list .play-item {
    width: calc(50% - 16px);
  }

  img.play-icon {
    width: 40px;
    height: 40px;
  }

  :deep(.art-control) {
    height: 36px !important;
  }

  :deep(.art-control .art-control-item) {
    width: 28px !important;
    height: 28px !important;
  }

  :deep(.art-control .art-control-item i) {
    font-size: 14px !important;
  }
}
</style>