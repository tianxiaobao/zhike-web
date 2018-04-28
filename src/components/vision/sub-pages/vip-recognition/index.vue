<style scoped lang="scss" type="text/scss">
    .vip-recognition-container {
        box-sizing: border-box;
        padding: 16px;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }

    .shuffling-cards-container {
        display: flex;
        align-items: center;
        flex: 1;
        overflow: hidden;
        min-height: 440px;
        position: relative;

        .shuffling-card {
            width: 250px;
            position: absolute;

            &.has-animation {
                transition: all .5s ease-in-out;
            }
        }
    }

    .statistic-panel {
        width: 100%;
        height: 100px;
        margin-top: 25px;
        box-sizing: border-box;
        padding-right: 24px;
    }
</style>

<template>
    <div class="vip-recognition-container">
        <div class="shuffling-cards-container">
            <shuffling-card class="shuffling-card"
                            :class="{'has-animation': hasAnimation}"
                            :style="{'left': (index - currentAnchor) * 290 + 'px'}"
                            v-for="(item, index) in flowList" :key="index"
                            :is-newest="index === currentAnchor"

                            :frequency="item.frequency"
                            :group="item.group_id"
                            :username="item.user_name"
                            :last-arrival="item.last_arrival"
                            :photo-url="item.img"
                            :mobile="item.mobile"
                            :gender="item.gender"
                            :photo="item.img"
                            :created-at="item.created_at"
                            :uuid="item.uuid"
                            :has-arrived-times="item.has_arrived_times"
                            :avg-stay-duration="item.avg_stay_duration"
                            :tags="item.tags"
            >
            </shuffling-card>
        </div>
        <statistic-panel class="statistic-panel">
        </statistic-panel>
    </div>
</template>

<script>
    import ShufflingCard from './sub-components/shuffling-card';
    import StatisticPanel from './sub-components/statistic-panel';

    export default {
        name: '',
        components: {
            ShufflingCard,
            StatisticPanel
        },
        data () {
            return {
                hasAnimation: false,
                currentAnchor: 0,
                flowList: [],
                lastIndex: -1,
                syncReloadFunc: null
            };
        },
        computed: {
            currentMall () {
                return this.$store.getters.currentMall.id;
            },
            currentShop () {
                return this.$store.getters.currentShop.id;
            }
        },
        watch: {
            currentMall () {
                this.resetFlowList();
            },
            currentShop () {
                this.resetFlowList();
            }
        },
        methods: {
            resetFlowList () {
                this.hasAnimation = false;
                this.currentAnchor = 0;
                this.flowList = [];
                this.lastIndex = -1;
            }
        },
        created () {
            this.$store.dispatch('vision/getSlideShow', {
                id: this.lastIndex
            }).then(res => {
                if (res.status === 'success') {
                    const flowList = JSON.parse(res['result_data']);
                    if (flowList.length === 0) return;
                    // for (const index in flowList) {
                    //     const current = flowList[index];
                    //     calcProportion(current);
                    // }
                    // 数组最前方为最新值
                    this.lastIndex = flowList[0].id;
                    this.flowList = flowList;
                }
            });
        },
        beforeDestroy () {
            clearInterval(this.syncReloadFunc);
        },
        mounted () {
            this.syncReloadFunc = setInterval(() => {
                this.$store.dispatch('vision/getSlideShow', {
                    id: this.lastIndex
                }).then(res => {
                    if (res.status === 'success') {
                        const flowList = JSON.parse(res['result_data']);
                        if (flowList.length === 0) return;
                        if (flowList[0].id <= this.lastIndex) return;
                        for (const index in flowList) {
                            const current = flowList[index];
                            calcProportion(current);
                        }
                        this.lastIndex = flowList[0].id;
                        const additionLength = flowList.length;
                        this.flowList.unshift(...flowList);
                        this.currentAnchor = +this.currentAnchor + additionLength;

                        setTimeout(() => {
                            this.hasAnimation = true;

                            if (this.currentAnchor > 0) {
                                this.currentAnchor = this.currentAnchor - additionLength;
                            }

                            setTimeout(() => {
                                this.hasAnimation = false;
                                if (this.flowList.length > 20) {
                                    this.flowList.splice(this.flowList.length - additionLength, additionLength);
                                }
                            }, 600);
                        }, 50);
                    }
                });
            }, 800);
        }
    };

    function calcProportion (current) {
        const sum = current.morning + current.night + current.noon + current.afternoon;
        if (sum === 0) {
            current.proportion = [0, 0, 0, 0];
        }
        current.proportion = [
            current.night / sum, current.morning / sum, current.noon / sum, current.afternoon / sum
        ];
        current['received_at'] = Date.now();
    }
</script>