<style scoped lang="scss" type="text/scss">
    .double-upload-container {
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;

        a {
            color: #3276A5;
            &:hover {
                color: #1276e5;
            }
        }

        .real-content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .photo-upload,
            .csv-upload {
                width: 49%;
                height: 100%;
                display: flex;
                flex-direction: column;

                .uploader-placeholder {
                    flex: 1;
                    position: relative;

                    .photo-gallery,
                    .text-gallery {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                    }
                }

                .button-panel {
                    min-height: 40px;
                    margin-top: 16px;
                }
            }
        }
    }
</style>

<template>
    <div class="double-upload-container">

        <div class="real-content">
            <div class="photo-upload">
                <huge-block class="uploader-placeholder" :no-hover-style="photoHasOnceUploaded"
                            @click="uploadPhotoBtnClickedCopy"
                >
                    <input type="file" multiple ref="photoUploadTrigger" @change="photoSelected"
                           style="position: absolute; visibility: hidden;">

                    <default-image-placeholder class="default-img"
                                               v-if="!photoHasOnceUploaded"
                                               icon="&#xe604;"
                    >
                        <div style="text-align: center">请通过点击此处或左下方按钮批量上传照片</div>
                        <div style="text-align: center; margin-top: 16px">（ 总计最多 {{ maxUploadCount }} 张，支持 jpg, jpeg,
                            gif, png ）
                        </div>
                    </default-image-placeholder>

                    <photo-gallery class="photo-gallery" v-else
                                   @scrolling="photoScrolling"
                                   :scroll-top="photoScrollTop"
                    ></photo-gallery>
                </huge-block>

                <div class="button-panel">
                    <vision-button @click="uploadPhotoBtnClicked">
                        <i class="icon">&#xe646;</i>
                        <span>
                            {{ photoHasOnceUploaded ? '继续' : '批量' }}上传 {{ photoStorage.length > 0 ? '（ 当前：' + photoStorage.length + ' 条 ）' : '照片' }}
                        </span>
                    </vision-button>
                </div>
            </div>
            <div class="csv-upload">
                <huge-block class="uploader-placeholder" :no-hover-style="textHasOnceUploaded"
                            @click="uploadTextBtnClickedCopy"
                >
                    <input type="file" multiple ref="textUploadTrigger" @change="textSelected"
                           style="position: absolute; visibility: hidden;">

                    <default-image-placeholder class="default-img"
                                               v-if="!textHasOnceUploaded"
                                               icon="&#xe7b8;"
                    >
                        <div style="text-align: center">请通过点击此处或左下方按钮上传 .csv 文件类型</div>
                        <div style="text-align: center; margin-top: 16px">（ 最多 {{ maxUploadCount }} 条
                            <a @click.stop="downloadTemplate">下载模板</a>
                            ）
                        </div>
                    </default-image-placeholder>

                    <text-gallery class="text-gallery" v-else
                                  @scrolling="textScrolling"
                                  :scroll-top="textScrollTop"
                    ></text-gallery>
                </huge-block>
                <div class="button-panel">
                    <vision-button @click="uploadTextBtnClicked">
                        <i class="icon">&#xe60a;</i>
                        <span>
                            {{ textHasOnceUploaded ? '重新' : '批量' }}上传 {{ textStorage.length > 0 ? '（ 当前：' + textStorage.length + ' 条 ）' : '用户信息列表' }}
                        </span>
                    </vision-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HugeBlock from '../../../sub-components/huge-block';
    import VisionButton from '../../../sub-components/vision-button';
    import DefaultImagePlaceholder from '../../../sub-components/default-image-placeholder';
    import papaparse from 'papaparse';
    import {csvTemplateURL} from '../../../../../../../apis/vision';

    import PhotoGallery from './photo-gallery';
    import TextGallery from './text-gallery';
    // import jschardet from 'jschardet';

    export default {
        name: '',
        components: {
            HugeBlock,
            VisionButton,
            DefaultImagePlaceholder,
            PhotoGallery,
            TextGallery
        },
        watch: {
            currentStep (step) {
                if (step === 2) {
                    this.$store.commit('vision/updatePhotoStorage', this.photoStorage);
                    this.$store.commit('vision/updateTextStorage', this.textStorage);
                }
            }
        },
        data () {
            return {
                // photoStorage: [],
                // textStorage: [],
                jschardet: null,
                photoScrollTop: 0,
                textScrollTop: 0,
                maxUploadCount: 50,
                csvTemplateURL
            };
        },
        beforeCreate () {
            import(`jschardet`).then(module => {
                this.jschardet = module;
            });
        },
        computed: {
            photoStorage () {
                return this.$store.state.vision.photoStorage;
            },
            textStorage () {
                return this.$store.state.vision.textStorage;
            },
            photoHasOnceUploaded () {
                return this.photoStorage.length > 0;
            },
            textHasOnceUploaded () {
                return this.textStorage.length > 0;
            },
            currentStep () {
                return this.$store.state.vision.step;
            }
        },
        methods: {
            downloadTemplate () {
                window.open(this.csvTemplateURL);
            },
            uploadPhotoBtnClickedCopy () {
                if (this.photoHasOnceUploaded) return;
                this.uploadPhotoBtnClicked();
            },
            uploadPhotoBtnClicked () {
                this.$refs.photoUploadTrigger.click();
            },
            uploadTextBtnClickedCopy () {
                if (this.textHasOnceUploaded) return;
                this.uploadTextBtnClicked();
            },
            uploadTextBtnClicked () {
                this.$refs.textUploadTrigger.click();
            },
            photoSelected (e) {
                const photoObjList = e.target.files || e.dataTransfer.files;
                const fileSizeLimit = 3 * 1024 * 1024;
                for (let index = 0; index < photoObjList.length && index < this.maxUploadCount; index++) {
                    if (photoObjList[index].size > fileSizeLimit) {
                        this.$alert('文件不能大于 3 M');
                        return;
                    }

                    if (!validateExt(photoObjList[index], ['jpg', 'jpeg', 'gif', 'png'])) {
                        this.$alert('请上传正确格式的图片');
                        return;
                    }
                }
                transformFiles(photoObjList);
                this.$store.commit('vision/addPhotoStorage', photoObjList);
                if (this.photoStorage.length > this.maxUploadCount) {
                    this.$alert('最多上传 50 张图片');
                    this.$store.commit('vision/updatePhotoStorage', this.photoStorage.slice(0, this.maxUploadCount));
                }
                this.$refs.photoUploadTrigger.setAttribute('type', 'text');
                this.$refs.photoUploadTrigger.setAttribute('type', 'file');
            },
            textSelected (e) {
                const textObject = e.target.files || e.dataTransfer.files;
                const csvObject = textObject[0];
                if (!validateExt(csvObject, ['csv'])) {
                    this.$alert('请上传 .csv 文件');
                    return;
                }
                const previewReader = new FileReader();
                previewReader.onload = foo => {
                    const encoding = checkEncoding(foo.target.result, this);

                    papaparse.parse(csvObject, {
                        encoding,
                        complete: (result) => {
                            if (result.errors.length === 0) {
                                const res = result.data;
                                // 去除最后的空行
                                if (res[res.length - 1] == "") {
                                    res.pop();
                                }
                                if (result.data.length > this.maxUploadCount + 1) {
                                    this.$alert('最多上传 50 条数据');
                                }
                                this.$store.commit('vision/updateTextStorage', result.data.slice(1, this.maxUploadCount + 1));
                                this.$refs.textUploadTrigger.setAttribute('type', 'text');
                                this.$refs.textUploadTrigger.setAttribute('type', 'file');
                            } else {
                                // console.log(result.errors);
                            }
                        }
                    });
                };
                previewReader.readAsDataURL(csvObject);
            },
            photoScrolling (val) {
                this.textScrollTop = val;
            },
            textScrolling (val) {
                this.photoScrollTop = val;
            }
        }
    };

    function transformFiles (files) {
        for (let index = 0; index < files.length; index++) {
            files[index].humanizedSize = humanizeFileSize(files[index].size);
        }
    }

    function humanizeFileSize (size) {
        let humanizedSize = '';
        let sizeCopy = size;
        const threshold = 1000;
        const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let level = 0;
        while (level < 6) {
            if (sizeCopy < threshold) break;
            level++;
            sizeCopy /= threshold;
        }
        humanizedSize = sizeCopy.toFixed(1) + ' ' + unit[level];
        return humanizedSize;
    }

    function validateExt (fileObj, allowedExt) {
        const fileExt = fileObj.name.substr(fileObj.name.lastIndexOf('.') + 1).toLowerCase();
        if (allowedExt.indexOf(fileExt) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    function checkEncoding (base64Str, that) {
        // 这种方式得到的是一种二进制串
        const str = atob(base64Str.split(";base64,")[1]);
        // 要用二进制格式
        let encoding = that.jschardet.detect(str);
        encoding = encoding.encoding;
        if (encoding == "windows-1252") {    // 有时会识别错误（如UTF8的中文二字）
            encoding = "ANSI";
        }
        return encoding;
    }
</script>