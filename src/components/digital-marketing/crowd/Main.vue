<template>
    <div>
        <component class="crowd-management" :is="status" @changeMode="onChangeMode" v-model="source"></component>
    </div>
</template>
<script>
import CrowdList from './components/CrowdList';
import CreateSteps from './components/CreateSteps';
import { defaultSourceFilter } from './config';
export default {
    components: {
        list: CrowdList,
        create: CreateSteps
    },
    data () {
        return {
            status: 'list',
            source: defaultSourceFilter
        };
    },
    methods: {
        onChangeMode () {
            this.status = this.status === 'list' ? 'create' : 'list';
        }
    }
};
</script>
<style lang="scss" scoped>
.crowd-management {
    padding: 20px;
    overflow-x: hidden;
}
</style>
