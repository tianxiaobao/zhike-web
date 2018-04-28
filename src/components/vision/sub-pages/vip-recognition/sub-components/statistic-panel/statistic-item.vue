<style scoped lang="scss" type="text/scss">
    .statistic-item-container{
        display: flex;
        justify-content: space-between;
        height: 100%;

        .left-icon{
            font-size: 40px;
            color: #777;
            width: 84px;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .right-item{
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            .quantity{
                color: #1276e5;
                font-size: 28px;
                height: 55%;
                display: flex;
                align-items: flex-end;
                justify-content: center;
            }

            .annotation{
                height: 45%;
                font-size: 13px;
                display: flex;
                align-items: flex-start;
                justify-content: center;
            }
        }
    }
</style>

<template>
    <div class="statistic-item-container">
        <div class="left-icon">
            <i class="icon" v-html="icon"></i>
        </div>
        <div class="right-item">
            <div class="quantity">
                {{ handledQuantity }}
            </div>
            <div class="annotation">
                {{ annotation }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: [
            'icon',
            'quantity',
            'annotation'
        ],
        computed: {
            handledQuantity () {
                const quantity = this.quantity;
                if (isNaN(quantity)) return '-';
                return (+quantity).toLocaleString();
            }
        },
        data () {
            return {
            };
        }
    };
</script>