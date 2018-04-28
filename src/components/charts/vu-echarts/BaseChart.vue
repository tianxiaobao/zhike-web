<template>
    <div v-if="false"></div>
</template>
<script>
import { merge } from '@/utils';
export default {
    name: 'BaseChart',
    props: {
        option: {
            default: function () {
                return {};
            }
        }
    },
    data () {
        return {
            chart: null,
            initOption: {
                color: ['#4fa8f9','#33d31b','#f13c3c','#00beba','#8788ca','#f0e534','#f08729']
            }
        };
    },
    methods: {
        getOption (option) {
            return option;
        },
        setOption (val) {
            this.$nextTick(() => {
                const option = merge(this.initOption, this.getOption(val));
                this.chart && !this.chart.isDisposed() && this.chart.setOption(option);
            });
        }
    },
    created () {
        this.chart = this.$parent.chart;
        this.__vuUnwatch = this.$watch('option', this.setOption, {
            immediate: true
        });
    },
    beforeDestroy () {
        this.__vuUnwatch();
        this.chart.isDisposed() || this.chart.clear();
        this.chart = null;
    }
};
</script>
