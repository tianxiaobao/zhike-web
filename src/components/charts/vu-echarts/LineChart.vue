<script>
import BaseChart from './BaseChart';

export default {
    name: 'LineChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                grid: {
                    top: '15%',
                    left: '1%',
                    right: '1%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top: 0,
                    right: 0
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    splitNumber: 24,
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisLabel: {
                        color: '#333'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisLabel: {
                        color: '#333'
                    }
                },
                series: []
            }
        };
    },
    methods: {
        getOption (val) {
            return this.adaptOption(val);
        },
        adaptOption (data) {
            const legend = { data: [] }, series = [], labels = data.xLabels;
            const xAxis = {
                data: labels,
                splitLine: {
                    show: true,
                    interval (index) {
                        return labels.length - 1 === index;
                    }
                }
            };
            data.series.map((item, index) => {
                const name = item.name;
                legend.data.push(index ? { name: name, icon: 'line' } : name);

                series.push({
                    name: name,
                    type: 'line',
                    smooth: true,
                    smoothMonotone: 'x',
                    showAllSymbol: true,
                    data: item.data,
                    symbol: index ? 'none' : 'emptyCircle',
                    lineStyle: {
                        normal: {
                            type: index ? 'solid' : 'solid'
                        }
                    }
                });
            });
            return {
                tooltip: data.tooltip,
                legend,
                xAxis,
                yAxis: data.yAxis,
                series
            };
        }
    }
};
</script>
