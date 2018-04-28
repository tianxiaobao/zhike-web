<template>
    <div>
        <chart-container>
            <div slot="header">
                <h2>是否有孩子</h2>
            </div>
            <div class="charts-wrapper">
                <vu-echarts class="charts" @click="handlePieClick">
                    <pie-chart v-if="showChart" :option="data"></pie-chart>
                </vu-echarts>
            </div>
        </chart-container>
        <children-detail-dialog :visible="dialogVisible" :type="type" :query-conditions="queryConditions" @close="handleDialogClose"></children-detail-dialog>
    </div>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import ChildrenDetailDialog from './dialog-children-detail/Main';

import DataGetter from '@/utils/DataGetter';
import types from '../config';

import { mapGetters, mapActions } from 'vuex';

import {
    getHaveChildren
} from '@/apis/customerProfile';

import {
    getMemberHaveChildren
} from '@/apis/member';
import {
    getCustomHaveChildren
} from '@/apis/customize';
const queryDelay = 5000;

export default {
    components: {
        ChartContainer,
        ChildrenDetailDialog,
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
            dialogVisible: false,
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
                        getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/has-children.json'));
                    } else {
                        getter = this.getter = DataGetter.createAjaxGetter(getHaveChildren, {
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
                    getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/has-children.json'));
                } else {
                    getter = this.getter = DataGetter.createAjaxGetter(getMemberHaveChildren, {
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
                        getter = this.getter = DataGetter.createJsonGetter(() => import('@/assets/json/has-children.json'));
                    } else {
                        getter = this.getter = DataGetter.createAjaxGetter(getCustomHaveChildren, {
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
        },
        handleDialogClose () {
            this.dialogVisible = false;
        },
        handlePieClick (data) {
            if(data.name === '有') {
                this.$nextTick(() => {
                    this.dialogVisible = true;
                });
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

