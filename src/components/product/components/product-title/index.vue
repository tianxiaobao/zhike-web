<style>
/*nav*/
.product-nav{
    height: 115px;
    text-align: center;
    border-bottom: 1px solid rgb(222,219,219);
}
.product-navlst {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    width: 100%;
}
.product-navlst li{
    height: 115px;
    line-height: 115px;
    padding: 0 30px;
    font-size: 18px;
    color: #848dbc;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    & i{
            width: 25px;
            height: 25px;
            display: inline-block;
            vertical-align: middle;
    }
}
.product-navlst li.on{
    color: #4489fb;
    box-sizing: border-box;
    border-bottom: 3px solid rgb(68,137,251);
}
.product-nav.active{
    position: fixed;
    top:0;
    left:0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 99999;
    display: block;
    height: 80px;
    & li{
        height: 80px;
        line-height: 77px;
        padding: 0 30px;
        font-size: 18px;
        color: #848dbc;
        cursor: pointer;
    }
}
</style>
<template>
    <div class="product-nav" :class = "{'active' : scrollFlag}">
            <div class="container">
                <ul class= "product-navlst">
                    <li v-for = "(item,i) in tips" @click.stop = "switchTips(i)" :class = "{'on' : tab[i]}">
                    <i :style="{background: `url(${item.icon})`}"></i>
                    {{item.title}}</li>
                </ul>
            </div>
        </div>
</template>
<script>
function liOn (arr, scrollTop) {
    let index = 0;
    for( let i = 0; i< arr.length; i++) {
        if(scrollTop <= arr[i]) {
            index = i;
            break;
        }else {
            index = arr.length - 1 ;
        }
    }
    return index;
}
import {mapGetters} from "vuex";
import functionIcon from "./config";
export default {
    data () {
        return {
            scrollFlag: false,
            tab:[true],
            tips:[
                {
                    icon: functionIcon[0].active,
                    title: "产品优势"
                },{
                    icon: functionIcon[1].normal,
                    title: "产品功能"
                },{
                    icon: functionIcon[2].normal,
                    title: "应用场景"
                }
            ]
        };
    },
    props: ['tops'],
    computed: {
        ...mapGetters(['scrollTop', 'clickFlag'])
    },
    methods: {
        switchTips (index) {
            // 点击滑动页面
            this.swapActive(index);
            this.$store.commit("updateClickFlag", true);
            const self = this;

            $("html,body").animate({
                scrollTop: self.tops[index] - 125
            },380,function () {
                self.$store.commit("updateClickFlag", false);
            });
        },
        swapActive (index) {
            // 交换active状态
            this.tab = [];
            this.tab[index] = true;
            this.tips.forEach(function (item, i) {
                item.icon = functionIcon[i].normal;
            });

            this.tips[index].icon = functionIcon[index].active;
        }
    },
    watch: {
        scrollTop (val) {
            val > 496 ? ( this.scrollFlag = true ) : ( this.scrollFlag = false );
            this.clickFlag || this.swapActive(liOn(this.tops,val));
        }
    }
};
</script>