<style scoped lang="scss" type="text/scss">

    .single-entry-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .step-bar {
            height: 45px;
            margin-bottom: 25px;
        }

        .info-content-container {
            flex: 1;
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: center;

            &::-webkit-scrollbar {
                width: 2px;
                height: 2px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: rgba(133, 144, 166, .3);
            }

            .left-column,
            .right-column {
                width: 70%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .left-column {
                .photo-placeholder {
                    height: 80%;
                    max-height: 400px;
                    width: 100%;

                    .preview-img {
                        width: 100%;
                        height: 100%;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center center;
                    }

                    .default-img {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                    }
                }
                .button-collection {
                    margin-top: 16px;
                    display: flex;
                    justify-content: space-between;
                    height: 40px;
                    width: 100%;

                    .button-item {
                        width: 49%;
                        height: 100%;
                    }
                }

                .video-model-container {
                    display: flex;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 16px;
                    align-items: center;
                    border-radius: 2px;
                    border: 1px solid #aaa;
                    position: relative;
                    width: 100%;
                    height: 80%;

                    .video-container,
                    .img-container {
                        position: absolute;
                        width: 100%;
                        height: 100%;

                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }

            .right-column {
                box-sizing: border-box;
                padding-left: 32px;

                .form-input-item {
                    margin-bottom: 8px;
                    width: 100%;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }

        }

        .bottom-panel {
            min-height: 36px;
            display: flex;
            margin-top: 16px;
        }
    }
</style>

<template>
    <div class="single-entry-container">
        <step-bar class="step-bar" :step="step"></step-bar>

        <div class="info-content-container">
            <group-selector class="group-selector" v-model="groupId"
                            v-show="step === 0"
            >
            </group-selector>

            <div class="left-column" v-show="step === 1">

                <huge-block v-if="!videoModel" class="photo-placeholder" @click="uploadBtnClicked">
                    <default-image-placeholder class="default-img" v-if="previewUrl === null"
                                               icon="&#xe604;"
                    >
                        点击此处或左下方按钮上传
                        <div style="width: 100%; display: flex; justify-content: center;">最大 3 M，支持 jpg, jpeg, gif,
                            png
                        </div>
                    </default-image-placeholder>

                    <div class="preview-img"
                         v-if="previewUrl !== null"
                         :style="{'background-image': 'url(' + previewUrl + ')'}"
                    >
                    </div>

                </huge-block>

                <input type="file" ref="fileUploadTrigger" @change="fileSelected"
                       style="position: absolute; visibility: hidden;">

                <div v-if="videoModel" class="video-model-container" ref="videoModelContainer">

                    <div class="canvas-container">
                        <canvas ref="videoCanvas"></canvas>
                    </div>
                    <div class="video-container" v-if="videoingModel">
                        <video ref="videoHost"></video>
                    </div>
                    <div class="img-container" v-show="!videoingModel" style="z-index: 10;">
                        <img src="" ref="videoImg" alt="">
                    </div>
                </div>

                <div class="button-collection">
                    <vision-button class="button-item" @click="uploadBtnClicked">
                        <i class="icon">&#xe604;</i>
                        <span>上传照片</span>
                    </vision-button>
                    <vision-button class="button-item" @click="useVideoModel">
                        <i class="icon">&#xe697;</i>
                        <span>{{ !(videoModelPermitted && videoingModel) ? '摄像头拍摄' : '点击拍照' }}</span>
                    </vision-button>
                </div>
            </div>
            <div class="right-column" v-show="step === 2">
                <vision-form-input class="form-input-item"
                                   :is-required="true"
                                   v-model="name"
                                   placeholder="若无请填写「 无 」"
                                   input-title="姓名">
                </vision-form-input>
                <vision-form-input class="form-input-item"
                                   :is-required="true"
                                   :only-form-header="true"
                                   input-title="性别">
                    <vision-button-group class="gender-selector">
                        <vision-button :class="{'active': gender === 'male'}"
                                       @click="toggleGender('male')"
                        >
                            <i class="icon">&#xe648;</i>
                            <span>男</span>
                        </vision-button>
                        <vision-button :class="{'active': gender === 'female'}"
                                       @click="toggleGender('female')"
                        >
                            <i class="icon">&#xe642;</i>
                            <span>女</span>
                        </vision-button>
                    </vision-button-group>
                </vision-form-input>

                <vision-form-input class="form-input-item"
                                   :is-required="true"
                                   v-model="age"
                                   placeholder="若无请填写「 无 」"
                                   input-title="年龄">
                </vision-form-input>
                <vision-form-input class="form-input-item"
                                   :is-required="true"
                                   v-model="mobile"
                                   placeholder="若无请填写「 无 」"
                                   input-title="联系方式">
                </vision-form-input>
            </div>
        </div>

        <bottom-panel class="bottom-panel" :is-upload-complete="isUploadComplete"
                      :step="step"
                      @nextStep="nextStep"
                      :submit-disabled="submitDisabled"
                      @prev="prev"></bottom-panel>
    </div>
</template>

<script>
    import GroupSelector from '../../group-selector';
    import StepBar from './step-bar';
    import HugeBlock from '../../sub-components/huge-block';
    import VisionButton from '../../sub-components/vision-button';
    import VisionButtonGroup from '../../sub-components/vision-button-group';
    import BottomPanel from './bottom-row';
    import VisionFormInput from '../../sub-components/vision-form-input';
    import DefaultImagePlaceholder from '../../sub-components/default-image-placeholder';

    export default {
        name: '',
        components: {
            GroupSelector,
            StepBar,
            HugeBlock,
            VisionButton,
            VisionButtonGroup,
            BottomPanel,
            VisionFormInput,
            DefaultImagePlaceholder
        },
        data () {
            return {
                step: 0,
                name: '',
                gender: 'male',
                age: '',
                mobile: '',
                fileObj: null,
                previewUrl: null,
                groupId: 'member',
                isUploadComplete: false,
                videoModel: false,
                videoingModel: false,
                videoModelPermitted: false,
                submitDisabled: false
            };
        },
        computed: {
            // groupId () {
            //     return this.$store.state.vision.groupId;
            // }
        },
        watch: {
            videoModel (val) {
                if (!val) {
                    this.videoModelPermitted = false;
                }
            }
        },
        methods: {
            nextStep () {
                if (this.step === 2) {
                    if (this.isUploadComplete) {
                        return;
                    } else {
                        this.startUploadToServer();
                    }
                } else {
                    this.step++;
                }
            },
            prev () {
                if (this.step > 0) {
                    if (this.isUploadComplete) {
                        this.step = 0;
                        this.name = '';
                        this.gender = 'male';
                        this.age = '';
                        this.mobile = '';
                        this.fileObj = null;
                        this.previewUrl = null;
                        this.isUploadComplete = false;
                    } else {
                        this.step--;
                    }
                }
            },
            toggleGender (gender) {
                this.gender = gender;
            },
            uploadBtnClicked () {
                if (this.videoModel) {
                    this.closeVideo();
                    this.videoingModel = false;
                    this.videoModel = false;
                }
                this.$refs.fileUploadTrigger.click();
            },
            fileSelected (e) {
                const fileObjList = e.target.files || e.dataTransfer.files;
                if (fileObjList.length > 0 && fileObjList[0].size > 3 * 1024 * 1024) {
                    this.$alert('文件不能大于 3 M');
                    return;
                }
                const previewReader = new FileReader();
                previewReader.onload = foo => {
                    this.previewUrl = foo.target.result;
                };
                const currentUpload = fileObjList[0];
                const allowedExt = ['jpg', 'jpeg', 'gif', 'png'];
                if (validateExt(currentUpload, allowedExt)) {
                    this.fileObj = currentUpload;
                    previewReader.readAsDataURL(fileObjList[0]);
                    this.$refs.fileUploadTrigger.setAttribute('type', 'text');
                    this.$refs.fileUploadTrigger.setAttribute('type', 'file');
                } else {
                    this.$alert('请上传正确格式的图片');
                }
            },
            startUploadToServer () {
                if (!this.validate()) return;

                const formData = new FormData();
                formData.append('name', this.name);
                formData.append('age', this.age);
                formData.append('mobile', this.mobile);
                formData.append('gender', this.gender);
                formData.append('group_id', this.groupId);
                let filename = this.fileObj.name;
                if (!filename) {
                    filename = Date.now() + '.png';
                }
                formData.append('file', this.fileObj, filename);
                if (this.fileObj.validWidth !== undefined) {
                    formData.append('file_valid_width', this.fileObj.validWidth);
                    formData.append('file_valid_height', this.fileObj.validHeight);
                }

                this.submitDisabled = true;
                this.$store.dispatch('vision/postUploadFile', formData).then((res) => {
                    if (res.status === 'success') {
                        this.isUploadComplete = true;
                        this.$alert('提交成功');
                    }
                    this.submitDisabled = false;
                }).catch((err) => {
                    if (err.status === 601) {
                        this.alert(err['result_data']);
                        this.submitDisabled = false;
                    }
                });
            },
            validate () {
                if (this.fileObj === null || this.fileObj === undefined) {
                    this.$alert('请上传照片');
                    return false;
                }
                if (this.name === '') {
                    this.$alert('姓名不能为空');
                    return false;
                }
                if (this.name.length > 10) {
                    this.$alert('姓名请不要超过 10 个字符');
                    return false;
                }
                // || !Number.isInteger(+this.age)
                if (this.age === '') {
                    this.$alert('年龄不能为空');
                    return false;
                }
                if (this.age.length > 10) {
                    this.$alert('年龄请不要超过 10 个字符');
                    return false;
                }
                if (this.mobile === '') {
                    this.$alert('联系方式不能为空');
                    return false;
                }
                if (this.mobile.length > 20) {
                    this.$alert('联系方式请不要超过 20 个字符');
                    return false;
                }
                return true;
            },
            useVideoModel () {
                if (this.videoingModel) {
                    this.shotImg();
                    this.closeVideo();
                    return;
                }
                this.videoModel = true;
                this.videoingModel = true;

                setTimeout(() => {
                    const video = this.$refs.videoHost;
                    const container = this.$refs.videoModelContainer;
                    const canvas = this.$refs.videoCanvas;
                    video.addEventListener('canplay', function () {
                        if (true) {
                            // height = video.videoHeight / (video.videoWidth / width);
                            const height = container.offsetHeight;
                            const width = container.offsetWidth;

                            video.setAttribute('width', width);
                            video.setAttribute('height', height);
                            canvas.setAttribute('width', width);
                            canvas.setAttribute('height', height);
                            // streaming = true;
                        }
                    }, false);

                    navigator.mediaDevices.getUserMedia({video: true, audio: false})
                        .then(stream => {
                            this.videoModelPermitted = true;
                            video.srcObject = stream; // 将捕获的视频流传递给video  放弃window.URL.createObjectURL(stream)的使用
                            video.play();
                        }).catch(() => {
                            this.$alert('抱歉，您的浏览器/访问方式不支持摄像头获取');
                            this.videoingModel = false;
                            this.videoModel = false;
                        });
                }, 50);
            },
            shotImg () {
                if (!this.videoingModel) return;
                // const container = this.$refs.videoModelContainer;
                const video = this.$refs.videoHost;
                const img = this.$refs.videoImg;
                const canvas = this.$refs.videoCanvas;
                const context = canvas.getContext('2d');

                const container = this.$refs.videoModelContainer;
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                if (true) {
                    const ratioW = video.videoWidth / width;
                    const ratioH = video.videoWidth / height;
                    const ratio = ratioW > ratioH ? ratioW : ratioH;
                    context.drawImage(video, 0, 0, video.videoWidth / ratio, video.videoHeight / ratio);// 将视频画面捕捉后绘制到canvas里面
                    const base64Code = canvas.toDataURL('image/png');// 将canvas的数据传送到img里
                    img.src = base64Code;
                    this.fileObj = convertBase64UrlToBlob(base64Code);
                    this.fileObj.validWidth = video.videoWidth / ratio;
                    this.fileObj.validHeight = video.videoHeight / ratio;
                }
            },
            closeVideo () {
                const video = this.$refs.videoHost;
                if (video) {
                    video.srcObject.getTracks().forEach(track => {
                        track.stop();
                    });
                    video.srcObject = null;
                    this.videoingModel = false;
                }
            }
        }
    };

    function validateExt (fileObj, allowedExt) {
        const fileExt = fileObj.name.substr(fileObj.name.lastIndexOf('.') + 1).toLowerCase();
        if (allowedExt.indexOf(fileExt) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    function convertBase64UrlToBlob (urlData) {
        const bytes = window.atob(urlData.split(',')[1]); // 去掉url的头，并转换为byte
        // 处理异常,将ascii码小于0的转换为大于0
        const ab = new ArrayBuffer(bytes.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], {type: 'image/png'});
    }
</script>