// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueCookie from 'vue-cookie';
import router from './router';
import store from './store';

import ElementUI from 'jcloud-ele-ui';
import 'jcloud-ele-ui/lib/theme-jcloud/index.css';

import '../../assets/css/style.css';

Vue.config.productionTip = false;

Vue.use(VueCookie);
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});
