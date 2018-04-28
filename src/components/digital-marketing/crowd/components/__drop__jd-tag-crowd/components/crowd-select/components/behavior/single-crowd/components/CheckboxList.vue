<template>
    <div class="checkbox-list">
        <p class="empty-text" v-show="!options.length">暂无数据</p>
        <el-checkbox-group :value="value" v-on="$listeners">
            <el-checkbox
                v-for="(item, idx) in options"
                :key="idx"
                :label="item.value"
                :disabled="disabled && (!disableCheckedOnly || !~value.indexOf(item.value))">
                <span :title="item.label">{{ item.label }}</span>
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    props: ['value', 'options', 'disabled', 'disableCheckedOnly']
};
</script>

<style lang="scss" scoped>
.checkbox-list {
    border: 1px solid #dde5eb;
    line-height: 1.5;
    padding: 5px 0;
    position: relative;
    .empty-text {
        position: absolute;
        height: 22px;
        margin: auto;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        color: #aaa;
    }
}
</style>
<style lang="scss">
.checkbox-list {
    .el-checkbox {
        margin: 0 8px;
        margin-left: 8px;
        .el-checkbox__label {
            display: inline-block;
            width: 98px;
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>