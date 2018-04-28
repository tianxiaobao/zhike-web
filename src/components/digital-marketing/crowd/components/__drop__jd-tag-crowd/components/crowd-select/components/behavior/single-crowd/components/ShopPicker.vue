<template>
    <div>
        <span>备选:</span>
        <div class="picker-panel">
            <div class="picker-header">
                <el-input
                    class="filter-input"
                    v-model="searchString"
                    @change="onSearchStringChange"
                    size="mini"
                    icon="search">
                </el-input>
            </div>
            <checkbox-list class="picker-list"
                v-model="pickedValueList"
                :options="shopOptions"
                :disabled="max != null && value.length >= max"
                :disable-checked-only="true">
            </checkbox-list>
            <div class="picker-footer">
                <div class="picker-pagination">
                    <el-pagination
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :current-page.sync="curPage"
                        :total="total"
                        @size-change="onPageChange"
                        @current-change="onPageChange"
                        small>
                    </el-pagination>
                </div>
            </div>
        </div>
        <span>已选:</span>
        <div>
            <brand-cart :value="value" @input="onCartChange"></brand-cart>
        </div>
    </div>
</template>

<script>
import BrandCart from './BrandCart';
import CheckboxList from './CheckboxList';

import { getShopOptions } from '@/apis/filter.js';
import AjaxClient from '@/utils/ajaxClient.js';

const pageSize = 12;

export default {
    components: {
        BrandCart,
        CheckboxList
    },
    props: ['value', 'max'],
    data () {
        return {
            shopOptions: [],
            pickedValueList: [],
            searchString: '',
            curPage: 1,
            total: 0,
            pageSize,
            token: null
        };
    },
    created () {
        this.onConditionChange();
    },
    watch: {
        value: {
            immediate: true,
            handler (val) {
                this.pickedValueList = val.map(shop => shop.value);
            }
        },
        pickedValueList (newVal, oldVal) {
            const addList = newVal.filter(shopValue => !~oldVal.indexOf(shopValue));
            const removeList = oldVal.filter(shopValue => !~newVal.indexOf(shopValue));
            if(addList.length === 0 && removeList.length === 0) {
                return;
            }
            const pickedShopList = this.value.slice();
            removeList.forEach(value => {
                const idx = pickedShopList.findIndex(shop => shop.value === value);
                if(~idx) {
                    pickedShopList.splice(idx, 1);
                }
            });
            addList.forEach(value => {
                const targetShop = this.shopOptions.find(shop => shop.value === value);
                if(targetShop) {
                    pickedShopList.push(targetShop);
                }
            });
            this.onCartChange(pickedShopList);
        }
    },
    methods: {
        queryOptions () {
            const token = this.token = AjaxClient.createCancleToken();
            const params = {
                shopName: this.searchString,
                pageSize: this.pageSize,
                pageNo: this.curPage
            };
            getShopOptions({
                params,
                cancelToken: token
            }).then(data => {
                this.token = null;
                const { resultList, total } = data.message.PageResult;
                this.shopOptions = resultList.map(({ id, brandName }) => {
                    return {
                        value: id,
                        label: brandName
                    };
                });
                this.total = Number(total);
            }).catch(err => {
                this.token = null;
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取店铺列表失败:' + err.message
                    });
                }
            });
        },
        onConditionChange () {
            this.searchString = '';
            this.pickedValueList = [];
            this.onCartChange([]);
            if (this.curPage !== 1) {
                this.curPage = 1;
            } else {
                this.shopOptions = [];
                this.queryOptions();
            }
        },
        onSearchStringChange () {
            if (this.curPage !== 1) {
                this.curPage = 1;
            } else {
                this.shopOptions = [];
                this.queryOptions();
            }
        },
        onPageChange () {
            this.shopOptions = [];
            this.queryOptions();
        },
        onCartChange (value) {
            this.$emit('input', value);
        }
    }
};
</script>

<style lang="scss" scoped>
.picker-panel {
    line-height: 1.5;
    .picker-list {
        height: 80px;
        overflow-y: auto;
    }
    .picker-header, .picker-footer {
        border: 1px solid #dde5eb;
    }
    .picker-header {
        border-bottom: 0;
        padding: 3px 7px;
        .filter-input {
            width: 150px;
        }
    }
    .picker-footer {
        border-top: 0;
        .picker-pagination {
            float: right;    
        }
        &::after {
            content: '';
            display: block;
            height: 0;
            visibility: hidden;
            clear: both;
        }
    }
}
</style>
