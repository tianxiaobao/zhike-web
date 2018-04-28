<template>
    <table-container>
        <div slot="header" class="operation-panel">
            <span class="label">发送方式:</span>
            <el-select v-model="type" placeholder="请选择" @change="getData">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="label">所属类别:</span>
            <el-select v-model="tagId" placeholder="请选择" @change="getData">
                <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <el-table :data="tableData" stripe>
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
            <el-table-column prop="createTime" label="创建时间" width="120">
            </el-table-column>
            <el-table-column prop="beginTime" label="开始发送时间" width="160">
            </el-table-column>
            <el-table-column prop="endTime" label="发送完成时间" width="160">
            </el-table-column>
            <el-table-column prop="sendType" label="发送方式" width="120">
            </el-table-column>
            <el-table-column prop="status" label="发送状态" width="120">
            </el-table-column>
            <el-table-column prop="percent" label="发送占比" width="120">
            </el-table-column>
            <el-table-column prop="clickPercent" label="点击占比" width="120">
            </el-table-column>
            <el-table-column prop="userPercent" label="下单占比" width="120">
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </table-container>
</template>
<script>
import TableContainer from '../../../common/TableContainer';
import { tagList,listResult } from '@/apis/adPlan.js';
import { mapGetters } from 'vuex';
export default {
    components: {
        'table-container': TableContainer
    },
    data () {
        return {
            // 发送类型
            type:'',
            typeList:[
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: 'ONCE',
                    label: '一次性'
                }
            ],
            // 所属类别
            tagId:'',
            tagList:[
                {
                    value: '',
                    label: '全部'
                }
            ],
            // 列表数据
            tableData:[],
            currentPage: 1,
            pageSize: 10,
            total:0
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
                this.tableData = [];
                if(val) {
                    this.getData();
                    this.getTagList();
                }
            }
        }
    },
    methods: {
        // 获取列表
        getData () {
            listResult({
                path:[this.currentMall.id, this.currentShop.id],
                params:{
                    pageSize:this.pageSize,
                    pageNo:this.currentPage,
                    sendType:this.type,
                    tagId:this.tagId
                }
            }).then((dataObj) => {
                if(dataObj.status=='success') {
                    this.total = dataObj.message.PageResult.total;
                    this.tableData = dataObj.message.PageResult.list.map(function (item) {
                        item.clickPercent += '%';
                        item.userPercent += '%';
                        item.percent += '%';
                        return item;
                    });
                }
            }).catch(err => {
                throw err;
            });
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
        // 获取所属类别
        getTagList () {
            tagList({
                path:[this.currentMall.id, this.currentShop.id]
            }).then((dataObj) => {
                self = this;
                self.tagList = [{
                    value: '',
                    label: '全部'
                }];
                dataObj.message.list.map((item) => {
                    const obj ={};
                    obj.label = item.name;
                    obj.value = item.id.toString();
                    self.tagList.push(obj);
                });
            }).catch(err => {
                throw err;
            });
        }
    }
};
</script>
<style scoped>
.label{
    font-size: 14px;
    vertical-align: middle;
    padding-right: 5px;
}
</style>