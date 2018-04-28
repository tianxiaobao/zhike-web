<template>
    <chart-container>
        <div slot="header" class="header">
            <h2>居住地分布</h2>
            <el-form :inline="true" :model="queryConditions" class="option-panel">
                <el-form-item label="范围选择:">
                    <el-select v-model="radius" placeholder="请选择">
                        <el-option v-for="option in optionsConfig" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="onPutClick('dsp')">DSP投放</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <heat-map-chart :data="data" :center="mallCenter" :radius="radius"></heat-map-chart>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import HeatMapChart from '@/components/charts/HeatMapChart';
import DataGetter from '@/utils/DataGetter';
import types from '../config';
import { mapGetters, mapActions } from 'vuex';
import {
    getResidenceAnalysis
} from '@/apis/customerProfile';
// import {
//     getMemberResidenceAnalysis
// } from '@/apis/member';
// import {
//     getCustomResidenceAnalysis
// } from '@/apis/customize';
const queryDelay = 5000;

const optionsConfig = [{
    label: '3公里',
    value: 3
}, {
    label: '5公里',
    value: 5
}, {
    label: '20公里',
    value: 20
}];
export default {
    components: {
        ChartContainer,
        HeatMapChart
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
                center: '',
                series: []
            },
            radius: 3,
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
        },
        mallCenter () {
            return {
                lng: this.currentMall && this.currentMall.lng,
                lat: this.currentMall && this.currentMall.lat
            };
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
                center: '',
                series: []
            };
        },
        adaptData (data) {
            return {
                series: data
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
                    getter = this.getter = DataGetter.createAjaxGetter(getResidenceAnalysis, {
                        path: [this.currentMall.id, queryConditions.time],
                        params: {
                            customerType: queryConditions.customerType,
                            start: queryConditions.startDate,
                            end: queryConditions.endDate,
                            shopId: this.currentShop.id
                        }
                    }, queryConditions.time ? 0 : queryDelay);
                    getter.on('data', data => {
                        this.data = this.adaptData(data.message.list);
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
                // getter = this.getter = DataGetter.createAjaxGetter(getMemberResidenceAnalysis, {
                //     path: [this.currentMall.id]
                // });
                // getter.on('data', data => {
                //     this.data = this.adaptData(data.message.list);
                //     this.$nextTick(() => this.showChart = true);
                // });
                // getter.start();
                // break;
            case types.CUSTOM:
                // if(queryConditions) {
                //     getter = this.getter = DataGetter.createAjaxGetter(getCustomResidenceAnalysis, {
                //         path: [this.currentMall.id, queryConditions.id],
                //     });
                //     getter.on('data', data => {
                //         this.data = this.adaptData(data.message.list);
                //         this.$nextTick(() => this.showChart = true);
                //     });
                //     getter.start();
                // }
                break;
            }
        }
        // onPutClick (type) {
        //     this.$emit('select', { 
        //         name: this.radius + '公里以内',
        //         nameSeries: '地域',
        //         type
        //     });
        // }
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
</style>
