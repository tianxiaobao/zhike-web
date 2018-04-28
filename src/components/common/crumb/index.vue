<style scoped lang="scss" type="text/scss">
    .crumb{
        width: 100%;
        height: 2.5rem;
        background-color: rgba(255, 255, 255, .9);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 1rem;
        font-size: .75rem;
        color: #666;
        -webkit-font-smoothing: subpixel-antialiased;

        .left{
            width: 30%;

            .icon{
                color: #333;
                margin-right: .3rem;
            }
        }

        .right{
            width: 30%;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .icon{
                font-size: 1rem;
                color: royalblue;
                margin-right: .5rem;
            }
        }
    }
</style>

<template>
    <div class="crumb">
        <div class="left">
            <div>
                <i class="icon">&#xe62f;</i>
                <span class="zhike-global-ellipsis">
                    {{currentMenu}}
                    <!-- {{ pathInfoText }} -->
                </span>
            </div>
        </div>
        <div class="right">
            <i class="icon">&#xe6b7;</i>
            <span class="zhike-global-ellipsis">贴士：{{ tips }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Crumb',
    computed: {
        ...mapGetters([
            'tips',
            'currentMall',
            'currentShop',
            'sideHidden',
            'currentMenu'
        ]),
        pathInfoText () {
            return [this.currentMall && this.currentMall, this.currentShop].filter(item => item).map(item => item.name).join('/');
        }
    }
};
</script>