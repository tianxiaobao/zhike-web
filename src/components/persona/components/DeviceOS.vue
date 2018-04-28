<template>
    <chart-container>
        <div slot="header">
            <h2>常用设备操作系统</h2>
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
    getDeviceOs
} from '@/apis/customerProfile';
import {
    getMemberDeviceOs
} from '@/apis/member';
import {
    getCustomDeviceOs
} from '@/apis/customize';
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
            data: {
                name: '',
                series: []
            }
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
                    if(this.currentMall.id === 0) {
                        getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/device-os.json'));
                    } else {
                        getter = this.getter = DataGetter.createAjaxGetter(getDeviceOs, {
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
                    getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/device-os.json'));
                } else {
                    getter = this.getter = DataGetter.createAjaxGetter(getMemberDeviceOs, {
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
                        getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/device-os.json'));
                    } else {
                        getter = this.getter = DataGetter.createAjaxGetter(getCustomDeviceOs, {
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
.charts-wrapper, .charts {
    height: 300px;
}
</style>