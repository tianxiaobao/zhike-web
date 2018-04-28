<style lang="scss" scoped>
.customer-flow-package {
    .content, .block-container, .result-container {
        padding: 10px;
    }
    .crowd-pick-row {
        margin-top: 10px;
    }
    .crowd-picker {
        padding: 10px;
        padding-top: 0;
        border: 1px solid #e7e7e7;
        background-color: #fff;
    }
    .crowd-picked {
        min-height: 35px;
        padding: 0 10px;
        border: 1px solid #e7e7e7;
    }
    .t-center{
        width: 100%;
        text-align:center;
        & .el-button{
            min-width: 118px;
        }
    }
}
</style>
<style lang="scss">
.customer-flow-package {
    .crowd-condition.el-form-item.is-required .el-form-item__label:before {
        content: '';
    }
    .crowd-condition.el-form-item.is-error {
        .el-input__inner, .el-textarea__inner {
            border-color: #e7e7e7;
            &:focus {
                border-color: #2aafff;
                box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);color:#333;
            }
        }
        .crowd-picker {
            border-color: red;
        }
    }
    .crowd-pick-row.el-collapse .el-collapse-item__header {
        background-color: #f7f7f7;
    }
}
</style>

<template>
    <div class="customer-flow-package">
        <el-form ref="form" :rules="rules" :model="ruleForm" class="option-panel" label-width="80px" @submit.prevent>
           <el-form-item label="人群名称" prop="packageName">
                <el-input v-model="ruleForm.packageName" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="目标人群" prop="packageCrowd" class="crowd-condition">
                <div class="crowd-picker">
                    <el-collapse  class="crowd-pick-row">
                        <el-collapse-item title="筛选条件" name="picker">
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
                                <multi-attr-filter :type="type" :query-conditions="queryConditions" @click="onSelect"></multi-attr-filter>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <div>
                        <div>已选人群:</div>
                        <div class="crowd-picked">
                            <el-tag
                                v-if="ruleForm.packageCrowd"
                                type="primary"
                                :closable="true"
                                :close-transition="false"
                                @close="onRemove">
                                {{ ruleForm.packageCrowd.name }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <div class="t-center">
                <el-button type = "primary" @click="onPrev" :disabled="submitting">上一步</el-button>
                <el-button type = "primary" @click="onSubmit" :loading="submitting">创建</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
import ValueBlock from '@/components/common/ValueBlock';
import MultiAttrFilter from './components/multi-attr-filter/MultiAttrFilter';

import { mapGetters } from 'vuex';

import filterTypes from './components/multi-attr-filter/config';

import {
    getOverview
} from '@/apis/overview';
import { addCrowd } from '@/apis/crowd.js';
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
        MultiAttrFilter
    },
    beforeDestroy () {
        this.init();
    },
    data () {
        return {
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
            ruleForm: {
                packageName: '',
                packageCrowd: null
            },
            submitting: false,
            rules: {
                packageName: [
                    { required: true, message: '请输入人群名称', trigger: 'blur' },
                    { max: 40, message: '长度不超过40个字符', trigger: 'blur' }
                ],
                packageCrowd: [
                    { required: true, message: '请选择目标人群' }
                ]
            },
            type: filterTypes.CUSTOMER_FLOW
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
    methods: {
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
        },
        onSelect (val) {
            this.ruleForm.packageCrowd = val;
            this.$refs.form && this.$refs.form.validateField('packageCrowd');
        },
        onRemove () {
            this.ruleForm.packageCrowd = null;
            this.$refs.form && this.$refs.form.validateField('packageCrowd');
        },
        onPrev () {
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('prev');
        },
        onSubmit () {
            this.$refs.form && this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitting = true;
                    const params = {
                        name: this.ruleForm.packageName,
                        key: encodeURIComponent(this.ruleForm.packageCrowd.ids),
                        start: this.ruleForm.packageCrowd.start,
                        end: this.ruleForm.packageCrowd.end,
                        description:this.ruleForm.packageCrowd.name,
                        source: this.ruleForm.packageCrowd.source,
                        shopId: this.ruleForm.packageCrowd.shopId,
                        customerType: this.ruleForm.packageCrowd.customerType
                    };
                    addCrowd({
                        path: [this.currentMall.id, this.ruleForm.packageCrowd.timeslot],
                        params
                    }).then(() => {
                        this.submitting = false;
                        this.$emit('next');
                    }).catch(err => {
                        this.submitting = false;
                        if(err.message) {
                            this.$message({
                                type: 'error',
                                message: '创建人群包失败:' + err.message
                            });
                        }
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '请输入人群名称并选择目标人群'
                    });
                }
            });
        }
    }
};
</script>
