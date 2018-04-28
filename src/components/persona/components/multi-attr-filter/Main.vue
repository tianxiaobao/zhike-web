<template>
    <el-row>
        <el-col :span="24" class="chart-grid">
            <multi-attr-filter v-bind="$attrs"></multi-attr-filter>
        </el-col>
    </el-row>
</template>

<script>
import MultiAttrFilter from '../MultiAttrFilter';
import { mapActions } from 'vuex';
export default {
    components: {
        MultiAttrFilter
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
