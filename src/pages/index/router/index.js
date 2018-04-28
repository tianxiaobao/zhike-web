import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
import { NOT_FOUND } from './route_types';
import store from '../store';

// import * as authTypes from '@/pages/index/auth_types';

Vue.use(Router);

const router = new Router({
    routes
});
const authCheck = (auths, required) => {
    return required.every(req => auths.findIndex(auth => auth === req) !== -1);
};
router.beforeEach((to, from, next) => {
    // console.log(to, from);
    if(to.path === '/') {
        next();
        return;
    }
    let authsRequired = [];
    store.dispatch('setSideBarVisibility', !to.meta.sideHidden);
    store.dispatch('setNavBarVisibility', !to.meta.navHidden);
    if(to.matched.length === 0) {
        next(new Error('404'));
        return;
    }
    to.matched.forEach(record => {
        const auth = record.meta.auth;
        if(auth) {
            if(Array.isArray(auth)) {
                authsRequired.push(...auth);
            } else {
                authsRequired.push(auth);
            }
        }
    });
    authsRequired = [...new Set(authsRequired)];
    store.dispatch('getAuths').then(auths => {
        if(authCheck(auths, authsRequired)) {
            next();
        } else {
            next(new Error('404'));
        }
    });
});
router.onError(() => {
    router.push({name: NOT_FOUND});
});
export default router;
