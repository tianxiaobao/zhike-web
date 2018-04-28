<template>
    <div class="jd-crowd-behavior">
        <div class="global-feature">
            <el-form :inline="true">
                <el-form-item label="开始时间:">
                    <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">
                            购买时间最早追溯至 2015年1月1日</br>
                            搜索时间最早追溯至 2016年10月1日</br>
                            浏览时间最早追溯至 2017年9月1日</br>
                            加购、关注商品、关注店铺、评论时间最早追溯至 2018年1月1日
                        </div>
                        <el-date-picker
                            v-model="data.behavior.startDate"
                            type="date"
                            placeholder="选择开始时间"
                            :picker-options="dateStartOptions">
                        </el-date-picker>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="结束时间:">
                    <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">
                            购买时间最早追溯至 2015年1月1日</br>
                            搜索时间最早追溯至 2016年10月1日</br>
                            浏览时间最早追溯至 2017年9月1日</br>
                            加购、关注商品、关注店铺、评论时间最早追溯至 2018年1月1日
                        </div>
                        <el-date-picker
                            v-model="data.behavior.endDate"
                            type="date"
                            placeholder="选择结束时间"
                            :picker-options="dateEndOptions">
                        </el-date-picker>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>
        <div class="single-crowd-group">
            <card class="single-crowd" v-for="(singleFeature, idx) in data.behavior.detailList" :key="singleFeature.key" :closeable="true" @close="removeCrowd(idx)">
                <single-behavior-crowd :data="singleFeature"></single-behavior-crowd>
            </card>
            <div class="add-group-btn" v-show="data.behavior.detailList.length < crowdSize.max">
                <div class="icon-add" @click="addCrowd"><i class="el-icon-plus"></i></div>
            </div>
        </div>
    </div>
</template>

<script>

import SingleBehaviorCrowd from './single-crowd/Main';
import Card from '@/components/common/Card';
export default {
    components: {
        Card,
        SingleBehaviorCrowd
    },
    props: ['data'],
    created () {
        if(this.data.behavior.detailList) {
            while(this.data.behavior.detailList.length < this.crowdSize.min) {
                this.addCrowd();
            }
        }
    },
    data () {
        const _vm = this;
        return {
            optionCache: {},
            crowdSize: {
                min: 0,
                max: 3
            },
            dateStartOptions: {
                disabledDate (date) {
                    const beforeStartLimit = date.getTime() < new Date('2015-01-01T00:00:00+0800').getTime();
                    const todayOrLater = date.getTime() > Date.now() - 8.64e7;
                    const afterEnd = _vm.data.behavior.endDate ? date.getTime() > _vm.data.behavior.endDate.getTime() : false;
                    const moreThan180 = _vm.data.behavior.endDate ? date.getTime() <= _vm.data.behavior.endDate.getTime() - 180 * 8.64e7 : false;
                    return beforeStartLimit || todayOrLater || afterEnd || moreThan180;
                }
            },
            dateEndOptions: {
                disabledDate (date) {
                    const beforeStartLimit = date.getTime() < new Date('2015-01-01T00:00:00+0800').getTime();
                    const todayOrLater = date.getTime() > Date.now() - 8.64e7;
                    const beforeStart = _vm.data.behavior.startDate ? date.getTime() < _vm.data.behavior.startDate.getTime() : false;
                    const moreThan180 = _vm.data.behavior.startDate ? date.getTime() >= _vm.data.behavior.startDate.getTime() + 180 * 8.64e7 : false;
                    return beforeStartLimit || todayOrLater || beforeStart || moreThan180;
                }
            }
        };
    },
    methods: {
        generateBehaviorFeature (key) {
            return {
                key,
                targetItem: {
                    itemName: '',
                    sku: '',
                    skuValidated: true,
                    mainCategory: ['all'],
                    subCategory: [],
                    shopList: [],
                    brandList: [],
                    isSelectSubCategory: false,
                    isSelectShop: false,
                    isSelectBrand: false
                },
                operate: [{
                    pv: false,
                    order: false,
                    follow: false,
                    shopFollow: false,
                    cart: false,
                    comment: {
                        state: false,
                        keywords: '',
                        point: []
                    },
                    search: {
                        state: false,
                        keywords: ''
                    }
                }]
            };
        },
        addCrowd () {
            const behaviorList = this.data.behavior.detailList;
            const len = behaviorList.length;
            if(len >= this.crowdSize.max) {
                return;
            }
            const key = len ? behaviorList[len - 1].key + 1 : 1;
            behaviorList.push(this.generateBehaviorFeature(key));
        },
        removeCrowd (idx) {
            const behaviorList = this.data.behavior.detailList;
            if(behaviorList.length <= this.crowdSize.min) {
                return;
            }
            behaviorList.splice(idx, 1);
        }
    }
};
</script>

<style lang="scss" scoped>
.jd-crowd-behavior {
    .global-feature {
        padding: 10px;
        border: 1px solid #bfbfbf;
        background-color: #fff;
    }
    .single-crowd-group {
        padding: 10px;
        border: 1px solid #bfbfbf;
        border-top: 0;
        .single-crowd:not(:first-of-type),.add-group-btn:not(:first-of-type) {
            margin-top: 10px;
        }
        .add-group-btn {
            overflow: hidden;
            border: 1px dashed #bfbfbf;
            color: #bfbfbf;
            background-color: #fff;
            cursor: pointer;
            &:hover {
                color: #777;
                border-color: #777;
            }
            .icon-add {
                text-align: center;
                line-height: 100px;
                transform: scale(2);
            }
        }
    }
    
}
</style>
<style>
.jd-crowd-behavior .global-feature .el-form .el-form-item {
    margin-bottom: 0;
}
</style>
