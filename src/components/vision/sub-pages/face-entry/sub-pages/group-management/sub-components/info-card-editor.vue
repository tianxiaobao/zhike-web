<style scoped lang="scss" type="text/scss">
    .info-card-container {
        height: 420px;
        width: 480px;
        background-color: #eee;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 16px;
        border-radius: 2px;
        border: 1px solid #ccc;

        .description {
            height: 16px;
            font-size: 13px;
            color: #888;
            margin-bottom: 8px;
            margin-top: 8px;
        }

        .first-row {
            display: flex;
            height: 200px;

            .left-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 160px;
                margin-right: 8px;

                .portrait {
                    width: 160px;
                    height: 100%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center center;
                }
            }

            .right-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

            }
        }
        .form-input {
            height: 30px;
        }
        .second-row {
        }

        .third-row {
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
                <div class="description">
                    修改用户名
                </div>
                <div class="username">
                    <vision-input size="small" v-model="usernameCopy" class="form-input"
                                  placeholder="用户名"></vision-input>
                </div>
                <div class="description">
                    修改性别
                </div>
                <div class="gender">
                    <vision-button-group class="gender-selector">
                        <vision-button :class="{'active': genderCopy === 'male'}"
                                       @click="toggleGender('male')"
                                       size="small"
                        >
                            <i class="icon">&#xe648;</i>
                            <span>男</span>
                        </vision-button>
                        <vision-button :class="{'active': genderCopy === 'female'}"
                                       @click="toggleGender('female')"
                                       size="small"
                        >
                            <i class="icon">&#xe642;</i>
                            <span>女</span>
                        </vision-button>
                    </vision-button-group>
                </div>
                <div class="description">
                    修改年龄
                </div>
                <div class="age">
                    <vision-input size="small" v-model="ageCopy" class="form-input" placeholder="年龄"></vision-input>
                </div>
            </div>
        </div>
        <div class="second-row">
            <div class="description">
                修改联系方式
            </div>
            <vision-input size="small" class="form-input" v-model="mobileCopy" placeholder="联系方式"></vision-input>
        </div>
        <div class="third-row">
            <div class="description">
                更换分组
            </div>
            <vision-button-group class="group-list">
                <vision-button v-for="(item, index) in groupList" :key="index"
                               class="group-list-item"
                               :class="{'active': item.value === groupIdCopy}"
                               size="small"
                               @click="toggleGroup(item.value)"
                >
                    <i class="icon" v-html="item.icon">&#xe64a;</i>
                    <span>{{ item.label }}</span>
                </vision-button>
            </vision-button-group>
        </div>
        <div class="fourth-row">
            <vision-button-group class="control-panel">
                <vision-button class="control-panel-item" type="submit" size="small" @click="save"
                               :disabled="saveBtnDisabled">
                    <i class="icon">&#xe611;</i>
                    <span>保存</span>
                </vision-button>
                <vision-button class="control-panel-item" type="danger" size="small" @click="cancel"
                               :disabled="deleteBtnDisabled">
                    <i class="icon">&#xe60d;</i>
                    <span>取消</span>
                </vision-button>
            </vision-button-group>
        </div>
    </div>
</template>

<script>
    import VisionInput from '../../../sub-components/vision-input';
    import VisionButton from '../../../sub-components/vision-button';
    import VisionButtonGroup from '../../../sub-components/vision-button-group';

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
            VisionButtonGroup
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
                groupList: [
                    {
                        value: 'member',
                        label: '会员',
                        icon: '&#xe660;'
                    },
                    {
                        value: 'passerby',
                        label: '路人',
                        icon: '&#xe647;'
                    },
                    {
                        value: 'customer',
                        label: '常客',
                        icon: '&#xe658;'
                    },
                    {
                        value: 'thief',
                        label: '盗客',
                        icon: '&#xe64a;'
                    }
                ]
            };
        },
        computed: {
            canChangeGroup () {
                return this.groupId === 'member' || this.groupId === 'thief';
            }
        },
        methods: {
            toggleGender (gender) {
                this.genderCopy = gender;
            },
            toggleGroup (groupId) {
                this.groupIdCopy = groupId;
            },
            save () {
                const queryParams = {
                    token: this.token,
                    username: this.usernameCopy,
                    gender: this.genderCopy,
                    age: this.ageCopy,
                    mobile: this.mobileCopy,
                    'group_id': this.groupIdCopy
                };
                if (queryParams.username === '') {
                    this.$alert('姓名不能为空');
                    return;
                }
                if (queryParams.age === '') {
                    this.$alert('年龄不能为空');
                    return;
                }
                if (queryParams.gender !== 'male' && queryParams.gender !== 'female') {
                    this.$alert('请选择性别');
                    return;
                }
                if (queryParams.mobile === '') {
                    this.$alert('联系方式不能为空');
                    return;
                }
                const formData = new FormData();
                for (const key in queryParams) {
                    formData.append(key, queryParams[key]);
                }

                this.saveBtnDisabled = true;

                this.$store.dispatch('vision/updateInfo', formData).then(() => {
                    this.$alert('更新成功');
                    this.$emit('save', {
                        username: this.usernameCopy,
                        gender: this.genderCopy,
                        mobile: this.mobileCopy,
                        age: this.ageCopy,
                        groupId: this.groupIdCopy
                    });
                    this.saveBtnDisabled = false;
                }).catch(err => {
                    this.$alert('更新失败：' + err['result_data']);
                    this.saveBtnDisabled = false;
                });
            },
            cancel () {
                this.$emit('cancel');
            }
        }
    };
</script>