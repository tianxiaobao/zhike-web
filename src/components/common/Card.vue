<template>
    <el-card class="card">
        <slot></slot>
        <div class="close-btn" v-show="closeable" @click="close"><i class="el-icon-close"></i></div>
    </el-card>
</template>

<script>
export default {
    props: ['closeable'],
    methods: {
        close () {
            if(this.closeable) {
                this.$emit('close');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    .close-btn {
        position: absolute;
        right: 8px;
        top: 5px;
        padding: 0 5px;
        color: #bfbfbf;
        border-radius: 13px;
        cursor: pointer;
        &:hover {
            background-color: #bfbfbf;
            color: #fff;
        }
    }
}
</style>
