<template>
    <div class="dsp">
        <div class="title">
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label= "    " disabled></el-tab-pane>
                <el-tab-pane label="小黑珑" name="first"></el-tab-pane>
                <el-tab-pane label="京准通" name="second"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <iframe class="result-container" src="https://www.blackdragon.com" frameborder="1" seamless v-if = "!showJZD"></iframe>
            <iframe class="result-container" src="https://jzt.jd.com" frameborder="1" seamless v-if = "showJZD"></iframe>
        </div>
    </div>
</template>
<script>
import { mapGetters} from 'vuex';
export default {
    computed: {
        ...mapGetters([
            'sideCollapse'
        ])
    },
    data () {
        return {
            activeName2: 'first',
            showJZD: false,
            activeIframe: false
        };
    },
    methods: {
        handleClick (tab) {
            tab.name == 'first' ? (this.showJZD = false) : (this.showJZD = true);
        }
    }
    // watch: {
    //     sideCollapse (val) {
    //         val ?( this.activeIframe = true ) : ( this.activeIframe = false );
    //     }
    // }
};
</script>
<style scoped>
.dsp {
    min-width: 1130px;
    & .title {
        height: 3rem;
    }
    & .result-container {
        position: absolute;
        border: none;
        top: 4.5rem;
        left: 1rem;
        height: calc(100% - 5.5rem);
        width: calc(100% - 2rem);
        transition: all .2s;
    }
}
/* .dsp iframe.active{
    left: 3.5rem;
    width: calc(100% - 4.5rem);
    transition: all .2s;
} */
</style>
