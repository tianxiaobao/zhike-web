<style scoped lang="scss" type="text/scss">
    .statistic-container {
        height: 100%;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        .date-range-toggle-container {
            width: 100%;
            box-sizing: border-box;
            padding: 0 8px;
            margin-top: 8px;
        }

        .i-echarts {
            flex: 1;
        }
    }
</style>

<template>
    <div class="statistic-container">
        <div class="date-range-toggle-container">
            <date-range-toggle class="date-range-toggle" @toggle="toggle"></date-range-toggle>
        </div>
        <i-echarts class="i-echarts" :option="option" :resize-signature="resizeSignature"></i-echarts>
    </div>
</template>

<script>
    import IEcharts from './sub-components/i-echarts';
    import DateRangeToggle from './sub-components/date-range-toggle';

    export default {
        name: '',
        components: {
            IEcharts,
            DateRangeToggle
        },
        data () {
            return {
                resizeSignature: null,
                range: null
            };
        },
        watch: {
            sideCollapse () {
                setTimeout(() => {
                    this.resizeSignature = Date.now() + Math.random();
                }, 400);
            },
            currentMall () {
                this.refreshData();
            },
            currentShop () {
                this.refreshData();
            }
        },
        methods: {
            toggle (range) {
                this.range = range;
                this.refreshData();
            },
            refreshData () {
                this.$store.dispatch('vision/getHistoryStatistic', {
                    ...this.range
                }).then();
            }
        },
        computed: {
            currentMall () {
                return this.$store.getters.currentMall.id;
            },
            currentShop () {
                return this.$store.getters.currentShop.id;
            },
            sideCollapse () {
                return this.$store.getters.sideCollapse;
            },
            historyStatistic () {
                return this.$store.state.vision.historyStatistic;
            },
            option () {
                const historyStatistic = this.historyStatistic;
                const dates = [];
                const customers = [];
                const firstTimeCustomers = [];
                const repeatedCustomers = [];
                const dealConversion = [];
                for (const index in historyStatistic) {
                    const current = historyStatistic[index];
                    dates.push(current['date']);
                    customers.push(current['customer']);
                    firstTimeCustomers.push(current['fist_time_customer']);
                    repeatedCustomers.push(current['repeated_customer']);
                    dealConversion.push(current['deal_conversion']);
                }
                let max = calcMax([calcMax(customers), calcMax(firstTimeCustomers), calcMax(repeatedCustomers)]);
                max = Math.ceil(max * 1.1 / 100) * 100;
                const interval = Math.ceil(max / 500) * 100;
                max = interval * 5;

                const option = {
                    'tooltip': {
                        'trigger': 'axis',
                        'axisPointer': {
                            'type': 'cross'
                        },
                        'padding': 10,
                        'backgroundColor': 'rgba(0, 0, 0, .8)',
                        'borderColor': '#777',
                        'borderWidth': 1
                    },
                    'grid': {
                        'left': '6%',
                        'right': '6%',
                        'top': '18%',
                        'bottom': '10%',
                        'containLabel': true
                    },
                    'legend': {
                        top: '8%',
                        left: 'center',
                        'data': ['到店顾客', '路人', '常客', '成交转换率']
                    },
                    'calculable': true,
                    'xAxis': [{
                        'type': 'category',
                        'axisLine': {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        'splitLine': {
                            'show': false
                        },
                        'axisTick': {
                            'show': false
                        },
                        'splitArea': {
                            'show': false
                        },
                        'axisLabel': {
                            'interval': 0
                        },
                        'data': dates
                    }],
                    'yAxis': [
                        {
                            'name': '人数',
                            'max': max,
                            'min': 0,
                            'interval': interval,
                            'type': 'value',
                            'axisLabel': {
                                'formatter': '{value} 人'
                            },
                            'axisLine': {
                                'lineStyle': {
                                    'color': '#1276e5'
                                }
                            }
                        },
                        {
                            'name': '比例',
                            'max': 100,
                            'min': 0,
                            'interval': 20,
                            'type': 'value',
                            'axisLabel': {
                                'formatter': '{value} %'
                            },
                            'axisLine': {
                                'lineStyle': {
                                    'color': '#28948e'
                                }
                            },
                            'position': 'right',
                            'offset': 0
                        }
                    ],
                    'dataZoom': [
                        {
                            'show': true,
                            'height': 30,
                            'xAxisIndex': [
                                0
                            ],
                            bottom: 30,
                            'start': 10,
                            'end': 80,
                            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                            handleSize: '110%',
                            handleStyle: {
                                color: '#a5b0c6'
                            },
                            textStyle: {
                                color: '#666'
                            },
                            borderColor: '#90979c'
                        }, {
                            'type': 'inside',
                            'show': true,
                            'height': 15,
                            'start': 1,
                            'end': 35
                        }
                    ],
                    'series': [
                        {
                            'name': '到店顾客',
                            'type': 'bar',
                            'barMaxWidth': 35,
                            'barGap': '10%',
                            'yAxisIndex': 0,
                            'itemStyle': {
                                'normal': {
                                    'color': '#1276a5'
                                }
                            },
                            'data': customers
                        },
                        {
                            'name': '路人',
                            'type': 'bar',
                            'barMaxWidth': 35,
                            'barGap': '10%',
                            'yAxisIndex': 0,
                            'itemStyle': {
                                'normal': {
                                    'color': '#38b48e'
                                }
                            },
                            'data': firstTimeCustomers
                        },
                        {
                            name: '常客',
                            type: 'bar',
                            yAxisIndex: 0,
                            itemStyle: {
                                'normal': {
                                    'color': '#cd3c80'
                                }
                            },
                            'data': repeatedCustomers
                        }, {
                            'name': '成交转换率',
                            'type': 'line',
                            symbolSize: 12,
                            symbol: 'circle',
                            smooth: true,
                            'itemStyle': {
                                'normal': {
                                    'color': '#FF3366'
                                }
                            },
                            'yAxisIndex': 1,
                            'data': dealConversion
                        }
                    ]
                };
                return option;
            }
        }
    };

    function calcMax (collection) {
        if (collection.length === 0) return 0;
        let max = +collection[0];
        for (const index in collection) {
            const current = +collection[index];
            if (current > max) max = current;
        }
        return max;
    }
</script>