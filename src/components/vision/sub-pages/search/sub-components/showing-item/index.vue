<style scoped lang="scss" type="text/scss">
    .showing-item-container {
        display: flex;
        box-sizing: border-box;

        &:last-child .left-info-panel .continuous-line{
            height: calc(100% - 32px);
        }

        .left-info-panel {
            width: 220px;
            position: relative;
            box-sizing: border-box;
            padding-left: 16px;

            .continuous-line {
                position: absolute;
                top: 32px;
                height: calc(100% - 12px);
                width: 2px;
                background-color: rgba(18, 118, 229, .7);
            }
            .focus-point {
                position: absolute;
                top: 26px;
                transform: translate(-45%, -50%);
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: rgba(18, 118, 229, .5);
                border: 1px solid rgba(18, 118, 229, 1);
            }

            .inner-info-panel {
                box-sizing: border-box;
                padding: 14px 48px 0 16px;

                .title {
                    font-size: 18px;
                    color: #1256e5;
                }
                .description {
                    font-size: 14px;
                    color: #888;
                    margin-top: 12px;
                }
                .quantity {
                    font-size: 14px;
                    color: #888;
                    margin-top: 12px;
                }
            }
        }

        .right-list {
            flex: 1;
            overflow: hidden;
            box-sizing: border-box;
            padding-bottom: 24px;

            .show-cards-wrap {
                width: 100%;
                overflow: auto;

                &::-webkit-scrollbar {
                    width: 2px;
                    height: 4px;
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background: rgba(133, 144, 166, .4);
                }

                .inner-wrap {
                    display: flex;

                    .show-card {
                        min-width: 250px;
                        &:not(:first-child) {
                            margin-left: 16px;
                        }
                    }
                }
            }
        }

    }
</style>

<template>
    <div class="showing-item-container">
        <div class="left-info-panel">
            <div class="continuous-line"></div>
            <div class="focus-point"></div>
            <div class="inner-info-panel">
                <div class="title">
                    {{ mainTitle }}
                </div>
                <div class="description" v-if="description !== null">
                    {{ description }}
                </div>
                <div class="quantity">
                    该阶段共捕捉 {{ quantity }} 次
                </div>
            </div>
        </div>
        <div class="right-list">
            <div class="show-cards-wrap">
                <div class="inner-wrap">
                    <show-card class="show-card" v-for="(item, index) in photos" :key="index"
                               :group="item.group_id"
                               :username="item.user_name"
                               :mobile="item.mobile"
                               :gender="item.gender"
                               :photo="item.img"
                               :created-at="item.created_at"
                               :uuid="item.uuid"
                               :camera-position="item.camera.title"
                    >
                    </show-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ShowCard from '../show-card';

    export default {
        name: '',
        props: {
            mainTitle: {
                default: ''
            },
            description: {
                default: ''
            },
            quantity: {
                default: 0
            },
            photos: {
                type: Array,
                default () {
                    return [];
                }
            }
        },
        components: {
            ShowCard
        },
        data () {
            return {
                msg: 'tttt'
            };
        }
    };
</script>