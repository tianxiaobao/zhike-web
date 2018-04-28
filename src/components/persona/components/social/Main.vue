<template>
    <el-row>
        <el-col :span="24" class="chart-grid">
            <work v-bind="$attrs"></work>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <marriage v-bind="$attrs"></marriage>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <children v-bind="$attrs"></children>
        </el-col>
    </el-row>
</template>

<script>
import Work from '../Work';
import Marriage from '../Marriage';
import Children from '../Children';
import { mapActions } from 'vuex';

export default {
    components: {
        Work,
        Marriage,
        Children
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