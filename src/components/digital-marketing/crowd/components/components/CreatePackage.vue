<template>
    <component :is="currentView" v-on="$listeners" v-bind="$attrs"></component>
</template>

<script>
import JdTag from './components/JdTag';
import LocalUpload from './components/LocalUpload';
import Customize from './components/Customize';
import CustomerFlow from './components/CustomerFlow';
const viewConfig = {
    'label': 'JdTag',
    'local': 'LocalUpload',
    'customize': 'Customize',
    'customer' : 'CustomerFlow'
};
export default {
    props: ['type'],
    components: {
        JdTag,
        LocalUpload,
        Customize,
        CustomerFlow
    },
    computed: {
        currentView () {
            return viewConfig[this.type];
        }
    }
};
</script>

<style lang="scss" scoped>

</style>

