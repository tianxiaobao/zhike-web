<style scoped lang="scss" type="text/scss">
    .customer-button-group{
        display: flex;

        .customer-button:not(:last-child){
            margin-right: -1px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .customer-button:not(:first-child){
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>

<template>
    <div class="customer-button-group">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: '',
        data () {
            return {
            };
        }
    };
</script>