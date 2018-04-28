<template>
    <div class="brand-cart">
        <el-tag
            class="brand-selected"
            type="primary"
            v-for="item in value"
            :key="item.value"
            :closable="true"
            :close-transition="false"
            @close="handleClose(item)">
            {{ item.label }}
        </el-tag>
    </div>
</template>

<script>
export default {
    props: ['value'],
    methods: {
        handleClose (item) {
            const input = this.value.filter(brand => brand.value !== item.value);
            this.$emit('input', input);
        }
    }
};
</script>

<style lang="scss" scoped>
.brand-cart {
    border: 1px solid #dde5eb;
    line-height: 1.5;
    padding: 3px 5px;
    min-height: 56px;
    max-height: 139px;
    overflow-y: auto;
    .brand-selected {
        margin: 2px 5px;
    }
}
</style>
