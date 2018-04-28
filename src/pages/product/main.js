import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'jcloud-ele-ui';
import VueCookie from 'vue-cookie';
import '../../assets/css/style.css';
import "@/assets/css/product/iconfont.css";
import 'jcloud-ele-ui/lib/theme-jcloud/index.css';
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueCookie);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});
