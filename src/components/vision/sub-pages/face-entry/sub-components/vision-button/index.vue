<style scoped lang="scss" type="text/scss">
    $pure-color: #333;
    $pure-hover-color: #555;
    $submit-color: #3165e0;
    $submit-hover-color: #4175e0;
    $danger-color: #c00;
    $danger-hover-color: #a00;
    $padding: 2px 16px;

    @mixin normal-transition {
        transition: all .2s;
    }

    @mixin soft-transition {
        transition: all .35s;
    }

    .customer-button {
        padding: $padding;
        border: 1px solid $pure-color;
        /*box-shadow: 0 0 1px #2185d0;*/
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        height: 36px;
        @include normal-transition;
        box-sizing: border-box;

        &.small{
            height: 32px;
            padding: 4px 15px;
            font-size: 13px;
        }

        .icon{
            margin-right: 8px;
        }

        span {
            font-size: 13px;
        }

        &:hover {
            cursor: pointer;
        }

        &.disabled{
            opacity: .4 !important;
            &:hover{
                cursor: not-allowed !important;
                background-color: transparent !important;
                color: #666 !important;
            }
        }

        &.active,
        &:hover {
            color: #ddd !important;
        }

        &.pure-style {
            border-color: $pure-color;
            color: #666;

            &:hover {
                border-color: $pure-hover-color;
                background-color: $pure-hover-color;
            }

            &.active {
                background-color: $pure-color;
            }
        }

        &.submit-style {
            border-color: $submit-color;
            color: $submit-color;

            &:hover {
                border-color: $submit-hover-color;
                background-color: $submit-hover-color;
            }
            &.active {
                background-color: $submit-color;
            }
        }

        &.danger-style {
            border-color: $danger-color;
            color: $danger-color;

            &:hover {
                border-color: $danger-hover-color;
                background-color: $danger-hover-color;
            }
            &.active {
                background-color: $danger-color;
            }
        }

    }
</style>

<template>
    <div class="customer-button"
         :class="{
            'small': size === 'small',
            'disabled': disabled,
            'active': active,
            'pure-style': type === 'pure',
            'submit-style': type === 'submit',
            'danger-style': type === 'danger'
         }"
         @click="click"
    >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            size: {
                type: String,
                default: 'normal'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'pure'
            },
            active: {
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