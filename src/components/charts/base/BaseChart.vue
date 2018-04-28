
<template>
    <div class="chart"></div>
</template>
<script>
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';

import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

// import echarts from 'echarts';

export default {
    props: ['option', 'initOption'],
    data () {
        return {
            chart: null,
            timer: null,
            color: ["#4fa8f9","#6ec71e","#f56e6a","#fc8b40","#818af8","#31c9d7","#f35e7a","#ab7aee","#14d68b","#edb00d"]
        };
    },
    created () {
        window.addEventListener('resize', this.handleDomResize);
        this.$on('resize', this.onResize);
    },
    mounted () {
        const chart = this.chart = echarts.init(this.$el), option = this.option;
        chart.on('click', this.handleClick);
        this.init();
        if(option) {
            option.color=this.color;
            chart.setOption(option);
        }
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.handleDomResize);
        this.chart && this.chart.dispose();
        this.chart = null;
    },
    watch: {
        option (val) {
            val.color = this.color;
            this.chart && this.chart.setOption(val);
        }
    },
    methods: {
        init () {
            this.chart && this.chart.setOption(this.initOption, true);
        },
        onResize () {
            this.chart && this.chart.resize();
        },
        handleClick (params) {
            this.$emit('click', params);
        },
        handleDomResize () {
            if(this.timer) {
                return;
            }
            this.timer = setTimeout(() => {
                this.onResize();
                this.timer = null;
            }, 150);
        }
    }
};
</script>
<style>
.chart {
    height: 300px;
}
</style>
