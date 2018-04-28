<style scoped lang="scss" type="text/scss">
    @mixin normal-transition {
        transition: all .2s;
    }

    .default-img {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .icon {
            @include normal-transition;
            font-size: 50px;
            color: #666;
        }
        span.tip {
            margin-top: 24px;
            font-size: 14px;
            color: #333;
            text-align: center;
        }
    }
</style>

<template>
    <div class="default-img">
        <i class="icon" v-html="icon">&#xe629;</i>
        <span class="tip">
            <slot></slot>
        </span>
    </div>
</template>

<script>
    export default {
        name: '',
        props: ['icon'],
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            };
        }
    };
</script>