<template>
    <chart-container>
        <div slot="header">
            <h2>品牌偏好</h2>
        </div>
        <rank-table-chart :data="data"></rank-table-chart>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import RankTableChart from '@/components/charts/RankTableChart';

import DataGetter from '@/utils/DataGetter';
import types from '../config';
import { mapGetters, mapActions } from 'vuex';

import {
    getBrandPreference
} from '@/apis/customerProfile';

import {
    getMemberBrandPreference
} from '@/apis/member';
import {
    getCustomBrandPreference
} from '@/apis/customize';
const queryDelay = 5000;

export default {
    components: {
        ChartContainer,
        RankTableChart
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
                    rank: data.dataSerials[0].cells[idx]
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
                    getter = this.getter = DataGetter.createAjaxGetter(getBrandPreference, {
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
                getter = this.getter = DataGetter.createAjaxGetter(getMemberBrandPreference, {
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
                    getter = this.getter = DataGetter.createAjaxGetter(getCustomBrandPreference, {
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