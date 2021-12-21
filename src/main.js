import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import Cookies from 'js-cookie'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import api from './utils/request';

import * as ws from './utils/ws'

import '@/icons' // icon
import '@/permission' // permission control
import { format } from 'echarts/lib/export'

var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/chart/gauge');

Vue.use(api);
Vue.use(Cookies)

Vue.prototype.Cookies = Cookies
Vue.prototype.ws = ws;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;

Vue.prototype.$EventBus = new Vue();

const eventbus = new Vue();

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */


if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
