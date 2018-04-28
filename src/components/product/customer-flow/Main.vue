<template>
    <div class="root">
        <product-banner :params = "banner"></product-banner>
        <product-title :tops = "tops"></product-title>
        <div class="graybg">
            <div class="container">
                <product-introduce :title = "title[0]"  data-idx= "0" >
                    <product-content
                        v-for = "(item, index) in list"
                        :param = "item"
                        :key = "index"
                    >
                    </product-content>
                </product-introduce>
           </div>
        </div>
        <div class="container">
            <product-introduce :title = "title[1]"  data-idx= "0" >
                <product-content
                    v-for = "(item, index) in feature"
                    :param = "item"
                    :flag = "true"
                    :key = "index"
                >
                </product-content>
            </product-introduce>
        </div>
         <div class="graybg">
            <div class="container">
                <product-introduce :title = "title[2]"  data-idx= "0" >
                    <product-content
                        v-for = "(item, index) in scene"
                        :param = "item"
                        :key = "index"
                    >
                    </product-content>
                </product-introduce>
           </div>
        </div>
    </div>
</template>
<script>
    import "@/assets/css/product/product.css";
    import productBanner from "./../components/product-banner";
    import productIntroduce from "./../components/product-introduce";
    import productTitle from "./../components/product-title";
    import productContent from "./../components/product-content";
    import {advantage,banner,feature,scene} from './config';

    export default{
        data () {
            return {
                title:['产品优势', '产品功能', '应用场景'],
                tops:[],
                clcikFlag: false,
                banner: banner,
                list: advantage,
                feature: feature,
                scene: scene
            };
        },
        components:{productBanner,productIntroduce,productTitle,productContent},
        methods:{
        },
        mounted () {
            const el = document.querySelectorAll("[data-idx]");
            const self = this;
            el.forEach( (item) => {
                self.tops.push(item.offsetTop - 120);
            });
            this.$nextTick(function () {
                window.addEventListener('mousewheel', function () {
                    self.clcikFlag = false;
                });
            });
        }
    };
</script>