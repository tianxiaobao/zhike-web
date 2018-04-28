<style scoped lang="scss" type="text/scss">
    .shuffling-card-container {
        height: 400px;
        box-sizing: border-box;
        padding-top: 64px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;

        .portrait {
            position: absolute;
            top: 0;
            width: 128px;
            height: 128px;
            border-radius: 50%;
            background-image: url(http://p2.wmpic.me/article/2015/03/16/1426483585_WFHwnmJk_215x185.jpg);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
            box-sizing: border-box;
            background-color: #eee;
            border: 4px solid #fff;
        }

        .info-box {
            height: 100%;
            width: 100%;
            background-color: #eee;
            box-sizing: border-box;
            padding: 64px 28px 8px;
            transition: all .5s ease-in-out;

            &.is-newest-info-box {
                box-shadow: 5px 5px 5px #ddd;
            }

            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 14px;

            .tag {
                margin: 16px 0 8px;
                padding: 4px 16px;
                border-radius: 2px;

                &.vip {
                    background-color: #5a5;
                    color: #fff;
                }

                &.passer-by {
                    background-color: #999;
                    color: #fff;
                }

                &.customer {
                    background-color: #1276e5;
                    color: #fff;
                }

                &.thief {
                    background-color: #c00;
                    color: #fff;
                }

            }

            .user-info {
                font-size: 13px;
                color: #888;
                margin-top: 8px;
            }

            .statistic {
                display: flex;
                flex: 1;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin: 0 0 16px;

                .statistic-item {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .quantity {
                        height: 75%;
                        display: flex;
                        justify-content: center;
                        align-items: flex-end;
                        font-size: 26px;
                        color: #444;
                        position: relative;

                        .unit {
                            font-size: .12px;
                            color: #aaa;
                            margin-bottom: 5px;
                        }
                    }
                    .description {
                        height: 20%;
                        font-size: 13px;
                        color: #888;
                        text-align: center;
                    }
                }
            }

            .tags-container {
                height: 30px;
                width: 100%;
                margin-top: 4px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;

                .tag-is-empty{
                    font-size: 12px;
                    color: #888;
                }

                .tag-item {
                    max-width: 128px;

                    padding: 4px 8px;
                    border-radius: 2px;
                    font-size: 12px;
                    transform: scale(.85);
                    color: #fff;
                    background-color: rgba(48, 138, 229, 1);
                }
            }

            .frequency-distribution {
                flex: 1;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0 16px 8px;

                .proportion-bar {
                    width: 100%;
                }

                .proportion-bar,
                .note-info {
                    margin-top: 8px;
                }

                .note-info {
                    font-size: 12px;
                }
            }

            .history-panel {
                margin: 8px 0;
                display: flex;
                width: 100%;
                font-size: 13px;
                justify-content: space-between;
            }

            .uuid {
                height: 30px;
                font-size: 16px;
                color: #333;
                display: flex;
                align-items: center;
                transition: all .2s;

                &:hover{
                    cursor: pointer;
                    color: #1256e5;
                    text-decoration: underline;
                }
            }
        }

        .is-newest {
            position: absolute;
            top: 0%;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;

            .important-tag {
                width: 40px;
                height: 40px;
                border: 1px dashed rgba(18, 118, 229, 1);
                border-radius: 50%;
                font-size: 13px;
                color: rgba(18, 118, 229, 1);
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .timestamp {
            position: absolute;
            top: 100%;
            width: 100%;
            height: 40px;
            display: flex;
            font-size: 13px;
            justify-content: center;
            align-items: flex-end;
        }
    }
</style>

<template>
    <div class="shuffling-card-container">
        <div class="portrait"
             :style="{'background-image': 'url(' + photo +')'}"
        >
        </div>

        <div class="info-box" :class="{'is-newest-info-box': isNewest}">
            <div class="tag"
                 :class="{'vip': group === 'member', 'customer': group === 'customer', 'passer-by': group === 'passerby', 'thief': group === 'thief'}"
            >
                {{ group === 'member' ? '会员' : group === 'customer' ? '常客' : group === 'passerby' ? '路人' : '盗客'}}
            </div>
            <div class="uuid" @click="redirectToHistory(uuid)">
                {{ uuid }}
            </div>
            <div class="user-info">
                <i class="icon" v-html="gender === 'female' ? '&#xe642;' : '&#xe648;'">&#xe648;</i>
                &nbsp;<span> {{ username === '' ? '姓名未知' : username }} </span>
                &nbsp;<span>{{ mobile === '' ? '( 手机未知 )' : '( ' + mobile + ' )' }}</span>
            </div>

            <div class="statistic">
                <div class="statistic-item">
                    <div class="quantity">{{ hasArrivedTimes }}</div>
                    <div class="description">历史到店次数</div>
                </div>
                <div class="statistic-item">
                    <div class="quantity">
                        {{ avgStayDuration }}
                        <div class="unit">(min)</div>
                    </div>
                    <div class="description">平均逗留时长</div>
                </div>
            </div>

            <div class="tags-container">
                <span class="tag-is-empty" v-if="tags.length === 0">
                    暂无标签数据
                </span>
                <div class="tag-item" v-for="tag in tags">
                    <span class="zhike-global-ellipsis">{{ tag }}</span>
                </div>
                <!--<div class="tag-item">-->
                <!--<span class="zhike-global-ellipsis">30岁以下</span>-->
                <!--</div>-->
                <!--<div class="tag-item">-->
                <!--<span class="zhike-global-ellipsis">程序员</span>-->
                <!--</div>-->
                <!--<div class="tag-item">-->
                <!--<span class="zhike-global-ellipsis">已婚</span>-->
                <!--</div>-->
                <!--<div class="tag-item">-->
                <!--<span class="zhike-global-ellipsis">白领</span>-->
                <!--</div>-->
            </div>

            <div class="history-panel">
                <div class="last-come">
                    上次：{{ humanizedLastArrived }}
                </div>
                <div class="frequency">
                    周期：{{ frequency }} 次/周
                </div>
            </div>
        </div>

        <div class="is-newest" v-if="isNewest">
            <div class="important-tag">最新</div>
        </div>

        <div class="timestamp">
            {{ createdAt }}
        </div>
    </div>
</template>

<script>
    import ProportionBar from './proportion-bar';
    import moment from 'moment';
    import * as types from '../../../../../../pages/index/router/route_types';

    export default {
        name: '',
        props: {
            isNewest: {
                type: Boolean,
                default: false
            },
            group: {
                type: String,
                default: 'member'
            },
            frequency: {
                type: Number,
                default: 0
            },
            lastArrival: {
                type: String,
                default: '2018-01-08 00:00:00'
            },
            photoUrl: {
                type: String,
                default: ''
            },
            username: {
                type: String,
                default: ''
            },
            gender: {
                type: String,
                default: ''
            },
            mobile: {
                type: String,
                default: ''
            },
            photo: {
                type: String,
                default: ''
            },
            createdAt: {
                type: String,
                default: ''
            },
            uuid: {
                default: 'X-未知'
            },
            hasArrivedTimes: {
                type: Number,
                default: 0
            },
            avgStayDuration: {
                type: Number,
                default: 0
            },
            tags: {
                type: Array,
                default () {
                    return [];
                }
            }
        },
        components: {
            ProportionBar
        },
        computed: {
            humanizedLastArrived () {
                return localeDate(moment().to(moment(this.lastArrival)));
            }
        },
        data () {
            return {};
        },
        methods: {
            redirectToHistory (uuid) {
                this.$store.commit('vision/updateHistoryUuid', uuid);
                this.$router.push({
                    name: types.VISION_SEARCH_BY_TIME_LINE
                });
            }
        }
    };

    function localeDate (origin) {
        let temp = origin;
        temp = temp.replace('an hour', '1小时');
        temp = temp.replace('hours', '小时');
        temp = temp.replace('hour', '小时');
        temp = temp.replace('ago', '前');
        temp = temp.replace('seconds', '秒');
        temp = temp.replace('second', '秒');
        temp = temp.replace('minutes', '分钟');
        temp = temp.replace('minute', '分钟');
        temp = temp.replace('days', '天');
        temp = temp.replace('day', '天');
        temp = temp.replace('a few', '几十');
        temp = temp.replace('a ', '1');
        temp = temp.replace(/\s+/g, "");
        return temp;
    }
</script>