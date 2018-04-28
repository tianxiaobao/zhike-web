<template>
    <el-row>
        <el-col :span="12" class="chart-grid">
            <before-last-buy v-bind="$attrs"></before-last-buy>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <last-buy-score v-bind="$attrs"></last-buy-score>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <buy-count-score v-bind="$attrs"></buy-count-score>
        </el-col>
        <el-col :span="12" class="chart-grid">
            <buy-payment-score v-bind="$attrs"></buy-payment-score>
        </el-col>
    </el-row>
</template>

<script>
import BeforeLastBuy from '../BeforeLastBuy';
import LastBuyScore from '../LastBuyScore';
import BuyCountScore from '../BuyCountScore';
import BuyPaymentScore from '../BuyPaymentScore';
import { mapActions } from 'vuex';
export default {
    components: {
        BeforeLastBuy,
        LastBuyScore,
        BuyCountScore,
        BuyPaymentScore
    },
    created () {
        this.initError();
    },
    methods: {
        ...mapActions(['initError'])
    }
};

</script>
<style lang="scss" scoped>
.chart-grid {
    padding: 20px 15px 0 15px;
}
</style>