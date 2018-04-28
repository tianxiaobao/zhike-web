<template>
    <div id="app">
        <div class="app-layout-option normal-layout" v-if="!noSkeleton">
            <navbar></navbar>
            <div class="except-for-navbar">
                <sidebar></sidebar>
                <div class="except-for-sidebar">
                    <crumb></crumb>
                    <div class="except-for-crumb">
                        <router-view class="app-main-playground zhike-global-card" v-if="currentShop"></router-view>
                    </div>
                </div>
            </div>
        </div>
        <!--无侧边栏、导航条、面包屑需求支持-->
        <div class="app-layout-option layout-without-widget" v-if="noSkeleton">
            <router-view v-if="currentShop"></router-view>
        </div>
    </div>
</template>

<script>
import navbar from '@/components/common/navbar';
import sidebar from '@/components/common/sidebar';
import crumb from '@/components/common/crumb';

import { mapActions, mapGetters } from 'vuex';
import { throttle } from '@/utils';

export default {
    name: 'app',
    components: {
        navbar,
        sidebar,
        crumb
    },
    data () {
        return {
            noSkeleton: false
        };
    },
    created () {
        this.fetchUserInfo();
        this.fetchMallList();
        this.loginBlackDragon();
    },
    mounted () {
        this.setResizeSensor(this.$el.querySelector('.except-for-crumb'));
    },
    beforeDestroy () {
        this.destroyResizeSensor();
    },
    computed: {
        ...mapGetters([
            'currentShop',
            'errorMessage'
        ])
    },
    watch: {
        errorMessage (val) {
            if(val !== '') {
                this.$message({
                    type: 'error',
                    message: val
                });
            }
        }
    },
    methods: {
        ...mapActions([
            'fetchMallList',
            'setUserName',
            'setUserPin',
            'setContentSize'
        ]),
        fetchUserInfo () {
            this.setUserName(this.$cookie.get('unick') || '');
            this.setUserPin(this.$cookie.get('pin') || '');
        },
        loginBlackDragon () {
            global._loginBD = (resStr) => {
                const res = JSON.parse(resStr);
                if(res.result !== 'success') {
                    throw new Error('自动登录小黑珑失败');
                }
                global._loginBD = null;
            };
            const script = document.createElement("script");
            script.src = `https://sso.jd.com/setCookie?t=sso.blackdragon.com&callback=_loginBD&_=${new Date().getTime()}`;
            document.body.appendChild(script);
        },
        setResizeSensor (el) {
            const object = this.sensor = document.createElement('object');
            this.resize = throttle(() => {
                this.setContentSize({
                    w: el.offsetWidth,
                    h: el.offsetHeight
                });
            }, 150);
            object.setAttribute('style', 'border:none; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
            object.setAttribute('aria-hidden', 'true');
            object.type = 'text/html';
            object.onload = () => {
                object.contentDocument.defaultView.addEventListener('resize', this.resize);
                object.onload = null;
            };
            el.appendChild(object);
        },
        destroyResizeSensor () {
            this.sensor.removeEventListener('resize', this.resize);
            this.sensor = null;
            this.resize = null;
        }
    }
};
</script>

<style scoped lang="scss" type="text/scss">
    $app-min-height: 1366px;
    $main-content-bg-color: #eee;

    @mixin flex-content-between {
        display: flex;
        justify-content: space-between;
    }

    #app {
        position: absolute;
        min-width: $app-min-height;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .app-layout-option {
            width: 100%;
            height: 100%;
            overflow: auto;
        }
    }

    .normal-layout {
        flex-direction: column;
        @include flex-content-between;

        .except-for-navbar {
            flex: 1;
            @include flex-content-between;

            .except-for-sidebar {
                flex: 1;
                overflow: hidden;
                flex-direction: column;
                @include flex-content-between;

                .except-for-crumb {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    @include flex-content-between;
                    box-sizing: border-box;
                    background-color: $main-content-bg-color;
                    padding: 1rem;

                    .app-main-playground {
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                    }
                }
            }
        }
    }
</style>
