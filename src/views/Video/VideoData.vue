<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {onBeforeRouteUpdate} from "vue-router";

const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;

const per_view = ref(5);

const guid = ref(null);
const gallery_type = ref(null);
const VideoDataInfo = ref({})
const SeasonData = ref(null)
const playInfo = ref(null)
const backImg = ref(null)
const siderRef = ref(null);
const PersonList = ref(null);
const EpisodeList = ref(null);
const EpisodeCarouselRef = ref(null);

guid.value = proxy.$route.query.guid
gallery_type.value = proxy.$route.query.gallery_type

// 获取剧集信息
async function GetVideoData() {
  let api = "/api/v1/item/" + guid.value;
  let res = await COMMON.requests("GET", api)
  if (res.data.code === 0) {
    VideoDataInfo.value = res.data.data;
    if (res.data.data.backdrops !== undefined) {
      backImg.value = COMMON.imgUrl + "/92/17/" + res.data.data.backdrops + "?w=200"
    } else {
      backImg.value = COMMON.imgUrl + "/92/17/" + VideoDataInfo.value.posters + "?w=200"
    }
  }
}

// 获取季信息
async function GetSeasonData() {
  let api = "/api/v1/season/list/" + guid.value;
  let res = await COMMON.requests("GET", api)
  if (res.data.code === 0) {
    SeasonData.value = res.data.data
  }
}

// 获取播放信息
async function GetPayInfo() {
  let api = "/api/v1/play/info";
  let _data = {
    "item_guid": guid.value
  }
  let res = await COMMON.requests("POST", api, _data)
  if (res.data.code === 0) {
    playInfo.value = res.data.data;
  }
}

async function GetPersonList() {
  let api = "/api/v1/person/list/" + guid.value;
  let res = await COMMON.requests("POST", api)
  if (res.data.code === 0) {
    PersonList.value = res.data.data.list.filter(o => o.role !== "");
  }
}

async function GetEpisodeList(){
  let api = "/api/v1/episode/list/" + guid.value;
  let res = await COMMON.requests("GET", api)
  if (res.data.code === 0) {
    EpisodeList.value = res.data.data;
    // 滚动到当前观看集
    setTimeout(function (){
      goToSlide(playInfo.value.item.episode_number - 1)
    },10)
  }
}

const onMountedFun = async () => {
  // 获取剧集详情
  await GetVideoData();
  await GetPayInfo();
  // 获取剧集
  if (gallery_type.value === "TV") {
    await GetSeasonData();
  }
  if (gallery_type.value !== 'TV') {
    await GetPersonList();
  }
  if(gallery_type.value === 'season'){
    await GetEpisodeList()
  }
};


// 下一张
const goNext = () => {
  let _index = EpisodeCarouselRef.value.getCurrentIndex();
  EpisodeCarouselRef.value?.to(_index + per_view.value);
};

// 上一张
const goPrev = () => {
  let _index = EpisodeCarouselRef.value.getCurrentIndex();
  EpisodeCarouselRef.value?.to(_index - per_view.value);
};

// 跳转到指定索引（例如第二张图，索引从 0 开始）
const goToSlide = (index) => {
  EpisodeCarouselRef.value?.to(index);
};

onBeforeRouteUpdate(async (to, from) => {
  guid.value = to.query.guid;
  gallery_type.value = to.query.gallery_type
  await onMountedFun();
});

onMounted(async () => {
  await onMountedFun();
})


</script>

<template>
  <div class="main-content">
    <div class="backdropContainer" v-bind:style="{ backgroundImage: 'url(' + backImg + ')' }">
    </div>
    <div class="view-backdrop">
      <div class="mainColumn">
        <div class="view-scroller">
          <div class="view-card-image">
            <img :src='COMMON.imgUrl + "/92/17/"+VideoDataInfo.posters + "?w=200"'
                 alt="">
          </div>
          <div class="view-card-detail detailTextContainer">
            <div class="lex-direction-column">
              <div class="itemPrimaryNameContainer">
                <h1 class="itemName-primary">{{
                    gallery_type === "tv" ? VideoDataInfo.name : VideoDataInfo.tv_title + " " + VideoDataInfo.title
                  }}</h1>
              </div>
              <div class="mediaInfo">
                <div class="mediaInfoItem">
                                    <span class="icon-star">
                                        <i class='bx bxs-star'></i>
                                    </span>{{
                    isNaN(Math.floor(VideoDataInfo.vote_average * 100) / 100) ?
                        "" :
                        Math.floor(VideoDataInfo.vote_average * 100) / 100
                  }}
                </div>
                <div class="mediaInfoItem">{{ VideoDataInfo.release_date }}</div>
              </div>
              <n-space size="large" class="detailButtons">
                <button @click="Play()" class="detailButton outlineButton">
                                    <span class="button-icon">
                                        <i class='bx bxs-caret-right-circle'></i>
                                    </span>
                  <span class="button-text" v-if="SeasonData!=null">
                    第 {{ playInfo.item.season_number }} 季 第 {{ playInfo.item.episode_number }} 集
                                    </span>
                  <span class="button-text" v-else>
                    播放
                                    </span>
                </button>
              </n-space>
              <div class="overview-text">
                {{ VideoDataInfo.overview }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="gallery_type === 'TV'" class="showContainer">
          <div class="show-header">
            <div class="show-title">
              <h3>季</h3>
            </div>
          </div>
          <n-scrollbar ref="seasonRef" x-scrollable>
            <div style="white-space: nowrap;">
              <div class="show-card-list">
                <div class="show-card-item" v-for="(item, index) in SeasonData" :key="index">
                  <router-link :to="{
                                        path: '/video', query: {
                                            guid: item.guid,
                                            gallery_type: 'season'
                                        }
                                    }">
                    <div class="show-img">
                      <img :src='COMMON.imgUrl + item.poster + "?w=200"'
                           alt="">
                    </div>
                  </router-link>
                  <div class="show-name season-name">
                    {{ item.title }}
                  </div>
                </div>

              </div>
            </div>
          </n-scrollbar>
        </div>

        <div v-if="gallery_type === 'season'" class="carousel-container">
          <n-carousel :show-dots="false" :slides-per-view="per_view" :space-between="20" ref="EpisodeCarouselRef" :loop="false" draggable>
            <div class="view-item" v-for="(item, index) in EpisodeList" :key="index">
                <img v-if="item.poster.length > 0" loading="lazy" class='gallery-img'
                     :src='COMMON.imgUrl + item.poster' style="border-radius:10px">
                <img v-else loading="lazy" class='gallery-img' src='/images/not_gellery.png'>
                <div class="view-item-title">
                 第 {{ item.episode_number }} 集{{ item.title }}
                </div>
            </div>
          </n-carousel>
          <!-- 左箭头 -->
          <button class="carousel-arrow left" @click="goPrev">‹</button>

          <!-- 右箭头 -->
          <button class="carousel-arrow right" @click="goNext">›</button>
        </div>

        <div class="showContainer" v-if="gallery_type !== 'TV'">
          <div class="show-header">
            <div class="show-title">
              <h3>演职人员</h3>
            </div>
<!--            <div class="show-header-tool">-->
<!--              <n-space>-->
<!--                <n-button @click="siderRef?.scrollBy({ left: -left })" circle>-->
<!--                  <i class='bx bx-chevron-left'></i>-->
<!--                </n-button>-->
<!--                <n-button @click="siderRef?.scrollBy({ left: left })" circle>-->
<!--                  <i class='bx bx-chevron-right'></i>-->
<!--                </n-button>-->
<!--              </n-space>-->
<!--            </div>-->
          </div>
          <n-scrollbar ref="siderRef" x-scrollable>
            <div style="white-space: nowrap;">
              <div class="show-card-list">
                <div class="show-card-item" v-for="(item, index) in PersonList" :key="index">
                  <router-link :to="{ path: '/person', query: { id: item.id, } }">
                    <div class="show-img">
                      <img v-if="item.profile_path!==''" loading="lazy"
                           :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.profile_path'
                           alt="">
                      <img v-else loading="lazy" src="/images/not_person.jpg" alt="">
                    </div>
                  </router-link>
                  <div class="show-name">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </n-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdropContainer {
  contain: style size;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  touch-action: none;
  border-bottom: 1px solid #15191b;
  background-size: cover;
  background-repeat: no-repeat;
}

.mainColumn .show-header ion-icon {
  color: white;
}

.view-backdrop {
  background-image: linear-gradient(90deg, #a39090 150px, rgb(207 179 179 / 20%));
  position: relative;
  min-height: 100vh;
}

.dark .view-backdrop {
  background-image: linear-gradient(90deg, #200b0b 150px, rgba(32, 11, 11, .84));
}

.view-scroller {
  display: flex;
  gap: 20px;
  padding: 14px;
  color: white;
}

.view-scroller .mediaInfo {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.view-card-image {
  width: 20%;
  border-radius: 5px;
}


.view-card-image img {
  width: 100%;
  border-radius: 5px;
  aspect-ratio: 11/16;
}

.season-name {
  text-align: center;
}

@media (min-width: 1300px) {
  .view-card-image img {
    min-width: 240px;
  }
}

.mediaInfo .icon-star {
  color: yellow;
}

.mediaInfo .mediaInfoOfficialRating {
  border: 0.09em solid;
  padding: 0 0.6em;
}

.mediaInfoItem.tag-list {
  display: inherit;
}

.mediaInfoItem.tag-list .tag-item {
  margin-left: 4px;
}

.detailButtons {
  margin-top: 12px;
}

.detailButton {
  background: hsla(285, 4.2%, 40%, .7);
  color: hsla(0, 0%, 100%, 1);
  border-radius: 12px;
  position: relative;
  display: -webkit-inline-flex;
  display: inline-flex;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  z-index: 0;
  padding: 0.72em 2ch;
  vertical-align: middle;
  border: 0;
  vertical-align: middle;
  border-radius: 0.6em;
  position: relative;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
  line-height: inherit;
  outline: 0 !important;
  margin: 0 auto;
}

.detailButton:hover .button-icon,
.detailButton:hover .button-text {
  color: #c33;
}

.detailButton.active .button-icon {
  color: #c33;
}

.detailButton.circleButton {
  border-radius: 50%;
  padding: 0.72em 1.7ch;
}

.button-icon {
  font-size: 25px;
}

span.button-text {
  font-size: 20px;
  margin-left: 4px;
}

.detailButton.outlineButton .button-icon {
  position: relative;
  top: 2px;
}

.overview-text {
  width: 50%;
  min-width: 600px;
  margin-top: 20px;
}

@media (max-width: 750px) {
  .overview-text {
    min-width: 100%;
  }
}


.showContainer {
  padding: 14px;
  color: white;
}

.show-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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

.search-list {
  margin-top: 20px;
}

.search-title {
  font-size: 1.2em;
}

.search-itme {
  display: flex;
  gap: 10px;
}

.search-overview {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  margin-bottom: 10px;
}

.search-itme img {
  border-radius: 5px;
}

@media (max-width: 750px) {
  .view-scroller {
    flex-direction: column;
  }

  .view-card-image {
    width: 65%;
    margin: 0 auto;
  }
}


/* 轮播容器，确保箭头在正确位置 */
.carousel-container {
  position: relative;
  width: 100%;
}

/* 左右箭头按钮 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  padding: 10px 15px;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* 左箭头位置 */
.carousel-arrow.left {
  left: 5px;
}

/* 右箭头位置 */
.carousel-arrow.right {
  right: 5px;
}
</style>