<template>
    <div class="buy">
        <div class="buy-area--row">
            <div class="buy-area--container">
                <default-table-chart :data="top30Data" class="buy-area--table"></default-table-chart>
            </div>
            <div class="buy-area--container">
                <default-table-chart :data="top60Data" class="buy-area--table"></default-table-chart>
            </div>
            <div class="buy-area--container">
                <default-table-chart :data="top90Data" class="buy-area--table"></default-table-chart>
            </div>
        </div>
        <div class="buy-area--row">
            <div class="buy-area--container">
                <default-table-chart :data="topMaleData" class="buy-area--table"></default-table-chart>
            </div>
            <div class="buy-area--container">
                <default-table-chart :data="topFemaleData" class="buy-area--table"></default-table-chart>
            </div>
        </div>
        <div class="buy-area--row">
            <div class="buy-area--container">
                <chart-container>
                    <span slot="header" class="buy-area--title">母婴用户购买力</span>
                    <pie-chart :data="monbabyPieData" class="buy-area--pie"></pie-chart>
                </chart-container>
            </div>
            <div class="buy-area--container">
                <chart-container>
                    <span slot="header" class="buy-area--title">个护用户购买力</span>
                    <pie-chart :data="beautyPieData" class="buy-area--pie"></pie-chart>
                </chart-container>
            </div>
            <div class="buy-area--container">
                <chart-container>
                    <span slot="header" class="buy-area--title">酒类用户购买力</span>
                    <pie-chart :data="winePieData" class="buy-area--pie"></pie-chart>
                </chart-container>
            </div>
            <div class="buy-area--container">
                <chart-container>
                    <span slot="header" class="buy-area--title">促销敏感度</span>
                    <pie-chart :data="promotionPieData" class="buy-area--pie"></pie-chart>
                </chart-container>
            </div>
            <div class="buy-area--container">
                <chart-container>
                    <span slot="header" class="buy-area--title">支付方式</span>
                    <pie-chart :data="paytypePieData" class="buy-area--pie"></pie-chart>
                </chart-container>
            </div>
            <div class="buy-area--container">
                <chart-container>
                    <span slot="header" class="buy-area--title">京东等级</span>
                    <pie-chart :data="levelPieData" class="buy-area--pie"></pie-chart>
                </chart-container>
            </div>
        </div>
    </div>
</template>
<script>
import PieChart from '@/components/charts/PieChart';
import DefaultTableChart from '@/components/charts/DefaultTableChart';
import ChartContainer from '@/components/common/ChartContainer';
import { getFeatureRate, getClassRank } from '@/apis/regionAnalysis';
import AjaxClient from '@/utils/ajaxClient.js';

export default {
    components: {
        PieChart,
        DefaultTableChart,
        ChartContainer
    },
    props: ['id'],
    data () {
        return {
            token: null,
            top30Data: {
                labels: [
                    { text: '30天品类销量', name: 'name' },
                    { text: '排名', name: 'value', type: 'val' }
                ],
                series: []
            },
            top60Data: {
                labels: [
                    { text: '60天品类销量', name: 'name' },
                    { text: '排名', name: 'value', type: 'val' }
                ],
                series: []
            },
            top90Data: {
                labels: [
                    { text: '90天品类销量', name: 'name' },
                    { text: '排名', name: 'value', type: 'val' }
                ],
                series: []
            },
            topMaleData: {
                labels: [
                    { text: '男性购买品类', name: 'name' },
                    { text: '排名', name: 'value', type: 'val' }
                ],
                series: []
            },
            topFemaleData: {
                labels: [
                    { text: '女性购买品类', name: 'name' },
                    { text: '排名', name: 'value', type: 'val' }
                ],
                series: []
            },
            monbabyPieData: {
                name: '',
                series: []
            },
            beautyPieData: {
                name: '',
                series: []
            },
            winePieData: {
                name: '',
                series: []
            },
            promotionPieData: {
                name: '',
                series: []
            },
            paytypePieData: {
                name: '',
                series: []
            },
            levelPieData: {
                name: '',
                series: []
            }
        };
    },
    created () {
        this.token = AjaxClient.createCancleToken();
        this.initData();
    },
    beforeDestroy () {
        this.token && this.token.cancel();
    },
    methods: {
        adaptPie (data, defaultName) {
            const valueList = (data.dataSerials[0] && data.dataSerials[0].cells) || [];
            const series = data.nameSerial.cells.map((name, i) => {
                return {
                    name: name,
                    value: valueList[i]
                };
            }).filter(s => s.value);
            return {
                radius: '55%',
                name: data.nameSerial.name || defaultName,
                series: series
            };
        },
        adaptTable (data, defaultName) {
            const valueList = (data.dataSerials && data.dataSerials[0] && data.dataSerials[0].cells) || [];
            const series = data.nameSerial.cells.map((name, i) => {
                return {
                    name: name,
                    value: valueList[i]
                };
            });
            return {
                labels: [
                    { text: data.nameSerial.name || defaultName, name: 'name' },
                    { text: (data.dataSerials[0] && data.dataSerials[0].name) || '排名', name: 'value', type: 'val' }
                ],
                series: series
            };
        },
        queryTop30 () {
            getClassRank({
                path: [this.id, 'cate30'], 
                params: {
                    topN: 10
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.top30Data = this.adaptTable(dataObj.message.DataResult, '30天品类销量');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取30天品类销量数据失败: ' + err.message
                    });
                }
            });
        },
        queryTop60 () {
            getClassRank({
                path: [this.id, 'cate60'],
                params: {
                    topN: 10
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.top60Data = this.adaptTable(dataObj.message.DataResult, '60天品类销量');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取60天品类销量数据失败: ' + err.message
                    });
                }
            });
        },
        queryTop90 () {
            getClassRank({
                path: [this.id, 'cate90'], 
                params: {
                    topN: 10
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.top90Data = this.adaptTable(dataObj.message.DataResult, '90天品类销量');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取90天品类销量数据失败: ' + err.message
                    });
                }
            });
        },
        queryTopMale () {
            getClassRank({
                path: [this.id, 'catemale'],
                params: {
                    topN: 5
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.topMaleData = this.adaptTable(dataObj.message.DataResult, '男性购买品类');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取男性购买品类数据失败: ' + err.message
                    });
                }
            });
        },
        queryTopFemale () {
            getClassRank({
                path: [this.id, 'catefemale'],
                params: {
                    topN: 5
                },
                cancelToken: this.token
            }).then(dataObj => {
                this.topFemaleData = this.adaptTable(dataObj.message.DataResult, '女性购买品类');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取女性购买品类数据失败: ' + err.message
                    });
                }
            });
        },
        queryMonbaby () {
            getFeatureRate({
                path: [this.id, 'monbaby'],
                cancelToken: this.token
            }).then(dataObj => {
                this.monbabyPieData = this.adaptPie(dataObj.message.DataResult, '母婴用户购买力');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取母婴数据失败: ' + err.message
                    });
                }
            });
        },
        queryBeauty () {
            getFeatureRate({
                path: [this.id, 'beauty'],
                cancelToken: this.token
            }).then(dataObj => {
                this.beautyPieData = this.adaptPie(dataObj.message.DataResult, '个护用户购买力');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取个护数据失败: ' + err.message
                    });
                }
            });
        },
        queryWine () {
            getFeatureRate({
                path: [this.id, 'wine'],
                cancelToken: this.token
            }).then(dataObj => {
                this.winePieData = this.adaptPie(dataObj.message.DataResult, '酒类用户购买力');
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取酒类数据失败: ' + err.message
                    });
                }
            });
        },
        queryPromotion () {
            getFeatureRate({
                path: [this.id, 'promotion'],
                cancelToken: this.token
            }).then(dataObj => {
                this.promotionPieData = this.adaptPie(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取促销敏感度数据失败: ' + err.message
                    });
                }
            });
        },
        queryPaytype () {
            getFeatureRate({
                path: [this.id, 'paytype'],
                cancelToken: this.token
            }).then(dataObj => {
                this.paytypePieData = this.adaptPie(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取支付方式数据失败: ' + err.message
                    });
                }
            });
        },
        queryLevel () {
            getFeatureRate({
                path: [this.id, 'level'],
                cancelToken: this.token
            }).then(dataObj => {
                this.levelPieData = this.adaptPie(dataObj.message.DataResult);
            }).catch(err => {
                if(AjaxClient.isCancel(err)) {
                    return;
                }
                if(err.message) {
                    this.$message({
                        type: 'error',
                        message: '获取京东等级数据失败: ' + err.message
                    });
                }
            });
        },
        initData () {
            this.queryTop30();
            this.queryTop60();
            this.queryTop90();
            this.queryTopMale();
            this.queryTopFemale();
            this.queryMonbaby();
            this.queryBeauty();
            this.queryWine();
            this.queryPromotion();
            this.queryPaytype();
            this.queryLevel();
        }
    }
};
</script>

<style>
.buy-area--row::after {
    content: '';
    display: block;
    height: 0;
    clear: both;
}

.buy-area--container {
    float: left;
    width: calc((100% - 60px) / 3);
    margin-bottom: 30px;
    margin-right: 30px;
    &:nth-of-type(3n) {
        margin-right: 0;
    }
    & .chart-container .c-body {
        padding: 0;
    }
}

.buy-area--table .el-table td,.buy-area--table .el-table th {
    height: 35px;
}

.buy-area--title {
    font-weight: bold;
    font-size: 14px;
}

.buy-area--pie.pie-chart {
    height: 280px;
}
</style>
