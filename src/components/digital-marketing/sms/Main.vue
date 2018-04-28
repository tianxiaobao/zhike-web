<template>
    <div class="sms">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label= "    " disabled></el-tab-pane>
            <el-tab-pane label="短信模板" name="first" v-if="hasAuth[0]"><message-template v-if="activeName === 'first'"></message-template></el-tab-pane>
            <el-tab-pane label="短信任务" name="second" v-if="hasAuth[1]"><message-list v-if="activeName === 'second'"></message-list></el-tab-pane>
            <el-tab-pane label="短信效果" name="third" v-if="hasAuth[2]"><message-result v-if="activeName === 'third'"></message-result></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import MessageList from './components/MessageList';
import MessageResult from './components/MessageResult';
import MessageTemplate from './components/MessageTemplate/Main';
import * as ahthTypes from '@/pages/index/auth_types.js';
import { mapGetters } from 'vuex';
export default {
    components: {
        'message-list': MessageList,
        'message-result': MessageResult,
        MessageTemplate
    },
    data () {
        return {
            activeName: 'first'
        };
    },
    computed: {
        ...mapGetters(['authsButton']),
        hasAuth () {
            const authArr = [];
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSTEMPLATE)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSPLAN)>=0);
            authArr.push(this.authsButton.indexOf(ahthTypes.AUTH_SMSEFFECT)>=0);
            this.activeName = authArr[0]?'first':(authArr[1]?'second':(authArr[2]?'third':''));
            return authArr;
        }
    },
    methods: {
    }
};
</script>
<style lang="scss">
.sms {
	.el-tabs__content{
		padding: 20px;
	}
}
</style>