<template>
    <div class="consumer-feature">
        <div class="feature-type">
            <el-select v-model="data.type" placeholder="请选择画像类型">
                <el-option
                    v-for="feature in featureOptions"
                    :key="feature.value"
                    :label="feature.label"
                    :value="feature.value"
                    :disabled="!!~disableList.indexOf(feature.value)">
                </el-option>
            </el-select>
        </div>
        <div class="feature-value" v-loading="loading">
            <el-tree ref="cityTree" class="area-tree" v-if="data.type==='city'" node-key="value" :data="itemList" :props="treeProps" @check-change="onCheckedCityChange" accordion show-checkbox>
            </el-tree>
            <el-checkbox-group v-else v-model="data.values">
                <el-checkbox-button v-for="item in itemList" :label="item.value" :key="item.value" class="value-item">{{ item.label }}</el-checkbox-button>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
import { getProfileEnum } from '@/apis/filter.js';

const featureOptions = [{
    value: 'sex',
    label: '性别'
}, {
    value: 'age',
    label: '年龄'
}, {
    value: 'city',
    label: '地域'
}, {
    value: 'marriage',
    label: '婚姻状态'
}, {
    value: 'hasChild',
    label: '是否有孩子'
}, {
    value: 'profession',
    label: '职业分布'
}, {
    value: 'userLevel',
    label: '客户在京东的户等级'
}, {
    value: 'promotion',
    label: '促销敏感度'
}, {
    value: 'customerValue',
    label: '客户价值'
}, {
    value: 'purchPower',
    label: '整体购买力分析'
}, {
    value: 'm3BuyTime',
    label: '90天购买次数分布'
}, {
    value: 'm3BuyAmount',
    label: '90天购买金额分布'
}, {
    value: 'lastBuy',
    label: '最近一次购买距今天数分布'
}];

const hashMapAdapter = function (obj) {
    const hashmap = obj.HashMap;
    return Object.entries(hashmap).map(item => {
        return {
            value: item[0],
            label: item[1]
        };
    });
};

const hashMapResortAdapter = function (obj) {
    const data = hashMapAdapter(obj);
    data.sort((a, b) => {
        const va = parseInt(a.value);
        const vb = parseInt(b.value);
        if(Number.isNaN(va) || Number.isNaN(vb)) {
            return a.value < b.value ? -1 : 1;
        }
        return va - vb;
    });
    return data;
};

const cityAdapter = function (obj) {
    const provinceList = obj.list;
    return provinceList.map(province => {
        const ret = {
            value: `${province.pid}`,
            label: province.provinceName
        };
        if(province.city && province.city.length) {
            ret.children = province.city.map(city => {
                return {
                    value: `${province.pid}-${city.cid}`,
                    label: city.cityName
                };
            });
        }
        return ret;
    });
};

const adapter = {
    'age': hashMapResortAdapter,
    'sex': hashMapAdapter,
    'city': cityAdapter,
    'marriage': hashMapAdapter,
    'hasChild': hashMapAdapter,
    'profession': hashMapAdapter,
    'userLevel': hashMapAdapter,
    'promotion': hashMapResortAdapter,
    'customerValue': hashMapResortAdapter,
    'purchPower': hashMapResortAdapter,
    'm3BuyTime': hashMapResortAdapter,
    'm3BuyAmount': hashMapResortAdapter,
    'lastBuy': hashMapResortAdapter
};

export default {
    props: ['data', 'disableList', 'cache'],
    data () {
        return {
            loading: false,
            featureOptions,
            itemList: [],
            treeProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    watch: {
        "data.type": {
            immediate: true,
            handler (val) {
                this.itemList = [];
                this.data.values = [];
                if(val) {
                    this.getOptions(val);
                }
            }
        }
    },
    methods: {
        getOptions (type) {
            if(this.cache[type]) {
                this.itemList = this.cache[type];
                return;
            }
            this.loading = true;
            getProfileEnum({
                params: {
                    profileType: type
                }
            }).then(data => {
                this.cache[type] = adapter[type](data.message);
                if(this.data.type === type) {
                    this.itemList = this.cache[type];
                }
                this.$nextTick(() => this.loading = false);
            }).catch(err => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取选项失败: ' + err.message
                    });
                }
                this.$nextTick(() => this.loading = false);
            });
        },
        onCheckedCityChange () {
            this.data.values = this.$refs.cityTree.getCheckedKeys();
        }
    }
};
</script>

<style lang="scss" scoped>
.consumer-feature {
    display: flex;
    .feature-type {
        padding-top: 1px;
        flex-shrink: 0;
    }
    .feature-value {
        padding-left: 50px;
        flex-grow: 1;
    }
}
</style>

<style lang="scss">
.consumer-feature .value-item {
    .el-checkbox-button__inner {
        margin-bottom: 2px;
        min-width: 56px;
        border-left: 1px solid #e7e7e7;
    }
    &.el-checkbox-button.is-checked .el-checkbox-button__inner {
        box-shadow: none!important;
    }
}
.area-tree .el-tree-node__children {
    white-space: normal;
    .el-tree-node {
        display: inline-block;
        .el-tree-node__content {
            cursor: inherit;
            &:hover {
                background-color: transparent;
            }
            .el-tree-node__label {
                display: inline-block;
                min-width: 55px;
            }
        }
    }
}
</style>
