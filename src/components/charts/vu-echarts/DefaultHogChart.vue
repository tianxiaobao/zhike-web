<script>
import BaseChart from './BaseChart';

export default {
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                grid: {
                    containLabel: true,
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%'
                },
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
                barWidth: '60%',
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
