<template>
    <div class="phone">
        <div class="phone-message__container">
            <div v-show="message" class="phone-message__bubble">
                <el-input class="phone-message__message"
                    type="textarea"
                    v-model="message" autosize readonly>
                </el-input>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['message']
};
</script>

<style lang="scss" scoped>
.phone {
    position: relative;
    background: linear-gradient(to bottom, #fff, transparent 15%, transparent 50%, #fff), url("~@/assets/phone1.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 310px;
    height: 420px;
    .phone-message__container {
        position: absolute;
        width: 264px;
        height: 280px;
        left: 23px;
        top: 139px;
        overflow: auto;
    }
    .phone-message__bubble {
        margin: 8px;
        border: 10px 10px 10px 15px solid;
        max-width: 154px;
        display: inline-block;
        border-image: url("~@/assets/bubble.jpg") 10 10 10 15 round;
    }
    .phone-message__message {
        margin: -4px -2px;
        display: block;
        width: auto;
        background-color: rgb(230, 229, 235);
    }
}
</style>
<style lang="scss">
.phone {
    .phone-message__message {
        textarea.el-textarea__inner {
            padding: 0;
            border: none;
            color: #383838;
            background-color: rgb(230, 229, 235);
            resize: none;
            overflow: hidden;
            font-size: 12px;
            &:hover, &:active, &:focus {
                border: none;
                box-shadow: none;
            }
        }
    }
}
</style>

