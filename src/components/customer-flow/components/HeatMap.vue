<template>
    <div class="heatmap">
        <slot name="img"></slot>
    </div>
</template>

<script>
export default {
    props: ['mapData'],
    data () {
        return {
        };
    },
    mounted () {
        this.setMap();
    },
    updated () {
        this.setMap();
    },
    methods: {
        setMap () {
            const _this = this;
            const img = document.getElementsByClassName("heatmap")[0].firstChild;
            img.onload =function () {
                const ht = img.naturalHeight;
                document.getElementsByClassName("heatmap")[0].setAttribute("height",ht);
                const heatmapInstance = h337.create({
                    container: _this.$el
                });
                const data = {
                    max: 40,
                    data: _this.mapData
                };
                heatmapInstance.setData(data);
            };
        }
    }
};
</script>
<style>
.heatmap{
    width: 1100px;
    margin: 0 auto;
}
</style>
