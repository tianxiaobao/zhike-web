<style scoped lang="scss" type="text/scss">
    $hover-bg-color: rgba(0, 135, 255, .4);
    $hover-title-color: rgba(0, 185, 255, 1);

    $logo-width: 9rem;
    $logo-margin: 0 1rem;
    $logo-actual-hold-width: 11rem;

    $title-height: 4rem;
    $title-width: 8rem;
    $title-font-size: .85rem;
    $title-color: #ddd;

    $sub-title-height: 2.5rem;
    $sub-title-font-size: .8rem;
    $sub-title-color: #bbb;

    $extra-panel-height: 8.5rem;

    @mixin normal-flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @mixin normal-transition {
        transition: all .2s;
    }

    @mixin soft-transition {
        transition: all .35s;
    }

    .navbar-container {
        width: 100%;
        height: $title-height;
        background: #000;
        display: flex;
        justify-content: space-between;
        position: relative;

        .left-items {
            @include normal-flex-center;

            .logo {
                margin: $logo-margin;
                width: $logo-width;
                height: 100%;
                background-image: url('~@/assets/zk_logo.png');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center center;
                cursor:pointer;
            }

            .title-header {
                height: 100%;
                @include normal-flex-center;
                font-size: $title-font-size;

                .item {
                    @include normal-flex-center;
                    width: $title-width;
                    height: 100%;
                    color: $title-color;
                    @include normal-transition;

                    .icon {
                        margin-right: .5rem;
                    }

                    &:hover {
                        cursor: pointer;
                    }

                    &.active {
                        color: $hover-title-color;
                        background-color: $hover-bg-color;
                    }
                }
            }
        }

        .background-shadow {
            max-height: 15rem;
            overflow: hidden;
            z-index: 1000;
            @include soft-transition;

            &.hidden {
                max-height: 0rem;
            }

            position: absolute;
            margin-top: $title-height;
            width: 100%;

            .wrap-container {
                box-sizing: border-box;
                padding-left: $logo-actual-hold-width;
                width: 100%;
                background-color: rgba(0, 0, 0, .9);
                display: flex;

                .item {
                    width: $title-width;
                    font-size: $sub-title-font-size;
                    color: $sub-title-color;
                    @include normal-transition;

                    &.active {
                        background-color: $hover-bg-color;
                    }

                    .sub-item {
                        // @include normal-flex-center;
                        height: $sub-title-height;
                        @include normal-transition;

                        &:hover {
                            cursor: pointer;
                            & a {
                                color: $hover-title-color;
                            }
                        }
                        & a {
                            @include normal-flex-center;
                            height: $sub-title-height;
                            width: $title-width;
                            color: $sub-title-color;
                        }
                    }
                }
            }
        }

        .right-items {
            display: flex;
            align-items: center;
            position: relative;

            .notice-container{
                width: 3.5rem;
                height: 100%;
                @include normal-flex-center;
                color: #ccc;
                font-size: 1.2rem;
                position: relative;
                @include normal-transition;
                box-sizing: border-box;

                &:after{
                    content: '';
                    right: 0;
                    position: absolute;
                    width: .05rem;
                    height: 30%;
                    background-color: #999;
                }

                &:hover{
                    color: deepskyblue;
                }

                .icon{
                    margin-top: .2rem;
                }

                .has-notice{
                    position: absolute;
                    width: .5rem;
                    height: .5rem;
                    top: 1rem;
                    right: .8rem;
                    border-radius: 50%;
                    background-color: $hover-title-color;
                }
            }

            .portal-and-user-name{
                width: 12rem;
                display: flex;
                align-items: center;
                position: relative;
            }

            &:hover {
                cursor: pointer;
            }

            .portal {
                width: 4rem;
                height: 4rem;
                @include normal-flex-center;

                .wrap-container {
                    width: 3rem;
                    height: 3rem;
                    box-sizing: border-box;
                    border-radius: 50%;
                    @include normal-flex-center;

                    .portal-image {
                        width: 2rem;
                        height: 2rem;
                        box-sizing: border-box;
                        border-radius: 50%;

                        background-image: url('~@/assets/jd-portal.png');
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center center;
                    }
                }
            }

            .user-name {
                flex: 1;
                overflow: hidden;
                display: flex;
                justify-content: start;
                align-items: center;
                box-sizing: border-box;

                color: #bbb;
                font-size: .85rem;
            }

            .extra-panel {
                position: absolute;
                top: 100%;
                width: 100%;
                background-color: #111;
                color: #ccc;
                font-size: .8rem;
                overflow: hidden;
                z-index: 1000;
                @include normal-transition;
                height: $extra-panel-height;
                border-bottom-left-radius: .2rem;
                border-bottom-right-radius: .2rem;

                &.collapse {
                    height: 0;
                }

                .extra-panel-wrap {
                    box-sizing: border-box;
                    padding: 0 .8rem .8rem;

                    .first-row {
                        width: 100%;
                        height: 4rem;

                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-sizing: border-box;
                        border-bottom: .05rem dashed #333;

                        &:last-child {
                            border-bottom: none;
                        }

                        .row-item {
                            width: calc(50% - .25rem);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color: #333;
                            box-sizing: border-box;
                            padding: .5rem;
                            font-size: .75rem;
                            border-radius: .15rem;
                            @include normal-transition;

                            .icon {
                                width: 50%;
                                font-size: 1.2rem;
                            }

                            .item-name {
                                width: 50%;
                                display: flex;
                                flex-direction: column;
                            }

                            &:hover {
                                background-color: royalblue;
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="navbar-container">
        <div class="background-shadow" :class="{'hidden': !isAllShow}" @mouseleave="leaveAll">
            <div class="wrap-container">
                <div class="item" v-for="(item, index) in navbarList"
                     @mouseleave="itemLeave"
                     @mouseover="itemHover(index)"
                     :class="{'active': index === activeIndex}"
                >
                    <div class="sub-item" v-for="subItem in item.children">
                        <a :href="subItem.link.path" :target="subItem.link.target" v-if="subItem.link">{{ subItem.title }}</a>
                        <router-link :to="{ name: subItem.routeName }" v-else @click.native="writePath(item.title,subItem.title)">
                            {{ subItem.title }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="left-items">
            <div class="logo" @click = "sendRed"></div>

            <div class="title-header" @mouseleave="leaveAll">
                <div class="item" v-for="(item, index) in navbarList"
                     @mouseleave="itemLeave"
                     @mouseover="itemHover(index)"
                     :class="{'active': index === activeIndex}"
                >
                    <i class="icon" v-html="item.icon"></i>
                    <span>{{ item.title }}</span>
                </div>
            </div>
        </div>

        <div class="right-items">

            <div class="notice-container">
                <div class="has-notice"></div>
                <i class="icon">&#xe621;</i>
            </div>

            <div class="portal-and-user-name"
                 @mouseleave="extraLeave"
                 @mouseover="extraHover"
            >

                <div class="extra-panel" :class="{'collapse': isExtraPanelHidden}"
                     @mouseleave="extraLeave"
                     @mouseover="extraHover"
                >
                    <div class="extra-panel-wrap">
                        <div class="first-row">
                            <div class="row-item">
                                <i class="icon">&#xe64d;</i>
                                <div class="item-name">
                                    <span>购买</span>
                                    <span>产品</span>
                                </div>
                            </div>
                            <div class="row-item">
                                <i class="icon">&#xe616;</i>
                                <div class="item-name">
                                    <span>知客</span>
                                    <span>指南</span>
                                </div>
                            </div>
                        </div>

                        <div class="first-row">
                            <div class="row-item" @click="handleGoCenter">
                                <i class="icon">&#xe60f;</i>
                                <div class="item-name">
                                    <span>个人</span>
                                    <span>中心</span>
                                </div>
                            </div>
                            <div class="row-item" @click="handleLogout">
                                <i class="icon">&#xe611;</i>
                                <div class="item-name">
                                    <span>退出</span>
                                    <span>知客</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="portal"
                >
                    <div class="wrap-container">
                        <div class="portal-image"></div>
                    </div>
                </div>
                <div class="span user-name"
                >
                    <span class="zhike-global-ellipsis"> {{ username }} </span>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    import { exit } from '@/apis/account.js';
    import config from './config';
    import * as authTypes from '@/pages/index/auth_types';
    import { mapGetters, mapActions } from 'vuex';
    const authCheck = (auths, required) => {
        return required.every(req => auths.findIndex(auth => auth === req) !== -1);
    };

    export default {
        name: '',
        data () {
            return {
                // navbarList: config,
                activeIndex: -1,
                indexDelayEvent: null,
                isAllShow: false,
                isExtraPanelHidden: true
            };
        },
        created () {
            this.getAuths();
        },
        computed: {
            ...mapGetters([
                'username',
                'userpin',
                'auths'
            ]),
            navbarList () {
                return config.map((item) => {
                    return Object.assign({}, item, {
                        children: item.children.filter((item) => {
                            return this.isAuth(item.auth);
                        })
                    });
                }).filter(item => item.children.length);
            }
        },
        methods: {
            ...mapActions([
                'getAuths'
            ]),
            isAuth (auth) {
                if(!auth) {
                    return true;
                }
                return authCheck(this.auths, auth);
            },
            sendRed () {
                window.location.replace("//www.jdcloud.com");
            },
            itemHover (index) {
                this.activeIndex = index;
                this.isAllShow = true;
            },
            itemLeave () {
                this.activeIndex = -1;
                this.isAllShow = false;
            },
            leaveAll () {
                this.isAllShow = false;
                this.activeIndex = -1;
            },
            extraHover () {
                this.isExtraPanelHidden = false;
            },
            extraLeave () {
                this.isExtraPanelHidden = true;
            },
            handleLogout () {
                exit().then(() => {
                    location.reload(true);
                }).catch(() => {
                    location.reload(true);
                });
            },
            handleGoCenter () {
                if(this.isAuth([authTypes.AUTH_ADMIN])) {
                    global.location = '/mis/message-management.html';
                }
            },
            writePath (title,subTitle) {
                const currentMenu = title+'/'+subTitle;
                this.$store.commit("SET_CURRENT_MENU", currentMenu);
            }
        }
    };
</script>