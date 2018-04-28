<style scoped lang="scss" type="text/scss">
    .input-form-container {
        .input-title {
            box-sizing: border-box;
            padding: 8px 0;
            position: relative;

            span {
                color: #666;
                font-size: 13px;
                position: relative;
            }

            &.is-required span:after {
                position: absolute;
                content: '*';
                right: -10px;
                top: -5px;
                font-size: 20px;
                color: hotpink;
            }
        }

        .form-input{
            height: 40px;
        }
    }
</style>

<template>
    <div class="input-form-container">
        <div class="input-title"
             :class="{'is-required': isRequired}"
        >
            <span>{{ inputTitle }}</span>
        </div>
        <vision-input v-if="!onlyFormHeader" class="form-input" v-model="valueCopy" :placeholder="placeholder"></vision-input>
        <slot></slot>
    </div>
</template>

<script>
    import VisionInput from '../vision-input';

    export default {
        name: '',
        components: {
            VisionInput
        },
        props: {
            onlyFormHeader: {
                type: Boolean,
                default: false
            },
            isRequired: {
                type: Boolean,
                default: false
            },
            inputTitle: {
                default: ''
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
            value (val) {
                this.valueCopy = val;
            }
        },
        methods: {}
    };
</script>