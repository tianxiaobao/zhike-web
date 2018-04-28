<style scoped lang="scss" type="text/scss">
    .group-management-container {
        display: flex;
        flex-direction: column;
    }

    .info-cards-container {
        flex: 1;
        overflow: auto;
        margin-top: -16px;
        margin-left: -12px;

        .wrap-container{
            display: flex;
            flex-wrap: wrap;
        }

        &::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: rgba(133, 144, 166, .4);
        }
    }

    .info-card {
        width: calc(33% - 12px);
        /*min-width: 275px;*/
        margin-top: 16px;
        margin-left: 15px;
    }

    .pagination-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 36px;
        margin-top: 16px;

        .pagination-indicator {
            color: #777;
            font-size: 15px;
        }
    }
</style>

<template>
    <div class="group-management-container">
        <div class="info-cards-container">
            <div class="wrap-container">
                <info-card class="info-card"
                           v-for="(item, index) in infoList" :key="item.token"
                           :token="item.token"
                           :photo="item.photo"
                           :username="item.username"
                           :gender="item.gender"
                           :mobile="item.mobile"
                           :age="item.age"
                           :group-id="groupId"
                           @need-refresh="refresh"
                >
                </info-card>
            </div>
        </div>
        <div class="pagination-container">
            <pagination-indicator class="pagination-indicator"
                                  :data-count="totalCount"
                                  :current-page="currentPage"
                                  :page-size="pageSize"
            >
            </pagination-indicator>
            <pagination @redirect-page="redirectPage"
                        :data-count="totalCount"
                        :current-page="currentPage"
                        :page-size="pageSize"
            >
            </pagination>
        </div>
    </div>
</template>

<script>
    import InfoCard from './sub-components/info-card';
    import Pagination from '../../sub-components/pagination';
    import PaginationIndicator from '../../sub-components/pagination-indicator';

    export default {
        name: '',
        components: {
            InfoCard,
            Pagination,
            PaginationIndicator
        },
        computed: {
            groupId () {
                return this.$store.state.vision.groupId;
            },
            infoList () {
                return this.$store.state.vision.infoList;
            },
            totalCount () {
                return this.$store.state.vision.infoCount;
            },
            currentMall () {
                return this.$store.getters.currentMall.id;
            },
            currentShop () {
                return this.$store.getters.currentShop.id;
            }
        },
        data () {
            return {
                currentPage: 0,
                pageSize: 15
            };
        },
        watch: {
            groupId () {
                this.redirectPage(0);
            },
            currentMall () {
                this.redirectPage(0);
            },
            currentShop () {
                this.redirectPage(0);
            }
        },
        created () {
            this.redirectPage(this.currentPage);
        },
        methods: {
            refresh () {
                this.redirectPage(this.currentPage);
            },
            redirectPage (page) {
                this.$store.dispatch('vision/getInfoList', {
                    'group_id': this.groupId,
                    'page': page,
                    'page_size': this.pageSize
                }).then(() => {
                    this.currentPage = page;
                });
            }
        }
    };
</script>