<style scoped lang="scss" type="text/scss">
    .search-by-camera-container {
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
    <div class="search-by-camera-wrap">
        <div class="search-by-camera-container">
            <showing-item class="showing-item"
                          v-for="(item, index) in cameraList" :key="index"
                          :main-title="item.title"
                          :description="item.description"
                          :quantity="history[item.id].length"
                          :photos="history[item.id]"
            >
            </showing-item>
        </div>
    </div>
</template>

<script>
    import ShowingItem from '../../sub-components/showing-item';

    export default {
        name: '',
        components: {
            ShowingItem
        },
        computed: {
            historyData () {
                return this.$store.state.vision.historyData;
            },
            cameraList () {
                const historyData = this.historyData;
                const history = {};
                const cameraList = [];
                for (const index in historyData) {
                    const current = historyData[index];
                    const cameraId = current.camera.id;
                    if (history[cameraId] === undefined) {
                        cameraList.push(current.camera);
                        history[cameraId] = [current];
                    } else {
                        history[cameraId].push(current);
                    }
                }
                cameraList.sort(function (next, prev) {
                    return next.id - prev.id;
                });
                this.history = history;
                return cameraList;
            }
        },
        data () {
            return {
                history: {}
            };
        }
    };
</script>