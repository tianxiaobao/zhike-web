<template>
    <el-dialog title="短信预览" class="dialog" size="tiny" :visible.sync="visible" :before-close="handleClose">
        <preview :message="message" class="preview"></preview>
        <div slot="footer" class="dialog-footer">
            <el-button type="success" @click="handleClose">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Preview from './components/Preview';
export default {
    props: ['visible'],
    components: {
        Preview
    },
    data () {
        return {
            message: ''
        };
    },
    created () {
        this.$on('set', message => {
            this.message = message;
        });
    },
    methods: {
        handleClose () {
            this.message = '';
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.preview {
    margin: auto;
}
</style>
