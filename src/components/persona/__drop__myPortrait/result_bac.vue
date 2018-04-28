<template>
<div>
    <title-bar class="bar">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>我的画像</el-breadcrumb-item>
            <el-breadcrumb-item>结果</el-breadcrumb-item>
        </el-breadcrumb>
    </title-bar>
    <div class="content">
        <vu-echarts class="chart">
                <my-portrait-chart></my-portrait-chart>
        </vu-echarts>
    </div>
</div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
export default {
    components: {
        'title-bar':TitleBar,
        VuEcharts: () => import('@/components/charts/vu-echarts/VuEcharts'),
        MyPortraitChart: () => import('@/components/charts/vu-echarts/MyPortraitChart')
    },
    data () {
        return {
        };
    },
    methods: {
    }
};
</script>

<style scoped>
.content{
    padding: 20px;
}
.chart{
    height: 500px;
}
</style>
