<template>
    <el-dialog title="短信模板申诉" class="dialog-message" :visible.sync="visible" :before-close="onCancel">
        <div class="dialog-content">
            <el-form :model="form" class="form" :rules="rules" ref="form">
                <el-form-item label="模板名称:" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item prop="message" label="短信内容:" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.message" auto-complete="off" :maxlength="320" :autosize="{ minRows: 8, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="审批时间:" :label-width="formLabelWidth" class="text-only">
                    <span> {{ form.approvalTime | time }} </span>
                </el-form-item>
                <el-form-item label="审批人:" :label-width="formLabelWidth" class="text-only">
                    <span> {{ form.approver }} </span>
                </el-form-item>
                <el-form-item label="审批意见:" :label-width="formLabelWidth" class="text-only">
                    <span> {{ form.approvalReason }} </span>
                </el-form-item>
                <el-form-item prop="appealReason" label="申诉理由:" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.appealReason" auto-complete="off" :maxlength="500" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
                </el-form-item>
            </el-form>
            <div class="message-preview">
                <preview :message="form.message"></preview>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button :loading="isSubmitting" type="success" @click="onSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Preview from './components/Preview';

import { mapGetters } from 'vuex';
import { timeFormatter } from '@/utils';
import { appealMessage } from '@/apis/shortMessage';

export default {
    props: ['visible'],
    components: {
        Preview
    },
    filters: {
        time (val) {
            return timeFormatter(val);
        }
    },
    data () {
        return {
            formLabelWidth: '100px',
            isSubmitting: false,
            rules: {
                message: [
                    { required: true, message: '请填写短信内容', trigger: 'blur' }
                ],
                appealReason: [
                    { required: true, message: '请填写申诉理由', trigger: 'blur' }
                ]
            },
            form: {
                id: undefined,
                name: '',
                message: '',
                approvalTime: '',
                approver: '',
                approvalReason: '',
                appealReason: ''
            }
        };
    },
    created () {
        this.$on('set', (item) => this.init({
            id: item.id,
            name: item.modelName,
            message: item.modelContent,
            approvalTime: item.approvalTime,
            approver: item.approvalerPin,
            approvalReason: item.approvalSug
        }));
    },
    computed: {
        ...mapGetters(['currentMall', 'currentShop'])
    },
    methods: {
        init (data = {}) {
            this.form = Object.assign({
                id: undefined,
                name: '',
                message: '',
                approvalTime: '',
                approvalReason: '',
                appealReason: ''
            }, data);
            this.$refs.form && this.$refs.form.resetFields();
        },
        onCancel () {
            this.init();
            this.handleClose();
        },
        onSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.isSubmitting = true;
                    const { id, message, appealReason } = this.form;
                    appealMessage({
                        path: [this.currentMall.id, this.currentShop.id],
                        params: {
                            shortMessageId: id,
                            smContent: message,
                            appealSug: appealReason
                        },
                        type: 'formData'
                    }).then(() => {
                        this.$nextTick(() => {
                            this.isSubmitting = false;
                        });
                        this.init();
                        this.handleClose(true);
                    }).catch(err => {
                        if(err.message) {
                            this.$message({
                                type: 'error',
                                message: '申诉提交失败:' + err.message
                            });
                        }
                        this.$nextTick(() => {
                            this.isSubmitting = false;
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        handleClose (refresh = false) {
            this.$emit('close', refresh);
        }
    }
};
</script>

<style scoped lang="scss">
.dialog-content {
    display: flex;
    .form {
        flex-grow: 1;
        .el-form-item.text-only {
            margin-bottom: 0;
            span {
                display: inline-block;
                transform: translateY(1px);
            }
        }
    }
    .message-preview {
        padding-left: 40px;
    }
}
</style>
<style>
.dialog-message>.el-dialog.el-dialog--small{
    min-width: 820px;
}
</style>

