<template>
    <el-dialog title="新建短信模板" class="dialog-message" :visible.sync="visible" :before-close="onCancel">
        <div class="dialog-content">
            <el-form :model="form" class="form" :rules="rules" ref="form">
                <el-form-item prop="name" label="模板名称:" :maxlength="20" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="message" label="短信内容:" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.message" auto-complete="off" :maxlength="320" :autosize="{ minRows: 8, maxRows: 18}"></el-input>
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

import { createMessage } from '@/apis/shortMessage';

export default {
    props: ['visible'],
    components: {
        Preview
    },
    data () {
        return {
            formLabelWidth: '100px',
            isSubmitting: false,
            rules: {
                name: [
                    { required: true, message: '请填写模板名称', trigger: 'blur' }
                ],
                message: [
                    { required: true, message: '请填写短信内容', trigger: 'blur' }
                ]
            },
            form: {
                name: '',
                message: ''
            }
        };
    },
    computed: {
        ...mapGetters([
            'currentMall',
            'currentShop'
        ])
    },
    methods: {
        init (data = {}) {
            this.form = Object.assign({
                name: '',
                message: ''
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
                    const { name, message } = this.form;
                    createMessage({
                        path: [this.currentMall.id, this.currentShop.id],
                        params: {
                            smName: name,
                            smContent: message
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
                                message: '短信模板创建失败:' + err.message
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
