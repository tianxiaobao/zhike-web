<style scoped lang="scss" type="text/scss">
    .first-row-container {
        .left-collection {
            display: flex;
        }

        .right-collection {
            display: flex;
            .group-list {
                margin-right: 8px;
                font-size: 13px;
            }
        }

        .vision-button-item {
        }
    }
</style>

<template>
    <div class="first-row-container">
        <div class="left-collection">
            <vision-button-group>
                <vision-button class="vision-button-item"
                               :class="{'active': routerName === item.token}"
                               :disabled="item.disabled"
                               v-for="(item, index) in toggleCollection"
                               :key="index"
                               @click="toggle(item.token)"
                >
                    <i class="icon" v-html="item.icon">&#xe600;</i>
                    <span>{{ item.label }}</span>
                </vision-button>
            </vision-button-group>
        </div>
        <div class="right-collection">

            <vision-button-group class="group-list" v-if="routerName === groupManagementToken">
                <vision-button v-for="(item, index) in groupList" :key="index"
                               :class="{'active': item.value === currentGroupId}"
                               @click="toggleGroup(item.value)"
                >
                    <i class="icon" v-html="item.icon">&#xe64a;</i>
                    <span>{{ item.label }}</span>
                </vision-button>
            </vision-button-group>

            <vision-button class="vision-button-item"
                           @click="toggle(groupManagementToken)"
                           :class="{'active': routerName === groupManagementToken}"
            >
                <i class="icon">&#xe633;</i>
                <span>分组管理</span>
            </vision-button>
        </div>
    </div>
</template>

<script>
    import VisionButton from './sub-components/vision-button';
    import VisionButtonGroup from './sub-components/vision-button-group';
    import * as routerTypes from '../../../../pages/index/router/route_types';

    export default {
        name: '',
        components: {
            VisionButton,
            VisionButtonGroup
        },
        data () {
            return {
                routerTypes,
                groupManagementToken: routerTypes.FACE_GROUP_MANAGEMENT,
                toggleCollection: [
                    {
                        label: '单项导入',
                        icon: '&#xe600;',
                        token: routerTypes.FACE_SINGLE_ENTRY
                    },
                    {
                        label: '批量导入',
                        icon: '&#xe7b2;',
                        token: routerTypes.FACE_MULTIPLE_ENTRY
                    }
                    // {
                    //     label: '智能摄像',
                    //     icon: '&#xe6e0;',
                    //     token: 'camera',
                    //     disabled: true
                    // }
                ],
                groupList: [
                    {
                        value: 'member',
                        label: '会员',
                        icon: '&#xe660;'
                    },
                    {
                        value: 'passerby',
                        label: '路人',
                        icon: '&#xe647;'
                    },
                    {
                        value: 'customer',
                        label: '常客',
                        icon: '&#xe658;'
                    },
                    {
                        value: 'thief',
                        label: '盗客',
                        icon: '&#xe64a;'
                    }
                ]
            };
        },
        computed: {
            routerName () {
                return this.$route.name;
            },
            currentGroupId () {
                return this.$store.state.vision.groupId;
            }
        },
        methods: {
            toggle (activeToken) {
                this.$router.push({
                    name: activeToken
                });
            },
            toggleGroup (groupId) {
                this.$store.commit('vision/updateGroupId', groupId);
            }
        }
    };
</script>