<style scoped lang="scss" type="text/scss">
    @mixin normal-transition {
        transition: all .2s;
    }

    .customer-input-container {
        border: 1px solid #888;
        box-sizing: border-box;
        padding: 8px 10px;
        @include normal-transition;
        border-radius: 2px;
        display: flex;
        align-items: center;

        &.small{
            padding: 2px 10px;
        }

        &.focus {
            border-color: #666;
        }
        &.blur {
            border-color: #aaa;
        }

        input {
            background-color: transparent;
            border: none;
            outline: none;
            width: 100%;
            height: 100%;
            font-size: 13px;
            color: #555;
        }
    }
</style>

<template>
    <div class="customer-input-container"
         :class="{'focus': isFocus, 'blur': !isFocus, 'small': size === 'small'}"
    >
        <input type="text" v-model.trim="valueCopy" :placeholder="placeholder" @focus="inputFocus" @blur="inputBlur">
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
            value: {
                default: ''
            },
            placeholder: {
                default: ''
            }
        },
        data () {
            return {
                isFocus: false,
                valueCopy: ''
            };
        },
        created () {
            this.valueCopy = this.value;
        },
        watch: {
            valueCopy (newVal) {
                this.$emit('input', newVal);
            },
            value (newVal) {
                this.valueCopy = newVal;
            }
        },
        methods: {
            inputFocus () {
                this.isFocus = true;
            },
            inputBlur () {
                this.isFocus = false;
            }
        }
    };
</script>