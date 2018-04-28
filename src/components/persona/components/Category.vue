<template>
    <div>
        <chart-container>
            <div slot="header">
                <h2>品类偏好</h2>
            </div>
            <rank-table-chart :data="data" @click="handleRowClick"></rank-table-chart>
        </chart-container>
        <category-detail-dialog :visible="dialogVisible" :type="type" :name="detailConditions.category" :query-conditions="detailConditions" @close="handleDialogClose"></category-detail-dialog>
    </div>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import RankTableChart from '@/components/charts/RankTableChart';
import CategoryDetailDialog from './dialog-category-detail/Main';
import DataGetter from '@/utils/DataGetter';
import types from '../config';
import { mapGetters, mapActions } from 'vuex';

import {
    getConsumePreference
} from '@/apis/customerProfile';

import {
    getMemberConsumePreference
} from '@/apis/member';

import {
    getCustomConsumePreference
} from '@/apis/customize';
const queryDelay = 5000;

export default {
    components: {
        ChartContainer,
        RankTableChart,
        CategoryDetailDialog
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
            },
            detailConditions: {}
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
            this.detailConditions = {};
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
                    getter = this.getter = DataGetter.createAjaxGetter(getConsumePreference, {
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
                getter = this.getter = DataGetter.createAjaxGetter(getMemberConsumePreference, {
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
                    getter = this.getter = DataGetter.createAjaxGetter(getCustomConsumePreference, {
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
        },
        handleDialogClose () {
            this.dialogVisible = false;
        },
        handleRowClick (row) {
            // console.log(row);
            this.detailConditions = Object.assign({category: row.name}, this.queryConditions);
            this.$nextTick(() => {
                this.dialogVisible = true;
            });
        }
    }
};
</script>