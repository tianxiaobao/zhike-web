<template>
    <chart-container class="customer-number">
        <div slot="header" class="header">
            <h2>进店顾客数</h2>
            <el-form :inline="true" :model="queryConditions" class="option-panel">
                <el-form-item label="客流:">
                    <el-select v-model="queryConditions.customerType" placeholder="请选择" @change="onConditionsChange" class="select">
                        <el-option v-for="option in customerTypeOptions" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼层:" v-show="currentShop && currentShop.id === 0">
                    <el-select v-model="queryConditions.floor" placeholder="请选择" @change="onConditionsChange" class="select">
                        <el-option key="" label="全量" value="">
                        </el-option>
                        <el-option v-for="option in floorOptions" :key="option.id" :label="option.name" :value="option.id">
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
                    <el-date-picker :picker-options="pickerOptions" v-model="queryConditions.dates" placeholder="请选择" @multiple-limited="handleLimit" @change="onConditionsChange" :multiple="true" :multiple-limit="2" class="date-picker">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="queryConditions.time === -2">
                    <el-date-picker :picker-options="pickerOptions" v-model="queryConditions.timeSlot" placeholder="选择日期范围" type="daterange" @change="onConditionsChange" class="date-picker">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <vu-echarts class="chart">
            <line-chart v-if="showChart" :option="data"></line-chart>
        </vu-echarts>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';

import { getEnterAmountHistory, getEnterAmountAverage } from '@/apis/customerFlow';
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
    { value: -1, label: '自定义' },
    { value: -2, label: '自定义时间段' }
];

const queryDelay = 5000;

export default {
    components: {
        ChartContainer: ChartContainer,
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        LineChart: () => import('@/components/charts/vu-echarts/LineChart')
    },
    props: ['floorOptions'],
    beforeDestroy () {
        this.init();
    },
    data () {
        return {
            timer: null,
            tmp: null,
            token: null,
            showChart: false,
            customerTypeOptions,
            timeOptions,
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() >= Date.now();
                }
            },
            queryConditions: {
                customerType: customerTypeOptions[0].value,
                time: timeOptions[0].value,
                floor: '',
                dates: '',
                timeSlot:''
            },
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
                this.queryConditions.floor = '';
                this.init();
                if(val) {
                    this.onConditionsChange();
                }
            }
        }
    },
    methods: {
        dateToString (date) {
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            return Y + M + D;
        },
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
        adaptSingleDayData (data, name) {
            const xLabels = data.nameSerial.cells.map((name, i, arr) => {
                return `${name}~${arr[(i + 1) % arr.length]}`;
            });
            const series = [];
            series.push({
                name: name || data.dataSerials[0].name,
                data: data.dataSerials[0].cells
            });
            return {
                xLabels,
                series
            };
        },
        adaptMultiDaysData (data) {
            const xLabels = data.nameSerial.cells.map((name, i, arr) => {
                return `${name}~${arr[(i + 1) % arr.length]}`;
            });
            const ret = data.dataSerials.map(serial => {
                return {
                    xLabels,
                    series: [{
                        name: serial.name,
                        data: serial.cells
                    }]
                };
            });
            return ret;
        },
        adaptRangeDaysData (data) {
            const timeRanges = data.nameSerial.cells;
            const rangeSize = timeRanges.length;
            const xLabels = [], vals = [];
            data.dataSerials.reverse();
            data.dataSerials.forEach(serial => {
                serial.cells.forEach((val, i) => {
                    vals.push(val);
                    xLabels.push(`${serial.name}\n${timeRanges[i]}~${timeRanges[(i + 1) % rangeSize]}`);
                });
            });
            return {
                xLabels,
                series: [{
                    name: '进店顾客数',
                    data: vals
                }]
            };
        },
        queryData () {
            const queryConditions = this.queryConditions;
            const id = this.currentMall.id;
            this.token = AjaxClient.createCancleToken();
            if (queryConditions.time === 0) {
                Promise.all([
                    getEnterAmountHistory({
                        path: [id, 0], 
                        params: {
                            customerType: queryConditions.customerType,
                            floorId: this.currentShop.id? '': queryConditions.floor,
                            shopId: this.currentShop.id? this.currentShop.id: -1
                        },
                        cancelToken: this.token
                    }),
                    getEnterAmountHistory({
                        path: [id, 1],
                        params: {
                            customerType: queryConditions.customerType,
                            floorId: this.currentShop.id? '': queryConditions.floor,
                            shopId: this.currentShop.id? this.currentShop.id: -1
                        },
                        cancelToken: this.token
                    }),
                    getEnterAmountAverage({
                        path: [id, 7], 
                        params: {
                            customerType: queryConditions.customerType,
                            floorId: this.currentShop.id? '': queryConditions.floor,
                            shopId: this.currentShop.id? this.currentShop.id: -1
                        },
                        cancelToken: this.token
                    }),
                    getEnterAmountAverage({
                        path: [id, 30], 
                        params: {
                            customerType: queryConditions.customerType,
                            floorId: this.currentShop.id? '': queryConditions.floor,
                            shopId: this.currentShop.id? this.currentShop.id: -1
                        },
                        cancelToken: this.token
                    })
                ]).then(dataObjs => {
                    this.token = null;
                    const tmp = [];
                    tmp[0] = this.adaptSingleDayData(dataObjs[0].message.DataResult, '今日');
                    tmp[1] = this.adaptSingleDayData(dataObjs[1].message.DataResult, '昨日');
                    tmp[2] = this.adaptSingleDayData(dataObjs[2].message.DataResult);
                    tmp[3] = this.adaptSingleDayData(dataObjs[3].message.DataResult);
                    this.tmp = tmp;
                    this.data = {
                        xLabels: tmp[0].xLabels,
                        series: tmp.map(data => data.series[0])
                    };
                    this.$nextTick(() => this.showChart = true);
                    this.updateCustomerNumberToday(queryDelay, '今日', 0);
                }).catch(this.handleQueryError);
            } else {
                const flag = queryConditions.timeSlot[0]? true:false;
                const urlPath = queryConditions.time== '-2'? '0': queryConditions.time;
                // 如果没选择时间段，不请求接口
                if(!flag && queryConditions.time== '-2') {
                    return;
                }
                getEnterAmountHistory({
                    path: [this.currentMall.id, urlPath],
                    params: {
                        customerType: queryConditions.customerType,
                        floorId: this.currentShop.id? '': queryConditions.floor,
                        shopId: this.currentShop.id? this.currentShop.id: -1,
                        timeslot:queryConditions.time=='-2'?'-1':'',
                        start: this.dateToString(new Date(queryConditions.timeSlot[0])),
                        end: this.dateToString(new Date(queryConditions.timeSlot[1]))
                    },
                    cancelToken: this.token
                }).then(dataObj => {
                    this.token = null;
                    this.data = this.adaptRangeDaysData(dataObj.message.DataResult);
                    this.$nextTick(() => this.showChart = true);
                }).catch(this.handleQueryError);
            }
        },
        queryPicked () {
            const queryConditions = this.queryConditions;
            if (!queryConditions.dates || !Array.isArray(queryConditions.dates)) {
                return;
            }
            const now = new Date().getTime();
            const oneDay = 1000 * 3600 * 24;
            let todayIndex = -1;
            const dates = queryConditions.dates.map((date, i) => {
                const time = Math.floor((now - date.getTime()) / oneDay + 1e-8);
                if (time === 0) {
                    todayIndex = i;
                }
                return this.dateToString(date);
            });
            this.token = AjaxClient.createCancleToken();
            getEnterAmountHistory({
                path: [this.currentMall.id], 
                params: {
                    customerType: queryConditions.customerType,
                    floorId: this.currentShop.id? '': queryConditions.floor,
                    shopId: this.currentShop.id? this.currentShop.id: -1,
                    'dates[]': dates
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.token = null;
                const tmp = this.tmp = this.adaptMultiDaysData(dataObj.message.DataResult);
                this.data = {
                    xLabels: tmp[0].xLabels,
                    series: tmp.map(data => data.series[0])
                };
                this.$nextTick(() => this.showChart = true);
                if (todayIndex !== -1) {
                    this.updateCustomerNumberToday(queryDelay, null, todayIndex);
                }
            }).catch(this.handleQueryError);
        },
        updateCustomerNumberToday (timeout, name, idx) {
            this.timer = setTimeout(() => {
                this.timer = null;
                const queryConditions = this.queryConditions;
                if (queryConditions.time !== 0 && queryConditions.time !== -1) return;
                this.token = AjaxClient.createCancleToken();
                getEnterAmountHistory({
                    path: [this.currentMall.id, 0], 
                    params: {
                        customerType: queryConditions.customerType,
                        floorId: this.currentShop.id? '': queryConditions.floor,
                        shopId: this.currentShop.id? this.currentShop.id: -1
                    },
                    cancelToken: this.token
                }).then(dataObj => {
                    this.token = null;
                    this.tmp[idx] = this.adaptSingleDayData(dataObj.message.DataResult, '今日');
                    this.data = {
                        xLabels: this.tmp[0].xLabels,
                        series: this.tmp.map(data => data.series[0])
                    };
                    this.$nextTick(() => this.showChart = true);
                    this.updateCustomerNumberToday(timeout, name, idx);
                }).catch(this.handleQueryError);
            }, timeout);
        },
        onConditionsChange () {
            this.init();
            if (this.queryConditions.time == -1) {
                this.queryConditions.timeSlot = '';
                this.queryPicked();
            } else {
                if(this.queryConditions.time !== -2) {
                    this.queryConditions.timeSlot = '';
                }
                this.queryConditions.dates = '';
                this.queryData();
            }
        },
        handleQueryError (err) {
            if(AjaxClient.isCancel(err)) {
                return;
            }
            throw err;
        },
        handleLimit (val) {
            this.$message({
                type: 'info',
                message: `只能选择${val}个`
            });
        }
    }
};

</script>

<style>
.customer-number {
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
    & .date-picker .el-date-editor.el-input {
        width: 230px;
    }
    & .el-form-item {
        margin-bottom: 0;
    }
}
</style>
