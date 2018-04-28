<template>
<div class="content">
    <vu-echarts class="chart">
        <contrast-chart></contrast-chart>
    </vu-echarts>
</div>
</template>

<script>
export default {
    components: {
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        ContrastChart: () => import('@/components/charts/vu-echarts/ContrastChart')
    },
    data () {
        return {
        };
    },
    methods: {
    }
};
</script>

<style scoped>
.chart{
    height: 400px;
}
</style>
