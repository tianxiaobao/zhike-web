<template>
    <div class="table-chart--default">
        <el-table
            :data="data.series"
            stripe
            style="width: 100%"
            v-on="this.$listeners">
            <el-table-column
                v-for="l in data.labels"
                :key="l.name"
                :prop="l.name"
                :label="l.text"
                :class-name="l.type === 'val'? 'val': ''"
                :show-overflow-tooltip="true"
                :min-width="l.minWidth"
                 >
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ['data']
};
</script>
<style>
.table-chart--default .val {
    color: #2aafff
}
.table-chart--default .el-table__row {
    font-size: 12px;
}
</style>
