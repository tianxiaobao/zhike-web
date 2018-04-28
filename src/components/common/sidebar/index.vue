<style scoped lang="scss" type="text/scss">
    @mixin normal-flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @mixin normal-transition {
        transition: all .2s;
    }

    $normal-title-height: 2.2rem;

    $icon-width: 2.5rem;

    @mixin item-font-style {
        font-size: .8rem;
        color: #aaa;
    }

    @mixin sub-item-font-style {
        font-size: .75rem;
        color: #999;
    }

    .sidebar {
        height: 100%;
        width: 11rem;
        background-color: #111;
        display: flex;
        flex-direction: column;
        @include normal-transition;

        &.collapse {
            width: $icon-width;

            .bottom-items {
                width: $icon-width;

                .button-items-wrap {
                    width: $icon-width;
                }
            }
        }

        &.hidden {
            width: 0!important;
            .bottom-items {
                width: 0!important;
                .button-items-wrap {
                    width: 0!important;
                }
            }
            .shrink-toggle-button {
                visibility: hidden;
            }
        }

        .shrink-toggle-button {
            user-select: none;
            height: 1.5rem;
            background-color: #181818;
            color: #aaa;
            @include normal-flex-center;
            @include normal-transition;

            &:hover {
                color: #ddd;
                cursor: pointer;
            }
        }

        .except-for-shrink-btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .top-items {
                flex: 1;
                overflow: auto;
            }

            .bottom-items {
                color: #ccc;
                font-size: .75rem;
                box-sizing: border-box;
                border-top: .05rem solid #282828;

                .input-container {
                    height: 2.5rem;
                    @include normal-flex-center;
                    box-sizing: border-box;
                    padding: .2rem .5rem;

                    input {
                        width: 100%;
                        height: 100%;
                        background-color: transparent;
                        border: none;
                        outline: none;
                        color: #eee;
                    }
                }

                .button-items-wrap {
                    display: flex;
                    justify-content: space-between;

                    height: 2.5rem;
                    width: 11rem;
                    overflow: hidden;

                    .search-button {
                        user-select: none;
                        width: $icon-width;
                        @include normal-flex-center;
                        box-sizing: border-box;
                        position: relative;

                        &:after {
                            content: '';
                            position: absolute;
                            right: -.05rem;
                            height: 50%;
                            border-right: .05rem dashed rgba(200, 200, 200, .3);
                        }

                        &:hover {
                            cursor: pointer;
                            color: deepskyblue;
                        }
                    }

                    .except-for-search-btn {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                        overflow: hidden;

                        .left-button{
                            padding-left: .5rem;
                        }
                        .right-button{
                            padding-right: .5rem;
                        }

                        .left-button,
                        .right-button {
                            .icon {
                                user-select: none;
                                margin-right: .5rem;
                                margin-top: .1rem;
                            }
                            width: 50%;
                            box-sizing: border-box;
                            @include normal-flex-center;
                            @include normal-transition;

                            &:hover {
                                cursor: pointer;
                                color: deepskyblue;
                            }
                        }
                    }
                }
            }
        }
    }

    .item-collection {
        &:hover {
            cursor: pointer;
        }

        overflow: hidden;
        @include normal-transition;

        &.collapsed {
            height: $normal-title-height !important;
        }

        .wrap-container {
            display: flex;
            flex-direction: column;

            .item-title {
                height: $normal-title-height;
                background-color: #282828;
                box-sizing: border-box;
                border-bottom: .05rem dashed rgba(150, 150, 150, .05);

                display: flex;
                align-items: center;
                width: 100%;

                @include item-font-style;
                @include normal-transition;

                .icon {
                    user-select: none;
                    min-width: $icon-width;
                    font-size: 1.2rem;
                    margin-top: .1rem;
                    @include normal-flex-center;
                }

                .span {
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }

                &:hover {
                    background-color: rgba(0, 135, 255, .7);
                    color: #eee;
                }
                &.active {
                    background-color: rgba(0, 135, 255, .9);
                    color: #eee;
                }
            }

            .sub-items {

                .item {
                    height: $normal-title-height;
                    display: flex;
                    align-items: center;
                    @include sub-item-font-style;
                    box-sizing: border-box;

                    @include normal-transition;

                    .icon {
                        user-select: none;
                        font-size: 1.2rem;
                        min-width: $icon-width;
                        @include normal-flex-center;
                    }

                    .span {
                        flex: 1;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                    }

                    &:hover, &.active:hover {
                        background-color: rgba(0, 135, 255, .6);
                        color: #eee;
                    }

                    &.active {
                        background-color: rgba(0, 135, 255, .8);
                        color: #eee;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="sidebar" :class="{'collapse': sideCollapse, 'hidden': sideHidden}">
        <div class="shrink-toggle-button" @click="toggleSideBar">
            <i class="icon" v-html="sideCollapse ? '&#xe609;' : '&#xe726;'"></i>
        </div>
        <div class="except-for-shrink-btn">
            <div class="top-items">
                <div class="item-collection" v-for="(item, index) in mallList"
                     :style="{'height': (item.children.length) * 2.2 + 'rem'}"
                     :class="{'collapsed': index !== activeIndex}"
                >
                    <div class="wrap-container">
                        <div class="item-title" @click="select(item, index)" :class="{active: currentMall && currentShop && currentMall.id === item.id && currentShop.id === 0}">
                            <i class="icon">&#xe651;</i>
                            <span class="zhike-global-ellipsis">{{ item.name }}</span>
                        </div>
                        <div class="sub-items">
                            <div class="item" v-for="(subItem, subIndex) in item.children" v-if="subItem.id !== 0" :class="{ active: currentMall && currentShop && currentMall.id === item.id && currentShop.id === subItem.id}" @click="handleSubSelect(subItem)">
                                <i class="icon">&#xe8fe;</i>
                                <span class="zhike-global-ellipsis">{{ subItem.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-items">

                <div class="input-container" v-if="!isSearchHidden">
                    <input type="text" placeholder="搜索店铺/分组" ref="searchInputContainer">
                </div>

                <div class="button-items-wrap">
                    <div class="search-button" @click="toggleSearch">
                        <i class="icon" v-html="isSearchHidden ? '&#xe998;' : '&#xe606;'">&#xe998;</i>
                    </div>
                    <div class="except-for-search-btn">
                        <div class="left-button">
                            <i class="icon">&#xe601;</i>
                            <span>编辑</span>
                        </div>
                        <div class="right-button">
                            <i class="icon">&#xe600;</i>
                            <span>添加</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import config from './config';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: '',
        data () {
            return {
                config:[],
                activeIndex: 0,
                isSearchHidden: true,
                isSidebarCollapse: false
            };
        },
        computed: {
            ...mapGetters([
                'sideCollapse',
                'sideHidden',
                'mallList',
                'currentMall',
                'currentShop'
            ])
        },
        methods: {
            ...mapActions([
                'toggleSideBar',
                'setCurrentMallShop'
            ]),
            toggleSearch () {
                this.isSearchHidden = !this.isSearchHidden;
                this.$nextTick(() => {
                    this.$refs.searchInputContainer && this.$refs.searchInputContainer.focus();
                });
            },
            select (item, index) {
                if (index === this.activeIndex) {
                    this.activeIndex = -1;
                } else {
                    this.activeIndex = index;
                }
                if(item.hasPermit) {
                    this.setCurrentMallShop({
                        mallId: item.id,
                        shopId: 0
                    });
                }
            },
            handleSubSelect (item) {
                // console.log(item);
                this.setCurrentMallShop({
                    mallId: item.mallId,
                    shopId: item.id
                });
            }
        }
    };
</script>