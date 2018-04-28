<script>
import BaseChart from './BaseChart';

export default {
    name: 'FilterChart',
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                tooltip : {
                    trigger: 'item',
                    formatter: function (params) {
                        return `${params.marker} ${params.name} : ${params.percent}%`;
                    }
                },
                series : [
                    {
                        name:'多级筛选',
                        type:'pie',
                        radius : ['5%', '70%'],
                        center : ['50%', '50%'],
                        roseType : 'radius',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:[]
                    }
                ]
            }
        };
    },
    methods: {
        getOption (val) {
            return {
                series: [{
                    name:'多级筛选',
                    type:'pie',
                    radius : ['5%', '70%'],
                    center : ['50%', '50%'],
                    roseType : 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: val
                }]
            };
        }
    }
};
</script>
