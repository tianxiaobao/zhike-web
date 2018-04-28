<style scoped lang="scss" type="text/scss">

</style>

<template>
    <div class="date-range-toggle-container">
        <the-button-group class="">
            <the-button class="date-toggle-item" :active="activeToken === 1" size="small" @click="toggle(1)">最近一月
            </the-button>
            <the-button class="date-toggle-item" :active="activeToken === 3" size="small" @click="toggle(3)">最近三月
            </the-button>
            <the-button class="date-toggle-item" :active="activeToken === -1" size="small" @click="toggle(6)">最近半年
            </the-button>
            <the-button class="date-toggle-item" :active="activeToken === 12" size="small" @click="toggle(12)">最近一年
            </the-button>
        </the-button-group>
    </div>
</template>

<script>
    import TheButtonGroup from '../../../face-entry/sub-components/vision-button-group';
    import TheButton from '../../../face-entry/sub-components/vision-button';
    import moment from 'moment';

    export default {
        name: '',
        components: {
            TheButtonGroup,
            TheButton
        },
        data () {
            return {
                activeToken: 1
            };
        },
        created () {
            this.toggle(this.activeToken);
        },
        methods: {
            toggle (rangeToken) {
                this.activeToken = rangeToken;
                const end = moment();
                let start = -1;
                if (rangeToken !== -1) {
                    start = end.clone().subtract(rangeToken, 'months');
                }
                const range = {
                    start: start === -1 ? -1 : start.unix(),
                    end: end.unix()
                };
                this.$emit('toggle', range);
            }
        }
    };
</script>