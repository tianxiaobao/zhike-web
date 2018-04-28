<template>
    <el-dialog title="创建人群包" :visible.sync="visible" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="人群名称" prop="name">
                <el-input v-model="ruleForm.name" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="人群描述" prop="desc">
                <el-input v-model="userPackage.name" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="primary" :loading="submitting" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addCrowd } from '@/apis/crowd.js';
import * as types from '@/pages/index/router/route_types';
import { mapActions } from 'vuex';
export default {
    props: ['visible'],
    data () {
        return {
            // 表单信息
            ruleForm: {
                name:''
            },
            // 校验规则
            rules: {
                name: [
                    {required: true, message: '请输入人群名称', trigger: 'blur'},
                    { max: 40, message: '长度不超过40个字符', trigger: 'blur' }
                ]
            },
            submitting: false
        };
    },
    computed: {
        userPackage () {
            return this.$store.getters.userPackage;
        }
    },
    created () {
        this.initError();
    },
    methods: {
        ...mapActions(['initError']),
        handleClose () {
            this.$emit('close');
        },
        // 取消
        onCancel () {
            this.$emit('close');
        },
        // 提交表单
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitting = true;
                    const params = {
                        name:this.ruleForm.name,
                        key:encodeURIComponent(this.userPackage.ids),
                        start: this.userPackage.start,
                        end: this.userPackage.end,
                        description:this.userPackage.name,
                        source: this.userPackage.source,
                        shopId: this.userPackage.shopId
                    };
                    if (this.userPackage.customerType) {
                        params.customerType = this.userPackage.customerType;
                    }
                    if (this.userPackage.profileId !== undefined) {
                        params.profileId = this.userPackage.profileId;
                    }
                    addCrowd({
                        path: [this.userPackage.mallId, this.userPackage.timeslot],
                        params
                    }).then(() => {
                        this.submitting = false;
                        this.$router.push({ name: types.PERSONA_CROWD_PACKAGE });
                    }).catch(err => {
                        this.submitting = false;
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