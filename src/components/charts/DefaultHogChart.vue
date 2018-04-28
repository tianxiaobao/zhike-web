<template>
    <base-chart ref="chart" class="hog-chart--default" :initOption="initOption" :option="option" v-on="$listeners"></base-chart>
</template>

<script>
// import BaseChart from './base/BaseChart';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/component/tooltip';
export default {
    components: {
        // 'base-chart': BaseChart
        'base-chart': () => import('./base/BaseChart')
    },
    props: ['data'],
    data () {
        return {
            initOption: {
                color: ['#c23531','#2f4554', '#7cb5ec', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisLabel: {
                        color: '#333',
                        interval: 0
                    },
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %',
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [{
                    type: 'bar',
                    stack: 'chart',
                    barWidth: '60%'
                }]
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
            const data = this.data;
            const xAxis = {
                data: data.series.map(item => item.name)
            };
            const series = [{
                name: data.name,
                data: data.series.map(item => item.value)
            }];
            return {
                tooltip: data.tooltip,
                xAxis,
                series
            };
        }
    }
};
</script>
<style>
.hog-chart--default {
}
</style>
