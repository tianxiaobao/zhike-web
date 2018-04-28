<style scoped lang="scss" type="text/scss">
    .statistic-panel-container {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .statistic-item {
            width: 20%;
            max-width: 220px;
        }
    }
</style>

<template>
    <div class="statistic-panel-container">
        <statistic-item class="statistic-item"
                        icon="&#xe613;"
                        annotation="当前在店总数"
                        :quantity="statistic.current"
        ></statistic-item>
        <statistic-item class="statistic-item"
                        icon="&#xe606;"
                        annotation="今日到店总数"
                        :quantity="statistic.footfall"
        ></statistic-item>
        <statistic-item class="statistic-item"
                        icon="&#xe660;"
                        annotation="今日到店会员"
                        :quantity="statistic.member"
        ></statistic-item>
        <statistic-item class="statistic-item"
                        icon="&#xe658;"
                        annotation="今日到店常客"
                        :quantity="statistic.customer"
        ></statistic-item>
        <statistic-item class="statistic-item"
                        icon="&#xe647;"
                        annotation="今日到店路人"
                        :quantity="statistic.passerby"
        ></statistic-item>
        <statistic-item class="statistic-item"
                        icon="&#xe64a;"
                        annotation="今日到店盗客"
                        :quantity="statistic.thief"
        ></statistic-item>
    </div>
</template>

<script>
    import StatisticItem from './statistic-item';

    export default {
        name: '',
        components: {
            StatisticItem
        },
        data () {
            return {
                syncFunc: null
            };
        },
        computed: {
            statistic () {
                return this.$store.state.vision.statistic;
            }
        },
        beforeDestroy () {
            clearInterval(this.syncFunc);
        },
        created () {
            this.$store.dispatch('vision/getStatistic').then();
            this.syncFunc = setInterval(() => {
                this.$store.dispatch('vision/getStatistic').then();
            }, 2000);
        }
    };
</script>