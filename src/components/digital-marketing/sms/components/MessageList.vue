<template>
<div class="content">
    <table-container>
    	<div slot="header" class="operation-panel">
            <el-button type="primary" v-if="hasAuth[0]" @click="creat">创建任务</el-button>
            <el-tooltip effect="dark" content="此功能无权限使用" placement="top" v-else>
                <span><el-button type="primary" v-if="!hasAuth[0]">创建任务</el-button></span>
            </el-tooltip>
        </div>
        <el-table :data="tableData" stripe v-if="hasAuth[3]">
        	<el-table-column prop="id" label="编号">
            </el-table-column>
            <el-table-column prop="title" label="短信名称" min-width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="desc" label="描述" min-width="150" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="tag" label="所属类别" min-width="120">
            </el-table-column>
            <el-table-column prop="content" label="短信内容" min-width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160" sortable>
            </el-table-column>
            <el-table-column prop="beginTime" label="开始发送时间" width="160">
            </el-table-column>
            <el-table-column prop="endTime" label="发送完成时间" width="160">
            </el-table-column>
            <el-table-column prop="sendType" label="发送类型" min-width="120">
            </el-table-column>
            <el-table-column prop="percent" label="发送占比" min-width="120">
            </el-table-column>
            <el-table-column prop="status" label="执行状态" min-width="120" sortable>
            </el-table-column>
            <el-table-column label="可执行操作" min-width="160">
                <template scope="scope">
                    <el-button type="link" @click="stop(scope.row.id)" v-if="scope.row.status=='执行中'&& hasAuth[1]||scope.row.status=='未执行'&& hasAuth[1]">取消</el-button>
                    <el-button type="link" @click="edit(scope.row.id)" v-if="scope.row.status=='已取消'&& hasAuth[2]">重新发送</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" v-if="hasAuth[3]">
            <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </table-container>
    <message-form ref="form" :visible="dialogFormVisible" @submit="onSubmit" @cancel="onCancel" :editInfo='editInfo'></message-form>
</div>
</template>
<script>
import TableContainer from '../../../common/TableContainer';
import { adPlanList,adPlanStop,getAdPlan } from '@/apis/adPlan.js';
import MessageForm from './MessageForm';
import * as ahthTypes from '@/pages/index/auth_types.js';
import { mapGetters } from 'vuex';
export default {
    components: {
        'table-container': TableContainer,
        'message-form': MessageForm
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
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSPLANADD)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSPLANCANCEL)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSPLANRESEND)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSPLANLIST)>=0);
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
    data () {
        return {
            tableData:[],
            currentPage: 1,
            pageSize: 10,
            total:0,
            dialogFormVisible:false,
            editInfo:{
                flag:false,
                id:''
            }
        };
    },
    methods: {
        // 获取任务列表
        getData () {
            adPlanList({
                path:[this.currentMall.id, this.currentShop.id],
                params:{
                    pageSize:this.pageSize,
                    pageNo:this.currentPage
                }
            }).then(dataObj => {
                if(dataObj.status == 'success') {
                    this.total = dataObj.message.PageResult.total;
                    this.tableData = dataObj.message.PageResult.list.map(function (item) {
                        item.percent += '%';
                        return item;
                    });
                }
            }).catch(err => {
                throw err;
            });
        },
        // 分页
        onCurrentChange (pageNo) {
            this.currentPage = pageNo;
            this.getData();
        },
        onSizeChange (pageSize) {
            this.currentPage = 1;
            this.pageSize = pageSize;
            this.getData();
        },
        // 创建任务
        creat () {
            this.editInfo.flag = false;
            this.dialogFormVisible = true;
        },
        // 取消任务
        onCancel () {
            this.$refs.form.$emit('init');
            this.dialogFormVisible = false;
        },
        // 提交任务
        onSubmit () {
            this.$refs.form.$emit('init');
            this.dialogFormVisible = false;
            this.getData();
        },
        // 取消操作
        stop (id) {
            adPlanStop({
                path: [this.currentMall.id, this.currentShop.id, id]
            }).then(() => {
                this.getData();
            }).catch(err => {
                throw err;
            });
        },
        // 重新发送
        edit (id) {
            getAdPlan({
                path: [this.currentMall.id, this.currentShop.id, id]
            }).then((dataObj) => {
                if(dataObj.status=='success') {
                    this.$refs.form.$emit('set',dataObj.message.AdPlan);
                    this.editInfo ={
                        flag:true,
                        id:id
                    };
                    this.dialogFormVisible = true;
                }
            }).catch(err => {
                throw err;
            });
        }
    }
};
</script>
<style>
.sms {
    & .operation-panel {
        padding: 10px 20px;
    }
}
</style>