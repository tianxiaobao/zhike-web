<template>
    <chart-container>
        <div slot="header" class="header">
            <h2>品类用户购买力</h2>
            <el-form :inline="true" :model="queryConditions" class="option-panel">
                <el-form-item label="品类:">
                    <el-select v-model="itemType" placeholder="请选择" @change="onConditionChange">
                        <el-option v-for="option in optionsConfig" :key="option.value" :label="option.name" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="charts-wrapper">
            <vu-echarts class="charts">
                <pie-chart v-if="showChart" :option="data"></pie-chart>
            </vu-echarts>
        </div>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import DataGetter from '@/utils/DataGetter';
import types from '../config';
import { mapGetters, mapActions } from 'vuex';
import {
    getMombabyAnalysis,
    getBeautyAnalysis,
    getWineAnalysis
} from '@/apis/customerProfile';
import {
    getMemberMombabyAnalysis,
    getMemberBeautyAnalysis,
    getMemberWineAnalysis
} from '@/apis/member';
import {
    getCustomMombabyAnalysis,
    getCustomBeautyAnalysis,
    getCustomWineAnalysis
} from '@/apis/customize';
const optionsConfig = [{
    name: '母婴',
    value: 'mombaby',
    api: getMombabyAnalysis,
    memberApi: getMemberMombabyAnalysis,
    customApi: getCustomMombabyAnalysis
}, {
    name: '个护',
    value: 'beauty',
    api: getBeautyAnalysis,
    memberApi: getMemberBeautyAnalysis,
    customApi: getCustomBeautyAnalysis
}, {
    name: '酒类',
    value: 'wine',
    api: getWineAnalysis,
    memberApi: getMemberWineAnalysis,
    customApi: getCustomWineAnalysis
}];

const queryDelay = 5000;

export default {
    components: {
        ChartContainer,
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        PieChart: () => import('@/components/charts/vu-echarts/PieChart')
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
            itemType: optionsConfig[0].value,
            data: {
                name: '',
                series: []
            },
            optionsConfig
        };
    },
    beforeDestroy () {
        this.init();
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
    methods: {
        ...mapActions(['setError']),
        init () {
            if(this.getter) {
                this.getter.destroy();
                this.getter = null;
            }
            this.showChart = false;
            this.data = {
                name: '',
                series: []
            };
        },
        adaptData (data) {
            const name = data.nameSerial.name;
            const series = data.nameSerial.cells.map((name, idx) => {
                return {
                    name: name,
                    value: data.dataSerials[0].cells[idx]
                };
            });
            return {
                name,
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
                    const api = optionsConfig.find(item => item.value === this.itemType).api;
                    getter = this.getter = DataGetter.createAjaxGetter(api, {
                        path: [this.currentMall.id, queryConditions.time],
                        params: {
                            customerType: queryConditions.customerType,
                            start: queryConditions.startDate,
                            end: queryConditions.endDate,
                            shopId: this.currentShop.id
                        }
                    }, queryConditions.time ? 0 : queryDelay);
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
                const api = optionsConfig.find(item => item.value === this.itemType).memberApi;
                getter = this.getter = DataGetter.createAjaxGetter(api, {
                    path: [this.currentMall.id]
                });
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
                    const api = optionsConfig.find(item => item.value === this.itemType).customApi;
                    getter = this.getter = DataGetter.createAjaxGetter(api, {
                        path: [this.currentMall.id, queryConditions.id]
                    });
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
}
.charts-wrapper, .charts {
    height: 300px;
}
</style>
