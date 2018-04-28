import Vue from 'vue';
import App from './App';

import { Table, TableColumn } from 'jcloud-ele-ui';
import 'jcloud-ele-ui/lib/theme-jcloud/base.css';
import 'jcloud-ele-ui/lib/theme-jcloud/reset.css';

Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});
