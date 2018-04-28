<style scoped lang="scss" type="text/scss">
    @mixin normal-flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @mixin normal-transition {
        transition: all .2s;
    }

    $border-style: 1px solid #eee;
    .upload-confirm-container {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border: 1px solid #aaa;
        height: 100%;
        overflow: auto;

        .slider-item {
            &:hover {
                background-color: #eee;
            }

            min-height: 40px;
            display: flex;
            color: #444;
            box-sizing: border-box;
            border-bottom: $border-style;
            @include normal-transition;

            &.slide-placeholder {
                width: 100%;
                position: absolute;
                opacity: .1;
            }

            &.will-be-drag {
            }

            &.frozen-row {
                border-color: #aaa;
                .block-item {
                    border-right: none !important;

                    &:hover {
                        cursor: default !important;
                    }
                }
            }

            .block-item {
                font-size: 13px;
                @include normal-flex-center;
                overflow: hidden;
                span {
                    font-size: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                &:not(:last-child) {
                    box-sizing: border-box;
                    border-right: $border-style;
                }
            }

            .block-item:nth-child(2) {
                width: 150px;
            }
            .block-item:nth-child(1),
            .block-item:nth-child(3),
            .block-item:nth-child(4) {
                width: 120px;
            }
            .block-item:nth-child(7) {
                width: 120px;
            }
            .block-item:nth-child(5) {
                width: 200px;
            }
            .block-item:nth-child(6) {
                flex: 1;
                overflow: hidden;
                box-sizing: border-box;
                padding: 0 20px;
            }
        }

        .slider-container {
            flex: 1;
            overflow: auto;
            position: relative;

            &::-webkit-scrollbar {
                width: 2px;
                height: 2px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: rgba(133, 144, 166, .5);
            }
        }
    }
</style>

<template>
    <div class="upload-confirm-container">
        <!--固定栏-->
        <div class="frozen-row slider-item">
            <div class="block-item">序号</div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">姓名</span>
            </div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">性别</span>
            </div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">年龄</span>
            </div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">联系方式</span>
            </div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">照片名称</span>
            </div>
            <div class="block-item">
                <span class="zhike-global-ellipsis">大小</span>
            </div>
        </div>

        <!--可滑动栏-->
        <div class="slider-container">
            <!--其他格-->
            <div class="slider-item" v-for="(item, index) in dataCollection">
                <div class="block-item">{{ index + 1 }}</div>
                <div class="block-item">
                    <span class="zhike-global-ellipsis">{{ item.name }}</span>
                </div>
                <div class="block-item">
                    <span class="zhike-global-ellipsis">{{ item.gender }}</span>
                </div>
                <div class="block-item">
                    <span class="zhike-global-ellipsis">{{ item.age }}</span>
                </div>
                <div class="block-item">
                    <span class="zhike-global-ellipsis">{{ item.mobile }}</span>
                </div>
                <div class="block-item">
                    <span class="zhike-global-ellipsis">{{ item.filename }}</span>
                </div>
                <div class="block-item">
                    <span class="zhike-global-ellipsis">{{ index < nextUploadedIndex ? '已完成' : index === nextUploadedIndex ? '正在上传...' : item.fileSize }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            shouldSubmit: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            dataCollection () {
                return this.$store.getters['vision/willUploadCollection'];
            },
            nextUploadedIndex () {
                return this.$store.state.vision.nextUploadedIndex;
            },
            groupId () {
                return this.$store.state.vision.groupId;
            }
        },
        watch: {
            shouldSubmit (shouldSubmit) {
                if (shouldSubmit) {
                    if (this.dataCollection.length === 0) {
                        this.$alert('上传数量不能为 0');
                        return;
                    }
                    const index = 0;
                    this.upload(index);
                }
            }
        },
        data () {
            return {};
        },
        methods: {
            upload (index) {
                const dataCollection = this.dataCollection;
                const currentData = dataCollection[index];
                this.$store.commit('vision/updateNextUploadedIndex', index);
                if (currentData === undefined) {
                    // this.nextUploadedIndex = -1;
                    this.$alert('全部上传完成');
                    return;
                }

                const formData = new FormData();
                formData.append('name', currentData.name);
                formData.append('age', currentData.age);
                formData.append('mobile', currentData.mobile);
                formData.append('gender', currentData.gender === '男' ? 'male' : currentData.gender === '女' ? 'female' : currentData.gender);
                formData.append('group_id', this.groupId);
                formData.append('file', currentData.fileObj, currentData.fileObj.name);

                this.$store.dispatch('vision/postUploadFile', formData).then(() => {
                    this.$store.commit('vision/updateUploadedSignature', index);
                    this.upload(index + 1);
                }).catch((err) => {
                    if (err.status === 601) {
                        this.alert(err['result_data']);
                        this.submitDisabled = false;
                    }
                });
            }
        }
    };

</script>