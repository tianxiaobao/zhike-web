<template>
    <div class="district">
        <div class="content">
            <table-container>
                <div slot="header" class="operation-panel">
                    <el-button type="primary" @click="onNewRequest">新增查询</el-button>
                </div>
                <div>
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="address" label="商圈地址" min-width="220" class-name="show-overflow">
                        </el-table-column>
                        <el-table-column label="商圈半径" min-width="130">
                            <template scope="scope">
                                {{ scope.row.radius | radius }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="keyword" label="竞争对手关键字" min-width="150" class-name="show-overflow">
                        </el-table-column>
                        <el-table-column label="创建时间" min-width="190">
                            <template scope="scope">
                                {{ scope.row.time | time }}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" min-width="130">
                            <template scope="scope">
                                <div :style="statusConfig[scope.row.status].style">
                                    {{ scope.row.status | requestStatus }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="130">
                            <template scope="scope">
                                <el-button @click="onView(scope.row)" type="link" :disabled="!statusConfig[scope.row.status].viewable">
                                    查看报告
                                </el-button>
                                <el-button type="link" @click="onDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="footer">
                    <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page="currentPage" :page-sizes="pageSizeConfig" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="data.length" v-show="data.length">
                    </el-pagination>
                </div>
            </table-container>
        </div>
        <request-form ref="form" :visible="dialogFormVisible" @submit="onSubmit" @cancel="onCancel"></request-form>
    </div>
</template>

<script>
import TableContainer from '../common/TableContainer';

import RequestForm from './RequestForm';

import { getRegionAnalysisList, deleteRegionAnalysis, createRegionAnalysis } from '@/apis/regionAnalysis';
import AjaxClient from '@/utils/ajaxClient.js';

import location from 'china-location/dist/location.json';
import * as types from '@/pages/index/router/route_types';

const statusConfig = {
    'done': {
        text: '已生成',
        style: {
            color: 'rgb(95, 210, 181)'
        },
        viewable: true
    },
    'doing': {
        text: '报告生成中...',
        style: {
            color: 'rgb(181, 106, 216)'
        },
        viewable: false
    },
    'notstart': {
        text: '分析准备中...',
        style: {
            color: '#fed74c'
        },
        viewable: false
    }
};
const pageSizeConfig = [10, 30, 50];

export default {
    components: {
        'table-container': TableContainer,
        'request-form': RequestForm
    },
    filters: {
        requestStatus (val) {
            return statusConfig[val].text;
        },
        radius (val) {
            return val + '公里';
        },
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
    created () {
        this.queryData();
    },
    beforeDestroy () {
        this.token && this.token.cancel();
    },
    data () {
        return {
            statusConfig: statusConfig,
            dialogFormVisible: false,
            currentPage: 1,
            pageSize: pageSizeConfig[0],
            pageSizeConfig: pageSizeConfig,
            data: [],
            token: null
        };
    },
    computed: {
        tableData () {
            const pageSize = this.pageSize;
            const currentPage = this.currentPage;
            const l = (currentPage - 1) * pageSize;
            const r = l + pageSize;
            return this.data.slice(l, r);
        }
    },
    methods: {
        adaptData (list) {
            return list.map(item => {
                const key = item.id;
                const radius = item.radius;
                const time = item.dtCreate;
                const status = item.status;
                const keyword = item.keyword;

                const province = location[item.province];
                const city = province && province.cities[item.city];
                const district = city && city.districts[item.district];

                const addressList = [city && city.name || '', district || '', item.address || ''];

                if (item.province !== item.city) {
                    addressList.unshift(province.name);
                };

                const address = addressList.join('');
                return {
                    key,
                    address,
                    radius,
                    keyword,
                    time,
                    status
                };
            });
        },
        queryData () {
            this.token = AjaxClient.createCancleToken();
            getRegionAnalysisList({
                cancelToken: this.token
            }).then(dataObj => {
                this.token = null;
                this.data = this.adaptData(dataObj.message.list);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取数据失败: ' + err.message
                    });
                }
            });
        },
        onNewRequest () {
            this.$refs.form.$emit('init');
            this.dialogFormVisible = true;
        },
        onDelete (row) {
            this.$confirm('确认删除此商圈分析？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                deleteRegionAnalysis({
                    path: [row.key]
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryData();
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '操作失败: ' + err.message
                    });
                });
            });
        },
        onView (row) {
            // console.log(row);
            const regionCode = `${row.key},${row.address || ''}`;
            const param = escape(regionCode).replace(/%/g, '-');
            this.$router.push({ name: types.BUSINESS_AREA_ANALYSIS_REPORT, params: { region: param } });
        },
        onSubmit (form) {
            // console.log(form);
            createRegionAnalysis({
                params: {
                    province: form.selectedOptions[0],
                    city: form.selectedOptions[1],
                    district: form.selectedOptions[2],
                    address: form.address,
                    radius: form.radius,
                    keyword: form.keyword.join(',')
                }
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '新增查询成功!'
                });
                this.dialogFormVisible = false;
                this.queryData();
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: '操作失败: ' + err.message
                });
            });
        },
        onCancel () {
            this.dialogFormVisible = false;
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
<style>
.district {
    min-width: 1130px;
    & .content {
        padding: 20px;
    }
    & td.show-overflow .cell {
        white-space: nowrap;
        min-width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    & td.show-overflow:hover .cell {
        display: inline-block;
        overflow: visible;
        position: relative;
        z-index: 10;
        background-color: #f9f8e8;
        transition: background-color .25s ease;
    }
    & .operation-panel {
        padding: 10px 20px;
    }
    & .el-pagination {
        border-width: 0;
        background-color: transparent;
    }
}
</style>
