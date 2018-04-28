<template>
    <div class="jd-tag-crowd">
        <div class="crowd">
            <crowd-select class="select-crowd" :data="crowdCondition"></crowd-select>
            <crowd-submit class="submit-crowd" :crowd-data="queryData" @create="onCreate"></crowd-submit>
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
        <crowd-form-dialog :visible="visible" :crowd-data="queryData" @close="onClose" @submitted="onSubmitted"></crowd-form-dialog>
    </div>
</template>

<script>
import GoodsInfo from './components/GoodsInfo';
import CrowdSubmit from './components/CrowdSubmit';
import CrowdFormDialog from './components/DialogCrowdForm';
import CrowdSelect from './components/crowd-select/Main';

import { PERSONA_CROWD_PACKAGE } from '@/pages/index/router/route_types';

export default {
    components: {
        GoodsInfo,
        CrowdSubmit,
        CrowdFormDialog,
        CrowdSelect
    },
    data () {
        return {
            collapse: true,
            visible: false,
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
            }

        };
    },
    computed: {
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
        onClose () {
            this.visible = false;
        },
        onCreate () {
            this.visible = true;
        },
        onSubmitted () {
            this.$router.push({ name: PERSONA_CROWD_PACKAGE });
        }
    }
};
</script>
<style lang="scss" scoped>
.jd-tag-crowd {
    .seach-goods {
        position: fixed;
        right: 15px;
        top: 174px;
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
