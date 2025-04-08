<script setup>
import { useMediaDbData } from '../store'
import {getCurrentInstance, ref} from "vue";
const MediaDbData = useMediaDbData()
const per_view = ref(5);
const per_card = ref(8);
const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;
</script>

<template>
  <div  class="content">
    <div class="card-list">
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
</style>