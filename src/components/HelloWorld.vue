<template>
  <head>
    <title>인기글 확인하기</title>
  </head>
  <h1>{{ msg }}</h1>
  <h2>{{ text }}</h2>
  <q-input v-model="text" standout label="블로그 아이디" @keyup.enter="click" />
  <br />
  <br />
  <q-btn color="white" text-color="black" label="Search" @click="click" />

  <q-table
    class="q-mt-xl"
    :grid="$q.screen.lt.sm"
    flat
    bordered
    title="인기글"
    :columns="columns"
    :rows="rows"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="titleWithInspectMessage" :props="props">
          {{ props.row.titleWithInspectMessage }}
        </q-td>
        <q-td key="logNo" class="cursor-pointer" :props="props" @click="clickItem(props.row.logNo)">
          {{ props.row.logNo }}
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
import axios from 'axios'
import { useQuasar } from 'quasar'

let text: string = ''

const columns = [
  { name: 'titleWithInspectMessage', align: 'center' as 'center', label: '제목', field: 'titleWithInspectMessage' },
  {
    name: 'logNo',
    align: 'center' as 'center',
    label: '링크',
    field: 'logNo',
  },
  { name: 'keyword', label: '키워드', field: 'keyword', align: 'center' as 'center' },
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
    async click() {
      this.showLoading(false)

      this.keyword = []

      const URL = 'https://flask-hello-world-jxj6vgw8u-ryan3780.vercel.app'

      const POPULAR_URL = `${URL}/api/popular-post-list`

      const KEYWORD_URL = `${URL}/api/keyword-list`

      let blogID: string = this.text

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

      if (resData.length > 0) {
        this.showLoading(true)
      }
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
