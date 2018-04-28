<template>
	<div class="scoreTip">
		<el-popover
			ref="popover1"
			placement="top-start"
			width="300"
			trigger="hover"
			:content="content">
			<slot></slot>
		</el-popover>
		<i class="icon" v-popover:popover1>&#xe64a;</i>
	</div>
</template>
<script>
const contents = [
    '用户在统计周期内购物距今的时间间隔标准化得分，只统计有效订单，不计虚拟订单、1元以下订单以及500万以上订单。分值范围0~100',
    '用户在统计周期内购买次数的标准化得分，只统计有效订单，不计虚拟订单、1元以下订单以及500万以上订单。分值范围0~100',
    '用户在统计周期内购买金额的标准化得分，只统计有效订单，不计虚拟订单、1元以下订单以及500万以上订单。分值范围0~100',
    '购买过的用户在统计周期内对于商品的评论，评论分数中5分为好评，1分为差评',
    '搜索关键字，以逗号分隔'
];
export default {
    props: ['index'],
    computed: {
        content () {
            return contents[this.index];
        }
    }
};
</script>

<style lang="scss" scoped>
.scoreTip {
	display: inline-block;
	i {
		cursor: default;
		color: #06AEF1;
	}
}
</style>