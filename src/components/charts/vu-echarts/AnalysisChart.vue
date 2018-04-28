<script>
import BaseChart from './BaseChart';
export default {
    name: 'AnalysisChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                grid: {
                    x: 40,
                    y: 10,
                    x2: 30
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    bottom: 0,
                    data:['事件总数','拒绝事件数','审核事件数']
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
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#333'
                        }
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: '（次）',
                    xisTick: {
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
    methods:{
        getOption (val) {
            return this.adaptOption(val);
        },
        adaptOption (data) {
            let series = [];
            let xAxis = {};
            if(data.hasOwnProperty("dataSerials")) {
                series = [{
                    name:'事件总数',
                    type:'line',
                    data:data.dataSerials[0].cells
                },
                {
                    name:'拒绝事件数',
                    type:'line',
                    data:data.dataSerials[1].cells
                },
                {
                    name:'审核事件数',
                    type:'line',
                    data:data.dataSerials[2].cells
                }];
            }
            if(data.hasOwnProperty("nameSerial")) {
                xAxis = {
                    data:data.nameSerial.cells
                };
            }
            return {
                series,
                xAxis
            };
        }
    }
};
</script>
