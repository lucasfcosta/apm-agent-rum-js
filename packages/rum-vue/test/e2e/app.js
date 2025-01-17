/**
 * MIT License
 *
 * Copyright (c) 2017-present, Elasticsearch BV
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
import 'core-js'
import 'whatwg-fetch'
import { createApp, defineComponent, defineAsyncComponent, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import FetchComponent from './components/Fetch.vue'
import { getApmBase, getServerUrl } from './'
import { ApmVuePlugin } from '../../src'

const Home = defineComponent({
  render: () => h('div', {}, 'home')
})

const Lazy = defineAsyncComponent(() =>
  import(/* webpackChunkName: "lazy" */ './components/Lazy.vue')
)

const router = new createRouter({
  history: createWebHistory('test/e2e/'),
  routes: [
    { path: '/', component: Home },
    { path: '/lazy', component: Lazy },
    {
      path: '/lazy/:params*',
      name: 'lazy params',
      component: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              template: `
              <div>
                <h2>Lazy with params</h2>
                <pre>{{ $route.path }}</pre>
              </div>`
            })
          }, 200)
        })
    },
    {
      path: '/fetch',
      component: FetchComponent
    }
  ]
})

createApp(App)
  .use(router)
  .use(ApmVuePlugin, {
    router,
    apm: getApmBase(),
    config: {
      serviceName: 'rum-e2e-vue',
      serverUrl: getServerUrl(),
      logLevel: 'debug'
    }
  })
  .mount('#app')
