<template>
    <base-chart ref="chart" class="pie-chart" :initOption="initOption" :option="option" v-on="$listeners">
    </base-chart>
</template>
<script>
// import BaseChart from './base/BaseChart';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/chart/pie';

export default {
    components: {
        // 'base-chart': BaseChart
        'base-chart': () => import('./base/BaseChart')
    },
    props: ['data'],
    data () {
        return {
            initOption: {
                color: ['#c23531','#2f4554', '#7cb5ec', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3', '#fcd251'],
                tooltip: {
                    trigger: 'item',
                    formatter (params) {
                        return `${params.seriesName}
                                </br>
                                ${params.marker}
                                ${params.name} : ${params.percent}%`;
                    }
                },
                series: []
            }
        };
    },
    methods: {
        init () {
            this.$refs.chart && this.$refs.chart.init();
        }
    },
    computed: {
        option () {
            const data = this.data, series = [{
                    name: data.name,
                    type: 'pie',
                    radius: data.radius || '65%',
                    data: data.series,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }];
            return {
                series
            };
        }
    }
};
</script>
<style>
</style>

