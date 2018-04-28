<template>
    <chart-container class="retention">
        <div slot="header" class="header">
            <h2>平均滞留时长</h2>
            <el-form :inline="true" :model="queryConditions" class="option-panel">
                <el-form-item label="客流:">
                    <el-select v-model="queryConditions.customerType" placeholder="请选择" @change="onConditionsChange" class="select">
                        <el-option v-for="option in customerTypeOptions" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间:">
                    <el-select v-model="queryConditions.time" placeholder="请选择" @change="onConditionsChange" class="select">
                        <el-option v-for="option in timeOptions" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="queryConditions.time === -1">
                    <el-date-picker :picker-options="pickerOptions" v-model="queryConditions.timeSlot" placeholder="选择日期范围" type="daterange" @change="onConditionsChange" class="date-picker">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <vu-echarts class="chart" ref="chart">
            <stack-chart v-if="showChart" :is-vertical="isVertical" :option="data"></stack-chart>
        </vu-echarts>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';

import { getStayTime } from '@/apis/customerFlow';
import AjaxClient from '@/utils/ajaxClient.js';

import { mapGetters } from 'vuex';

const customerTypeOptions = [
    { value: 'All', label: '全部顾客' },
    { value: 'New', label: '新顾客' },
    { value: 'Old', label: '老顾客' }
];

const timeOptions = [
    { value: 0, label: '今日' },
    { value: 7, label: '最近7天' },
    { value: 14, label: '最近14天' },
    { value: 30, label: '最近30天' },
    { value: -1, label: '自定义时间段'}
];

const queryDelay = 5000;

export default {
    components: {
        ChartContainer: ChartContainer,
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        StackChart: () => import('@/components/charts/vu-echarts/StackChart')
    },
    beforeDestroy () {
        this.init();
    },
    data () {
        return {
            timer: null,
            token: null,
            isVertical: false,
            queryConditions: {
                customerType: customerTypeOptions[0].value,
                time: timeOptions[0].value,
                timeSlot: ''
            },
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() >= Date.now();
                }
            },
            showChart: false,
            customerTypeOptions,
            timeOptions,
            data: {
                xLabels: [],
                series: []
            }
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
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.init();
                if(val) {
                    this.onConditionsChange();
                }
            }
        },
        isVertical () {
            this.$refs.chart && this.$refs.chart.resize && this.$refs.chart.resize();
        }
    },
    methods: {
        init () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            if(this.token) {
                this.token.cancel();
                this.token = null;
            }
            this.data = {
                xLabels: [],
                series: []
            };
            this.showChart = false;
        },
        adaptData (data) {
            const xLabels = [];
            const series = data.nameSerial.cells.map(name => {
                return {
                    name: name,
                    data: []
                };
            });

            data.dataSerials.forEach(serial => {
                xLabels.push(serial.name);
                serial.cells.forEach((cell, idx) => {
                    series[idx].data.push(cell);
                });
            });
            return {
                xLabels,
                series
            };
        },
        queryData () {
            const queryConditions = this.queryConditions;
            const flag = queryConditions.timeSlot[0]? true:false;
            const urlPath = queryConditions.time== '-1'? '0': queryConditions.time;
            this.token = AjaxClient.createCancleToken();
            return getStayTime({
                path: [this.currentMall.id, urlPath],
                params: {
                    customerType: queryConditions.customerType,
                    shopId: this.currentShop.id? this.currentShop.id: -1,
                    timeslot:queryConditions.time,
                    start: flag ? this.dateToString(queryConditions.timeSlot[0]) : '',
                    end: flag ? this.dateToString(queryConditions.timeSlot[1]) : ''
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.token = null;
                this.data = this.adaptData(dataObj.message.DataResult);
                this.$nextTick(() => this.showChart = true);
                return Promise.resolve();
            }).catch(err => Promise.reject(err));
        },
        updateData (timeout) {
            this.queryData().then(() => {
                if(this.queryConditions.time === 0) {
                    this.timer = setTimeout(() => {
                        this.timer = null;
                        this.updateData(timeout);
                    }, timeout);
                }
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                throw err;
            });
        },
        onConditionsChange () {
            this.init();
            if (this.queryConditions.time !== -1) {
                this.queryConditions.timeSlot = '';
            }
            this.isVertical = this.queryConditions.time > 7 || this.queryConditions.time == -1;
            this.$emit('change', this.isVertical);
            this.updateData(queryDelay);
        },
        dateToString (time) {
            const date = new Date(time);
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            return Y + M + D;
        }
    }
};

</script>

<style>
.retention {
    & .header {
        overflow: hidden;
        & h2 {
            line-height: 40px;
            float: left;
        }
        & .el-form-item__label {
            padding-top: 14px;
        }
        & .option-panel {
            float: right;
        }
    }
    & .chart {
        height: 300px;
    }
    & .select {
        width: 120px;
    }
    & .el-form-item {
        margin-bottom: 0;
    }
}
</style>
