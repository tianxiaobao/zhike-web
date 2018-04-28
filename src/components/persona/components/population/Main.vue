<template>
    <el-row>
        <el-col :span="12" class="chart-grid">
            <generation v-bind="$attrs"></generation>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <sex v-bind="$attrs"></sex>
        </el-col>
    </el-row>
</template>

<script>
import Generation from '../Generation';
import Sex from '../Sex';
import { mapActions } from 'vuex';

export default {
    components: {
        Generation,
        Sex
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
