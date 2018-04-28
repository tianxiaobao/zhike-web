<template>
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose">
        <el-row>
            <el-col :span="24" class="chart-grid">
                <age v-bind="$attrs" v-if="visible"></age>
            </el-col>
            <!-- <el-col :span="12" class="chart-grid">
                <birth-month v-bind="$attrs" v-if="visible"></birth-month>
            </el-col> -->
        </el-row>
    </el-dialog>
</template>

<script>

import Age from './components/Age';
import BirthMonth from './components/BirthMonth';
import { mapActions } from 'vuex';
export default {
    props: ['visible'],
    components: {
        Age,
        BirthMonth
    },
    computed: {
        title () {
            return `孩子信息`;
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

