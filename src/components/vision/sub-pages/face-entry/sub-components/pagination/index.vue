<style scoped>
    .self-pagination {
        display: flex;
    }
</style>

<template>
    <vision-button-group class="self-pagination">
        <vision-button size="small" class="ui button"
                       :class="{'disabled' : pagination.first.status === 'disabled'}"
                       @click="redirectPage(pagination.first.value)">首页
        </vision-button>
        <vision-button size="small" class="ui button"
                       :class="{'disabled' : pagination.prev.status === 'disabled'}"
                       @click="redirectPage(pagination.prev.value)">上一页
        </vision-button>
        <vision-button size="small" class="ui button" v-for="(page, index) in pagination.pages" :key="index"
                       :class="{'disabled' : page.status === 'disabled',
                                    'active' : page.status === 'active'}"
                       @click="redirectPage(page.value)">{{ page.title }}
        </vision-button>
        <vision-button size="small" class="ui button"
                       :class="{'disabled' : pagination.next.status === 'disabled'}"
                       @click="redirectPage(pagination.next.value)">下一页
        </vision-button>
        <vision-button size="small" class="ui button"
                       :class="{'disabled' : pagination.last.status === 'disabled'}"
                       @click="redirectPage(pagination.last.value)">末页
        </vision-button>
    </vision-button-group>
</template>

<script>
    import VisionButtonGroup from '../vision-button-group';
    import VisionButton from '../vision-button';

    export default {
        components: {
            VisionButtonGroup,
            VisionButton
        },
        props: {
            dataCount: {
                type: Number,
                default: 0
            },
            currentPage: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 1
            }
        },
        data () {
            return {};
        },

        methods: {
            redirectPage (page) {
                if (page === null || page === undefined || page === false) return;
                this.$emit('redirect-page', page);
            }
        },

        computed: {
            pagination () {
                const dataCount = this.dataCount;
                const currentPage = this.currentPage;
                let pageSize = this.pageSize;
                // 防止除 0 错误
                if (pageSize === 0) pageSize = 1;

                let totalPage = Math.ceil(dataCount / pageSize) - 1;
                if (totalPage < 0) totalPage = 0;

                const pagination = {
                    first: {
                        title: '首页',
                        value: 0
                    },
                    prev: {
                        title: '上一页',
                        value: currentPage - 1
                    },
                    pages: [],
                    next: {
                        title: '下一页',
                        value: currentPage + 1
                    },
                    last: {
                        title: '末页',
                        value: totalPage
                    }
                };

                const disabledPage = {
                    title: '...',
                    status: 'disabled',
                    value: null
                };
                if (currentPage == 0) {
                    pagination.first.status = 'disabled';
                    pagination.first.value = null;
                    pagination.prev.status = 'disabled';
                    pagination.prev.value = null;
                }
                if (currentPage == totalPage) {
                    pagination.last.status = 'disabled';
                    pagination.last.value = null;
                    pagination.next.status = 'disabled';
                    pagination.next.value = null;
                }

                if (totalPage < 5) {
                    for (let index = 0; index <= totalPage; index++) {
                        pagination.pages.push({
                            title: index + 1,
                            value: index
                        });
                    }
                } else {
                    if (currentPage < 2) {
                        pagination.pages.push({
                            title: 1,
                            value: 0
                        });
                        pagination.pages.push({
                            title: 2,
                            value: 1
                        });
                        pagination.pages.push({
                            title: 3,
                            value: 2
                        });
                        pagination.pages.push(disabledPage);
                        pagination.pages.push({
                            title: +totalPage + 1,
                            value: +totalPage
                        });
                    } else if (currentPage > totalPage - 3) {
                        pagination.pages.push({
                            title: 1,
                            value: 0
                        });
                        pagination.pages.push(disabledPage);
                        pagination.pages.push({
                            title: +totalPage - 1,
                            value: +totalPage - 2
                        });
                        pagination.pages.push({
                            title: +totalPage,
                            value: +totalPage - 1
                        });
                        pagination.pages.push({
                            title: +totalPage + 1,
                            value: +totalPage
                        });
                    } else {
                        pagination.pages.push({
                            title: 1,
                            value: 0
                        });
                        pagination.pages.push(disabledPage);
                        pagination.pages.push({
                            title: +currentPage,
                            value: +currentPage - 1
                        });
                        pagination.pages.push({
                            title: +currentPage + 1,
                            value: +currentPage
                        });
                        pagination.pages.push({
                            title: +currentPage + 2,
                            value: +currentPage + 1
                        });
                        pagination.pages.push(disabledPage);
                        pagination.pages.push({
                            title: +totalPage + 1,
                            value: +totalPage
                        });
                    }
                }

                for (const index in pagination.pages) {
                    if (pagination.pages[index].value == currentPage) {
                        pagination.pages[index].status = 'active';
                    }
                }

                return pagination;
            }
        }
    };
</script>
