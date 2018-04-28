<template>
    <el-row>
        <el-col :span="24" class="chart-grid">
            <residence v-bind="$attrs"></residence>
        </el-col>
    </el-row>
</template>

<script>
import Residence from '../Residence';
import { mapActions } from 'vuex';

export default {
    components: {
        Residence
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
