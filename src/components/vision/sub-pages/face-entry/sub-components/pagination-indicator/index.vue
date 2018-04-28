<style scoped>

</style>

<template>
    <span>显示 {{ from }} 到 {{ to }} / 共计 {{ sum }} 条</span>
</template>

<script>
    export default {
        props: {
            currentPage: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 0
            },
            dataCount: {
                type: Number,
                default: 0
            }
        },
        computed: {
            sum () {
                const dataCount = this.dataCount;
                return dataCount;
            },

            from () {
                const currentPage = this.currentPage;
                const pageSize = this.pageSize;
                let from;
                if (this.dataCount === 0) {
                    from = 0;
                } else {
                    from = currentPage * pageSize + 1;
                }
                return from;
            },

            to () {
                const currentPage = this.currentPage;
                const pageSize = this.pageSize;
                const dataCount = this.dataCount;
                const to = pageSize === -1 ? dataCount
                    : pageSize > dataCount ? dataCount
                        : (currentPage + 1) * pageSize > dataCount ? dataCount
                            : (currentPage + 1) * pageSize;
                return to;
            }
        },
        data () {
            return {};
        }
    };
</script>
