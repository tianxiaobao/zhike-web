<template>
    <div class = "jd-tag-crowd">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  element-loading-text="正在上传中，请稍后……">
            <el-form-item label="人群名称" prop="name">
                <el-input v-model="ruleForm.name" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="人群描述" prop="description">
                <el-input v-model="ruleForm.description" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
                <el-radio-group v-model="ruleForm.userType">
                    <el-radio  label="mac" >MAC</el-radio>
                    <el-radio  label="user_log_acct" >京东登录帐号</el-radio>
                    <el-radio  label="mobile" >手机号</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择文件" prop="file" ref="fileFormItem">
                <el-upload
                    action=""
                    name="file"
                    :on-change="onFileChange"
                    :on-remove="onFileRemove"
                    :auto-upload="false"
                    :file-list="fileList"
                    accept=".txt">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">请上传txt文档，最大200MB，文档中以换行分隔数据</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer t-center">
            <el-button type="primary" @click="onCancel" :disabled="loading">上一步</el-button>
            <el-button type="primary" @click="onSubmit('ruleForm')" :loading="loading">创建</el-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { uploadCrowd} from '@/apis/crowd.js';
export default {
    data () {
        const fileValidator = (rule, value, callback) => {
            if (!value['name']) {
                callback(new Error('请添加文件'));
            } else {
                callback();
            }
        };
        return {
            loading:false,
            fileList:[],
            ruleForm: {
                name:'',
                description:'',
                userType:'',
                file:''
            },
            rules: {
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ],
                description: [
                    {required: true, message: '请输入描述', trigger: 'blur'}
                ],
                userType: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ],
                file: [
                    {required: true, validator: fileValidator,trigger:'change'}
                ]
            }
        };
    },
    prop: ['step'],
    computed: {
        ...mapGetters([
            'currentMall',
            'currentShop'
        ]),
        currentMallShopIds () {
            if(!this.currentMall || !this.currentShop) {
                return null;
            }
            return `${this.currentMall.id},${this.currentShop.id}`;
        }
    },
    methods: {
        // 取消操作
        onCancel () {
            this.$emit('prev');
        },
        // 文件变换
        onFileChange (file,fileList) {
            this.ruleForm.file = file.raw;
            if(fileList.length>1) {
                this.fileList = fileList.slice(fileList.length-1);
            }else{
                this.fileList =fileList;
            }
            this.$refs.fileFormItem.$emit('el.form.change');
        },
        // 删除文件
        onFileRemove () {
            this.ruleForm.file = '';
        },
        // 提交表单
        onSubmit () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(!this.currentMallShopIds) {
                        this.$message({
                            type: 'error',
                            message: '请选择有效的商场和店铺'
                        });
                        return;
                    }
                    this.loading = true;
                    const params = new FormData();
                    params.append("name", this.ruleForm.name);
                    params.append("description", this.ruleForm.description);
                    params.append("file", this.ruleForm.file);
                    params.append("userType", this.ruleForm.userType);
                    uploadCrowd({
                        path:[this.currentMall.id, this.currentShop.id],
                        params,
                        type:'form'
                    }).then(() => {
                        this.loading = false;
                        this.resetForm();
                        this.$emit('next');
                    }).catch(err => {
                        this.loading = false;
                        this.$message({
                            showClose: true,
                            message: err.message,
                            type: 'error'
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        // 重置表单
        resetForm () {
            this.$refs['ruleForm'].resetFields();
        }
    }
};
</script>
<style lang="scss" scoped>
   .t-center{
        width: 100%;
        text-align:center;
        & .el-button{
            min-width: 118px;
        }
    }
</style>