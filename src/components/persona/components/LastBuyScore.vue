<template>
    <chart-container>
        <div slot="header" class="header">
            <h2>最近一次购买距离今天数得分
                <score-tip :index="0"></score-tip>
            </h2>
            <el-form :inline="true" class="option-panel">
                <el-form-item label="距今天数:">
                    <el-select v-model="day" placeholder="请选择" class="day-select" @change="onConditionChange">
                        <el-option v-for="option in optionsConfig" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="charts-wrapper">
            <vu-echarts class="charts">
                <default-hog-chart v-if="showChart" :option="data"></default-hog-chart>
            </vu-echarts>
        </div>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import ScoreTip from '@/components/common/ScoreTip';
import DataGetter from '@/utils/DataGetter';
import types from '../config';
import { mapGetters, mapActions } from 'vuex';

import {
    getRfmRScoreD7,
    getRfmRScoreD15,
    getRfmRScoreD30,
    getRfmRScoreM3
} from '@/apis/customerProfile';

import {
    getMemberRfmRScoreD7,
    getMemberRfmRScoreD15,
    getMemberRfmRScoreD30,
    getMemberRfmRScoreM3
} from '@/apis/member';

import {
    getCustomRfmRScoreD7,
    getCustomRfmRScoreD15,
    getCustomRfmRScoreD30,
    getCustomRfmRScoreM3

} from '@/apis/customize';

const queryDelay = 5000;

const optionsConfig = [{
    label: '7天',
    value: 7,
    api: getRfmRScoreD7,
    memberApi: getMemberRfmRScoreD7,
    customApi: getCustomRfmRScoreD7
}, {
    label: '15天',
    value: 15,
    api: getRfmRScoreD15,
    memberApi: getMemberRfmRScoreD15,
    customApi: getCustomRfmRScoreD15
}, {
    label: '30天',
    value: 30,
    api: getRfmRScoreD30,
    memberApi: getMemberRfmRScoreD30,
    customApi: getCustomRfmRScoreD30
}, {
    label: '90天',
    value: 90,
    api: getRfmRScoreM3,
    memberApi: getMemberRfmRScoreM3,
    customApi: getCustomRfmRScoreM3
}];

export default {
    components: {
        ChartContainer,
        ScoreTip,
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        DefaultHogChart: () => import('@/components/charts/vu-echarts/DefaultHogChart')
    },
    props: {
        type: {
            required: true,
            type: String
        },
        queryConditions: {
            default () {
                return {};
            }
        }
    },
    data () {
        return {
            showChart: false,
            getter: null,
            data: {
                series: []
            },
            day: 7,
            optionsConfig
        };
    },
    computed: {
        ...mapGetters([
            'currentMall',
            'currentShop'
        ]),
        currentMallShopIds () {
            if(!this.currentMall || !this.currentShop) {
                return null;
            }
            return `${this.currentMall.id},${this.currentShop.id}`;
        }
    },
    watch: {
        queryConditions: {
            deep: true,
            handler () {
                this.init();
                this.onConditionChange();
            }
        },
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.init();
                if(val) {
                    this.onConditionChange();
                }
            }
        }
    },
    beforeDestroy () {
        this.init();
    },
    methods: {
        ...mapActions(['setError']),
        init () {
            if(this.getter) {
                this.getter.destroy();
                this.getter = null;
            }
            this.showChart = false;
            this.data = {
                series: []
            };
        },
        adaptData (data) {
            const series = data.nameSerial.cells.map((name, idx) => {
                return {
                    name: name,
                    value: data.dataSerials[0].cells[idx]
                };
            });
            return {
                tooltip: {
                    formatter (params) {
                        return `${params[0].name}
                                </br>
                                ${params[0].marker}
                                ${params[0].value}%`;
                    }
                },
                name: data.nameSerial.name,
                series
            };
        },
        onConditionChange () {
            this.init();
            const queryConditions = this.queryConditions;
            
            let getter = null;
            switch(this.type) {
            case types.CUSTOMER_FLOW:
                if(queryConditions) {
                    if (queryConditions.time === -1 && (!this.queryConditions.startDate || !this.queryConditions.endDate)) {
                        return;
                    }
                    if(this.currentMall.id === 0) {
                        getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/last-buy-score.json'));
                    } else {
                        const api = optionsConfig.find(item => item.value === this.day).api;
                        getter = this.getter = DataGetter.createAjaxGetter(api, {
                            path: [this.currentMall.id, queryConditions.time],
                            params: {
                                customerType: queryConditions.customerType,
                                start: queryConditions.startDate,
                                end: queryConditions.endDate,
                                shopId: this.currentShop.id
                            }
                        }, queryConditions.time ? 0 : queryDelay);
                    }
                    getter.on('data', data => {
                        this.data = this.adaptData(data.message.DataResult);
                        this.$nextTick(() => this.showChart = true);
                    });
                    getter.on('error', error => {
                        if(error.message) {
                            this.setError(error.message);
                        }
                        this.$nextTick(() => this.showChart = true);
                    });
                    getter.start();
                }
                break;
            case types.VIP:
                if(this.currentMall.id === 0) {
                    getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/last-buy-score.json'));
                } else {
                    const api = optionsConfig.find(item => item.value === this.day).memberApi;
                    getter = this.getter = DataGetter.createAjaxGetter(api, {
                        path: [this.currentMall.id]
                    });
                }
                getter.on('data', data => {
                    this.data = this.adaptData(data.message.DataResult);
                    this.$nextTick(() => this.showChart = true);
                });
                getter.on('error', error => {
                    if(error.message) {
                        this.setError(error.message);
                    }
                    this.$nextTick(() => this.showChart = true);
                });
                getter.start();
                break;
            case types.CUSTOM:
                if(queryConditions) {
                    if(this.currentMall.id === 0) {
                        getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/last-buy-score.json'));
                    } else {
                        const api = optionsConfig.find(item => item.value === this.day).customApi;
                        getter = this.getter = DataGetter.createAjaxGetter(api, {
                            path: [this.currentMall.id, queryConditions.id]
                        });
                    }
                    getter.on('data', data => {
                        this.data = this.adaptData(data.message.DataResult);
                        this.$nextTick(() => this.showChart = true);
                    });
                    getter.on('error', error => {
                        if(error.message) {
                            this.setError(error.message);
                        }
                        this.$nextTick(() => this.showChart = true);
                    });
                    getter.start();
                }
                break;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    overflow: hidden;
    h2 {
        line-height: 40px;
        float: left;
    }
    .option-panel {
        float: right;
    }
    .day-select {
        width: 100px;
    }
}
.charts-wrapper, .charts {
    height: 300px;
}
</style>

