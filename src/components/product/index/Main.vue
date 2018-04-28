<style>
.slider-wrap{
    background: rgb(27,41,79);
}
.slider-item{
    width: 1200px;
    margin: 0 auto;
    & .left-area{
        width: 600px;
        float: left;
        color: #fff;
        & h2{
            margin-top: 110px;
            font-size: 44px;
        }
        & p{
            margin-top: 40px;
            font-size: 18px;
        }
        & .product-btn{
            height: 35px;
            line-height: 35px;
            padding: 0 32px;
            color: #fff;
            font-size: 14px;
            margin-top: 15px;
            transition: all .5s ease;
            border: 1px solid #448aff;
            background: rgb(68, 137, 251);
        }
        & .product-btn:hover{
            background: #4733F9;
            border: 1px solid #4733F9;
        }
    }
    & .right-area{
        float: right;
        width: 500px;
        height: 500px;
    }
}
.introduce{
    background: #f8faff;
    padding-bottom: 60px;
    & h2{
        text-align: center;
        font-size: 32px;
        color: #3e3a6a;
        height: 160px;
        line-height: 160px;
    }
    & .introduce-view{
        width: 100%;
        height: 425px;
        box-sizing: border-box;
        overflow: hidden;
        padding: 15px 0;
        position: relative;
        & .i-btn{
            position: absolute;
            top: 15px;
            bottom: 20px;
            width: 35px;
            z-index: 100;
            background: rgba(227, 232, 240, .5);
            cursor: pointer;
        }
        & .i-btn:hover{
            background: rgba(229,234,241,.8);
        }
        & .i-btn:after{
            content: "";
            width: 22px;
            height: 22px;
            top: 195px;
            right: 13px;
            position: absolute;
            border-left: 1px solid #999;
            border-bottom: 1px solid #999;
        }
        & .lt-btn{
            left: 0;
        }
        & .rt-btn{
            right: 0;
        }
        & .lt-btn:after{
			left: 13px;
            -webkit-transform: translate(0,-50%) rotate(45deg);
            transform: translate(0,-50%) rotate(45deg);

        }
        & .rt-btn:after{
			right: 13px;
            -webkit-transform: translate(0,-50%) rotate(-135deg);
            transform: translate(0,-50%) rotate(-135deg);

        }
    }
}
</style>
<template>
<div class="root">
	<div class="slider-wrap">
        <el-carousel height="500px" arrow = "never">
            <el-carousel-item v-for="item in sliders" :key="item.title">
            	<div class="slider-item clear">
            		<div class = "left-area">
                        <h2>{{item.title}}</h2>
                        <p>{{item.content}}</p>
                        <a href="/index.html" target="_blank" class="product-btn">知客控制台</a>
                    </div>
                    <div class="right-area">
                        <img :src = "item.img">
                    </div>
            	</div>
            </el-carousel-item>
        </el-carousel>
	</div>
    <div class="introduce">
        <div class="container">
            <h2>安全、可靠的产品</h2>
            <div class="introduce-view">
                <i class = "i-btn lt-btn" @click.stop = "scrollLeft" v-show = "index !== 0"></i>
                <i class = "i-btn rt-btn" @click.stop = "scrollRight" v-show = "index !== -1"></i>
                <index-desc id = "itr-show"></index-desc>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import indexDesc from "./index-desc";
import * as indexCfg from "./config.js";
import _ from "lodash";
export default{
    data () {
        return {
            sliders: indexCfg.sliders,
            index: 0
        };
    },
    components:{indexDesc},
    methods: {
        scrollRight: _.debounce(
            function () {
                let left = parseInt($("#itr-show .scroll-desc").css('left'));
                left -= 300;
                (left > -500) && $("#itr-show .scroll-desc").css('left', left);
                this.index = Math.floor(left / 300);
            },200
        ),
        scrollLeft:_.debounce(
            function () {
                let left = parseInt($("#itr-show .scroll-desc").css('left'));
                left += 300;
                (left <= 0 ) && $("#itr-show .scroll-desc").css('left', left);
                this.index = Math.floor(left / 300);
            },200
        )
    }
};
</script>