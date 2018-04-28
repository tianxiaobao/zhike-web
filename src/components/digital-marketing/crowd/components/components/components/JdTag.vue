<template>
    <div class="jd-tag-crowd">
        <div class="crowd">
            <crowd-submit class="submit-crowd" :number="crowdNumber"></crowd-submit>
        </div>
        <div class="seach-goods" :class="{ collapse: collapse }">
            <div class="search-panel">
                <goods-info class="search"></goods-info>
            </div>
            <div class="shrink-btn" @click="collapse = !collapse">
                <div class="icon">
                    <i :class="'el-icon-d-arrow-right'"></i>
                </div>
                <span>查询商品</span>
            </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="人群名称" prop="name">
                <el-input v-model="ruleForm.name" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="所需人数" prop="limit">
                <el-input v-model.number="ruleForm.limit" :min="1" :max="5e6" type="number"></el-input>
            </el-form-item>
            <el-form-item label="人群描述" prop="desc">
                <el-input v-model="ruleForm.description" :maxlenght="200"></el-input>
            </el-form-item>
            <el-form-item label="筛选条件" prop="creatable" class="crowd-condition">
                <crowd-select class="select-crowd" :data="crowdCondition"></crowd-select>
            </el-form-item>
            <div class = "t-center">
                <el-button type = "primary" @click="onPrev" :disabled="submitting">上一步</el-button>
                <el-button type = "primary" @click="submitForm" :loading="submitting">创建</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import GoodsInfo from './components/GoodsInfo';
import CrowdSubmit from './components/CrowdSubmit';
import CrowdFormDialog from './components/DialogCrowdForm';
import CrowdSelect from './components/crowd-select/Main';

import AjaxClient from '@/utils/ajaxClient.js';
import { stringToBase64, debounce } from '@/utils';
import { createPackage, getEstimateNumber } from '@/apis/filter.js';
import { mapGetters } from 'vuex';

export default {
    components: {
        GoodsInfo,
        CrowdSubmit,
        CrowdFormDialog,
        CrowdSelect
    },
    data () {
        const validateCrowdCondition = (rule, value, callback) => {
            if (value) {
                callback();
                return;
            }
            callback(new Error(this.msg));
        };
        return {
            collapse: true,
            crowdCondition: {
                behavior: {
                    startDate: null, // Date
                    endDate: null, // Date
                    detailList: []
                    /* {
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
                            pv: true,
                            order: true,
                            follow: true,
                            shopFollow: false,
                            cart: true,
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
                    }*/
                },
                profile: []
                /* {
                    key,
                    featureList: [{
                        key,
                        type: 'sex',
                        values: []
                    }]
                }*/
            },
            ruleForm: {
                name: '',
                limit: '',
                description: '',
                creatable: false
            },
            // 校验规则
            rules: {
                name: [
                    { required: true, message: '请输入人群名称', trigger: 'blur'},
                    { max: 40, message: '长度不超过40个字符', trigger: 'blur' }
                ],
                limit: [
                    { type: 'integer', required: true, message: '请输入一个正整数', trigger: 'blur' },
                    { type: 'integer', min: 1, max: 5e6, message: '所需人数必须为500万以内的正整数', trigger: 'blur' }
                ],
                description: [
                    { max: 200, message: '长度不超过200个字符', trigger: 'blur' }
                ],
                creatable: [
                    { validator: validateCrowdCondition, trigger: 'change' }
                ]
            },
            crowdNumber: '0',
            msg: '',
            token: null,
            submitting: false
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
        queryData () {
            const { behavior, profile } = this.crowdCondition;
            const _behavior = this.constructBehavior(behavior);
            const _profile = this.constructProfile(profile);
            return {
                behavior: _behavior,
                profile: _profile
            };
        }
    },
    watch: {
        queryData: {
            immediate: true,
            handler (data) {
                this.token && this.token.cancel();
                this.crowdNumber = '--';
                this.ruleForm.creatable = false;
                this.msg = '查询中...';
                if(!this._query) {
                    this._query = debounce(data => {
                        if(this.validate(data)) {
                            this.queryCrowdNumber(data);
                        }
                    }, 300);
                }
                this._query(data);
            }
        }
    },
    methods: {
        constructDetail ({ targetItem, operate }) {
            const { itemName, sku, skuValidated , mainCategory, subCategory, brandList, shopList, isSelectSubCategory, isSelectBrand, isSelectShop } = targetItem;
            const category = mainCategory.slice();
            if(category.length && category[category.length - 1] === 'all') {
                category.pop();
            }
            if(category.length === 2) {
                category.push(isSelectSubCategory ? subCategory.slice() : undefined);
            }
            const [ firstClassId, secondClassId, thirdClassId ] = category;

            const brandId = isSelectBrand ? brandList.map(brand => brand.value) : undefined;

            const shopIdIn = isSelectShop ? shopList.map(shop => shop.value) : undefined;

            const itemNameIn = itemName;

            const itemSkuIn = sku;

            const _operate = {};

            ['pv', 'order', 'follow', 'cart'].forEach(key => {
                if(operate[0][key]) {
                    _operate[key] = '';
                }
            });

            if(isSelectShop && shopIdIn.length && operate[0].shopFollow) {
                _operate.shopFollow = '';
            }

            const comment = operate[0].comment;
            if(comment && comment.state) {
                _operate.commentIn = comment.keywords;
                _operate.commentStarIn = comment.point.join(',');
            }

            const search = operate[0].search;
            if( search && search.state) {
                _operate.searchIn = search.keywords;
            }

            return {
                firstClassId,
                secondClassId,
                thirdClassId,
                brandId,
                shopIdIn,
                itemNameIn,
                itemSkuIn,
                skuValidated,
                operate: _operate,
                isSelectThirdClass: isSelectSubCategory,
                isSelectBrand,
                isSelectShop
            };
        },
        constructBehavior ({ startDate, endDate, detailList }) {
            const beginTime = this.dateToString(startDate);
            const endTime = this.dateToString(endDate);
            const _detailList = detailList.map(detail => this.constructDetail(detail));
            return {
                beginTime,
                endTime,
                detailList: _detailList
            };
        },
        constructProfile (profile) {
            return profile.map(item => {
                const ret = {};
                item.featureList.forEach(feature => {
                    if(ret[feature.type]) {
                        ret[feature.type].push(...feature.values);
                    } else {
                        ret[feature.type] = feature.values.slice();
                    }
                });
                Object.keys(ret).forEach(key => {
                    if(key === 'city') {
                        ret[key] = this.constrcutCity([...new Set(ret[key])]);
                    } else {
                        ret[key] = [...new Set(ret[key])];
                    }
                });
                return ret;
            });
        },
        constrcutCity (city) {
            const map = new Map();
            city.forEach(ids => {
                const [pid, cid] = ids.split('-');
                if(!pid) {
                    return;
                }
                let target = map.get(pid);
                if(!target) {
                    map.set(pid, target = []);
                }
                if(cid) {
                    target.push(cid);
                }
            });
            const ret = [];
            for(const [pid, cid] of map) {
                ret.push({
                    pid,
                    cid
                });
            }
            return ret;
        },
        dateToString (date) {
            if(!date) {
                return '';
            }
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            return Y + M + D;
        },
        validate (data) {
            return data.behavior.detailList.every(detail => detail.skuValidated);
        },
        queryCrowdNumber (data) {
            const token = this.token = AjaxClient.createCancleToken();
            const cond = process.env.NODE_ENV !== 'production' ? JSON.stringify(data) : stringToBase64(JSON.stringify(data));
            getEstimateNumber({
                params: {
                    cond
                },
                cancelToken: token
            }).then(data => {
                this.token = null;
                const {status, num, msg} = data.message.EstimateNum;
                this.ruleForm.creatable = status;
                this.crowdNumber = num;
                this.msg = msg;
                this.$refs.ruleForm && this.$refs.ruleForm.validateField('creatable');
            }).catch(err => {
                this.token = null;
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取已选人群数失败: ' + err.message
                    });
                }
                this.msg = '查询失败';
            });
        },
        submitForm () {
            this.$refs.ruleForm && this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(!this.currentMallShopIds) {
                        this.$message({
                            type: 'error',
                            message: '请选择有效的商场和店铺'
                        });
                        return;
                    }
                    this.submitting = true;
                    const cond = process.env.NODE_ENV !== 'production' ? JSON.stringify(this.queryData) : stringToBase64(JSON.stringify(this.queryData));
                    createPackage({
                        params: {
                            packageName: this.ruleForm.name,
                            pkDescription: this.ruleForm.description,
                            mallId: this.currentMall.id,
                            shopId: this.currentShop.id,
                            limit: this.ruleForm.limit,
                            cond
                        }
                    }).then(() => {
                        this.$nextTick(() => this.submitting = false);
                        // this.$message({
                        //     type: 'success',
                        //     message: '创建人群包成功!'
                        // });
                        this.$emit('next');
                    }).catch(err => {
                        this.$nextTick(() => this.submitting = false);
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
                        message: '请输入人群名称和所需人数，并选择合法的目标人群'
                    });
                }
            });
        },
        onPrev () {
            this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
            this.$emit('prev');
        }
    }
};
</script>
<style lang="scss" scoped>
.jd-tag-crowd {
    .seach-goods {
        position: fixed;
        right: 15px;
        top: 205px;
        z-index: 100;
        transform: translateZ(0);
        &.collapse {
            .search-panel {
                width: 0px;
                // border: 0px solid #dde5eb;
            }
            .shrink-btn .icon {
                transform: rotate(180deg);
            }
        } 
        .search-panel {
            .search {
                margin: 20px;
            }
            background-color: #fff;
            transition: all .2s ease-out;
            width: 700px;
            margin-left: 22px;
            border: 1px solid #dde5eb;
            border-right: 0;
            overflow: hidden;
        }
        .shrink-btn {
            user-select: none;
            font-size: 14px;
            position: absolute;
            width: 22px;
            top: 0;
            left: 0;
            border-radius: 5px 0 0 5px;
            // border: 1px solid #dde5eb;
            border-left: 0;
            color: #fff;
            background-color: #2aafff;
            text-align: center;
            padding: 10px 0;
            cursor: pointer;
            .icon {
                transition: all .2s ease-out;
            }
        }
    }
    .crowd {
        display: flex;
        .select-crowd {
            flex-grow: 1;
        }
        .submit-crowd {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100;
            transform: translateZ(0);
        }
    }
}
.t-center{
    width: 100%;
    text-align:center;
    & .el-button{
        min-width: 118px;
    }
}
@media (max-width: 1365px) {
    .jd-tag-crowd {
        .seach-goods {
            right: calc(100% - 1351px);
            top: 174px;
        }
        .crowd .submit-crowd {
            bottom: 20px;
            right: calc(100% - 1346px);
        }
    }
}
@media (max-width: 1350px) {
    .jd-tag-crowd {
        .seach-goods {
            right: 0;
            top: 174px;
        }
        .crowd .submit-crowd {
            bottom: 20px;
            right: 5px;
        }
    }
}
</style>
<style lang="scss">
.jd-tag-crowd .crowd-condition.el-form-item.is-error {
    .el-collapse {
        border-color: red;
        .el-collapse-item__header, .el-collapse-item__wrap {
            border-bottom-color: red;
        }
    }
    .el-input__inner, .el-textarea__inner {
        border-color: #e7e7e7;
        &:focus {
            border-color: #2aafff;
            box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);color:#333;
        }
    }
}
</style>
