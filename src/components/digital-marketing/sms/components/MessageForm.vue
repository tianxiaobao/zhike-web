<template>
<el-dialog title="任务创建" :visible.sync="visible" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="adPlanform">
        <el-form-item label="短信名称" prop="title" style="width:500px;">
            <el-input v-model="ruleForm.title" :disabled="editInfo.flag" :maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc" style="width:500px;">
            <el-input v-model="ruleForm.desc" :disabled="editInfo.flag" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="tagId">
            <el-select v-model="ruleForm.tagId" placeholder="请选择类别" :disabled="editInfo.flag">
                <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select><span class="plus" @click="addTag">+</span>
        </el-form-item>
        <el-form-item label="发送类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择类型">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="目标用户群" prop="packageId">
            <el-select v-model="ruleForm.packageId" placeholder="请选择用户群" :disabled="editInfo.flag">
                <el-option v-for="item in crowdList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发送时间" prop="beginTime">
            <el-date-picker v-model="ruleForm.beginTime" type="datetime" placeholder="选择日期" :picker-options="pickerOptions" popper-class="noLink">
            </el-date-picker>
            <!-- <el-date-picker v-model="ruleForm.beginTime" type="datetime" placeholder="选择日期"> -->
            <!-- </el-date-picker> -->
        </el-form-item>
        <el-form-item label="短信模板" prop="templateId">
            <el-select v-model="ruleForm.templateId" placeholder="请选择模板" :disabled="editInfo.flag" @change="setMsgCon()">
                <el-option v-for="item in msgList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="短信内容" style="width:500px;">
            <el-input type="textarea" v-model="msgContent" :disabled="true"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="success" @click="onSubmit('ruleForm')">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
import { createAdPlan,tagList,tagAdd,adPlanRestart } from '@/apis/adPlan.js';
import { getSmsCrowdList } from '@/apis/crowd.js';
import { getMessageList } from '@/apis/shortMessage.js';
import { mapGetters } from 'vuex';
export default {
    props: ['visible','editInfo'],
    data () {
        return {
            pickerOptions:{
                disabledDate (time) {
                    return time.getTime() < Date.now();
                    // return time.getTime() < Date.now() - 8.64e7;
                }
            },
            // 表单信息
            ruleForm: {
                title:'',
                desc:'',
                tagId:'',
                type:'',
                packageId:'',
                beginTime:'',
                templateId:''
            },
            // 校验规则
            rules: {
                title: [
                    {required: true, message: '请输入短信名称', trigger: 'blur'}
                ],
                desc: [
                    {required: true, message: '请输入描述', trigger: 'blur'}
                ],
                tagId: [
                    {required: true, message: '请选择类别', trigger: 'change'}
                ],
                type: [
                    {required: true, message: '请选择类型', trigger: 'change'}
                ],
                packageId: [
                    {required: true, message: '请选择人群包', trigger: 'change'}
                ],
                beginTime: [
                    {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                ],
                templateId: [
                    {required: true, message: '请选择模板', trigger: 'change'}
                ]
            },
            tagList:[],
            crowdList:[],
            options:[
                {
                    value: 'ONCE',
                    label: '一次性'
                }
            ],
            msgList:[],
            initMsgList:'',
            msgContent:''
        };
    },
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
    // 监听mallId
    watch:{
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                if(val) {
                    this.getTagList();
                    this.getMessageList();
                    this.getCrowdList();
                }
            }
        }
    },
    created () {
        // this.getTagList();
        // this.getCrowdList();
        // this.getMessageList();
        this.$on('set', item => {
            this.ruleForm.title = item.title;
            this.ruleForm.desc = item.description;
            this.ruleForm.tagId = item.tagId.toString();
            this.ruleForm.type = item.sendType;
            this.ruleForm.packageId = item.packageId.toString();
            this.ruleForm.beginTime = new Date(item.beginTime);
            this.ruleForm.templateId = item.templateId.toString();
            this.setMsgCon();
        });
        this.$on('init', () => {
            this.initForm();
        });
    },
    methods: {
        initForm () {
            this.ruleForm = {
                title:'',
                desc:'',
                tagId:'',
                type:'',
                packageId:'',
                beginTime:'',
                templateId:''
            };
            this.msgContent = '';
            this.$refs['ruleForm'].resetFields();
        },
        handleClose () {
            this.onCancel();
        },
        onCancel () {
            this.$emit('cancel');
        },
        onSubmit (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const time = this.ruleForm.beginTime;
                    this.ruleForm.beginTime = this.format(this.ruleForm.beginTime, 'yyyy-MM-dd HH:mm:ss');
                    // console.log(time);
                    if(this.editInfo.flag) {
                        adPlanRestart({
                            path:[this.currentMall.id, this.currentShop.id, this.editInfo.id],
                            params: this.ruleForm
                        }).then(dataObj => {
                            if(dataObj.status == 'success') {
                                this.$emit('submit');
                            }
                        }).catch(err => {
                            throw err;
                        });
                    }else{
                        createAdPlan({
                            path:[this.currentMall.id, this.currentShop.id],
                            params: this.ruleForm
                        }).then(dataObj => {
                            if(dataObj.status == 'success') {
                                this.$emit('submit');
                            }
                        }).catch(err => {
                            this.ruleForm.beginTime = time;
                            // this.$emit('submit');
                            this.$message({
                                showClose: true,
                                message: err.message,
                                type: 'error'
                            });
                        });
                    }
                }
            });
        },
        // 添加所属类别
        addTag () {
            this.$prompt('请输入类别', '新建类别', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\s\S]{1,10}$/,
                inputPlaceholder:'最大长度为10个字符',
                inputErrorMessage: '不能为空，且最大长度为10字符'
            }).then(({ value }) => {
                tagAdd({
                    path:[this.currentMall.id, this.currentShop.id],
                    params: {name:value}
                }).then(() => {
                    this.getTagList();
                }).catch(err => {
                    throw err;
                });
            }).catch(() => {
            });
        },
        // 获取所属类别
        getTagList () {
            tagList({path:[this.currentMall.id, this.currentShop.id]}).then((dataObj) => {
                self = this;
                self.tagList = [];
                dataObj.message.list.map((item) => {
                    const obj ={};
                    obj.label = item.name;
                    obj.value = item.id.toString();
                    self.tagList.push(obj);
                });
            }).catch(err => {
                throw err;
            });
        },
        getCrowdList () {
            getSmsCrowdList({
                path: [this.currentMall.id, this.currentShop.id]
            }).then((dataObj) => {
                self = this;
                self.crowdList = [];
                dataObj.message.list.map((item) => {
                    const obj ={};
                    obj.label = item.name;
                    obj.value = item.id.toString();
                    self.crowdList.push(obj);
                });
            }).catch(err => {
                throw err;
            });
        },
        // 获取短信模板列表
        getMessageList () {
            getMessageList({path:[this.currentMall.id, this.currentShop.id]}).then((dataObj) => {
                self = this;
                self.msgList = [];
                this.initMsgList = dataObj.message.list;
                dataObj.message.list.map((item) => {
                    if(item.modelStatus=='1') {
                        const obj ={};
                        obj.label = item.modelName;
                        obj.value = item.id.toString();
                        self.msgList.push(obj);
                    }
                });
            }).catch(err => {
                throw err;
            });
        },
        setMsgCon () {
            self = this;
            this.initMsgList.map((item) => {
                if(item.id==self.ruleForm.templateId) {
                    self.msgContent = item.modelContent;
                }
            });
        },
        format (time, format) {
            const t = new Date(time);
            const tf = function (i) {return (i < 10 ? '0' : '') + i;};
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch(a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
                }
            });
        }
    }
};
</script>

<style>
.adPlanform {
    & .plus{
        display: inline-block;
        width: 30px;
        font-size: 20px;
        font-weight: bold;
        vertical-align: top;
        text-align: center;
        position: relative;
        top: 3px;
        cursor: pointer;
    }
    .el-date-editor.el-input{
        width: 178px;
    }
}
.noLink .el-picker-panel__link-btn{
    display: none;
}
.el-message-box__message {
    padding: 0;
    text-align: left;
}
</style>
