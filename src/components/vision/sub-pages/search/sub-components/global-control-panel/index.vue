<style scoped lang="scss" type="text/scss">
    .global-control-panel-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-control-panel {
            display: flex;
            align-items: center;

            .search-input {
                width: 300px;
                height: 33px;
            }

            .left-item {
                &:not(:first-child) {
                    margin-left: 8px;
                }
            }
        }
        .right-control-panel {
            display: flex;
            align-items: center;

            .right-item {
                &:not(:last-child) {
                    margin-right: 8px;
                }
            }
        }
    }
</style>

<template>
    <div class="global-control-panel-container">
        <div class="left-control-panel">
            <the-button-group>
                <the-button size="small" :active="!isViewByTimeLine" @click="toggleViewType('camera')">
                    <i class="icon">&#xe62e;</i>
                    <span>按机位查看</span>
                </the-button>
                <the-button size="small" :active="isViewByTimeLine" @click="toggleViewType('time-line')">
                    <i class="icon">&#xe6c1;</i>
                    <span>按时间查看</span>
                </the-button>
            </the-button-group>
            <the-search-input-button class="left-item search-input" v-model="searchKeyWord"
                                     @search="search"></the-search-input-button>
        </div>
        <div class="right-control-panel">
            <the-date-range-toggle class="the-date-range-toggle" @toggle="toggleDate"></the-date-range-toggle>
        </div>
    </div>
</template>

<script>
    import TheButton from '../../../face-entry/sub-components/vision-button';
    import TheSearchInputButton from '../../sub-components/search-input-button';
    import TheDateRangeToggle from '../../sub-components/date-range-toggle';
    import TheButtonGroup from '../../../face-entry/sub-components/vision-button-group';
    import * as routes from '../../../../../../pages/index/router/route_types';

    export default {
        name: '',
        components: {
            TheButton,
            TheButtonGroup,
            TheSearchInputButton,
            TheDateRangeToggle
        },
        computed: {
            currentRouter () {
                return this.$route.name;
            },
            historyViewType () {
                return this.$store.state.vision.historyViewType;
            },
            isViewByTimeLine () {
                return this.historyViewType === 'time-line';
            },
            historyUuid () {
                return this.$store.state.vision.historyUuid;
            },
            currentMall () {
                return this.$store.getters.currentMall.id;
            },
            currentShop () {
                return this.$store.getters.currentShop.id;
            }
        },
        created () {
            this.searchKeyWord = this.historyUuid;
            this.search(this.searchKeyWord);
            this.toggleViewTypeByRouterName(this.currentRouter);
        },
        watch: {
            currentRouter (routerName) {
                this.toggleViewTypeByRouterName(routerName);
            },
            isViewByTimeLine (isViewByTimeLine) {
                let routerName = '';
                if (isViewByTimeLine) {
                    routerName = routes.VISION_SEARCH_BY_TIME_LINE;
                } else {
                    routerName = routes.VISION_SEARCH_BY_CAMERA;
                }
                this.$router.push({
                    name: routerName
                });
            },
            currentMall () {
                this.searchKeyWord = '';
                this.search(this.searchKeyWord);
            },
            currentShop () {
                this.searchKeyWord = '';
                this.search(this.searchKeyWord);
            }
        },
        methods: {
            search (keyword) {
                if (keyword === '' || keyword === null) {
                    this.$store.commit('vision/updateHistoryData', []);
                } else {
                    if (this.dateRange.start === undefined) return;
                    this.$store.dispatch('vision/getHistorySearch', {
                        keyword,
                        ...this.dateRange
                    }).then();
                }
            },
            toggleViewType (viewType) {
                this.$store.commit('vision/updateHistoryViewType', viewType);
            },
            toggleDate (range) {
                this.dateRange = range;
                this.search(this.searchKeyWord);
            },
            toggleViewTypeByRouterName (routerName) {
                let viewType = '';
                switch (routerName) {
                case routes.VISION_SEARCH_BY_CAMERA :
                    viewType = 'camera';
                    break;
                case routes.VISION_SEARCH_BY_TIME_LINE:
                    viewType = 'time-line';
                    break;
                }
                this.$store.commit('vision/updateHistoryViewType', viewType);
            }
        },
        data () {
            return {
                searchKeyWord: '',
                dateRange: {}
            };
        }
    };
</script>