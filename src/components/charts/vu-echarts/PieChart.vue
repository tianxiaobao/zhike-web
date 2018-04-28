<script>
import BaseChart from './BaseChart';
export default {
    name: 'PieChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
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
        getOption (val) {
            return this.adaptOption(val);
        },
        adaptOption (data) {
            const series = [{
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

