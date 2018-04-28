<style scoped lang="scss" type="text/scss">
    .shuffling-card-container {
        height: 330px;
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

            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 14px;

            .user-info {
                font-size: 13px;
                color: #888;
                margin-top: 8px;
            }
            .camera-info {
                font-size: 14px;
                color: #666;
                margin-top: 16px;
            }
            .timestamp {
                font-size: 14px;
                color: #666;
                margin-top: 14px;
            }
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
            .uuid {
                height: 30px;
                font-size: 16px;
                color: #333;
                display: flex;
                align-items: center;
            }
        }

    }
</style>

<template>
    <div class="shuffling-card-container">
        <div class="portrait"
             :style="{'background-image': 'url(' + photo +')'}"
        >
        </div>

        <div class="info-box">
            <div class="tag"
                 :class="{'vip': group === 'member', 'customer': group === 'customer', 'passer-by': group === 'passerby', 'thief': group === 'thief'}"
            >
                {{ group === 'member' ? '会员' : group === 'customer' ? '常客' : group === 'passerby' ? '路人' : '盗客'}}
            </div>
            <div class="uuid">
                {{ uuid }}
            </div>
            <div class="user-info">
                <i class="icon" v-html="gender === 'female' ? '&#xe642;' : '&#xe648;'">&#xe648;</i>
                &nbsp;<span> {{ username === null || username === '' ? '姓名未知' : username }} </span>
                &nbsp;<span>{{ mobile === null || mobile === '' ? '( 手机未知 )' : '( ' + mobile + ' )' }}</span>
            </div>
            <div class="camera-info">
                <i class="icon">&#xe62e;</i>
                <span>{{ cameraPosition }}</span>
            </div>
            <div class="timestamp">
                <i class="icon">&#xe6c1;</i>
                <span>{{ formattedCreatedAt }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: '',
        props: {
            group: {
                type: String,
                default: 'member'
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
                default: null
            },
            uuid: {
                default: 'X-未知'
            },
            cameraPosition: {
                default: '未知机位'
            }
        },
        computed: {
            formattedCreatedAt () {
                if (this.createdAt === null || this.createdAt === undefined || this.createdAt === '') return '';
                return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        data () {
            return {};
        }
    };
</script>