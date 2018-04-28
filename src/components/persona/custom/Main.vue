<template>
    <div class="persona">
        <title-bar class="bar">
            <div class="bar-options">
                <el-button type="default" @click="onBack">返回</el-button>
            </div>
        </title-bar>
        <div class="content">
            <el-tabs v-model="activeTab" type="card" class="result-container">
                <el-tab-pane label="人口属性" name="population">
                    <population v-if="activeTab === 'population'" :type="type" :query-conditions="queryConditions"></population>
                </el-tab-pane>
                <el-tab-pane label="社会属性" name="social">
                    <social v-if="activeTab === 'social'" :type="type" :query-conditions="queryConditions"></social>
                </el-tab-pane>
                <el-tab-pane label="消费偏好" name="consume">
                    <consume v-if="activeTab === 'consume'" :type="type" :query-conditions="queryConditions"></consume>
                </el-tab-pane>
                <!-- <el-tab-pane label="地域分布" name="region">
                    <region v-if="activeTab === 'region'" :type="type" :query-conditions="queryConditions"></region>
                </el-tab-pane> -->
                <el-tab-pane label="购买行为" name="buyBehavior">
                    <buy-behavior v-if="activeTab === 'buyBehavior'" :type="type" :query-conditions="queryConditions"></buy-behavior>
                </el-tab-pane>
                <el-tab-pane label="购物习惯" name="shopHabit">
                    <shop-habit v-if="activeTab === 'shopHabit'" :type="type" :query-conditions="queryConditions"></shop-habit>
                </el-tab-pane>
                <el-tab-pane label="多级筛选" name="filter">
                    <multi-attr-filter v-if="activeTab === 'filter'" :type="type" :query-conditions="queryConditions"></multi-attr-filter>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
import Population from '../components/population/Main';
import Social from '../components/social/Main';
import Consume from '../components/consume/Main';
// import Region from '../components/region/Main';
import BuyBehavior from '../components/buy-behavior/Main';
import ShopHabit from '../components/shop-habit/Main';
import MultiAttrFilter from '../components/multi-attr-filter/Main';

import personaTypes from '../config';

export default {
    components: {
        TitleBar,
        Population,
        Social,
        Consume,
        // Region,
        BuyBehavior,
        ShopHabit,
        MultiAttrFilter
    },
    props: ['taskId'],
    data () {
        return {
            activeTab: 'population',
            type: personaTypes.CUSTOM
        };
    },
    computed: {
        queryConditions () {
            return {
                id: this.taskId || 0
            };
        }
    },
    methods: {
        onBack () {
            global.history.back();
        }
    }
};
</script>
<style lang="scss" scoped>
.persona {
    .bar .bar-options {
        float: right;
        .el-button.el-button--default {
            transform: translateY(-2px);
        }
    }
    .content, .result-container {
        padding: 10px;
    }
}
</style>
