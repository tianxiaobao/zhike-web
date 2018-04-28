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

export default {
    components: {
        PieChart,
        DefaultTableChart,
        ChartContainer
    },
    data () {
        return {
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
        this.chartsData = chartsData;
        this.initData();
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
            this.top30Data = this.adaptTable(this.chartsData.cate30, '30天品类销量');
        },
        queryTop60 () {
            this.top60Data = this.adaptTable(this.chartsData.cate60, '60天品类销量');
        },
        queryTop90 () {
            this.top90Data = this.adaptTable(this.chartsData.cate90, '90天品类销量');
        },
        queryTopMale () {
            this.topMaleData = this.adaptTable(this.chartsData.catemale, '男性购买品类');
        },
        queryTopFemale () {
            this.topFemaleData = this.adaptTable(this.chartsData.catefemale, '女性购买品类');
        },
        queryMonbaby () {
            this.monbabyPieData = this.adaptPie(this.chartsData.monbaby, '母婴用户购买力');
        },
        queryBeauty () {
            this.beautyPieData = this.adaptPie(this.chartsData.beauty, '个护用户购买力');
        },
        queryWine () {
            this.winePieData = this.adaptPie(this.chartsData.wine, '酒类用户购买力');
        },
        queryPromotion () {
            this.promotionPieData = this.adaptPie(this.chartsData.promotion, '促销敏感度');
        },
        queryPaytype () {
            this.paytypePieData = this.adaptPie(this.chartsData.paytype, '支付方式');
        },
        queryLevel () {
            this.levelPieData = this.adaptPie(this.chartsData.level, '京东等级');
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
