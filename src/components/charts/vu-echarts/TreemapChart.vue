<script>
import BaseChart from './BaseChart';

export default {
    name: 'TreemapChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                tooltip: {
                    formatter: function (params) {
                        return `${params.marker}
                                ${params.name} : ${params.value}%`;
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
            return {
                series: [{
                    name:'多级筛选',
                    type:'treemap',
                    visibleMin: 500,
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    itemStyle: {
                        normal: {
                            gapWidth: 2, 
                            borderColor: '#fff'
                        }
                    },
                    breadcrumb: {
                        show: false
                    },
                    data: data
                }]
            };
        }
    }
};
</script>
