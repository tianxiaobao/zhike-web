<template>
    <el-collapse class="crowd-picker" v-model="active">
        <el-collapse-item title="行为筛选" name="behavior">
            <behavior-select class="crowd-feature" v-bind="$attrs"></behavior-select>
        </el-collapse-item>
        <el-collapse-item title="画像筛选" name="persona">
            <persona-feature class="crowd-feature" v-bind="$attrs"></persona-feature>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
import BehaviorSelect from './components/behavior/Main';
import PersonaFeature from './components/persona/Main';
export default {
    components: {
        BehaviorSelect,
        PersonaFeature
    },
    data () {
        return {
            active: 'behavior'
        };
    }
};
</script>
<style lang="scss">
.crowd-picker.el-collapse .el-collapse-item__header {
    background-color: #f7f7f7;
}
</style>
