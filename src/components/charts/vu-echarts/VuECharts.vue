<template>
  <div class="vu-echarts">
    <slot v-if="isInit"></slot>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts';

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/treemap';

import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

import { mapGetters } from 'vuex';
export default {
    name: 'VuEcharts',
    data () {
        return {
            isInit: false,
            chart: null
        };
    },
    computed: {
        ...mapGetters([
            'contentSize'
        ])
    },
    watch: {
        contentSize: { 
            handler () {
                this.resize();
            }
        }
    },
    methods: {
        init () {
            this.chart = echarts.init(this.$el);
            this.chart.on('click', this.handleClick);
            this.isInit = true;
        },
        handleClick (params) {
            this.$emit('click', params);
        },
        destroy () {
            this.chart && this.chart.dispose();
            this.chart = null;
        },
        resize () {
            this.chart && this.chart.resize();
        }
    },
    mounted () {
        this.init();
    },
    beforeDestroy () {
        this.destroy();
    }
};
</script>