<style lang="scss" scoped>
.customize-package {
    .crowd-pick-row {
        margin-top: 10px;
    }
    .crowd-picker {
        padding: 10px;
        padding-top: 0;
        border: 1px solid #e7e7e7;
        background-color: #fff;
    }
    .crowd-picked {
        min-height: 35px;
        padding: 0 10px;
        border: 1px solid #e7e7e7;
    }
}
.t-center{
    width: 100%;
    text-align:center;
    & .el-button{
        min-width: 118px;
    }
}
</style>
<style lang="scss">
.customize-package {
    .crowd-condition.el-form-item.is-required .el-form-item__label:before {
        content: '';
    }
    .crowd-condition.el-form-item.is-error {
        .el-input__inner, .el-textarea__inner {
            border-color: #e7e7e7;
            &:focus {
                border-color: #2aafff;
                box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);color:#333;
            }
        }
        .crowd-picker {
            border-color: red;
        }
    }
    .crowd-pick-row.el-collapse .el-collapse-item__header {
        background-color: #f7f7f7;
    }
}
</style>

<template>
   <div class="customize-package">
       <el-form ref="form" :rules="rules" :model="ruleForm" class="option-panel" label-width="80px" @submit.prevent>
           <el-form-item label="人群名称" prop="packageName">
                <el-input v-model="ruleForm.packageName" :maxlength="40"></el-input>
            </el-form-item>
            <el-form-item label="目标人群" prop="packageCrowd" class="crowd-condition">
                <div class="crowd-picker">
                    <el-collapse class="crowd-pick-row">
                        <el-collapse-item title="筛选条件" name="picker">
                            <el-select v-model="crowdName" placeholder="请选择定制画像" filterable clearable>
                                <el-option v-for="item in crowdList" :value="item.id" :key="item.id" :label="item.title"></el-option>
                            </el-select>
                            <div v-if="crowdDetail" class="crowd-pick-row">
                                <el-table :data="[crowdDetail]" stripe>
                                    <el-table-column v-for="(val, key) in crowdDetail"
                                        :label="key"
                                        :key="key"
                                        :prop="key"
                                        min-width= "120">
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="chart-grid crowd-pick-row">
                                <multi-attr-filter :type="type" :queryConditions="queryConditions" @click="onSelect"></multi-attr-filter>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <div>
                        <div>已选人群:</div>
                        <div class="crowd-picked">
                            <el-tag
                                v-if="ruleForm.packageCrowd"
                                type="primary"
                                :closable="true"
                                :close-transition="false"
                                @close="onRemove">
                                {{ ruleForm.packageCrowd.name }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <div class = "t-center">
                <el-button type = "primary" @click="onPrev" :disabled="submitting">上一步</el-button>
                <el-button type = "primary" @click="onSubmit" :loading="submitting">创建</el-button>
            </div>
        </el-form>
   </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getUploadList } from '@/apis/customerProfile.js';
import { addCrowd } from '@/apis/crowd.js';
import { timeFormatter } from '@/utils';
import MultiAttrFilter from './components/multi-attr-filter/MultiAttrFilter';
import filterTypes from './components/multi-attr-filter/config';

export default {
    data () {
        return {
            ruleForm: {
                packageName: '',
                packageCrowd: null
            },
            submitting: false,
            rules: {
                packageName: [
                    { required: true, message: '请输入人群名称', trigger: 'blur' },
                    { max: 40, message: '长度不超过40个字符', trigger: 'blur' }
                ],
                packageCrowd: [
                    { required: true, message: '请选择目标人群' }
                ]
            },
            crowdName: '',
            crowdData: [],
            type: filterTypes.CUSTOM
        };
    },
    components: {
        MultiAttrFilter
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
        crowdList () {
            return this.crowdData.filter(crowd => crowd.canProfile);
        },
        crowdDetail () {
            const id = this.crowdName;
            const crowdSelected = this.crowdList.find(item => item.id === id);
            if(!crowdSelected) return null;
            return {
                '编号': crowdSelected.id,
                '名称': crowdSelected.title,
                '描述': crowdSelected.description,
                '人群数量': crowdSelected.count,
                '创建时间': timeFormatter(crowdSelected.dtCreate)
            };
        },
        queryConditions () {
            const id = this.crowdName;
            if(id || id === 0) {
                return { id };
            }
            return null;
        }
    },
    watch: {
        currentMallShopIds: {
            immediate: true,
            handler (val) {
                this.init();
                if(val) {
                    this.getCrowdData();
                }
            }
        }
    },
    methods: {
        init () {
            this.crowdName = '';
            this.crowdData = [];
            this.ruleForm.packageCrowd = null;
        },
        getCrowdData () {
            getUploadList({
                path: [this.currentMall.id, this.currentShop.id],
                params:{
                    pageSize: 0,
                    pageNo: 0
                }
            }).then(dataObj => {
                this.crowdData = dataObj.message.PageResult.list;
            }).catch(err => {
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取定制画像列表失败:' + err.message
                    });
                }
            });
        },
        onSelect (val) {
            this.ruleForm.packageCrowd = val;
            this.$refs.form && this.$refs.form.validateField('packageCrowd');
        },
        onRemove () {
            this.ruleForm.packageCrowd = null;
            this.$refs.form && this.$refs.form.validateField('packageCrowd');
        },
        onPrev () {
            this.$refs.form && this.$refs.form.resetFields();
            this.$emit('prev');
        },
        onSubmit () {
            this.$refs.form && this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitting = true;
                    const params = {
                        name: this.ruleForm.packageName,
                        key: encodeURIComponent(this.ruleForm.packageCrowd.ids),
                        start: this.ruleForm.packageCrowd.start,
                        end: this.ruleForm.packageCrowd.end,
                        description:this.ruleForm.packageCrowd.name,
                        source: this.ruleForm.packageCrowd.source,
                        shopId: this.ruleForm.packageCrowd.shopId,
                        profileId: this.ruleForm.packageCrowd.profileId
                    };
                    addCrowd({
                        path: [this.currentMall.id, this.ruleForm.packageCrowd.timeslot],
                        params
                    }).then(() => {
                        this.submitting = false;
                        this.$emit('next');
                    }).catch(err => {
                        this.submitting = false;
                        if(err.message) {
                            this.$message({
                                type: 'error',
                                message: '创建人群包失败:' + err.message
                            });
                        }
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '请输入人群名称并选择目标人群'
                    });
                }
            });
        }
    }
};
</script>