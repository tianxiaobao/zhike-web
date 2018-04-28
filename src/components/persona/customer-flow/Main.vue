<template>
    <div class="persona">
        <title-bar class="bar">
            <div class="bar-options">
                <el-form :inline="true" :model="queryConditions">
                    <el-form-item label="时间:">
                        <el-select v-model="queryConditions.time" placeholder="请选择" @change="onTimeSelect">
                            <el-option v-for="option in timeOptions" :key="option.value" :label="option.label" :value="option.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="queryConditions.time === -1">
                        <el-date-picker :picker-options="pickerOptions" v-model="dates" type="daterange" @change="onDateRangePick" placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </title-bar>
        <div class="content">
            <el-row>
                <el-col :span="8" v-for="block in blockList" :key="block.type" class="block-container">
                    <value-block :active="queryConditions.customerType === block.type" :clickable="true" @click="onBlockClick(block)">
                        <template>{{ block.value }}</template>
                        <template slot="sub">{{ block.name }}</template>
                        <template slot="icon"><img :src="block.icon"></template>
                    </value-block>
                </el-col>
            </el-row>
            <el-tabs v-model="activeTab" type="card" class="result-container">
                <el-tab-pane label="人口属性" name="population">
                    <population v-if="activeTab === 'population'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></population>
                </el-tab-pane>
                <el-tab-pane label="社会属性" name="social">
                    <social v-if="activeTab === 'social'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></social>
                </el-tab-pane>
                <el-tab-pane label="消费偏好" name="consume">
                    <consume v-if="activeTab === 'consume'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></consume>
                </el-tab-pane>
                <el-tab-pane label="地域分布" name="region">
                    <region v-if="activeTab === 'region'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></region>
                </el-tab-pane>
                <el-tab-pane label="购买行为" name="buyBehavior">
                    <buy-behavior v-if="activeTab === 'buyBehavior'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></buy-behavior>
                </el-tab-pane>
                <el-tab-pane label="购物习惯" name="shopHabit">
                    <shop-habit v-if="activeTab === 'shopHabit'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></shop-habit>
                </el-tab-pane>
                <el-tab-pane label="多级筛选" name="filter">
                    <multi-attr-filter v-if="activeTab === 'filter'" :type="personaTypes.CUSTOMER_FLOW" :query-conditions="queryConditions"></multi-attr-filter>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
import ValueBlock from '@/components/common/ValueBlock';

import Population from '../components/population/Main';
import Social from '../components/social/Main';
import Consume from '../components/consume/Main';
import Region from '../components/region/Main';
import BuyBehavior from '../components/buy-behavior/Main';
import ShopHabit from '../components/shop-habit/Main';
import MultiAttrFilter from '../components/multi-attr-filter/Main';

import { mapGetters } from 'vuex';

import personaTypes from '../config';

import {
    getOverview
} from '@/apis/overview';
import { recordLog } from '@/apis/log.js';
import AjaxClient from '@/utils/ajaxClient.js';

import cusall from '@/assets/cusall.png';
import cusnew from '@/assets/cusnew.png';
import cusold from '@/assets/cusold.png';

const overviewTypes = {
    CUSTOMERNUMBER: 'CustomerFlowAmount',
    NEWCUSTOMERNUMBER: 'NewCustomerAmount'
};

const catalog = Object.values(overviewTypes);

const customerTypes = {
    ALL: 'All',
    NEW: 'New',
    OLD: 'Old'
};

const adapters = [{
    type: customerTypes.ALL,
    adapter (data) {
        return data[overviewTypes.CUSTOMERNUMBER] || 0;
    }
}, {
    type: customerTypes.NEW,
    adapter (data) {
        return data[overviewTypes.NEWCUSTOMERNUMBER] || 0;
    }
}, {
    type: customerTypes.OLD,
    adapter (data) {
        return (data[overviewTypes.CUSTOMERNUMBER] || 0) - (data[overviewTypes.NEWCUSTOMERNUMBER] || 0);
    }
}];

const blocksConfig = [{
    type: customerTypes.ALL,
    name: '总顾客数',
    icon: cusall
}, {
    type: customerTypes.NEW,
    name: '新增顾客数',
    icon: cusnew
}, {
    type: customerTypes.OLD,
    name: '老顾客数',
    icon: cusold
}];

const timeOptions = [
    { value: 0, label: '今日' },
    { value: 7, label: '最近7天' },
    { value: 14, label: '最近14天' },
    { value: 30, label: '最近30天' },
    { value: -1, label: '自定义' }
];

const queryDelay = 5000;

export default {
    components: {
        TitleBar,
        ValueBlock,
        Population,
        Social,
        Consume,
        Region,
        BuyBehavior,
        ShopHabit,
        MultiAttrFilter
    },
    beforeDestroy () {
        this.init();
    },
    data () {
        return {
            activeTab: 'population',
            timer: null,
            token: null,
            queryConditions: {
                time: 0,
                customerType: blocksConfig[0].type,
                startDate: '',
                endDate: ''
            },
            data: {},
            dates: [null, null],
            blocksConfig,
            timeOptions,
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() + 86400000 >= Date.now();
                }
            },
            personaTypes
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
                const value = this.data[blockConfig.type] || 0;
                return Object.assign({ value }, blockConfig);
            });
        }
    },
    watch: {
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.init();
                if (val) {
                    this.onConditionChange();
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
                    operation: '浏览客流画像',
                    module: 'CUSTOMER_PROFILE',
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
            if (this.token) {
                this.token.cancel();
                this.token = null;
            }
            this.data = {};
        },
        dateToString (date) {
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            return Y + M + D;
        },
        adaptData (data) {
            const ret = {};
            adapters.forEach(item => {
                ret[item.type] = item.adapter(data);
            });
            return ret;
        },
        queryData () {
            this.token = AjaxClient.createCancleToken();
            const queryConditions = this.queryConditions;
            return getOverview({
                path: [this.currentMall.id],
                params: {
                    recentDays: queryConditions.time,
                    shopId: this.currentShop.id? this.currentShop.id: -1,
                    catalog,
                    start: queryConditions.startDate,
                    end: queryConditions.endDate
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.token = null;
                this.data = this.adaptData(dataObj.message.current);
                return Promise.resolve();
            }).catch(err => {
                return Promise.reject(err);
            });
        },
        updateData (timeout) {
            this.queryData().then(() => {
                if (timeout && this.queryConditions.time === 0) {
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
                        message: '获取数据失败: ' + err.message
                    });
                }
            });
        },
        onBlockClick (block) {
            if (block.type === this.queryConditions.customerType) {
                return;
            }
            this.queryConditions.customerType = block.type;
        },
        onConditionChange () {
            this.init();
            if(this.queryConditions.time === 0) {
                this.updateData(queryDelay);
            } else {
                if (this.queryConditions.time === -1 && (!this.queryConditions.startDate || !this.queryConditions.endDate)) {
                    return;
                }
                this.updateData();
            }
        },
        onDateRangePick () {
            this.queryConditions.startDate = this.dates[0]? this.dateToString(this.dates[0]): '';
            this.queryConditions.endDate = this.dates[1]? this.dateToString(this.dates[1]): '';
            this.onConditionChange();
        },
        onTimeSelect () {
            this.queryConditions.startDate = this.queryConditions.endDate = '';
            if(this.queryConditions.time === -1) {
                this.dates = [null, null];
            }
            this.onConditionChange();
        }
    }
};
</script>
<style lang="scss" scoped>
.persona {
    .bar .bar-options {
        float: right;
    }
    .content, .block-container, .result-container {
        padding: 10px;
    }
}
</style>
