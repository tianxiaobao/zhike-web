<template>
    <div>
        <el-form label-width="70px" :model="data">
            <el-form-item
                prop="itemName"
                :rules="nameRules" class="error-as-info">
                <div slot="label">
                    <score-tip>
                        输入的商品名将作为关键字进行模糊匹配, 多个商品名使用逗号隔开.
                    </score-tip>
                    <span>商品名:</span>
                </div>
                <el-input v-model="data.itemName"></el-input>
            </el-form-item>
            <el-form-item
                prop="sku"
                :rules="skuRules">
                <div slot="label">
                    <score-tip>
                        多个sku使用逗号隔开.
                    </score-tip>
                    <span>SKU:</span>
                </div>
                <el-input v-model="data.sku"></el-input>
            </el-form-item>
            <el-form-item label="主品类:">
                <el-cascader
                    :options="mainCategoryOptions"
                    v-model="data.mainCategory"
                    @active-item-change="onParentCategorySelect">
                </el-cascader>
            </el-form-item>
            <el-form-item label="次品类:">
                <el-radio-group v-model="data.isSelectSubCategory" :disabled="!isL2Category">
                    <el-radio :label="false">全部</el-radio>
                    <el-radio :label="true">部分</el-radio>
                </el-radio-group>
                <checkbox-list
                    class="sub-category-list"
                    v-show="data.isSelectSubCategory"
                    v-model="data.subCategory"
                    :options="subCategoryOptions"
                    :disabled="subCategoryDisabled">
                </checkbox-list>
            </el-form-item>
            <el-form-item label="店铺:">
                <el-radio-group v-model="data.isSelectShop">
                    <el-radio :label="false">全部</el-radio>
                    <el-radio :label="true">部分</el-radio>
                </el-radio-group>
                <shop-picker
                    v-if="data.isSelectShop"
                    v-model="data.shopList"
                    :max="50">
                </shop-picker>
            </el-form-item>
            <el-form-item label="品牌:">
                <el-radio-group v-model="data.isSelectBrand">
                    <el-radio :label="false">全部</el-radio>
                    <el-radio :label="true">部分</el-radio>
                </el-radio-group>
                <brand-picker
                    v-if="data.isSelectBrand"
                    v-model="data.brandList"
                    :category="category"
                    :max="50">
                </brand-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import BrandPicker from './components/BrandPicker';
import ShopPicker from './components/ShopPicker';
import CheckboxList from './components/CheckboxList';
import ScoreTip from "@/components/common/ScoreTip";
import AjaxClient from '@/utils/ajaxClient.js';
import { debounce } from '@/utils';
import { getCategoryOptions, skuValidate } from '@/apis/filter.js';
const typeMap = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3
};
const validateItemNumber = (rule, value, callback) => {
    if (!value) {
        callback();
        return;
    }
    const wordList = value.replace(/，/g, ',').split(',');
    callback(new Error(`已输入${wordList.length}个`));
};
export default {
    props: ['data'],
    /* {
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
    }*/
    components: {
        BrandPicker,
        ShopPicker,
        CheckboxList,
        ScoreTip
    },
    data () {
        return {
            token: null,
            nameRules: [{
                validator: validateItemNumber,
                trigger: 'blur,change'
            }],
            skuRules: [{
                validator: (...args) => {
                    this.token && this.token.cancel();
                    this.data.skuValidated = false;
                    this.validateSku(...args);
                },
                trigger: 'blur,change'
            }],
            mainCategoryOptions: [{
                value: 'all',
                label: '全部'
            }, {
                value: 'loading',
                label: '加载中...',
                disabled: true
            }],
            subCategoryOptions: []
        };
    },
    created () {
        const skuValidator = (rule, value, callback) => {
            if(!value) {
                this.data.skuValidated = true;
                callback();
                return;
            }
            const skuList = value.replace(/，/g, ',').split(',');
            // const limit = 5;
            // if(skuList.length > limit) {
            //     callback(new Error(`SKU不超过${limit}个`));
            //     return;
            // }
            if(skuList.some(sku => {
                return !(/^\d{1,15}$/.test(sku));
            })) {
                callback(new Error(`SKU是1~15位的数字`));
                return;
            }
            const token = this.token = AjaxClient.createCancleToken();
            skuValidate({
                params: {
                    skucode: value
                },
                cancelToken: token
            }).then(data => {
                this.token = null;
                if(data.message.Boolean) {
                    this.data.skuValidated = true;
                    callback();
                } else {
                    callback(new Error('存在无效SKU'));
                }
            }).catch(err => {
                this.token = null;
                if(AjaxClient.isCancel(err)) {
                    callback();
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: `验证SKU失败: ${err.message}`
                    });
                }
                callback(new Error('SKU验证失败'));
            });
        };
        this.validateSku = debounce(skuValidator, 300);
        this.queryData().then(list => {
            this.mainCategoryOptions.splice(1, 1, ...list);
        }).catch(() => {
            this.mainCategoryOptions[1].label = '加载失败';
        });
    },
    computed: {
        isL2Category () {
            return this.data.mainCategory.length === 2 && this.data.mainCategory[1] !== 'all';
        },
        subCategoryDisabled () {
            return !this.isL2Category || !this.data.isSelectSubCategory;
        },
        category () {
            const category = this.data.mainCategory.slice();
            if(category.length && category[category.length - 1] == 'all') {
                category.pop();
            }
            if(this.data.isSelectSubCategory) {
                category.push(this.data.subCategory.slice());
            }
            return category;
        }
    },
    watch: {
        "data.mainCategory": {
            immediate: true,
            handler (val) {
                this.data.isSelectSubCategory = false;
                this.subCategoryOptions = [];
                this.data.subCategory = [];
                if(val.length === 2 && val[1] !== 'all') {
                    this.onL2CategorySelect(val);
                }
            }
        }
    },
    methods: {
        queryData (category = []) {
            return new Promise((resolve, reject) => {
                if(category.length && category[category.length - 1] == 'all') {
                    category.pop();
                }
                const type = typeMap[category.length];
                const params = {
                    type,
                    isAll: 0
                };
                switch(category.length) {
                case 3:
                    params.thirdCateId = category[2];
                        /* continue next case */
                case 2:
                    params.secondCateId = category[1];
                        /* continue next case */
                case 1:
                    params.firstCateId = category[0];
                    break;
                case 0:
                    break;
                default:
                    reject({
                        message: '参数异常'
                    });
                    return;
                }
                getCategoryOptions({
                    params
                }).then(data => {
                    const list = data.message.list.map(({ id, cateName, brandName }) => {
                        const ret = {
                            value: id,
                            label: category.length === 3 ? brandName : cateName
                        };
                        if(category.length < 1) {
                            ret.children = [{
                                value: 'all',
                                label: '全部'
                            }, {
                                value: 'loading',
                                label: '加载中...',
                                disabled: true
                            }];
                        }
                        return ret;
                    });
                    resolve(list);
                }).catch(err => {
                    if(err.message) {
                        this.$message({
                            type: 'error',
                            message: '获取选项失败: ' + err.message
                        });
                    }
                    reject(err);
                });
            });
        },
        onParentCategorySelect (category) {
            category = category.slice();
            let p = this.mainCategoryOptions;
            category.forEach(key => {
                const target = p.find(item => item.value === key);
                p = target.children;
            });
            if(p.length < 1 || p[p.length - 1].value !== 'loading') {
                return;
            }
            this.queryData(category).then(list => {
                p.splice(p.length - 1, 1, ...list);
            }).catch(() => {
                p[p.length - 1].label = '加载失败';
            });
        },
        onL2CategorySelect (category) {
            category = category.slice();
            this.queryData(category).then(list => {
                this.subCategoryOptions = list;
            }).catch((err) => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: `获取次品类失败: ${err.message}`
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.sub-category-list {
    height: 80px;
    overflow-y: auto;
}
</style>
<style lang="scss">
.el-form-item.error-as-info {
    &.is-error {
        .el-input__inner {
            border-color: #e7e7e7;
            &:focus {
                border-color: #2aafff;
                box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
            }
        }
    }
    .el-form-item__error {
        color: #2aafff;
    }
}
</style>
