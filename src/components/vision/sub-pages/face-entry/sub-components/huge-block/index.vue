<style scoped lang="scss" type="text/scss">
    @mixin normal-transition {
        transition: all .2s;
    }

    .photo-placeholder {
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        padding: 16px;
        align-items: center;
        border-radius: 2px;
        border: 1px solid #aaa;
        @include normal-transition;
        position: relative;

        &.has-hover-style{
            border-style: dashed;
        }

        &.has-hover-style:hover {
            cursor: pointer;
            /*border-color: #4a66fc;*/
            background-color: rgba(200, 200, 200, .3);
        }
    }
</style>

<template>
    <div class="photo-placeholder"
         :class="{'has-hover-style': !noHoverStyle}"
         @click="click"
    >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            noHoverStyle: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {};
        },
        methods: {
            click () {
                this.$emit('click');
            }
        }
    };
</script>