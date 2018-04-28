<template>
    <el-dialog
    title="画像人群包导入"
    :visible.sync="visible"
    size = "large"
    :before-close="handleClose">
        <el-alert
            title="注：这部分只显示创建进度为“已完成”的人群包"
            type="success"
            class="tip-info">
        </el-alert>
        <el-table
            ref="multipleTable"
            :data="list"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="编号" width="120"></el-table-column>
            <el-table-column prop="name" label="人群名称" width="120"></el-table-column>
            <el-table-column prop="description" label="人群描述"></el-table-column>
            <el-table-column
                label="创建时间"
                width="120">
                <template scope="scope">
                    {{ scope.row.createTime | time }}
                </template>
            </el-table-column>
            <el-table-column prop="userCount" label="人群数量" width="120"></el-table-column>
            <el-table-column
                label="创建进度"
                width="120">
                <template scope="scope">
                    <span>已完成</span>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="success" @click="onSubmit()" :disabled="!this.packageIds" :loading="submitting">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import { importCrowd } from '@/apis/crowd.js';
export default {
    props: ['list','visible'],
    computed: {
        ...mapGetters(['currentMall'])
    },
    filters: {
        time (val) {
            if(!val)
                return '';
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
    data () {
        return {
            packageIds: undefined,
            multipleSelection: [],
            submitting: false
        };
    },
    methods: {
        // 关闭操作
        handleClose () {
            this.onCancel();
        },
        // 取消操作
        onCancel () {
            this.$emit('cancel');
        },
        // 提交表单
        onSubmit () {
            if(!this.packageIds) {
                return;
            }
            this.submitting = true;
            importCrowd ({
                path: [this.currentMall.id],
                params: {
                    packageIds: this.packageIds
                }
            }).then(() => {
                this.$nextTick(() => this.submitting = false);
                this.$emit('submit');
            }).catch(err => {
                this.$nextTick(() => this.submitting = false);
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '导入失败: ' + err.message
                    });
                }
            });
        },
        // 处理多选
        handleSelectionChange (val) {
            const multipleSelection = [];
            val.forEach((value) => {
                value.id && multipleSelection.push(value.id);
            });
            this.packageIds = multipleSelection.join(",");
        }
    }
};
</script>
<style scoped>
.tip-info {
    margin-bottom:10px;
}
</style>