<script setup>
import {useMediaDbData} from '../store'
import {getCurrentInstance, onMounted, ref, onUnmounted, h} from "vue";
import {useMessage, NIcon} from 'naive-ui'

const MediaDbData = useMediaDbData()
const message = useMessage()
const per_view = ref(window.innerWidth <= 768 ? 2 : 5);
const per_card = ref(window.innerWidth <= 768 ? 3 : 8);
const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;
const playList = ref(null)
const play_item_guid = ref(null);
const EpisodeCarouselRef = ref(null);
const showDropdown = ref(false)
const dropdownX = ref(0)
const dropdownY = ref(0)
const currentContextItem = ref(null)

// 渲染图标的函数
const renderIcon = (icon) => {
  return () => h(NIcon, null, {default: () => icon})
}

// 右键菜单选项
const dropdownOptions = [
  {
    label: '继续播放',
    key: 'continue',
    icon: renderIcon('▶')
  },
  {
    label: '从继续观看中移除',
    key: 'remove',
    icon: renderIcon('🗑')
  }
]

// 处理右键菜单点击
const handleContextMenu = (e, item) => {
  e.preventDefault()
  currentContextItem.value = item
  dropdownX.value = e.clientX
  dropdownY.value = e.clientY
  showDropdown.value = true
}

// 处理菜单选项点击
const handleDropdownSelect = async (key) => {
  const item = currentContextItem.value
  if (!item) return

  switch (key) {
    case 'continue':
      // 跳转到播放页面
      proxy.$router.push({
        path: '/player',
        query: {
          gallery_type: item.type,
          guid: item.parent_guid ?? item.guid
        }
      })
      break
    case 'remove':
      try {
        // 调用移除API
        await COMMON.requests("DELETE", `/api/v1/play/record`, true, {
          "item_guid": item.guid
        })
        message.success('已从继续观看中移除')
        // 重新获取播放列表
        await GetPlayList()
      } catch (error) {
        message.error('移除失败')
      }
      break
  }
  showDropdown.value = false
}

// 点击其他地方关闭菜单
const handleClickOutside = () => {
  showDropdown.value = false
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  per_view.value = window.innerWidth <= 768 ? 2 : 5;
  per_card.value = window.innerWidth <= 768 ? 3 : 8;
});

async function GetPlayList() {
  let api = "/api/v1/play/list"
  playList.value = await COMMON.requests("GET", api, true);
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
  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="content">
    <div class="card-list">
      <div class="card-shows" v-if="playList && playList.length > 0">
        <div class="card-show-title">
          继续观看
        </div>
        <div class="carousel-container">
          <n-carousel :show-dots="false" :slides-per-view="per_view" :space-between="20" ref="EpisodeCarouselRef"
                      :loop="false" draggable>
            <div class="view-item" v-for="(item, index) in playList" :key="item.guid"
                 @mouseenter="play_item_guid = item.guid"
                 @mouseleave="play_item_guid = null"
                 @contextmenu="handleContextMenu($event, item)">
              <div>
                <router-link :to="{
                    path: '/player', query: {
                        gallery_type: item.type,
                        guid: item.parent_guid??item.guid
                    }
                }">
                  <img v-if="item.poster.length > 0" loading="lazy" class='gallery-img'
                       v-lazy='COMMON.imgUrl + item.poster' style="border-radius:10px">
                  <img v-else loading="lazy" class='gallery-img' v-lazy="'/images/not_gellery.png'">
                  <!-- 播放图标 (仅在 hover 时显示) -->
                  <div v-if="play_item_guid === item.guid" class="play-icon">
                    <i class="bx bx-play"></i>
                  </div>
                  <div class="view-item-title">
                    {{ item.type === 'Episode' ? item.tv_title : item.title }}
                  </div>
                  <div v-if="item.type === 'Episode'" class="view-item-title"
                       style="font-size: 0.8em;color:rgba(0, 0, 0, 0.4);">
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
        <div v-if="MediaDbData.list.find((item) => item.guid === key).category !== 'Others'">
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
                       v-lazy='COMMON.imgUrl +  "/92/17/"+item.poster + "?w=200"'>
                  <img v-else loading="lazy" class='carousel-img' v-lazy="'/images/not_video.jpg'">
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

    <!-- 右键菜单 -->
    <n-dropdown
        :show="showDropdown"
        :options="dropdownOptions"
        :x="dropdownX"
        :y="dropdownY"
        placement="bottom-start"
        trigger="manual"
        @select="handleDropdownSelect"
    />
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
  cursor: context-menu; /* 添加右键菜单光标样式 */
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

/* 移动端适配样式 */
@media (max-width: 768px) {
  .card-show-title {
    font-size: 1.1em;
    padding-bottom: 12px;
  }

  .view-item-title {
    font-size: 0.9em;
    margin-top: 4px;
  }

  .carousel-container {
    margin: 0 -10px;
  }

  .carousel-arrow {
    padding: 8px 12px;
    font-size: 20px;
  }

  .play-icon {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .view-item-tag {
    font-size: 0.8em;
    padding: 2px 6px;
  }

  .view-item-tag-list .count {
    width: 16px;
    height: 16px;
    padding: 2px;
  }

  .custom-arrow button {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  /* 调整图片容器间距 */
  .card-shows {
    margin-bottom: 16px;
    padding: 0 10px;
  }

  /* 优化卡片间距 */
  .n-carousel {
    margin: 0 -5px;
  }

  .view-item {
    padding: 0 5px;
  }

  /* 调整图片比例 */
  img.carousel-img {
    aspect-ratio: 2/3;
  }

  .gallery-img {
    aspect-ratio: 16/9;
  }
}

/* 小屏幕手机适配 */
@media (max-width: 480px) {
  .card-show-title {
    font-size: 1em;
  }

  .view-item-title {
    font-size: 0.8em;
  }

  .carousel-arrow {
    padding: 6px 10px;
    font-size: 18px;
  }

  .play-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}
</style>