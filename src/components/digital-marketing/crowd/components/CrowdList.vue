<template>
<div class="crowd-list">
    <div class="tip-info">
        <el-alert
            title="注：人群包上传成功之后两个小时（上传完成时间之后两小时）可以用于DSP投放"
            type="success">
        </el-alert>
    </div>
    <table-container>
        <div slot="header" class="operation-panel">
            <el-form :inline="true" class="option-panel" @submit.prevent>
                <el-form-item label="人群包名称:">
                    <el-input v-model="search" icon="search" @change="onInputChange" :maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="创建时间:">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        :picker-options="dateOptions"
                        @change="initData">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="人群包类型:">
                    <el-select v-model="source" @change="initData" @input="onSourceInput">
                        <el-option v-for="option in sourceOptions" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createPackage" v-if="hasAuth[0]">创建人群包</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" stripe>
            <el-table-column prop="id" label="编号" :min-width="80">
            </el-table-column>
            <el-table-column prop="name" label="人群名称" :show-overflow-tooltip="true" :min-width="120">
            </el-table-column>
            <el-table-column prop="description" label="人群描述" :show-overflow-tooltip="true" :min-width="150">
            </el-table-column>
            <el-table-column label="创建时间" :show-overflow-tooltip="true" :min-width="180">
                <template scope="scope">
                    {{ scope.row.createTime | time }}
                </template>
            </el-table-column>
            <el-table-column prop="userCount" label="人群数量" :show-overflow-tooltip="true" :min-width="100">
            </el-table-column>
            <el-table-column label="进度" :min-width="100">
                 <template scope="scope">
                    <span v-if="!scope.row.operation.showResultMessage">
                        {{ scope.row.statusDetail.label }}
                    </span>
                    <el-tooltip v-else placement="top" :content="scope.row.resultMessage">
                        <span>{{ scope.row.statusDetail.label }}</span>
                    </el-tooltip>
                 </template>
            </el-table-column>
            <el-table-column label="操作" :min-width="240">
                <template scope="scope">
                    <el-button type="link" v-if="scope.row.operation.dps&&hasAuth[1]" @click="toDsp">
                        DSP投放
                    </el-button>
                    <template v-if="scope.row.operation.sms&&hasAuth[2]">
                        <el-button type="link" v-if="scope.row.canSms" @click="toSms">
                            短信投放
                        </el-button>
                        <el-tooltip v-else placement="top" content="当前人群包不支持短信投放操作">
                            <span class="disable-btn">
                                <el-button type="link" :disabled="true">
                                    短信投放
                                </el-button>
                            </span>
                        </el-tooltip>
                    </template>
                    <el-button type="link" v-if="scope.row.operation.dmp&&hasAuth[3]" :loading="scope.row.isLoading" @click="upDmp(scope.row)">
                        上传到DMP
                    </el-button>
                    <el-button type="link" v-if="scope.row.operation.reUpdmp&&hasAuth[3]" :loading="scope.row.isLoading" @click="reUpDmp(scope.row)">
                        重新上传到DMP
                    </el-button>
                    <el-button type="link" @click="deletePackage(scope.row)" v-if="hasAuth[4]">
                        删除
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="人群包类型" :show-overflow-tooltip="true" :min-width="140">
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" v-show="tableData.length">
            </el-pagination>
        </div>
    </table-container>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
import TableContainer from '@/components/common/TableContainer';
import { getCrowdList, deleteUploaded, deleteUnupload ,reupload, importCrowd } from '@/apis/crowd.js';
import { dateFormatter, timeFormatter, debounce } from '@/utils';
import { DSP, SMS } from '@/pages/index/router/route_types';
import { sourceMapping } from '../config';
import * as ahthTypes from '@/pages/index/auth_types.js';
const Status = {
    CREATED: 'created',
    CREATEFAIL: 'createFail',
    UPLOADED: 'uploaded',
    UPLOADFAIL: 'uploadFail',
    CREATING: 'creating',
    UPLOADING: 'uploading'
};
const statusMapping = {
    2: {
        label: '创建成功',
        value: Status.CREATED
    },
    3: {
        label: '创建失败',
        value: Status.CREATEFAIL
    },
    9: {
        label: '上传成功',
        value: Status.UPLOADED
    },
    10: {
        label: '上传失败',
        value: Status.UPLOADFAIL
    },
    1: {
        label: '创建中',
        value: Status.CREATING
    },
    4: {
        label: '上传中',
        value: Status.UPLOADING
    }
};

const operationMapping = {
    dps: status => status === Status.UPLOADED,
    sms: status => status === Status.CREATED || status === Status.UPLOADED || status === Status.UPLOADFAIL || status === Status.UPLOADING,
    dmp: status => status === Status.CREATED,
    reUpdmp: status => status === Status.UPLOADFAIL,
    showResultMessage: status => status === Status.UPLOADFAIL || status === Status.CREATEFAIL
};
export default {
    props: ['value'],
    components: {
        TableContainer
    },
    filters: {
        time (val) {
            return timeFormatter(val);
        }
    },
    computed: {
        ...mapGetters([
            'currentMall',
            'currentShop',
            'authsButton'
        ]),
        currentMallShopIds () {
            if(!this.currentMall || !this.currentShop) {
                return null;
            }
            return `${this.currentMall.id},${this.currentShop.id}`;
        },
        hasAuth () {
            const authArr = [];
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_PACKAGEADD)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_PACKAGEDSP)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_PACKAGESMS)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_PACKAGEUPLOADDMP)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_PACKAGEDELETE)>=0);
            return authArr;
        }
    },
    // 监听mallId
    watch: {
        currentMallShopIds: {
            // immediate: true,
            // datepicker组件初始化时会触发change事件, 利用datepicker这个事件初始化, 因此不使用immediate
            handler () {
                this.initData();
            }
        }
    },
    data () {
        const sourceOptions = Object.keys(sourceMapping).map(key => ({ label: sourceMapping[key], value: key }));
        return {
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            search: '',
            dateRange: [null, null],
            source: this.value,
            sourceOptions,
            dateOptions: {
                disabledDate (time) {
                    return time.getTime() >= Date.now();
                }
            }
        };
    },
    methods: {
        // 获取数据
        init () {
            this.tableData = [];
            this.currentPage = 1;
        },
        initData () {
            this.init();
            this.getData();
        },
        getData () {
            if (!this.currentMallShopIds) return;
            let startDate = dateFormatter(this.dateRange[0]);
            if(startDate) {
                startDate += ' 00:00:00';
            }
            let endDate = dateFormatter(this.dateRange[1]);
            if(endDate) {
                endDate += ' 23:59:59';
            }
            getCrowdList({
                path: [this.currentMall.id, this.currentShop.id],
                params: {
                    search: this.search,
                    startDate,
                    endDate,
                    source: this.source === 'all' ? '' : this.source,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                }
            }).then(dataObj => {
                const { total, list } = dataObj.message.PageResult;
                this.total = total;
                list.forEach(item => {
                    item.statusDetail = statusMapping[item.status] || {
                        label: '未知',
                        value: 'unknow'
                    };
                    item.source = sourceMapping[item.source.toLowerCase()] || '未知';
                    item.canSms = item.userType === 'mobile' || item.userType === "user_log_acct";
                    const operation = {};
                    Object.keys(operationMapping).forEach(key => {
                        operation[key] = operationMapping[key](item.statusDetail.value);
                    });
                    item.operation = operation;
                    item.isLoading = false;
                });
                this.tableData = list;
            }).catch(err => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取人群包列表失败:' + err.message
                    });
                }
            });
        },
        createPackage () {
            this.$emit('changeMode');
        },
        onSourceInput (val) {
            this.$emit('input', val);
        },
        onInputChange () {
            if(!this._delayGetData) {
                this._delayGetData = debounce(() => this.initData(), 300);
            }
            this._delayGetData();
        },
        // 切换current page
        onCurrentChange (pageNo) {
            this.currentPage = pageNo;
            this.tableData = [];
            this.getData();
        },
        // 切换page size
        onSizeChange (pageSize) {
            this.currentPage = 1;
            this.pageSize = pageSize;
            this.tableData = [];
            this.getData();
        },
        // 跳转到DSP
        toDsp () {
            this.$router.push({ name: DSP });
        },
        // 跳转到短信投放
        toSms () {
            this.$router.push({ name: SMS });
        },
        // 上传
        upDmp (item) {
            item.isLoading = true;
            importCrowd ({
                path: [this.currentMall.id, this.currentShop.id],
                params: {
                    packageId: item.id
                },
                type: 'formData'
            }).then(() => {
                this.$nextTick(() => {
                    item.isLoading = false;
                });
                this.$message({
                    type: 'success',
                    message: '上传成功'
                });
                this.initData();
            }).catch((err) => {
                this.$nextTick(() => {
                    item.isLoading = false;
                });
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '上传失败:' + err.message
                    });
                }
                this.initData();
            });
        },
        // 重新上传
        reUpDmp (item) {
            item.isLoading = true;
            reupload ({
                path: [this.currentMall.id, this.currentShop.id],
                params: {
                    dmpUserPackageId: item.id
                },
                type: 'formData'
            }).then(() => {
                this.$nextTick(() => {
                    item.isLoading = false;
                });
                this.$message({
                    type: 'success',
                    message: '重新上传成功'
                });
                this.initData();
            }).catch((err) => {
                this.$nextTick(() => {
                    item.isLoading = false;
                });
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '重新上传失败:' + err.message
                    });
                }
                this.initData();
            });
        },
        // 删除人群包
        deleteUploaded (id) {
            deleteUploaded ({
                path: [this.currentMall.id],
                params: {
                    dmpPackageId: id
                },
                type: 'formData'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
                this.initData();
            }).catch((err) => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '删除失败:' + err.message
                    });
                }
                this.initData();
            });
        },
        deleteUnupload (id) {
            deleteUnupload ({
                path: [this.currentMall.id, this.currentShop.id],
                params: {
                    userPackageId: id
                },
                type: 'formData'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
                this.initData();
            }).catch((err) => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '删除失败:' + err.message
                    });
                }
                this.initData();
            });
        },
        deletePackage (item) {
            this.$confirm("确认删除？", "删除",{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                if(item.statusDetail.value === Status.UPLOADED) {
                    this.deleteUploaded(item.id);
                } else {
                    this.deleteUnupload(item.id);
                }
            });
        }
    }
};
</script>
<style scoped lang="scss">
.crowd-list {
    .operation-panel {
        padding: 10px 20px;
        .option-panel {
            .el-form-item {
                margin-bottom: 0;
            }
        }
    }
    .tip-info {
        padding: 0 0 10px 0;
    }
}
</style>
<style lang="scss">
.crowd-list .operation-panel .el-form-item .el-input__icon {
    &.el-icon-search, &.el-icon-date {
        top: 2px;
    }
}
.crowd-list {
    .el-button+.disable-btn {
        margin-left: 10px;
    }
    .disable-btn+.el-button {
        margin-left: 10px;
    }
} 
</style>
