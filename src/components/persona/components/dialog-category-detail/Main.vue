<template>
    <el-dialog :title="title" size="large" :visible.sync="visible" :before-close="handleClose">
        <el-row>
            <el-col :span="12" class="chart-grid">
                <sub-category v-bind="$attrs" v-if="visible"></sub-category>
            </el-col>
            <!-- <el-col :span="8" class="chart-grid">
                <sub-brand v-bind="$attrs" v-if="visible"></sub-brand>
            </el-col> -->
            <el-col :span="12" class="chart-grid">
                <user-category v-bind="$attrs" v-if="visible"></user-category>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>

import SubCategory from './components/SubCategory';
import UserCategory from './components/UserCategory';
import SubBrand from './components/SubBrand';
import { mapActions } from 'vuex';
export default {
    props: ['visible', 'name'],
    components: {
        SubCategory,
        UserCategory,
        SubBrand
    },
    computed: {
        title () {
            return `${this.name}客户消费偏好`;
        }
    },
    created () {
        this.initError();
    },
    methods: {
        ...mapActions(['initError']),
        handleClose () {
            this.$emit('close');
        }
    }
};
</script>
<style lang="scss" scoped>
.chart-grid {
    padding: 0px 10px;
}
</style>
