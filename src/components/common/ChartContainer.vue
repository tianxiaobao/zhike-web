<template>
    <div class="chart-container">
        <div class="chart-container__header">
            <slot name="header"></slot>
        </div>
        <div class="chart-container__body">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.chart-container {
    border: 1px solid rgb(236, 236, 236);
    .chart-container__header {
        border-bottom: 1px solid rgb(236, 236, 236);
        background-color: #f8f8f8;
        line-height: 40px;
        padding: 0 20px;
    }
    .chart-container__body {
        padding: 16px 24px;
    }
}
</style>
<style lang="scss">
.chart-container .chart-container__header {
    .el-form-item {
        margin-bottom: 0;
    }
    .el-form-item__content {
        line-height: 40px;
    }
    .el-form-item__label, .el-input__inner {
        vertical-align: initial;
    }
}
</style>