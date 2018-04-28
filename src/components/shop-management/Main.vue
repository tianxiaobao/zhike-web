<template>
    <div class="shop-management">
        <title-bar title="店铺管理"></title-bar>
        <div class="content">
            <table-container>
                <div slot="header" class="operation-panel">
                    <el-button type="primary" @click="onNewShop">添加店铺</el-button>
                </div>
                <div>
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="name" label="店铺名称" min-width="200" class-name="show-overflow">
                        </el-table-column>
                        <el-table-column label="行业" min-width="180">
                            <template scope="scope">
                                {{ scope.row.industry | industry }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="categoryName" label="店铺品类" min-width="180"></el-table-column>
                        <el-table-column prop="incharge" label="负责人" min-width="150">
                        </el-table-column>
                        <el-table-column prop="contact" label="联系方式" min-width="200">
                        </el-table-column>
                        <el-table-column label="操作" min-width="180">
                            <template scope="scope">
                                <el-button type="link" @click="onEdit(scope.row)">编辑</el-button>
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
        <shop-form ref="form" :visible="dialogFormVisible" :edit="dialogFormEdit" :categoryList="categoryList" @submit="onSubmit" @cancel="onCancel"></shop-form>
    </div>
</template>

<script>

import TitleBar from '../common/TitleBar';
import TableContainer from '../common/TableContainer';

import ShopForm from './ShopForm';

import { getShopList, deleteShop, updateShop, createShop } from '@/apis/promotion';
import { getCategoryList } from '@/apis/category';
import AjaxClient from '@/utils/ajaxClient.js';

import { industryConfig } from '../config';
import { mapGetters } from 'vuex';

const pageSizeConfig = [10, 30, 50];

export default {
    components: {
        'title-bar': TitleBar,
        'table-container': TableContainer,
        'shop-form': ShopForm
    },
    filters: {
        industry (val) {
            return industryConfig[val] || '';
        }
    },
    beforeDestroy () {
        this.token && this.token.cancel();
    },
    data () {
        return {
            dialogFormVisible: false,
            dialogFormEdit: false,
            currentPage: 1,
            pageSize: pageSizeConfig[0],
            pageSizeConfig: pageSizeConfig,
            data: [],
            categoryList: [],
            token: null
        };
    },
    computed: {
        ...mapGetters(['currentMall']),
        tableData () {
            const pageSize = this.pageSize;
            const currentPage = this.currentPage;
            const l = (currentPage - 1) * pageSize;
            const r = l + pageSize;
            return this.data.slice(l, r).map(row => {
                row.categoryName = this.id2Category(row.categoryId);
                return row;
            });
        }
    },
    methods: {
        queryData () {
            this.token = AjaxClient.createCancleToken();
            const promiseList = [
                getShopList({
                    path:[this.currentMall.id],
                    cancelToken: this.token
                }), getCategoryList({
                    cancelToken: this.token
                })];
            Promise.all(promiseList).then(dataObjs => {
                this.token = null;
                this.categoryList = dataObjs[1].message.list;
                this.data = dataObjs[0].message.list;
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
        id2Category (val) {
            const target = this.categoryList.find(category => {
                return category.id === val;
            });
            return (target? target.name: '');
        },
        onNewShop () {
            this.$refs.form.$emit('init');
            this.dialogFormEdit = false;
            this.dialogFormVisible = true;
        },
        onDelete (row) {
            this.$confirm(`确认删除店铺：${row.name}？`, '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                deleteShop({
                    path: [row.id]
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
        onEdit (row) {
            // console.log(row);
            this.$refs.form.$emit('set', row);
            this.dialogFormEdit = true;
            this.dialogFormVisible = true;
        },
        onSubmit (form) {
            // console.log(form);
            const req = {
                name: form.name,
                industry: form.industry,
                incharge: form.incharge,
                contact: form.contact,
                categoryId: form.categoryId
            };
            if (this.dialogFormEdit) {
                req.id = form.id;
                updateShop({
                    params: req
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '修改店铺成功!'
                    });
                    this.dialogFormVisible = false;
                    this.queryData();
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '操作失败: ' + err.message
                    });
                });
            } else {
                createShop({
                    path: [this.currentMall.id],
                    params: req
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '新增店铺成功!'
                    });
                    this.dialogFormVisible = false;
                    this.queryData();
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '操作失败: ' + err.message
                    });
                });
            }
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
    },
    watch: {
        currentMall:{
            immediate: true,
            handler (val) {
                this.token && this.token.cancel();
                if(val) {
                    this.queryData();
                }
            }
        }
    }
};
</script>
<style>
.shop-management {
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
