<style scoped lang="scss" type="text/scss">
    .proportion-bar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;

        .time-item {
            width: 48px;
        }

        .proportion-value-wrap {
            height: 18px;
            width: 100%;
            position: relative;
            box-sizing: border-box;
            padding-left: 8px;
            display: flex;
            align-items: center;
            background-color: rgba(0, 135, 255, .15);
            overflow: hidden;

            span {
                font-size: 12px;
                color: #000;
            }
        }

        .proportion-value {
            position: absolute;
            left: 0;
            top: 0;
            flex: 1;
            height: 100%;
            background-color: rgba(0, 135, 255, .4);
        }
    }
</style>

<template>
    <div class="proportion-bar-container">
        <div class="time-item">
            {{ period }}
        </div>
        <div class="proportion-value-wrap">
            <div class="proportion-value" :style="{'width': percent}"></div>
            <span>{{ percent }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            period: {
                type: String,
                default: ''
            },
            proportion: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {};
        },
        computed: {
            percent () {
                return (this.proportion * 100).toFixed(0) + '%';
            }
        }
    };
</script>