<template>
    <div class="create-steps">
        <div class="steps-header">
            <el-steps :active="currentStep" finish-status="success">
                <el-step v-for="(step, i) in steps" :key="i" :title="step"></el-step>
            </el-steps>
        </div>
        <div>
            <crowd-type-select v-show="currentStep === 0" v-model="type" step="begin" @prev="onPrev" @next="onNext"></crowd-type-select>
            <create-package v-show="currentStep === 1" :type="type" step="middle" @prev="onPrev" @next="onNext"></create-package>
            <finish v-show="currentStep === 2" :type="type" step="end" @prev="onPrev" @next="onNext"></finish>
        </div>
    </div>
</template>

<script>
import CrowdTypeSelect from './components/CrowdTypeSelect';
import CreatePackage from './components/CreatePackage';
import Finish from './components/Finish';
import { defaultSource, defaultSourceFilter } from '../config';
export default {
    props: ['value'],
    components: {
        CrowdTypeSelect,
        CreatePackage,
        Finish
    },
    data () {
        return {
            steps: ['选择创建方式', '创建人群包', '完成'],
            currentStep: 0,
            type: this.value === defaultSourceFilter ? defaultSource : this.value
        };
    },
    methods: {
        onClose () {
            this.$emit('changeMode');
        },
        onCancel () {
            this.onClose();
        },
        onPrev () {
            if(this.currentStep === 0) {
                this.onClose();
            } else {
                --this.currentStep;
            }
        },
        onNext () {
            if(this.currentStep === this.steps.length - 1) {
                this.$emit('input', this.type);
                this.onClose();
            } else {
                ++this.currentStep;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.create-steps {
    .steps-header {
       padding-left: 22%;
    }
}
</style>
