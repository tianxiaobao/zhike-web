<template>
    <div class = "behavior-type">
        <!-- 复选框 -->
        <div class="goods-behavior">
             <el-checkbox-group v-model="checkList">
                <el-checkbox v-for = "(item,index) in commentCheckList"
                             :label="item.key"
                             :key = "index">
                            {{item.value}}
                </el-checkbox>
                <el-checkbox label="shopFollow"
                             key = "shopFollow"
                             :disabled="!isSelectShop">
                            关注店铺
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <!-- 评论 -->
        <div class="comment">
            <div class="item">
                <h4><el-checkbox v-model="checked">评论</el-checkbox>&nbsp;&nbsp;<score-tip :index = "3"></score-tip></h4>
                <p>
                    <ul>
                        <li>
                            <span>评论分数：</span>
                            <el-checkbox-group v-model="commentStar">
                                <el-checkbox-button v-for="city in score" :label="city" :key="city" :disabled = "!checked">{{city}}</el-checkbox-button>
                            </el-checkbox-group>
                        </li>
                        <li>
                            <span>评论内容：</span>
                            <el-input :disabled = "!checked" v-model = "data.comment.keywords"></el-input>
                        </li>
                    </ul>
                </p>
            </div>
            <div class="item">
                <h4><el-checkbox v-model="checked1">搜索</el-checkbox>&nbsp;&nbsp;<score-tip :index = "4"></score-tip></h4>
                <p>
                    <el-input :disabled = "!checked1" v-model = "data.search.keywords"></el-input>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import scoreTip from "@/components/common/ScoreTip";
export default {
    data () {
        return {
            commentCheckList: [{
                key: "pv",
                value: "浏览"
            },{
                key: "order",
                value: "购买"
            },{
                key: "cart",
                value: "加购"
            },{
                key: "follow",
                value: "关注商品"
            }],
            checkList:[],
            score:[1,2,3,4,5],
            comment:"",
            checked:"",
            checked1:"",
            commentStar:[]
        };
    },
    props: ["data", "isSelectShop"],
    computed:{
    },
    components: {
        scoreTip
    },
    watch: {
        checkList (val) {
            this.data.pv = !(val.indexOf("pv") === -1),
            this.data.order = !(val.indexOf("order") === -1),
            this.data.follow = !(val.indexOf("follow") === -1),
            this.data.shopFollow = !(val.indexOf("shopFollow") === -1);
            this.data.cart = !(val.indexOf("cart") === -1);
        },
        checked (val) {
            this.data.comment.state = val;
            if (!val) {
                this.data.comment.value = this.commentStar = [];
                this.data.comment.keywords = "";
            }
        },
        commentStar (val) {
            val && (this.data.comment.point = []);
            val && this.data.comment.point.push(...val);
        },
        comment (val) {
            this.data.comment = val;
        },
        checked1 (val) {
            this.data.search.state = val;
        },
        searchTag (val) {
            this.data.searchTag = val;
        }
    }
};
</script>

<style lang="scss" scoped>
    .behavior-type {
        // .goods-behavior{}
        .comment{
            .item{
                display: flex;
                flex-direction: row;
                margin-top: 15px;
                p{
                    padding-left: 15px;
                    ul>li{
                        display: flex;
                        flex-direction: row;
                        padding-top: 10px;
                        span{
                            word-break: keep-all;
                            padding-right: 5px;
                        }
                    }
                    ul>li:first-child{
                        padding-top:0;
                    }
                }
                .nonChecked{
                    cursor: not-allowed;
                }
            }
        }
    }
</style>
