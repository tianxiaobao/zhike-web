<style scoped lang="scss" type="text/scss">
    .multiple-entry-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;

            .step-bar {
                /*margin-right: 16px;*/
                height: 45px;
                width: 100%;
            }

            .tip-bar {
                flex: 1;
            }
        }

        .content-row {
            flex: 1;
            overflow: hidden;
        }

        .bottom-panel {
            min-height: 36px;
            display: flex;
            margin-top: 16px;
        }
    }
</style>

<template>
    <div class="multiple-entry-container">
        <div class="top-row">
            <step-bar :step="step" class="step-bar"></step-bar>
        </div>
        <div class="content-row">
            <group-selector v-show="step === 0" class="group-selector" v-model="groupId"></group-selector>
            <double-upload v-show="step === 1" @pop-data="receiveData"></double-upload>
            <upload-confirm :should-submit="shouldSubmit" :photo-storage="photoStorage" :text-storage="textStorage"
                            v-show="step === 2"></upload-confirm>
        </div>
        <bottom-row class="bottom-panel" @submit="submit" @reset-form="resetForm"></bottom-row>
    </div>
</template>

<script>
    import GroupSelector from '../../group-selector';
    import StepBar from './step-bar';
    import TipBar from '../../sub-components/tip-bar';
    import BottomRow from './bottom-row';
    import DoubleUpload from './double-upload/index';
    import UploadConfirm from './upload-confirm';

    export default {
        name: '',
        components: {
            GroupSelector,
            BottomRow,
            DoubleUpload,
            UploadConfirm,
            StepBar,
            TipBar
        },
        data () {
            return {
                photoStorage: [],
                textStorage: [],
                shouldSubmit: false,
                groupId: 'member'
            };
        },
        computed: {
            step () {
                return this.$store.state.vision.step;
            },
            totalWillUploadCount () {
                return this.$store.getters['vision/totalWillUploadCount'];
            }
        },
        watch: {
            groupId (val) {
                this.$store.commit('vision/updateGroupId', val);
            },
            step (step) {
                const photoStorage = this.$store.state.vision.photoStorage;
                const textStorage = this.$store.state.vision.textStorage;
                if (step === 2) {
                    if (photoStorage.length !== textStorage.length) {
                        this.$alert('图片和列表数量不同，将按照最小值截取');
                    }
                }
            }
        },
        methods: {
            submit () {
                this.shouldSubmit = true;
                setTimeout(() => {
                    if (this.totalWillUploadCount === 0) {
                        this.shouldSubmit = false;
                    }
                }, 50);
            },
            receiveData ({photoStorage, textStorage}) {
                this.photoStorage = photoStorage;
                this.textStorage = textStorage;
            },
            resetForm () {
                this.shouldSubmit = false;
            }
        }
    };
</script>