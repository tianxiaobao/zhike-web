<style scoped lang="scss" type="text/scss">
    @keyframes loading {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .submit-button.loading {
        display: flex;
        align-items: center;

        .icon {
            width: 24px;
            height: 24px;
            margin-right: 0;
            animation: loading 2s ease infinite;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        span {
            margin-left: 8px;
        }
    }

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
            <vision-button v-if="!isUploadComplete && !isUploading" type="submit" class="submit-button"
                           @click="nextStep">
                <i class="icon" v-html="step < 2 ? '&#xe605;' : '&#xe611;'"></i>
                <span>
                    {{ step < 2 ? '下一步' : '提交' }}
                </span>
            </vision-button>
            <vision-button class="submit-button" :disabled="true" type="submit" v-if="isUploadComplete">
                <i class="icon">&#xe65b;</i>
                <span>已完成</span>
            </vision-button>
            <vision-button class="loading submit-button" v-if="!isUploadComplete && isUploading">
                <i class="icon">&#xeb0e;</i>
                <span>
                    {{ hasUploadedCount + ' / ' + totalWillUploadCount }}
                </span>
            </vision-button>
            <vision-button class="submit-button" @click="fallback" v-if="step > 0">
                <i class="icon">&#xe7b9;</i>
                <span>
                    {{ isUploadComplete ? '再次提交' : '上一步' }}
                </span>
            </vision-button>
        </vision-button-group>
    </div>
</template>

<script>
    import VisionButton from '../../sub-components/vision-button/index';
    import VisionButtonGroup from '../../sub-components/vision-button-group';

    export default {
        name: '',
        computed: {
            step () {
                return this.$store.state.vision.step;
            },
            hasUploadedCount () {
                return this.$store.getters['vision/hasUploadedCount'];
            },
            totalWillUploadCount () {
                return this.$store.getters['vision/totalWillUploadCount'];
            },
            isUploadComplete () {
                return this.totalWillUploadCount !== 0 && this.hasUploadedCount === this.totalWillUploadCount;
            }
        },
        components: {
            VisionButton,
            VisionButtonGroup
        },
        data () {
            return {
                isUploading: false
            };
        },
        methods: {
            nextStep () {
                if (this.step < 2) {
                    this.$store.commit('vision/updateStep', this.step + 1);
                } else {
                    if (this.isUploadComplete) {
                        return;
                    } else {
                        this.$emit('submit');
                        if (this.totalWillUploadCount > 0) {
                            this.isUploading = true;
                        }
                    }
                }
            },
            fallback () {
                if (this.isUploadComplete) {
                    this.$store.dispatch('vision/resetUpload');
                    this.isUploading = false;
                    this.$emit('reset-form');
                    this.$store.commit('vision/updateStep', 0);
                } else {
                    if (this.isUploadComplete) {
                        this.$store.commit('vision/updateStep', 0);
                    } else {
                        this.$store.commit('vision/updateStep', this.step - 1);
                    }
                }
            }
        }
    };
</script>