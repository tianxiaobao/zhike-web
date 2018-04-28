<style scoped lang="scss" type="text/scss">
    .face-entry-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 16px;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: rgba(133, 144, 166, .4);
        }

        .first-row {
            min-height: 40px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
        }

        .content-row {
            flex: 1;
            overflow: hidden;
            min-height: 380px;

            .real-content {
                height: 100%;
                width: 100%;
            }
        }
    }
</style>

<template>
    <div class="face-entry-container">
        <first-row class="first-row"></first-row>
        <div class="content-row">
            <router-view class="real-content"></router-view>
        </div>
    </div>
</template>

<script>
    import FirstRow from './first-row';

    export default {
        name: '',
        components: {
            FirstRow
        },
        data () {
            return {};
        },
        methods: {
        }
    };
</script>