<script>
import BaseChart from './BaseChart';

export default {
    name: 'StackChart',
    mixins: [ BaseChart ],
    props: ['isVertical'],
    data () {
        return {
            initOption: {
                grid: {
                    top: '10%',
                    left: '1%',
                    right: '20',
                    bottom: '15%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    bottom: 0
                },
                xAxis: {
                },
                yAxis: {
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
            const legend = { bottom: 0, data: [] }, series = [];
            const tooltip = {
                formatter (params) {
                    return `${params[0].name}
                                </br>
                                ${params.map(param => {
                                    return `${param.marker}${param.seriesName} : ${param.value || 0} 分钟`;
                                }).join('</br>')}
                    `;
                }
            };
            let xAxis, yAxis;
            if (this.isVertical) {
                xAxis = {
                    type: 'category',
                    data: data.xLabels,
                    axisLabel: {
                        interval: 0,
                        color: '#333',
                        rotate: data.xLabels.length > 14 ? 25 : 0
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    }
                };
                yAxis = {
                    type: 'value',
                    axisLabel: {
                        color: '#333',
                        formatter: '{value} 分钟'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                };
            } else {
                xAxis = {
                    type: 'value',
                    axisLabel: {
                        color: '#333',
                        formatter: '{value} 分钟'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                };
                yAxis = {
                    type: 'category',
                    data: data.xLabels,
                    axisLabel: {
                        interval: 0,
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bbb'
                        }
                    }
                };
            }
            data.series.map(item => {
                const name = item.name;
                legend.data.push(name);

                series.push({
                    name: name,
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: item.data
                });
            });
            return {
                tooltip,
                legend,
                xAxis,
                yAxis,
                series
            };
        }
    }
};
</script>
