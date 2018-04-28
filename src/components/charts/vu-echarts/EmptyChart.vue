<script>

import BaseChart from './BaseChart';
export default {
    mixins: [ BaseChart ],
    data () {
        return {
            initOption: {
                title: {
                    text: '暂无数据',
                    textStyle: {
                        color: '#999'
                    },
                    left: 'center',
                    top: 'middle'
                },
                series: []
            }
        };
    },
    methods: {
        getOption () {
            return {};
        }
    }
};
</script>
