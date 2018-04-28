<script>
import BaseChart from './BaseChart';

export default {
    name: 'ContrastChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['实际发送量','转化率'],
                    bottom: '0'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['SIT1002013001','SIT1002013002'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name:'实际发送量',
                        type:'bar',
                        data:[300000, 150000],
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        }
                    },
                    {
                        name:'转化率',
                        type:'line',
                        yAxisIndex: 1,
                        data:[20, 13],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter:"{c}%"
                            }
                        }
                    }
                ]
            }
        };
    }
};
</script>
