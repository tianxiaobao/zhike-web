<template>
    <div class="behavior-select-group">
        <behavior-target-select class="behavior-select behavior-target" :data="data.targetItem"></behavior-target-select>
        <behavior-type-select class="behavior-select behavior-type" :data="data.operate[0]" :is-select-shop="data.targetItem.isSelectShop && data.targetItem.shopList.length"></behavior-type-select>
    </div>
</template>

<script>
import BehaviorTargetSelect from './BehaviorTargetSelect';
import BehaviorTypeSelect from './BehaviorTypeSelect';
export default {
    props: ['data'],
    components: {
        BehaviorTargetSelect,
        BehaviorTypeSelect
    }
};
</script>

<style lang="scss" scoped>
.behavior-select-group {
    display: flex;
    .behavior-select {
        padding-right: 30px;
        &+.behavior-select {
            padding-left: 32px;
            padding-right: 0;
            position: relative;
            &::before {
                content: '';
                display: block;
                position: absolute;
                background-color: #eee;
                top: 50%;
                left: 0;
                width: 2px;
                // height: 100px;
                // transform: translateY(-50%);
                top: -5px;
                bottom: -5px;
            }
        }
    }
    .behavior-target {
        width: 488px;
    }
    .behavior-type {
        flex-grow: 1;
    }
}
@media (min-width: 1517px) {
    .behavior-select-group .behavior-target {
        width: 578px;
    }
}
@media (min-width: 1643px) {
    .behavior-select-group .behavior-target {
        width: 680px;
    }
}
</style>
