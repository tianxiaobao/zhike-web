<style scoped lang="scss" type="text/scss">
    .the-search-input-button {
        display: flex;
        .search-input {
            height: 100%;
            flex: 1;
            margin-right: -1px;
            height: 100%;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .search-button {
            height: 100%;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>

<template>
    <div class="the-search-input-button">
        <the-input class="search-input" v-model="valueCopy" placeholder="请搜索单个编号" @keyup.native.enter="search"></the-input>
        <the-button class="search-button" size="small" @click="search">
            <i class="icon">&#xe63d;</i>
            <span>搜索</span>
        </the-button>
    </div>
</template>

<script>
    import TheInput from '../../../face-entry/sub-components/vision-input';
    import TheButton from '../../../face-entry/sub-components/vision-button';

    export default {
        name: '',
        props: {
            value: ''
        },
        components: {
            TheInput,
            TheButton
        },
        data () {
            return {
                valueCopy: ''
            };
        },
        watch: {
            value: {
                immediate: true,
                handler (val) {
                    this.valueCopy = val;
                }
            },
            valueCopy (valueCopy) {
                this.$emit('input', valueCopy);
            }
        },
        methods: {
            search () {
                this.$emit('search', this.valueCopy);
            }
        }
    };
</script>