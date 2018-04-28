import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/product/index/Main';
import digital from '@/components/product/digital-marketing/Main';
import persona from '@/components/product/persona/Main';
import customer from '@/components/product/customer-flow/Main';
import adEvaluation from '@/components/product/ad-evaluation/Main';
import face from '@/components/product/face/Main';

Vue.use(Router);
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'default',
            component: index
        },{
            path: '/index',
            name: 'index',
            component: index
        },{
            path: '/customer',
            name: 'customer',
            component: customer
        },{
            path: '/digital',
            name: 'digital',
            component: digital
        },{
            path: '/persona',
            name: 'persona',
            component: persona
        },{
            path: '/ad-evaluation',
            name: 'ad-evaluation',
            component: adEvaluation
        },{
            path: '/face',
            name: 'face',
            component: face
        }
    ],
    scrollBehavior () {
        return { x: 0, y: 0 };
    }
});
router.beforeEach(function (to,from,next) {
    window.scrollTo(0, 0);
    next();
});
export default router;
