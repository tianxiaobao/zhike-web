<template>
<div>
    <title-bar class="bar">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>我的画像</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
        </el-breadcrumb>
    </title-bar>
    <div class="content" v-loading="loading">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="手机号码" prop="mobile" style="width:500px;">
                <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode" style="width:500px;">
                <el-input v-model="ruleForm.verifyCode">
                    <el-button slot="append" @click="getCode" id="btn-authcode" :disabled="disBtn" style="width:100px;">发送验证码</el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onCancel">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
import { getProfileVerifyCode } from '@/apis/sms';
import { getProfile } from '@/apis/user';
import * as types from '@/pages/index/router/route_types';

export default {
    components: {
        'title-bar':TitleBar
    },
    data () {
        // 校验手机号
        const validateMobile = (rule, value, callback) => {
            const reg = /^1[345789]\d{9}$/;
            if (!reg.test(value)) {
                this.disBtn = true;
                callback(new Error('请输入正确手机号'));
            }else {
                this.disBtn = false;
                callback();
            }
        };
        return {
            disBtn:true,
            loading:false,
            // 表单信息
            ruleForm: {
                mobile:'',
                verifyCode:''
            },
            // 校验规则
            rules: {
                mobile: [
                    { validator: validateMobile, required: true, trigger: 'blur' }
                ],
                verifyCode: [
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ]
            },
            actionId:''
        };
    },
    methods: {
        // 获取验证码
        getCode () {
            getProfileVerifyCode({
                params: {
                    mobile: this.ruleForm.mobile
                }
            }).then(dataObj => {
                this.actionId = dataObj.message.String;
            }).catch(err => {
                throw err;
            });
            // 更改秒数
            const _this = this;
            let seconds = 60;
            _this.disBtn = true;
            const span = document.getElementById('btn-authcode').getElementsByTagName('span')[0];
            const int = setInterval(function () {
                span.innerHTML=seconds+'s';
                if(seconds > 0) {
                    seconds = seconds - 1;
                } else {
                    span.innerHTML='发送验证码';
                    window.clearInterval(int);
                    _this.disBtn = false;
                }
            },1000);
        },
        // 取消
        onCancel () {
            window.history.go(-1);
        },
        // 提交表单
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    getProfile({
                        params: {
                            mobile: this.ruleForm.mobile,
                            verifyCode:this.ruleForm.verifyCode,
                            actionId:this.actionId
                        }
                    }).then((dataObj) => {
                        this.loading = false;
                        this.$store.commit('setProfile', dataObj.message.HashMap);
                        this.$router.push({name: types.PERSONAL_PERSONA_RESULT});
                    }).catch(err => {
                        this.loading = false;
                        throw err;
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.content{
    padding: 20px;
}
.el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus{
    background-color: #eee;
    color: #999;
    border-color:#eee;
    cursor: not-allowed;
}
</style>