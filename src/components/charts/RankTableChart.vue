<template>
    <div class="table-chart--rank">
        <el-table @row-click="handleClick"
            :data="data.series"
            stripe
            style="width: 100%">
            <el-table-column
                prop="name"
                :label="data.name" min-width="200">
            </el-table-column>
            <el-table-column
                prop="rank"
                label="排名"
                class-name="rank" min-width="100">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ['data'],
    methods: {
        handleClick (row) {
            this.$emit('click', row);
        }
    }
};
</script>
<style lang="scss">
.table-chart--rank {
    .rank {
        color: #2aafff
    }
}
</style>
