<template>
    <div>
        <chart-container>
            <div slot="header" class="header">
                <h2>多级筛选</h2>
                <el-form class="option-panel" label-width="50px" inline>
                    <el-form-item label="属性:">
                        <el-select v-model="properties" multiple :multiple-limit="3" placeholder="请选择" class="multi-select">
                            <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="charts-wrapper">
                <vu-echarts class="charts" v-loading="isLoading">
                    <treemap-chart v-if="!isLoading && showChart && data.length" :option="data"></treemap-chart>
                    <empty-chart v-else-if="!isLoading && !data.length"></empty-chart>
                </vu-echarts>
            </div>
        </chart-container>
        <!-- <crowd-form-dialog :visible="dialogVisible" @close="handleDialogClose"></crowd-form-dialog> -->
    </div>
</template>

<script>

import ChartContainer from '@/components/common/ChartContainer';
// import CrowdFormDialog from './dialog-crowd-from/Main.vue';
import DataGetter from '@/utils/DataGetter';
import types from '../config';
// import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

import { getDimensionList, getMultiAnalysis } from '@/apis/customerProfile';
import { getMemberDimensionList, getMemberMultiAnalysis } from '@/apis/member';
import { getCustomDimensionList, getCustomMultiAnalysis } from '@/apis/customize';

const customerTypeStrMap = {
    'All': '全体顾客',
    'New': '新增顾客',
    'Old': '老顾客'
};

const timeOptions = [
    { value: 0, label: '今日' },
    { value: 7, label: '最近7天' },
    { value: 14, label: '最近14天' },
    { value: 30, label: '最近30天' },
    { value: -1, label: '自定义' }
];
export default {
    components: {
        ChartContainer,
        // CrowdFormDialog,
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        TreemapChart: () => import('@/components/charts/vu-echarts/TreemapChart'),
        EmptyChart: () => import('@/components/charts/vu-echarts/EmptyChart')
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
            options: [],
            properties: [],
            data: [],
            getter: null,
            isLoading: false,
            showChart: false
            // dialogVisible: false
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
                this.onSubmit();
            }
        },
        currentMallShopIds: {
            handler (val) {
                this.init();
                if(val) {
                    this.onSubmit();
                }
            }
        }
    },
    created () {
        this.init();
        this.getAttrList();
    },
    beforeDestroy () {
        this.init();
    },
    methods: {
        // ...mapActions([
        //     'setPackage'
        // ]),
        init () {
            if(this.getter) {
                this.getter.destroy();
                this.getter = null;
            }
            this.isLoading = false;
            this.showChart = false;
            this.data = [];
        },
        timeSelectToString ({time, startDate, endDate}) {
            if(time !== -1) {
                return timeOptions.find(option => option.value === time).label;
            }
            return startDate && endDate ? `${startDate}至${endDate}` : (startDate + endDate);
        },
        customerTypeToString (customerType) {
            return customerTypeStrMap[customerType] || '';
        },
        adaptAttrList (data) {
            const nameList = data.DataResult.nameSerial.cells;
            const keyList = data.DataResult.keySerial.cells;
            const ret = nameList.map((name, idx) => {
                return {
                    name,
                    value: keyList[idx]
                };
            });
            return ret;
        },
        adaptMemberAttrList (data) {
            if(!data.list)
                return [];
            return data.list.map(item => {
                const pair = Object.entries(item)[0];
                if (pair) {
                    return {
                        name: pair[1],
                        value: pair[0]
                    };
                }
                return null;
            }).filter(item => item);
        },
        adaptCustomAttrList (data) {
            if(!data.list)
                return [];
            return data.list.map(item => {
                const pair = Object.entries(item)[0];
                if (pair) {
                    return {
                        name: pair[1],
                        value: pair[0]
                    };
                }
                return null;
            }).filter(item => item);
        },
        getAttrList () {
            switch(this.type) {
            case types.CUSTOMER_FLOW:
                getDimensionList().then(data => {
                    this.options = this.adaptAttrList(data.message);
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '获取可选维度失败:' + err.message
                    });
                });
                break;
            case types.VIP:
                getMemberDimensionList().then(data => {
                    this.options = this.adaptMemberAttrList(data.message);
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '获取可选维度失败:' + err.message
                    });
                });
                break;
            case types.CUSTOM:
                getCustomDimensionList().then(data => {
                    this.options = this.adaptCustomAttrList(data.message);
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '获取可选维度失败:' + err.message
                    });
                });
                break;
            }
        },
        adaptMultiAnalysisData (data) {
            const nameList = data.DataResult.nameSerial.cells;
            const keyList = data.DataResult.keySerial.cells;
            const valueList = data.DataResult.dataSerials[0].cells;
            const ret = nameList.map((name, idx) => {
                return {
                    name,
                    value: valueList[idx],
                    key: keyList[idx]
                };
            });
            return ret;
        },
        onSubmit () {
            this.init();
            if(!this.properties.length) {
                return;
            }
            this.isLoading = true;
            const queryConditions = this.queryConditions;
            switch(this.type) {
            case types.CUSTOMER_FLOW:
                if(queryConditions) {
                    if (queryConditions.time === -1 && (!this.queryConditions.startDate || !this.queryConditions.endDate)) {
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0);
                        return;
                    }
                    const getter = this.getter = DataGetter.createAjaxGetter(getMultiAnalysis, {
                        path: [this.currentMall.id, queryConditions.time],
                        params: {
                            customerType: queryConditions.customerType,
                            start: queryConditions.startDate,
                            end: queryConditions.endDate,
                            dimensions: this.properties.join(','),
                            shopId: this.currentShop.id
                        }
                    });
                    getter.on('data', data => {
                        this.data = this.adaptMultiAnalysisData(data.message);
                        this.$nextTick(() => {
                            this.showChart = true;
                        });
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0);
                    });
                    getter.on('error', err => {
                        if(err.message) {
                            this.$message({
                                type: 'error',
                                message: '获取筛选数据失败:' + err.message
                            });
                        }
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0);
                    });
                    getter.start();
                }
                break;
            case types.VIP:
                const getter = this.getter = DataGetter.createAjaxGetter(getMemberMultiAnalysis, {
                    path: [this.currentMall.id],
                    params: {
                        dimensions: this.properties.join(',')
                    }
                });
                getter.on('data', data => {
                    this.data = this.adaptMultiAnalysisData(data.message);
                    this.$nextTick(() => {
                        this.showChart = true;
                    });
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 0);
                });
                getter.on('error', err => {
                    if(err.message) {
                        this.$message({
                            type: 'error',
                            message: '获取筛选数据失败:' + err.message
                        });
                    }
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 0);
                });
                getter.start();
                break;
            case types.CUSTOM:
                if(queryConditions) {
                    const getter = this.getter = DataGetter.createAjaxGetter(getCustomMultiAnalysis, {
                        path: [this.currentMall.id, queryConditions.id],
                        params: {
                            dimensions: this.properties.join(',')
                        }
                    });
                    getter.on('data', data => {
                        this.data = this.adaptMultiAnalysisData(data.message);
                        this.$nextTick(() => {
                            this.showChart = true;
                        });
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0);
                    });
                    getter.on('error', err => {
                        if(err.message) {
                            this.$message({
                                type: 'error',
                                message: '获取筛选数据失败:' + err.message
                            });
                        }
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0);
                    });
                    getter.start();
                }
                break;
            }
        }
        // onChartClick (param) {
        //     let source = '';
        //     let typeCode = '';
        //     switch(this.type) {
        //     case types.CUSTOMER_FLOW:
        //         const timeStr = this.timeSelectToString(this.queryConditions);
        //         const customerStr = this.customerTypeToString(this.queryConditions.customerType);
        //         source = 'customer';
        //         typeCode = `${this.currentMall.name}${this.currentShop.id ? this.currentShop.name : '全部店铺' }${timeStr}${customerStr}中${param.name.replace(/,/g,'')}人群`;
        //         this.setPackage({
        //             source,
        //             name: typeCode,
        //             ids: this.data.find(data => data.name === param.name).key,
        //             mallId: this.currentMall.id,
        //             shopId: this.currentShop.id,
        //             timeslot: this.queryConditions.time,
        //             customerType: this.queryConditions.customerType,
        //             start: this.queryConditions.startDate,
        //             end: this.queryConditions.endDate
        //         });
        //         break;
        //     case types.VIP:
        //         source = 'member';
        //         typeCode = `${this.currentMall.name}会员用户中${param.name.replace(/,/g,'')}人群`;
        //         this.setPackage({
        //             source,
        //             name: typeCode,
        //             ids: this.data.find(data => data.name === param.name).key,
        //             mallId: this.currentMall.id,
        //             shopId: '',
        //             timeslot: 0,
        //             customerType: '',
        //             start: '',
        //             end: ''
        //         });
        //         break;
        //     case types.CUSTOM:
        //         source = 'customize';
        //         typeCode = `${this.currentMall.name}定制画像中${param.name.replace(/,/g,'')}人群`;
        //         this.setPackage({
        //             source,
        //             name: typeCode,
        //             ids: this.data.find(data => data.name === param.name).key,
        //             mallId: this.currentMall.id,
        //             shopId: '',
        //             timeslot: 0,
        //             customerType: '',
        //             start: '',
        //             end: '',
        //             profileId: this.queryConditions.id
        //         });
        //         break;
        //     }
        //     this.$nextTick(() => this.dialogVisible = true);
        // },
        // handleDialogClose () {
        //     this.dialogVisible = false;
        // }
    }
};
</script>
<style lang="scss" scoped>
.header {
    h2 {
        line-height: 40px;
        float: left;
    }
    .option-panel {
        float: right;
    }
    &::after {
        content: '';
        display: block;
        height: 0;
        clear: both;
    }
}
.charts-wrapper, .charts {
    height: 350px;
}
</style>

<style lang="scss" >
.multi-select.el-select {
    min-width: 450px;
    .el-input__inner {
        height: 30px!important;
    }
}
</style>

