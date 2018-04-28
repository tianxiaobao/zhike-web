<style scoped lang="scss" type="text/scss">
    .bar-container{
        height: 40px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 16px;
        border: 1px solid #ccc;
        background-color: #eee;
        display: flex;
        align-items: center;
        color: #666;
        border-radius: 2px;

        > .icon{
            width: 20px;
            margin-right: 4px;
        }

        span{
            flex: 1;
            font-size: 12px;
        }
    }
</style>

<template>
    <div class="bar-container">
        <i class="icon">&#xe698;</i>
        <span class="zhike-global-ellipsis">
            <slot></slot>
        </span>
    </div>
</template>

<script>
    export default {
        name: '',
        data () {
            return {
            };
        }
    };
</script>