<script setup>
// 获取 Vue 实例
import {getCurrentInstance, onMounted, ref} from "vue";
import {useMediaDbData} from '@/store.js'
import {onBeforeRouteUpdate} from "vue-router";

const MediaDbData = useMediaDbData()

const guid = ref(null);
const mode = MediaDbData.sort_column;
const order = MediaDbData.sort_type;
const showSort = ref(false);
const size = ref(48);
const page = ref(1);
const MediaDbInfo = ref(null);


const instance = getCurrentInstance();
const proxy = instance.appContext.config.globalProperties;
const COMMON = proxy.$COMMON;
guid.value = proxy.$route.query.gallery_uid


const modes = [
  {
    value: 'sort_title',
    label: '标题'
  },
  {
    value: 'vote_average',
    label: '评分'
  },
  {
    value: 'release_date',
    label: '发行年份'
  },
  {
    value: 'create_time',
    label: '添加日期'
  }
]

const orders = [
  {
    value: "ASC",
    label: "升序"
  },
  {
    value: 'DESC',
    label: '降序'
  }
]


async function GetMediaDbInfos() {
  let api = '/api/v1/item/list'

  let _data = {
    "ancestor_guid": guid.value,
    "tags": {
      "type": [
        "Movie",
        "TV",
        "Directory",
        "Video"
      ]
    },
    "exclude_grouped_video": page.value,
    "sort_type": MediaDbData.sort_type.value,
    "sort_column": MediaDbData.sort_column.value,
    "page_size": size.value
  }
  let res = await COMMON.requests("POST", api, true, _data);
  MediaDbInfo.value = res.list

}

async function handleChange() {
  page.value = 1;
  await GetMediaDbInfos();
}

async function BackPage() {
  this.page = this.page - 1;
  if (this.page <= 0) {
    COMMON.ShowMsg("已经是第1页啦!")
    this.page = 1;
  }
  await GetMediaDbInfos();
}

async function NextPage() {
  this.page = this.page + 1;
  await GetMediaDbInfos();
}

onBeforeRouteUpdate(async (to, from) => {
  guid.value = to.query.gallery_uid;
  // gallery_type.value = to.query.gallery_type;
  await GetMediaDbInfos();
});

onMounted(async () => {
  // 获取每个分类的列表
  await GetMediaDbInfos();

})
</script>

<template>

  <div class="content">
    <div class="seriesTab">
      <div class="seriesTab-list">
        <div class="seriesTab-item">
          <n-button @click="BackPage()" strong secondary circle>
            <i class='bx bx-left-arrow-alt'></i>
          </n-button>
        </div>
        <div class="seriesTab-item">
          <n-button @click="NextPage()" strong secondary circle>
            <i class='bx bx-right-arrow-alt'></i>
          </n-button>
        </div>
        <div class="seriesTab-item">
          <n-button @click="showSort = !showSort" strong secondary circle>
            <i class='bx bx-align-middle'></i>
          </n-button>
        </div>
      </div>
    </div>
    <div class="card-show-content view-card-list">
      <div class="view-item" v-for="item in MediaDbInfo">
        <router-link :to="{
                    path: '/video', query: {
                        guid: item.guid,
                        gallery_type: item.type
                    }
                }">
          <div class="view-item-header">
            <div class="view-item-tag-list">
              <!--              <div class="view-item-tag rating">{{ isNaN(Math.floor(item.vote_average * 100) / 100) ?-->
              <!--                  "" :-->
              <!--                  Math.floor(item.vote_average * 100) / 100-->
              <!--                }}-->
              <!--              </div>-->
              <div v-if="item.played" class="view-item-tag count">
                <i class='bx bx-check'></i>
              </div>
            </div>
          </div>
          <img v-if="item.poster !== undefined" loading="lazy" class="carousel-img"
               :src=' COMMON.imgUrl + "/92/17/" + item.poster + "?w=200"'>
          <img v-else loading="lazy" class='carousel-img' src='/images/not_video.jpg'>
          <div class="view-item-title">
            {{ item.title }}
          </div>
        </router-link>
      </div>
    </div>
    <n-modal v-model:show="showSort" transform-origin="center">
      <n-card style="width: 600px;" title="排序" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          <n-button @click="showSort = !showSort" strong secondary circle>
            <i class='bx bx-x'></i>
          </n-button>
        </template>
        <div class="sort-list">
          <div class="sort-title">
            排序方式
          </div>
          <div class="sort-list">
            <n-radio-group v-model:value="mode" name="radiogroup">
              <n-space vertical>
                <n-radio @change="handleChange" class="sort-item" v-for="item in modes"
                         :checked="mode === item.value" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </div>
          <div class="sort-title">
            排序顺序
          </div>
          <div class="sort-list">
            <n-radio-group v-model:value="order" name="radiogroup">
              <n-space vertical>
                <n-radio @change="handleChange" class="sort-item" v-for="item in orders"
                         :checked="order === item.value" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>
.seriesTab {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.seriesTab .seriesTab-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.sort-title {
  font-size: 1.2em;
  margin-top: 12px;
  margin-bottom: 12px;
}

.sort-list .sort-item {
  font-size: 1.2em;
  margin-top: 4px;
  margin-bottom: 4px;
}

.view-card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 11.5%);
  grid-gap: 6px;
  justify-content: space-between;
}

@media (max-width: 750px) {
  .view-card-list {
    grid-template-columns: repeat(auto-fill, 31%);
  }
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

.view-card-list img.carousel-img {
  width: 100%;
  aspect-ratio: 11/16;
  border-radius: 5px;
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

.project {
  margin-top: 10px;
}

.project .n-pagination {
  float: right;
}

@media (max-width: 767px) {
  .card-show-title {
    font-size: 0.8em;
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