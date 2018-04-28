<template>
    <div>
        <div class="content persona—crowd">
            <div class="tip-info">
                <el-alert
                    title=""
                    type="success">
                    <span>注：创建画像人群需要在画像功能的“多级筛选”功能模块中完成；可将“创建进度”为已完成状态的画像人群包导入数字营销/人群包管理模块中，用于后续投放之用。具体的导入操作请前往
                        <router-link :to="{ name: this.crowdManagementRoute }">数字营销/人群包管理</router-link>
                    模块中！</span>
                </el-alert>
            </div>
            <table-container>
                <div>
                    <el-table :data="pageData" stripe>
                        <el-table-column prop="id" label="编号" min-width="80">
                        </el-table-column>
                        <el-table-column prop="name" label="人群名称" min-width="150" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="description" label="人群描述" min-width="150" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="userCount" label="人群数量" min-width="130">
                        </el-table-column>
                        <el-table-column prop="source" label="来源" min-width="150">
                        </el-table-column>
                        <el-table-column label="创建时间" min-width="180">
                            <template scope="scope">
                                {{ scope.row.createTime | time }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="创建进度" min-width="150">
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="footer">
                    <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" v-show="tableData.length">
                    </el-pagination>
                </div>
            </table-container>
        </div>
    </div>
</template>
<script>
import TableContainer from '@/components/common/TableContainer';
import { getCrowdList } from '@/apis/crowd.js';
import * as types from '@/pages/index/router/route_types';

import { mapGetters } from 'vuex';

const sourceMap = {
    customer: '客流人群包',
    member: '会员人群包',
    customize: '定制人群包',
    'JD': '京东标签人群包'
};

export default {
    components: {
        'table-container': TableContainer
    },
    data () {
        return {
            tableData: [],
            crowdManagementRoute: types.CROWD_MANAGE,
            currentPage: 1,
            pageSize: 10
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
        ...mapGetters([
            'currentMall',
            'currentShop'
        ]),
        currentMallShopIds () {
            if(!this.currentMall || !this.currentShop) {
                return null;
            }
            return `${this.currentMall.id},${this.currentShop.id}`;
        },
        pageData () {
            const pageSize = this.pageSize;
            const currentPage = this.currentPage;
            const l = (currentPage - 1) * pageSize;
            const r = l + pageSize;
            return this.tableData.slice(l, r);
        }
    },
    watch: {
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

        onCurrentChange (pageNo) {
            this.currentPage = pageNo;
        },
        onSizeChange (pageSize) {
            this.currentPage = 1;
            this.pageSize = pageSize;
        },
        // 获取数据
        getData () {
            getCrowdList({path: [this.currentMall.id]}).then(dataObj => {
                if(dataObj.status == 'success') {
                    this.tableData = dataObj.message.list.map(function (item) {
                        if (item.status=='1') {
                            item.status = '创建中';
                        } else if (item.status=='3') {
                            item.status = '创建失败';
                        } else {
                            item.status = '已完成';
                        }
                        item.source = sourceMap[item.source] || '未知';
                        return item;
                    });
                }
            }).catch(err => {
                throw err;
            });
        }
    }
};
</script>
<style scoped lang="scss">
.content.persona—crowd {
    padding: 20px;
}
.tip-info {
    padding: 0 0 10px 0;
    span {
        font-size: 13px;
        line-height: 18px;
    }
}
</style>
<style>
.content.persona—crowd .t-header{
    display: none;
}
</style>
