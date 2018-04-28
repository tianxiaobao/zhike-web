<template>
    <div>
        <el-row>
            <el-col :span="12" class="chart-grid">
                <category v-bind="$attrs"></category>
            </el-col>
            <el-col :span="12" class="chart-grid">
                <brand v-bind="$attrs"></brand>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12" class="chart-grid">
                <purchasing v-bind="$attrs"></purchasing>
            </el-col>
            <el-col :span="12" class="chart-grid">
                <sensitivity v-bind="$attrs"></sensitivity>
            </el-col>
            <el-col :span="12" class="chart-grid">
                <level v-bind="$attrs"></level>
            </el-col>
            <el-col :span="12" class="chart-grid">
                <items-purchasing v-bind="$attrs"></items-purchasing>
            </el-col>
            <el-col :span="12" class="chart-grid">
                <worth v-bind="$attrs"></worth>
            </el-col>
            <el-col :span="12" class="chart-grid">
                <life-cycle v-bind="$attrs"></life-cycle>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Category from '../Category';
import Brand from '../Brand';
import Purchasing from '../Purchasing';
import Sensitivity from '../Sensitivity';
import Level from '../Level';
import ItemsPurchasing from '../ItemsPurchasing';
import Worth from '../Worth';
import LifeCycle from '../LifeCycle';
import { mapActions } from 'vuex';
export default {
    components: {
        Category,
        Brand,
        Purchasing,
        Sensitivity,
        Level,
        ItemsPurchasing,
        Worth,
        LifeCycle
    },
    created () {
        this.initError();
    },
    methods: {
        ...mapActions(['initError'])
    }
};
</script>
<style lang="scss" scoped>
.chart-grid {
    padding: 20px 15px 0 15px;
}
</style>
