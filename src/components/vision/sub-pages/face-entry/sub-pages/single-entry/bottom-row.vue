<style scoped lang="scss" type="text/scss">
    .bottom-panel-container {
        display: flex;
        justify-content: center;

        .submit-button {
            width: 128px;
            span {
                font-size: 14px;
            }
        }
    }
</style>

<template>
    <div class="bottom-panel-container">
        <vision-button-group>
            <vision-button type="submit" class="submit-button" @click="nextStep"
                           :disabled="submitDisabled"
            >
                <i class="icon" v-html="step < 2 ? '&#xe605;' : isUploadComplete? '&#xe65b;' : '&#xe611;'"></i>
                <span>
                    {{ step < 2 ? '下一步' : isUploadComplete ? '已完成' : '提交' }}
                </span>
            </vision-button>
            <vision-button class="submit-button" @click="prev"
                           v-if="step > 0"
            >
                <i class="icon">&#xe611;</i>
                <span>
                    {{ isUploadComplete ? '再次提交' : '上一步' }}
                </span>
            </vision-button>
        </vision-button-group>

    </div>
</template>

<script>
    import VisionButtonGroup from '../../sub-components/vision-button-group';
    import VisionButton from '../../sub-components/vision-button/index';

    export default {
        name: '',
        components: {
            VisionButtonGroup,
            VisionButton
        },
        props: {
            step: {
                type: Number,
                default: 0
            },
            isUploadComplete: {
                type: Boolean,
                default: false
            },
            submitDisabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {};
        },
        methods: {
            nextStep () {
                this.$emit('nextStep');
            },
            prev () {
                this.$emit('prev');
            }
        }
    };
</script>