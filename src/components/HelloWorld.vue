<template>
  <head>
    <title>인기글 확인하기</title>
  </head>
  <div class="row justify-evenly items-center">
    <div style="font-size: 20px">인기글 {{ text }} / 현재 방문자 : {{ dayVisitation }}명</div>
    <!-- <div class="row">
      <q-input standout="bg-teal text-white" label="해쉬태그 생성" style="width: 500px" v-model="hashTag" />
      <q-btn color="secondary" text-color="white" label="생성하기" @click="makeHashTag" />
    </div> -->
  </div>
  <!-- <div>
    <span>{{ newHashTag }}</span>
    <q-btn color="secondary" text-color="white" label="COPY" @click="copyHashTag" class="q-ml-md" />
  </div> -->
  <q-input v-model="text" standout label="블로그 아이디" @keyup.enter="click" />
  <br />
  <br />
  <!-- <q-btn color="white" text-color="black" label="Search" @click="click" /> -->

  <q-table :grid="$q.screen.lt.md" flat bordered :columns="columns" :rows="rows" :rows-per-page-options="[0]">
    <template v-slot:body="props">
      <q-tr :props="props" class="text-no-wrap">
        <q-td key="titleWithInspectMessage" :props="props" class="text">
          {{ props.row.titleWithInspectMessage }}
        </q-td>
        <q-td key="logNo" class="cursor-pointer" :props="props" @click="clickItem(props.row.logNo)">
          <a href="#">새창에서 보기</a>
        </q-td>
        <q-td key="keyword" :props="props">
          {{ props.row.keyword }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <component is="script" src="https://unpkg.com/axios/dist/axios.min.js" />
</template>

<script lang="ts">
import { ref, defineComponent, onBeforeUnmount } from 'vue'
import { watch } from '@vue/runtime-core'
import axios from 'axios'
import { useQuasar } from 'quasar'

let text: string = ''

const columns = [
  {
    name: 'titleWithInspectMessage',
    align: 'center' as 'center',
    label: '제목',
    field: 'titleWithInspectMessage',
    style: 'font-size : 16px',
  },
  {
    name: 'logNo',
    align: 'center' as 'center',
    label: '링크',
    field: 'logNo',
    style: 'font-size : 14px',
  },
  {
    name: 'keyword',
    label: '키워드',
    field: 'keyword',
    align: 'center' as 'center',
    style: 'white-space: break-spaces; font-size : 15px',
  },
]

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      text,
      rows: [],
      columns,
      keyword: [],
      prevText: '',
      hashTag: '',
      newHashTag: '',
      dayVisitation: '',
    }
  },
  setup() {
    const $q = useQuasar()

    return {
      showLoading(isFetched: boolean) {
        if (isFetched) {
          $q.loading.hide()
        } else {
          $q.loading.show()
        }
      },
    }
  },

  methods: {
    copyHashTag() {
      navigator.clipboard.writeText(this.newHashTag)
    },
    makeHashTag() {
      const tag = this.hashTag.replaceAll(',', ' ')

      this.newHashTag = tag
    },

    async click() {
      if (this.prevText.replaceAll(' ', '') === this.text.replaceAll(' ', '')) {
        return
      }

      this.showLoading(false)

      this.keyword = []

      const URL = 'https://flask-hello-world-hazel-tau.vercel.app'

      const POPULAR_URL = `${URL}/api/popular-post-list`

      const KEYWORD_URL = `${URL}/api/keyword-list`

      const DAYVISIT_URL = `${URL}/api/day`

      let blogID: string = this.text.replaceAll(' ', '')

      const data = await axios.get(POPULAR_URL, {
        params: {
          blog_id: blogID,
        },
      })

      if (data.data.error || data.data.result.popularPostList.length === 0) {
        this.showLoading(true)
        alert('블로그가 없거나, 인기글이 없음')
        return
      }

      const resData = data.data.result.popularPostList

      for (let i = 0; i < resData.length; i++) {
        const res = await axios.get(KEYWORD_URL, {
          params: {
            blog_id: blogID,
            log_no: resData[i].logNo,
          },
        })
        this.keyword.push(res.data)
      }

      resData.map((item, idx) => {
        item.logNo = `https://m.blog.naver.com/${this.text}/${item.logNo}`
      })

      this.rows = resData

      this.keyword.map((item, idx) => {
        this.rows[idx]['keyword'] = item.replaceAll(',', ' ')
      })

      const dayVisit = await axios.get(DAYVISIT_URL, {
        params: {
          blog_id: blogID,
        },
      })

      if (resData.length > 0) {
        this.showLoading(true)
        this.prevText = this.text
      }

      this.dayVisitation = dayVisit.data.result.dayVisitorCount
    },
    clickItem(url) {
      window.open(url)
    },
  },
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
