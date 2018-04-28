<script>
import BaseChart from './BaseChart';
export default {
    name: 'RankHogChart',
    mixins: [ BaseChart ],
    props: ['data'],
    data () {
        return {
            initOption: {
                grid: {
                    x: 70
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                xAxis:  {
                    type: 'value',
                    show: false,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    axisLabel: {
                        interval: 0
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                series : []
            }
        };
    },
    methods: {
        getOption (val) {
            return this.adaptOption(val);
        },
        adaptOption (data) {
            const yAxis = {
                data: data.series.map(item => item.name)
            };
            const series = [{
                type: 'bar',
                stack: 'chart',
                barMaxWidth: '30px',
                label: {
                    normal: {
                        position: 'right',
                        show: true
                    }
                },
                data: data.series.map(item => item.value)
            }];
            return {
                yAxis,
                series
            };
        }
    }
};
</script>
