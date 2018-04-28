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
                :options="brandOptions"
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

import { getBrandOptions } from '@/apis/filter.js';
import AjaxClient from '@/utils/ajaxClient.js';

const pageSize = 12;

export default {
    components: {
        BrandCart,
        CheckboxList
    },
    props: ['value', 'category', 'max'],
    data () {
        return {
            brandOptions: [],
            pickedValueList: [],
            searchString: '',
            curPage: 1,
            total: 0,
            pageSize,
            token: null
        };
    },
    watch: {
        category: {
            immediate: true,
            handler () {
                this.onCategoryChange();
            }
        },
        value: {
            immediate: true,
            handler (val) {
                this.pickedValueList = val.map(brand => brand.value);
            }
        },
        pickedValueList (newVal, oldVal) {
            const addList = newVal.filter(brandValue => !~oldVal.indexOf(brandValue));
            const removeList = oldVal.filter(brandValue => !~newVal.indexOf(brandValue));
            if(addList.length === 0 && removeList.length === 0) {
                return;
            }
            const pickedBrandList = this.value.slice();
            removeList.forEach(value => {
                const idx = pickedBrandList.findIndex(brand => brand.value === value);
                if(~idx) {
                    pickedBrandList.splice(idx, 1);
                }
            });
            addList.forEach(value => {
                const targetBrand = this.brandOptions.find(brand => brand.value === value);
                if(targetBrand) {
                    pickedBrandList.push(targetBrand);
                }
            });
            this.onCartChange(pickedBrandList);
        }
    },
    methods: {
        queryBrandOptions () {
            const token = this.token = AjaxClient.createCancleToken();
            const category = this.category.slice();
            const params = {
                search: this.searchString,
                pageSize: this.pageSize,
                pageNo: this.curPage
            };
            ['firstCateId' , 'secondCateId', 'thirdCateId'].forEach((key, idx) => {
                if(category[idx] != null) {
                    params[key] = category[idx];
                }
            });
            getBrandOptions({
                params,
                cancelToken: token
            }).then(data => {
                this.token = null;
                const { resultList, total } = data.message.PageResult;
                this.brandOptions = resultList.map(({ id, brandName }) => {
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
                        message: '获取品牌列表失败:' + err.message
                    });
                }
            });
        },
        onCategoryChange () {
            this.searchString = '';
            this.pickedValueList = [];
            this.onCartChange([]);
            if (this.curPage !== 1) {
                this.curPage = 1;
            } else {
                this.brandOptions = [];
                this.queryBrandOptions();
            }
        },
        onSearchStringChange () {
            if (this.curPage !== 1) {
                this.curPage = 1;
            } else {
                this.brandOptions = [];
                this.queryBrandOptions();
            }
        },
        onPageChange () {
            this.brandOptions = [];
            this.queryBrandOptions();
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
