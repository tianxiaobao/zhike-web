<script>
import BaseChart from './BaseChart';
export default {
    name: 'MarkedHogChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
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
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisLabel: {
                        color: '#333'
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [{
                    type: 'bar',
                    stack: 'chart',
                    barMaxWidth: '60',
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                }]
            }
        };
    },
    methods: {
        getOption (val) {
            return this.adaptOption(val);
        },
        adaptOption (data) {
            const xAxis = {
                data: data.series.map(item => item.name)
            };
            const series = [{
                type: 'bar',
                stack: 'chart',
                barMaxWidth: '60',
                markPoint: data.markPoint,
                name: data.name,
                data: data.series.map(item => item.value)
            }];
            return {
                tooltip: data.tooltip,
                yAxis: data.yAxis,
                xAxis,
                series
            };
        }
    }
};
</script>

