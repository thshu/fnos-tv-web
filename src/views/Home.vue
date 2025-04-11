<script setup>
import {useMediaDbData} from '../store'
import {getCurrentInstance, onMounted, ref} from "vue";

const MediaDbData = useMediaDbData()
const per_view = ref(5);
const per_card = ref(8);
const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;
const playList = ref(null)
const play_item_guid = ref(null);
const EpisodeCarouselRef = ref(null);

async function GetPlayList() {
  let api = "/api/v1/play/list"
  let res = await COMMON.requests("GET", api);
  if (res.data.code === 0) {
    playList.value = res.data.data;
  }
}

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

onMounted(async () => {
  await GetPlayList();
})
</script>

<template>
  <div class="content">
    <div class="card-list">
      <div class="card-shows">
        <div class="card-show-title">
          继续观看
        </div>
        <div class="carousel-container">
          <n-carousel :show-dots="false" :slides-per-view="per_view" :space-between="20" ref="EpisodeCarouselRef"
                      :loop="false" draggable>
            <div class="view-item" v-for="(item, index) in playList" :key="item.guid"
                 @mouseenter="play_item_guid = item.guid"
                 @mouseleave="play_item_guid = null">
              <div>
                <router-link :to="{
                    path: '/player', query: {
                        gallery_type: item.type === 'Movie'?'Movie':'TV',
                        guid: item.parent_guid,
                        episode_guid: item.guid
                    }
                }">
                  <img v-if="item.poster.length > 0" loading="lazy" class='gallery-img'
                       :src='COMMON.imgUrl + item.poster' style="border-radius:10px">
                  <img v-else loading="lazy" class='gallery-img' src='/images/not_gellery.png'>
                  <!-- 播放图标 (仅在 hover 时显示) -->
                  <div v-if="play_item_guid === item.guid" class="play-icon">
                    <i class="bx bx-play"></i>
                  </div>
                  <div class="view-item-title">
                    {{ item.type === 'Episode' ? item.tv_title : item.title }}
                  </div>
                  <div v-if="item.type === 'Episode'" class="view-item-title" style="font-size: 0.8em;color:rgba(0, 0, 0, 0.4);">
                    第 {{ item.season_number }} 季·第 {{ item.episode_number }} 集
                  </div>
                  <div v-else class="view-item-title" style="font-size: 0.8em;color:rgba(0, 0, 0, 0.4);">
                    电影
                  </div>
                </router-link>
              </div>
            </div>
          </n-carousel>
          <!-- 左箭头 -->
          <button class="carousel-arrow left" @click="goPrev">‹</button>

          <!-- 右箭头 -->
          <button class="carousel-arrow right" @click="goNext">›</button>
        </div>
      </div>
      <div class="card-shows" v-for="(key, index) in Object.keys(MediaDbData.info)" :key="index">
        <div class="card-show-title">
          {{ MediaDbData.list.find((item) => item.guid === key).title }}
        </div>
        <div class="card-show-content view-card">
          <n-carousel :show-dots="false" show-arrow :slides-per-view="per_card" :space-between="20" :loop="false"
                      draggable>
            <div class="view-item" v-for="item in MediaDbData.info[key].list" :key="item.id">
              <div class="view-item-header">
                <div class="view-item-tag-list">
                  <div class="view-item-tag rating">
                    {{
                      isNaN(Math.floor(item.vote_average * 100) /
                          100) ? "" : Math.floor(item.vote_average * 100) / 100
                    }}
                  </div>
                  <!-- <div v-if="item.Type != 'Movie' && item.ChildCount != 0" class="view-item-tag count">
                      {{ item.ChildCount }}
                  </div> -->
                  <!--                  <p>{{ item }}</p>-->
                  <div v-if="item.played" class="view-item-tag count">
                    <i class='bx bx-check'></i>
                  </div>
                </div>
              </div>
              <router-link :to="{
                                path: '/video', query: {
                                    guid: item.guid,
                                    gallery_type: item.type
                                }
                            }">
                <img v-if="item.poster !== undefined" loading="lazy" class="carousel-img"
                     :src='COMMON.imgUrl +  "/92/17/"+item.poster + "?w=200"'>
                <img v-else loading="lazy" class='carousel-img' src='/images/not_video.jpg'>
              </router-link>
              <div v-if="item.title != null" class="view-item-title">
                {{ item.title }}
              </div>
              <div v-else class="view-item-title">
                {{ item.name }}
              </div>
            </div>
            <template #arrow="{ prev, next }">
              <div class="custom-arrow">
                <button type="button" class="custom-arrow--left" @click="prev">
                  <i class='bx bx-chevron-left'></i>
                </button>
                <button type="button" class="custom-arrow--right" @click="next">
                  <i class='bx bx-chevron-right'></i>
                </button>
              </div>
            </template>
          </n-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.movie-container {
  display: flex; /* 使用 Flexbox 排列 */
  justify-content: center; /* 居中对齐 */
  gap: 2px; /* 卡片之间的间距 */
  padding: 1px; /* 容器的内边距 */
  border-radius: 10px; /* 容器的圆角 */
  overflow-x: auto; /* 当内容超出时允许横向滚动 */
  backdrop-filter: blur(10px); /* 毛玻璃模糊效果 */
  -webkit-backdrop-filter: blur(10px); /* 兼容 Safari 浏览器 */
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景色 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 淡色边框 */
}

/* 单个卡片样式 */
.movie-card {
  text-align: center; /* 文字居中 */
  width: 150px; /* 卡片宽度 */
}

/* 图片样式 */
.movie-poster {
  width: 100%; /* 图片宽度占满卡片 */
  height: auto; /* 高度自适应 */
  border-radius: 10px; /* 图片的圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
  transition: transform 0.3s; /* 添加平滑缩放动画 */
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

.gallery-card .view-item {
  transform: translateY(0) scale(1);
  transition: all .2s ease-in-out;
}

.gallery-card .view-item:hover {
  transform: translateY(0) scale(0.99);
  transition: all .2s ease-in-out;
}

.gallery-card .view-item img {
  border-radius: 5px;
}

.medias .view-item-title {
  font-size: 1.2em;
  font-weight: 400;
}

.custom-arrow {
  display: flex;
  position: absolute;
  top: 70%;
  right: 10px;
}

@media (max-width: 750px) {
  .custom-arrow {
    display: none;
  }
}

.view-card .custom-arrow {
  top: 75%;
}

.custom-arrow button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 12px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-width: 0;
  border-radius: 8px;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-arrow button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.custom-arrow button:active {
  transform: scale(0.95);
  transform-origin: center;
}

img.carousel-img {
  width: 100%;
  aspect-ratio: 16/10;
}

.view-card img.carousel-img {
  width: 100%;
  aspect-ratio: 11/16;
  border-radius: 5px;
}


.view-card .view-item {
  transform: translateY(0) scale(1);
  transition: all .2s ease-in-out;
}

.view-card .view-item:hover {
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

.project {
  margin-top: 10px;
}

.project .n-pagination {
  float: right;
}

@media (max-width: 767px) {
  .card-show-title {
    font-size: 1.2em;
    font-weight: 400;
    padding-bottom: 10px;
  }

  .view-item-title {
    font-size: 0.5em;
    font-weight: 400;
  }

  .custom-arrow.next {
    bottom: 60px;
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

/* 鼠标悬浮时放大 */
.view-item:hover .gallery-img {
  transform: scale(1.05);
}

/* 播放按钮 */
.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
  cursor: pointer;
}

/* 悬浮时背景变亮 */
.play-icon:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>