<template>
  <div class="value-block" :class="{clickable: clickable, active: active}">
      <div class="block-inner" @click="onClick">
        <div class="block-text">
            <p class="main-info">
                <slot></slot>
            </p>
            <p class="sub-info">
                <slot name="sub"></slot>
            </p>
        </div>
        <div class="block-icon">
            <slot name="icon"></slot>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    props: ['clickable', 'active'],
    methods: {
        onClick (e) {
            if(this.clickable) {
                this.$emit('click', e);
            }
        }
    }
};
</script>

<style scoped lang="scss">
.value-block {
    &.clickable {
        .block-inner {
            padding: 36px 15%;
            border: 1px solid rgb(205, 234, 241);
        }
        &:hover, &.active {
            .block-inner {
                border: 2px solid #06AEF1;
                padding: 35px calc(15% - 1px);
            }
        }
        &::after {
            content: '.';
            display: block;
            height: 0;
            width: 0;
            font-size: 0;
            margin-left: 50%;
            transform: translate(-50%, 0);
            border: 0 solid transparent;
            border-width: 10px 10px 0 10px;
            clear: both;
        }
        &.active::after {
            border-color: #06AEF1 transparent transparent transparent;
        }
    }
    .block-inner {
        padding: 26px 8%;
        background-color: #fff;
        &::after {
            content: '.';
            display: block;
            height: 0;
            font-size: 0;
            visibility: hidden;
            clear: both;
        }
        .block-text {
            float: left;
            .main-info {
                font-size: 36px;
                line-height: normal;
                color: #06AEF1;
            }
            .sub-info {
                font-size: 16px;
                line-height: normal;
            }
        }
        .block-icon {
            float: right;
            padding: 7px 0;
            img {
                width: 62px;
                height: 62px;
            }
        }
    }
}

</style>
