<template>
    <el-dialog title="新增查询" class="dialog" :visible.sync="visible" :before-close="handleClose">
        <el-alert type="success" :closable="false" title="">
            <p class="el-alert__description">
                本模块为增值服务，按查询次数收费。如需了解详情，请邮件咨询：{{ email }}，
                <a :href="`mailto:${email}`" class="email">立即咨询</a>
            </p>
        </el-alert>
        <el-form :model="form" class="form">
            <el-form-item label="所在地区:" :label-width="formLabelWidth">
                <el-cascader :options="options" v-model="form.selectedOptions" class="select">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址:" :label-width="formLabelWidth">
                <el-input v-model="form.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="商圈半径:" :label-width="formLabelWidth">
                <el-select v-model="form.radius" placeholder="请选择商圈半径" class="select">
                    <el-option label="3公里" :value="3"></el-option>
                    <el-option label="5公里" :value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="竞争对手关键字:" :label-width="formLabelWidth">
                <el-select v-model="form.keyword" multiple placeholder="请选择关键字" class="select">
                    <el-option v-for="keyword in keywordOption" :label="keyword" :value="keyword" :key="keyword"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="success" @click="onSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import location from 'china-location/dist/location.json';
const options = Object.keys(location).map(provinceCode => {
    const province = location[provinceCode];
    const cities = province.cities;
    const cityCodes = Object.keys(cities);

    const value = province.code;
    const label = province.name;
    const children = !cityCodes.length ? null : cityCodes.map(cityCode => {
        const city = cities[cityCode];
        const districts = city.districts;
        const districtCodes = Object.keys(districts);

        const value = city.code;
        const label = city.name;
        const children = !districtCodes.length ? null : districtCodes.map(districtCode => {
            const district = districts[districtCode];
            return {
                value: districtCode,
                label: district
            };
        });
        return {
            value,
            label,
            children
        };
    });
    return {
        value,
        label,
        children
    };
});
const keywordOption = [
    '综合商场',
    '便利店',
    '超市',
    '停车场'
    // '电影院',
    // '中餐厅',
    // '日韩菜',
    // '西餐',
    // '烧烤',
    // '火锅',
    // '海鲜',
    // '素食',
    // '清真',
    // '自助餐',
    // '面包甜点',
    // '冷饮店',
    // '小吃快餐',
];
export default {
    props: ['visible'],
    data () {
        return {
            formLabelWidth: '100px',
            form: {},
            options: options,
            keywordOption: keywordOption,
            email: 'jdc-support@jd.com'
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
    methods: {
        initForm () {
            this.form = {
                address: '',
                radius: '',
                keyword: [],
                selectedOptions: []
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
            & input.el-input__inner {
                height: 30px!important;
            }
        }
    }
}
</style>
