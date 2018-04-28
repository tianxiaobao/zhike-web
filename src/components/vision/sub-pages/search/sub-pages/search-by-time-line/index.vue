<style scoped lang="scss" type="text/scss">
    .search-by-time-line-container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: rgba(133, 144, 166, .4);
        }
    }
</style>

<template>
    <div class="search-by-time-line-wrap">
        <div class="search-by-time-line-container">
            <showing-item class="showing-item"
                          v-for="(item, index) in dateList" :key="index"
                          :main-title="item.cnFormattedDate"
                          :description="''"
                          :quantity="history[item.formattedDate].length"
                          :photos="history[item.formattedDate]"
            >
            </showing-item>
        </div>
    </div>
</template>

<script>
    import ShowingItem from '../../sub-components/showing-item';
    import moment from 'moment';

    export default {
        name: '',
        components: {
            ShowingItem
        },
        computed: {
            historyData () {
                return this.$store.state.vision.historyData;
            },
            dateList () {
                const historyData = this.historyData;
                const history = {};
                const dateList = [];
                for (const index in historyData) {
                    const current = historyData[index];
                    const currentMoment = moment(current['created_at']);
                    const formattedDate = currentMoment.format('YYYY-MM');
                    const cnFormattedDate = currentMoment.format('YYYY年MM月');
                    if (history[formattedDate] === undefined) {
                        dateList.push({
                            formattedDate: formattedDate,
                            cnFormattedDate: cnFormattedDate,
                            year: currentMoment.year(),
                            month: currentMoment.month()
                        });
                        history[formattedDate] = [current];
                    } else {
                        history[formattedDate].push(current);
                    }
                }
                dateList.sort(function (next, prev) {
                    return next.year === prev.year ? prev.month - next.month : prev.year - next.year;
                });
                this.history = history;
                return dateList;
            }
        },
        data () {
            return {
                history: {}
            };
        }
    };
</script>