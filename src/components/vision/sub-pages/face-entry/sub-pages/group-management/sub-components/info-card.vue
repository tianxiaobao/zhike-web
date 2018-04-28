<style scoped lang="scss" type="text/scss">
    .info-card-container {
        height: 220px;
        background-color: #eee;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 16px;
        border-radius: 2px;
        border: 1px solid #ccc;

        .first-row {
            display: flex;
            height: 140px;

            .left-item {
                display: flex;
                flex-direction: column;
                width: 140px;
                margin-right: 8px;

                .portrait {
                    width: 140px;
                    height: 140px;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center center;
                }
            }

            .right-item {
                flex: 1;
                display: flex;
                margin-left: 8px;
                flex-direction: column;
                font-size: 13px;
                box-sizing: border-box;
                padding: 8px;
                justify-content: space-between;
                width: 100%;
                overflow: hidden;

                > div {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

            }
        }
        .form-input {
            height: 30px;
        }
        .second-row {
        }

        .third-row {
            display: flex;
            width: 100%;

            .group-list {
                width: 100%;
                .group-list-item {
                    width: 25%;
                }
            }
        }

        .fourth-row {
            width: 100%;
            .control-panel {
                width: 100%;
                .control-panel-item {
                    width: 50%;
                }
            }
        }
    }

    .extra-editor {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .8);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<template>
    <div class="info-card-container">
        <div class="first-row">
            <div class="left-item">
                <div class="portrait"
                     :style="{'background-image': 'url(' + photo + ')'}"
                >
                </div>
            </div>
            <div class="right-item">
                <div class="username">
                    用户名：{{ usernameCopy === null ? '未知' : usernameCopy }}
                </div>
                <div class="gender">
                    性别：{{ genderCopy === null ? '未知' : genderCopy === 'male' ? '男' : genderCopy === 'female' ? '女' :
                    genderCopy }}
                </div>
                <div class="age">
                    年龄：{{ ageCopy === null ? '未知' : ageCopy }}
                </div>
                <div class="mobile">
                    联系方式：{{ mobileCopy === null ? '未知' : mobileCopy }}
                </div>
            </div>
        </div>

        <div class="fourth-row">
            <vision-button-group class="control-panel">
                <vision-button class="control-panel-item" type="submit" size="small" @click="edit"
                               :disabled="saveBtnDisabled">
                    <i class="icon">&#xe621;</i>
                    <span>编辑</span>
                </vision-button>
                <vision-button class="control-panel-item" type="danger" size="small" @click="deleteItem"
                               :disabled="deleteBtnDisabled">
                    <i class="icon">&#xe601;</i>
                    <span>删除</span>
                </vision-button>
            </vision-button-group>
        </div>


        <div class="extra-editor" v-if="isEditing">
            <info-card-editor class="info-card-editor"
                              :token="token"
                              :photo="photo"
                              :username="usernameCopy"
                              :gender="genderCopy"
                              :mobile="mobileCopy"
                              :age="ageCopy"
                              :group-id="groupIdCopy"
                              @save="refresh"
                              @cancel="cancel"
            >
            </info-card-editor>
        </div>
    </div>
</template>

<script>
    import VisionInput from '../../../sub-components/vision-input';
    import VisionButton from '../../../sub-components/vision-button';
    import VisionButtonGroup from '../../../sub-components/vision-button-group';
    import InfoCardEditor from './info-card-editor';

    export default {
        name: '',
        props: {
            token: {
                default: ''
            },
            photo: {
                type: String,
                default: ''
            },
            username: {
                type: String,
                default: ''
            },
            gender: {
                type: String,
                default: ''
            },
            mobile: {
                type: String,
                default: ''
            },
            age: {
                default: ''
            },
            groupId: {
                type: String,
                default: ''
            }
        },
        components: {
            VisionInput,
            VisionButton,
            VisionButtonGroup,
            InfoCardEditor
        },
        created () {
            this.usernameCopy = this.username;
            this.genderCopy = this.gender;
            this.mobileCopy = this.mobile;
            this.ageCopy = this.age;
            this.groupIdCopy = this.groupId;
        },
        data () {
            return {
                saveBtnDisabled: false,
                deleteBtnDisabled: false,
                usernameCopy: '',
                genderCopy: '',
                mobileCopy: '',
                ageCopy: '',
                groupIdCopy: '',
                isEditing: false
            };
        },
        methods: {
            refresh (newInfo) {
                this.usernameCopy = newInfo.username;
                this.genderCopy = newInfo.gender;
                this.mobileCopy = newInfo.mobile;
                this.ageCopy = newInfo.age;
                this.$emit('need-refresh');
                this.isEditing = false;
            },
            cancel () {
                this.isEditing = false;
            },
            edit () {
                this.isEditing = true;
            },
            deleteItem () {
                this.$confirm('确认删除？').then(() => {
                    const formData = new FormData();
                    formData.append('token', this.token);
                    this.deleteBtnDisabled = true;
                    this.$store.dispatch('vision/deleteInfo', formData).then(() => {
                        this.$alert('删除成功');
                        this.$emit('need-refresh');
                        this.deleteBtnDisabled = false;
                    }).catch(err => {
                        this.$alert('删除失败：' + err['result_data']);
                        this.deleteBtnDisabled = false;
                    });
                });
            }
        }
    };
</script>