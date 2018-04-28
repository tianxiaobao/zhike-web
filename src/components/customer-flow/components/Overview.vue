<template>
    <chart-container class="overview">
        <div slot="header" class="header">
            <h2>概览</h2>
            <el-form :inline="true" :model="queryConditions" class="option-panel">
            <el-form-item label="时间:">
                <el-select v-model="queryConditions.time" placeholder="请选择" @change="onConditionsChange" class="select">
                    <el-option
                        v-for="option in timeOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryConditions.time === -1">
                <el-date-picker :picker-options="pickerOptions" v-model="queryConditions.timeSlot" placeholder="选择日期范围" type="daterange" @change="onConditionsChange" class="date-picker">
                </el-date-picker>
            </el-form-item>
            </el-form>
        </div>
        <div>
            <!-- <el-row>
                <el-col :span="6" v-for="block in blockList" :key="block.type" class="block-container">
                    <value-block>
                        <template>{{ block.value }}</template>
                        <template slot="sub">{{ block.name }}</template>
                        <template slot="icon"><img :src="block.icon"></template>
                    </value-block>
                </el-col>
            </el-row> -->
            <div class="view-box">
                <view-block v-for="block in blockList" :key="block.type">
                    <template slot="icon"><img :src="block.icon"></template>
                    <template slot="value">{{ block.value }}</template>
                    <template slot="sub">{{ block.name }}</template>
                    <template slot="upDown" v-if="block.up"><img :src="block.up">{{ block.updown }}</template>
                </view-block>
            </div>
        </div>
    </chart-container>
</template>

<script>
import ChartContainer from '@/components/common/ChartContainer';
import ViewBlock from '@/components/common/ViewBlock';

import { getOverview } from '@/apis/overview.js';
import { recordLog } from '@/apis/log.js';
import AjaxClient from '@/utils/ajaxClient.js';

import { mapGetters } from 'vuex';

import cusnew from '@/assets/view-4.png';
import cusnum from '@/assets/view-1.png';
// import hog from '@/assets/hog.png';
import house from '@/assets/view-2.png';
// import rate from '@/assets/rate.png';
import time from '@/assets/view-3.png';
import upImg from '@/assets/up.png';
import downImg from '@/assets/down.png';

const overviewTypes = {
    CUSTOMERNUMBER: 'CustomerFlowAmount',
    ENTERCUSTOMERNUMBER: 'ShopCustomerAmount',
    ENTERRATE: 'EnterShopRate',
    AVGSTAYTIME: 'AverageStayShopTime',
    NEWCUSTOMERNUMBER: 'NewCustomerAmount',
    NEWCUSTOMERRATE: 'NewCustomerRatio'
};

const formatters = {
    default: (val) => val || 0,
    percent: (val) => (val || '0.00') + '%'
};

const blocksConfig = [{
    type: overviewTypes.CUSTOMERNUMBER,
    name: '客流量',
    icon: cusnum,
    formatter: formatters.default,
    percent:formatters.percent
}, {
    type: overviewTypes.ENTERCUSTOMERNUMBER,
    name: '到店顾客',
    icon: house,
    formatter: formatters.default,
    percent:formatters.percent
// }, {
//     type: overviewTypes.ENTERRATE,
//     name: '进店率',
//     icon: rate,
//     formatter: formatters.percent
}, {
    type: overviewTypes.AVGSTAYTIME,
    name: '平均驻店时长(min)',
    icon: time,
    formatter: formatters.default,
    percent:formatters.percent
}, {
    type: overviewTypes.NEWCUSTOMERNUMBER,
    name: '新增顾客数',
    icon: cusnew,
    formatter: formatters.default,
    percent:formatters.percent
// }, {
//     type: overviewTypes.NEWCUSTOMERRATE,
//     name: '新顾客比例',
//     icon: hog,
//     formatter: formatters.percent
}];

const catalog = Object.values(blocksConfig).map(block => block.type);

const timeOptions = [
    { value: 0, label: '今日'},
    { value: 7, label: '最近7天'},
    { value: 14, label: '最近14天'},
    { value: 30, label: '最近30天'},
    { value: -1, label: '自定义时间段'}
];

const queryDelay = 5000;

export default {
    components: {
        ChartContainer: ChartContainer,
        ViewBlock
    },
    beforeDestroy () {
        this.init();
    },
    data () {
        return {
            timer: null,
            token: null,
            data: [],
            timeOptions,
            queryConditions: {
                time: timeOptions[0].value,
                timeSlot: ''
            },
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() >= Date.now();
                }
            },
            upDown:{
                CustomerFlowAmount:'',
                ShopCustomerAmount:'',
                AverageStayShopTime:'',
                NewCustomerAmount:''
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
        },
        blockList () {
            return blocksConfig.map(blockConfig => {
                const dataValue = this.data[blockConfig.type];
                const value = blockConfig.formatter(dataValue);
                // 添加升降
                if(this.queryConditions.time!=-1) {
                    const updown = blockConfig.percent(Math.abs(this.upDown[blockConfig.type]));
                    const up = this.upDown[blockConfig.type]>0?upImg:downImg;
                    return Object.assign({ value,updown,up }, blockConfig);
                }
                return Object.assign({ value}, blockConfig);
            });
        }
    },
    watch: {
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.init();
                if(val) {
                    this.onConditionsChange(queryDelay);
                }
            }
        }
    },
    created () {
        this.recordLog();
    },
    methods: {
        // 记录日志
        recordLog () {
            recordLog({
                params: {
                    operation: '浏览客流概览',
                    module: 'CUSTOMER_FLOW',
                    desc: 'mallId:'+this.currentMall.id+',shopId:'+this.currentShop.id
                }
            }).then(() => {
            });
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
            this.data = [];
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
        queryData () {
            const queryConditions = this.queryConditions;
            const flag = queryConditions.timeSlot[0]? true:false;
            this.token = AjaxClient.createCancleToken();
            return getOverview({
                path: [
                    this.currentMall.id
                ],
                params: {
                    recentDays: queryConditions.time,
                    shopId: this.currentShop.id? this.currentShop.id: -1,
                    catalog,
                    start: flag ? this.dateToString(queryConditions.timeSlot[0]) : '',
                    end: flag ? this.dateToString(queryConditions.timeSlot[1]) : ''
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.token = null;
                this.data = dataObj.message.current;
                this.handleUpDown(dataObj.message.current,dataObj.message.before);
                return Promise.resolve();
            }).catch(err => Promise.reject(err));
        },
        updateData (timeout) {
            this.queryData().then(() => {
                if(timeout) {
                    this.timer = setTimeout(() => {
                        this.timer = null;
                        this.updateData(timeout);
                    }, timeout);
                }
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取概览数据失败: ' + err.message
                    });
                }
            });
        },
        onConditionsChange () {
            this.init();
            if (this.queryConditions.time !== -1) {
                this.queryConditions.timeSlot = '';
            }
            this.updateData(this.queryConditions.time ? 0 : queryDelay);
        },
        dateToString (time) {
            const date = new Date(time);
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            return Y + M + D;
        },
        // 处理上升下降率的问题
        handleUpDown (current,before) {
            if(this.queryConditions.time != -1) {
                for(const i in this.upDown) {
                    this.upDown[i] = ((current[i] - before[i])*100/before[i]).toFixed(2);
                }
            }
        }
    }
};
</script>
<style>
.overview {
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
    & .select {
        width: 120px;
    }
    & .el-form-item {
        margin-bottom: 0;
    }
    & .block-container {
        position: relative;
        &:not(:last-of-type)::after {
            content: '';
            display: block;
            position: absolute;
            right: 0;
            width: 1px;
            background-color: rgb(205, 234, 241);
            top: 40px;
            bottom: 40px;
        }
    }
    & .view-box{
        display: flex;
        justify-content: space-between;
    }

}
</style>
