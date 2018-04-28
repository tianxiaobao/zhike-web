<template>
<div class="userDefined">
    <table-container>
        <div slot="header" class="operation-panel" v-if="hasAuth[0]">
            <el-button type="primary" @click="onUpload" >添加定制画像</el-button>
        </div>
        <el-table :data="tableData" stripe v-if="hasAuth[2]">
            <el-table-column prop="id" label="编号" width="70">
            </el-table-column>
            <el-table-column prop="title" label="人群名称">
            </el-table-column>
            <el-table-column prop="description" label="人群描述" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="count" label="人群数量">
            </el-table-column>
            <el-table-column prop="userType" label="用户类型">
            </el-table-column>
            <el-table-column prop="percent" label="命中率">
            </el-table-column>
            <el-table-column prop="dtCreate" label="创建时间" min-width="180">
                <template scope="scope">
                    {{ scope.row.dtCreate | time }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="创建进度">
            </el-table-column>
            <el-table-column label="操作" min-width="130">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="此功能无权限使用" placement="top" v-if="!hasAuth[1]">
                        <el-button type="link" class="not-allow">查看</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="scope.row.reason" placement="top" v-else-if="!scope.row.canProfile">
                        <el-button type="link" class="not-allow">查看</el-button>
                    </el-tooltip>
                    <el-button @click="onView(scope.row)" type="link" v-else>查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" v-if="hasAuth[2]">
            <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </table-container>
    <!-- 弹出框开始 -->
    <el-dialog title="人群上传" :visible.sync="visible" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" v-loading="loading" element-loading-text="正在上传中，请稍后……
">
            <el-form-item label="人群名称" prop="title">
                <el-input v-model="ruleForm.title" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="人群描述" prop="description">
                <el-input v-model="ruleForm.description" :maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
                <el-radio-group v-model="ruleForm.userType">
                    <div class="type-group">
                        <el-radio label="mobile"></el-radio>
                        <el-radio label="mac"></el-radio>
                        <el-radio label="idfa"></el-radio>
                        <el-radio label="imei"></el-radio>
                    </div>
                    <div class="type-group">
                        <el-radio label="md5_mobile"></el-radio>
                        <el-radio label="md5_mac"></el-radio>
                        <el-radio label="md5_idfa"></el-radio>
                        <el-radio label="md5_imei"></el-radio>
                    </div>
                    <div class="type-tips">
                        支持32位MD5加密格式文件
                    </div>
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
        <div slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="success" @click="onSubmit('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 弹出框结束 -->
</div>
</template>
<script>
import TableContainer from '@/components/common/TableContainer';
import {getUploadList,CustomizeUpload} from '@/apis/customerProfile';
import { recordLog } from '@/apis/log.js';
import * as types from '@/pages/index/router/route_types.js';
import * as ahthTypes from '@/pages/index/auth_types.js';
import { mapGetters } from 'vuex';
export default {
    components: {
        'table-container': TableContainer
    },
    data () {
        const fileValidator = (rule, value, callback) => {
            if (!value['name']) {
                callback(new Error('请添加文件'));
            } else {
                callback();
            }
        };
        return {
            tableData:[],
            currentPage: 1,
            pageSize: 10,
            total:0,
            visible:false,
            loading:false,
            fileList:[],
            ruleForm: {
                title:'',
                description:'',
                userType:'',
                file:''
            },
            rules: {
                title: [
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
    filters: {
        time (val) {
            const date = new Date(val);
            const Y = date.getFullYear();
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return `${Y}-${M}-${D} ${h}:${m}:${s}`;
        }
    },
    computed: {
        ...mapGetters(['currentMall', 'currentShop', 'authsButton']),
        currentMallShopIds () {
            if(!this.currentMall || !this.currentShop) {
                return null;
            }
            return `${this.currentMall.id},${this.currentShop.id}`;
        },
        hasAuth () {
            const authArr = [];
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_CUSTOMIZEPROFILEADD)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_CUSTOMIZEPROFILEVIEW)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_CUSTOMIZEPROFILELIST)>=0);
            return authArr;
        }
    },
    // 监听mallId
    watch:{
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.tableData = [];
                if(val) {
                    this.getData();
                }
            }
        }
    },
    methods: {
        // 获取数据列表
        getData () {
            getUploadList({
                path:[this.currentMall.id, this.currentShop.id],
                params: {
                    pageSize:this.pageSize,
                    pageNo:this.currentPage
                }
            }).then((dataObj) => {
                if(dataObj.status='success') {
                    this.total = dataObj.message.PageResult.total;
                    this.tableData = dataObj.message.PageResult.list.map(function (item) {
                        if (item.status=='0') {
                            item.status = '成功';
                        } else if (item.status=='1') {
                            item.status = '失败';
                        } else {
                            item.status = '计算中';
                        }
                        return item;
                    });
                }
            }).catch(err => {
                throw err;
            });
        },
        // 文件上传
        onUpload () {
            this.visible = true;
        },
        onFileChange (file,fileList) {
            this.ruleForm.file = file.raw;
            if(fileList.length>1) {
                this.fileList = fileList.slice(fileList.length-1);
            }else{
                this.fileList =fileList;
            }
            this.$refs.fileFormItem.$emit('el.form.change');
        },
        onFileRemove () {
            this.ruleForm.file = '';
        },
        handleClose () {
            this.onCancel();
        },
        onCancel () {
            this.visible = false;
            this.fileList=[];
            this.resetForm();
        },
        // 提交
        onSubmit () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loading=true;
                    const params = new FormData();
                    params.append("title", this.ruleForm.title);
                    params.append("description", this.ruleForm.description);
                    params.append("file", this.ruleForm.file);
                    params.append("userType", this.ruleForm.userType);
                    CustomizeUpload({
                        path:[this.$store.getters.currentMall.id, this.$store.getters.currentShop.id],
                        params,
                        type:'form'
                    }).then(() => {
                        this.loading=false;
                        this.onCancel();
                        this.getData();
                    }).catch(err => {
                        this.loading=false;
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
        resetForm () {
            this.$refs['ruleForm'].resetFields();
        },
        onCurrentChange (pageNo) {
            this.currentPage = pageNo;
            this.getData();
        },
        onSizeChange (pageSize) {
            this.currentPage = 1;
            this.pageSize = pageSize;
            this.getData();
        },
        // 查看
        onView (row) {
            // 记录日志
            recordLog({
                params: {
                    operation: '浏览定制画像',
                    module: 'CUSTOMIZE_PROFILE',
                    desc: 'mallId:'+this.currentMall.id+',shopId:'+this.currentShop.id+',id:'+row.id
                }
            }).then(() => {
            });
            this.$router.push({name:types.CUSTOM_PERSONA_DETAIL,params:{taskId:row.id}});
        }
    }
};
</script>
<style lang="scss" scoped>
.userDefined {
    padding: 20px;
    .operation-panel {
        padding: 10px 20px;
    }
    .not-allow{
        color: #bfcbd9;
        cursor: not-allowed;
    }
    .type-group:not(:last-of-type) {
        display: flex;
        line-height: 35px;
    }
    .type-tips {
        font-size: 12px;
        color: #83a5a2;
        &::before {
            content: '*';
            color: red;
        }
    }
}
</style>
<style lang="scss">
.userDefined .type-group .el-radio {
    flex-grow: 1
}
</style>
