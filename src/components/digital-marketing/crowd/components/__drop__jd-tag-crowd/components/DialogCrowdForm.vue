<template>
    <el-dialog title="创建人群包" :visible.sync="visible" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="人群名称" prop="name">
                <el-input v-model="ruleForm.name" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="所需人数" prop="limit">
                <el-input v-model.number="ruleForm.limit" :min="1" :max="5e6" type="number"></el-input>
            </el-form-item>
            <el-form-item label="人群描述" prop="desc">
                <el-input v-model="ruleForm.description" :maxlenght="200"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="onCancel('ruleForm')">取 消</el-button>
            <el-button type="primary" :loading="submitting" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { createPackage } from '@/apis/filter.js';
import { mapGetters } from 'vuex';
import { stringToBase64 } from '@/utils';

export default {
    props: ['visible', 'crowdData'],
    data () {
        return {
            // 表单信息
            ruleForm: {
                name: '',
                limit: '',
                description: ''
            },
            // 校验规则
            rules: {
                name: [
                    { required: true, message: '请输入人群名称', trigger: 'blur'},
                    { max: 40, message: '长度不超过40个字符', trigger: 'blur' }
                ],
                limit: [
                    { type: 'integer', required: true, message: '请输入一个正整数', trigger: 'blur' },
                    { type: 'integer', min: 1, max: 5e6, message: '所需人数必须为500万以内的正整数', trigger: 'blur' }
                ],
                description: [
                    { max: 200, message: '长度不超过200个字符', trigger: 'blur' }
                ]
            },
            submitting: false
        };
    },
    computed: {
        ...mapGetters(['currentMall'])
    },
    methods: {
        handleClose () {
            this.$emit('close');
        },
        // 取消
        onCancel (formName) {
            this.ruleForm = {
                name: '',
                limit: '',
                description: ''
            };
            this.$refs[formName].resetFields();
            this.$emit('close');
        },
        // 提交表单
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitting = true;
                    const cond = process.env.NODE_ENV !== 'production' ? JSON.stringify(this.crowdData) : stringToBase64(JSON.stringify(this.crowdData));
                    createPackage({
                        params: {
                            packageName: this.ruleForm.name,
                            pkDescription: this.ruleForm.description,
                            mallId: this.currentMall ? this.currentMall.id : -1,
                            limit: this.ruleForm.limit,
                            cond
                        }
                    }).then(() => {
                        this.$nextTick(() => this.submitting = false);
                        this.$message({
                            type: 'success',
                            message: '创建人群包成功!'
                        });
                        this.$emit('submitted');
                    }).catch(err => {
                        this.$nextTick(() => this.submitting = false);
                        if(err.message) {
                            this.$message({
                                type: 'error',
                                message: '创建人群包失败:' + err.message
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>