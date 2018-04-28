<style scoped lang="scss" type="text/scss">
    .history-search {
        height: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding: 16px;
        display: flex;
        flex-direction: column;

        .history-content {
            box-sizing: border-box;
            margin-top: 24px;
            padding-bottom: 16px;
            flex: 1;
            overflow: hidden;

            &.tip-info{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0 35%;
                font-size: 15px;
                text-align: center;
            }
        }
    }
</style>

<template>
    <div class="history-search">
        <global-control-panel></global-control-panel>
        <router-view class="history-content" v-if="!isSearchResultEmpty"></router-view>
        <div class="history-content tip-info" v-if="isSearchResultEmpty">
            搜索结果为空或搜索关键词为空。
            <p></p>
            请在上方进行搜索，或在会员识别页面中点击轮播卡片上的编号
        </div>
    </div>
</template>

<script>
    import GlobalControlPanel from './sub-components/global-control-panel';

    export default {
        name: '',
        components: {
            GlobalControlPanel
        },
        data () {
            return {};
        },
        computed: {
            historyData () {
                return this.$store.state.vision.historyData;
            },
            isSearchResultEmpty () {
                return this.historyData.length === 0;
            }
        }
    };

</script>