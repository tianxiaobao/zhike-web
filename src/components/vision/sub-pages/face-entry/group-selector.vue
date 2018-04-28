<style scoped lang="scss" type="text/scss">
    .group-selector-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;

        .group-item {
            width: 20%;
            max-width: 200px;
            height: 90%;
            max-height: 400px;
            border-radius: 2px;
            background-color: #ddd;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: all .3s;
            box-sizing: border-box;
            border: 1px solid rgba(255, 255, 255, 0);

            &.disabled {
                opacity: .6;
            }

            &.can-select:hover{
                transform: scale(1.05);
            }

            &.can-select.active{
                transform: scale(1.1);
            }

            &.can-select.active,
            &.can-select:hover {
                cursor: pointer;
                box-shadow: 2px 2px 2px #ccc;
                border-color: #1276e5;
                z-index: 9;
            }

            &:not(:last-child) {
                margin-right: 8px;
            }

            .icon-container {
                height: 30%;
                font-size: 50px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;

                &:after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    width: 60%;
                    height: 1px;
                    background-color: #fff;
                }
            }

            .title-name {
                height: 15%;
                min-height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .description {
                flex: 1;
                box-sizing: border-box;
                padding: 24px;
                font-size: 14px;
                display: flex;
                text-align: center;
            }

            .footer {
                height: 9%;
                min-height: 30px;
                margin-top: 8px;
                display: flex;
                justify-content: center;
                text-align: center;
                align-items: flex-start;
                font-size: 12px;
            }
        }
    }
</style>

<template>
    <div class="group-selector-container">
        <div class="group-item can-select"
             :class="{'active': valueCopy === 'member'}"
             @click="toggle('member')"
        >
            <div class="icon-container">
                <i class="icon">&#xe660;</i>
            </div>
            <div class="title-name">
                会员库
            </div>
            <div class="description">
                会员信息将被存放于此库中
            </div>
            <div class="footer">
                {{ valueCopy === 'member' ? '已选择' : '点击以选择' }}
            </div>
        </div>
        <div class="group-item can-select"
             :class="{'active': valueCopy === 'thief'}"
             @click="toggle('thief')"
        >
            <div class="icon-container">
                <i class="icon">&#xe64a;</i>
            </div>
            <div class="title-name">
                盗客库
            </div>
            <div class="description">
                曾经涉嫌盗窃行为的人员需存于此库
            </div>
            <div class="footer">
                {{ valueCopy === 'thief' ? '已选择' : '点击以选择' }}
            </div>
        </div>
        <div class="group-item disabled">
            <div class="icon-container">
                <i class="icon">&#xe647;</i>
            </div>
            <div class="title-name">
                路人库
            </div>
            <div class="description">
                前 2 次到店的顾客会被存于此库
            </div>
            <div class="footer">
                路人由系统智能识别并维护
            </div>
        </div>
        <div class="group-item disabled">
            <div class="icon-container">
                <i class="icon">&#xe658;</i>
            </div>
            <div class="title-name">
                常客库
            </div>
            <div class="description">
                到店 3 次及以上的顾客会被存于此库
            </div>
            <div class="footer">
                常客由系统智能识别并维护
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            value: {
                type: String,
                default: 'member'
            }
        },
        data () {
            return {
                valueCopy: 'member'
            };
        },
        created () {
            this.valueCopy = this.value;
        },
        watch: {
            value (newVal) {
                this.valueCopy = newVal;
            },
            valueCopy (newVal) {
                this.$emit('input', newVal);
            }
        },
        methods: {
            toggle (val) {
                this.valueCopy = val;
            }
        }
    };
</script>