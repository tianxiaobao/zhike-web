<template>
    <el-dialog class="dialog" :title="title" :visible.sync="visible" :before-close="handleClose">
        <el-form :model="form" class="form">
            <el-form-item label="店铺名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="行业" :label-width="formLabelWidth">
                <el-select v-model="form.industry" placeholder="请选择行业" class="select">
                    <el-option v-for="industry in industryOptions" :key="industry.value" :label="industry.label" :value="industry.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺品类" :label-width="formLabelWidth">
                <el-select v-model="form.categoryId" filterable placeholder="请选择店铺品类" class="select">
                    <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="责任人" :label-width="formLabelWidth">
                <el-input v-model="form.incharge" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="form.contact" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="success" @click="onSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import { industryConfig } from '../config';

export default {
    props: ['visible', 'edit', 'categoryList'],
    data () {
        const industryOptions = Object.keys(industryConfig).map(key => {
            return {
                value: key,
                label: industryConfig[key]
            };
        });
        return {
            industryOptions,
            formLabelWidth: '100px',
            form: {}
        };
    },
    created () {
        this.initForm();
        this.$on('set', val => {
            this.initForm();
            this.form = Object.assign(this.form, val || {});
        });
        this.$on('init', () => {
            this.initForm();
        });
    },
    computed: {
        title () {
            return `${this.edit ? '编辑' : '添加'}店铺`;
        }
    },
    methods: {
        initForm () {
            this.form = {
                id: -1,
                name: '',
                industry: '',
                incharge: '',
                contact: '',
                categoryId: null
            };
        },
        handleClose () {
            this.onCancel();
        },
        onCancel () {
            this.$emit('cancel');
        },
        onSubmit () {
            this.$emit('submit', this.form);
        }
    }
};
</script>

<style>
.dialog {
    & .email {
        text-decoration: underline
    }
    & .form {
        margin: 20px 40px 0 0;
        & .el-form-item__label {
            padding-top: 14px;
            font-size: 12px;
        }
        & .el-cascader__label {
            line-height: 35px;
            padding-top: 3px;
            padding-bottom: 3px;
            font-size: 12px;
        }
        & .select {
            width: 100%;
        }
    }
}
</style>
