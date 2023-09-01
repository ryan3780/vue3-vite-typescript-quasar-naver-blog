import { createApp } from 'vue'
import { Quasar, Loading } from 'quasar'
import App from './App.vue'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

createApp(App)
  .use(Quasar, {
    plugins: {
      Loading,
    },
  })
  .mount('#app')
