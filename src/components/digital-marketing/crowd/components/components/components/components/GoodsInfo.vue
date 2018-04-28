<template>
    <table-container class="sku-search">
        <div slot="header" class="header">
            <el-form :inline="true" class="option-panel" @submit.native.prevent>
                <el-form-item label="输入商品SKU号定位品牌、品类:">
                    <el-input v-model="sku" :maxlength="20" placeholder="请输入SKU" @keyup.enter.native="submit">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit" :disabled="!sku" :loading="loading">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
        :data="tableData"
        style="width: 100%" border>
        <el-table-column
            prop="sku"
            label="SKU"
            min-width="150">
        </el-table-column>
        <el-table-column label="主品类">
            <el-table-column
                prop="firstClass"
                label="一级品类"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="secondClass"
                label="二级品类"
                min-width="100">
            </el-table-column>
        </el-table-column>
        <el-table-column label="次品类">
            <el-table-column
                prop="thirdClass"
                label="三级品类"
                min-width="120">
            </el-table-column>
        </el-table-column>
        <el-table-column
            prop="brandName"
            label="品牌"
            min-width="180">
        </el-table-column>
        </el-table>
    </table-container>
</template>

<script>
import TableContainer from '@/components/common/TableContainer';
import { getBySku } from '@/apis/filter.js';
export default {
    components: {
        TableContainer
    },
    data () {
        return {
            sku: '',
            loading: false,
            tableData: []
        };
    },
    methods: {
        submit () {
            if(!this.sku) {
                return;
            }
            this.loading = true;
            this.tableData = [];
            getBySku({
                params: {
                    skuCode: this.sku
                }
            }).then(data => {
                this.tableData = [data.message.ClassBrand];
                this.$nextTick(() => this.loading = false);
            }).catch(err => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '查询商品失败' + err.message
                    });
                }
                this.$nextTick(() => this.loading = false);
            });
        }
    }
};
</script>

<style lang="scss">
.sku-search.table-container {
    min-width: 660px;
    .header .option-panel {
        padding: 10px 20px;
        .el-form-item {
            margin-bottom: 0;
        }
    }
    .t-footer {
        display: none;
    }
}
</style>
