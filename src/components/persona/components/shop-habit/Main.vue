<template>
    <el-row>
        <el-col :span="12" class="chart-grid">
            <device-rank v-bind="$attrs"></device-rank>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <device-os v-bind="$attrs"></device-os>
        </el-col>
    </el-row>
</template>

<script>
import DeviceRank from '../DeviceRank';
import DeviceOS from '../DeviceOS';
import { mapActions } from 'vuex';

export default {
    components: {
        DeviceRank,
        'device-os': DeviceOS
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