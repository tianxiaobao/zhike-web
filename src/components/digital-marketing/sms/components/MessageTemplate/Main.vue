<template>
        <div class="content">
            <table-container>
                <div slot="header" class="operation-panel">
                    <el-button type="primary" @click="onCreate" v-if="hasAuth[0]">创建模板</el-button>
                </div>
                <div v-if="hasAuth[1]">
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="id" label="编号" min-width="80">
                        </el-table-column>
                        <el-table-column prop="modelName" label="模板名称" min-width="150" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="创建时间" min-width="150">
                            <template scope="scope">
                                {{ scope.row.createDate | time }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="useTime" label="使用次数" min-width="100">
                        </el-table-column>
                        <el-table-column label="状态" min-width="100">
                            <template scope="scope">
                                <div :style="getStatusStyle(scope.row.modelStatus)">
                                    {{ scope.row.modelStatus | status }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="approvalSug" label="审批人意见" min-width="200" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="操作" min-width="150">
                            <template scope="scope">
                                <el-button @click="onView(scope.row)" type="link" v-if="hasAuth[2]">
                                    预览
                                </el-button>
                                <el-button v-if="scope.row.modelStatus == 2" @click="onAppeal(scope.row)" type="link">
                                    申诉
                                </el-button>
                                <el-button @click="onDelete(scope.row)" type="link" v-if="hasAuth[3]">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="footer">
                    <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="pageSizeConfig" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="data.length" v-show="data.length">
                    </el-pagination>
                </div>
            </table-container>
            <dialog-create :visible="createVisible" @close="onCreateClose"></dialog-create>
            <dialog-preview ref="preview" :visible="previewVisible" @close="onPreviewClose"></dialog-preview>
            <dialog-appeal ref="appeal" :visible="appealVisible" @close="onAppealClose"></dialog-appeal>
        </div> 
</template>

<script>
import TableContainer from '@/components/common/TableContainer';
import DialogPreview from './DialogPreview';
import DialogCreate from './DialogCreate';
import DialogAppeal from './DialogAppeal';

import { mapGetters } from 'vuex';
import { timeFormatter } from '@/utils';
import { getMessageList, deleteMessage } from '@/apis/shortMessage';
import * as ahthTypes from '@/pages/index/auth_types.js';

const pageSizeConfig = [10, 30, 50];

const statusMap = {
    '0': {
        text: '待审批',
        color: '#fab418'
    },
    '1': {
        text: '通过',
        color: '#51d2b7'
    },
    '2': {
        text: '驳回',
        color: '#e15a5f'
    },
    '3': {
        text: '待审批',
        color: '#fab418'
    }
};

export default {
    components: {
        TableContainer,
        DialogPreview,
        DialogCreate,
        DialogAppeal
    },
    filters: {
        time (val) {
            return timeFormatter(val);
        },
        status (val) {
            return (statusMap[val] && statusMap[val].text) || '未知';
        }
    },
    data () {
        return {
            currentPage: 1,
            pageSize: pageSizeConfig[0],
            pageSizeConfig: pageSizeConfig,
            data: [],
            previewVisible: false,
            createVisible: false,
            appealVisible: false
        };
    },
    computed: {
        ...mapGetters([
            'currentMall', 'currentShop', 'authsButton'
        ]),
        currentMallShopIds () {
            if(!this.currentMall || !this.currentShop) {
                return null;
            }
            return `${this.currentMall.id},${this.currentShop.id}`;
        },
        tableData () {
            const pageSize = this.pageSize;
            const currentPage = this.currentPage;
            const l = (currentPage - 1) * pageSize;
            const r = l + pageSize;
            return this.data.slice(l, r);
        },
        hasAuth () {
            const authArr = [];
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSTEMPLATETADD)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSTEMPLATELIST)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSTEMPLATEVIEW)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSTEMPLATEDELETE)>=0);
            return authArr;
        }
    },
    watch: {
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.init();
                if(val) {
                    this.getData();
                }
            }
        }
    },
    methods: {
        init () {
            this.data = [];
            this.currentPage = 1;
        },
        getData () {
            getMessageList({
                path: [this.currentMall.id, this.currentShop.id]
            }).then(data => {
                this.data = data.message.list;
            }).catch(err => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取短信模板列表失败:' + err.message
                    });
                }
            });
        },
        getStatusStyle (val) {
            return {
                color: (statusMap[val] && statusMap[val].color) || 'red'
            };
        },
        onCreate () {
            this.createVisible = true;
        },
        onView (item) {
            this.$refs.preview && this.$refs.preview.$emit('set', item.modelContent);
            this.previewVisible = true;
        },
        onAppeal (item) {
            this.$refs.appeal && this.$refs.appeal.$emit('set', item);
            this.appealVisible = true;
        },
        onDelete (item) {
            this.$confirm('确认删除此短信模板？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                deleteMessage({
                    path: [this.currentMall.id, this.currentShop.id],
                    params: {
                        shortMessageId: item.id
                    }
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.init();
                    this.getData();
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '删除失败: ' + err.message
                    });
                });
            });
        },
        onPreviewClose () {
            this.previewVisible = false;
        },
        onCreateClose (refresh) {
            if(refresh) {
                this.init();
                this.getData();
            }
            this.createVisible = false;
        },
        onAppealClose (refresh) {
            if(refresh) {
                this.init();
                this.getData();
            }
            this.appealVisible = false;
        },
        onCurrentChange (pageNo) {
            this.currentPage = pageNo;
        },
        onSizeChange (pageSize) {
            this.currentPage = 1;
            this.pageSize = pageSize;
        }
    }
};
</script>

<style lang="scss" scoped>
.content .operation-panel {
    padding: 10px 20px;
}
</style>
