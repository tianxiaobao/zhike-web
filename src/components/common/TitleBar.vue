<template>
    <div class="title-bar">
        <h1>{{ title }}</h1>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['title']
};
</script>
<style lang="scss" scoped>
.title-bar {
    line-height: 40px;
    padding: 0 20px;
    background-color: #f8f8f8;
    overflow: hidden;
    h1 {
    	font-size: 14px;
    	font-weight: bold;
    }
}
</style>
<style lang="scss">
.title-bar {
    .el-form-item {
        margin-bottom: 0;
    }
    .el-form-item__content {
        line-height: 40px;
        .el-form-item__label, .el-input__inner {
            vertical-align: initial;
        }
    }
}
</style>
