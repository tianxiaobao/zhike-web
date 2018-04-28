  <template>
	<div id="app">
        <div class="jc_hd"></div>
		<router-view/>
        <div class="jdc-footer"></div>
	</div>
</template>
<script>
export default {
    name: 'app',
    mounted () {
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll () {
            const top = window.scrollY;
            this.$store.commit("updateScrollTop", top);
            // this.$store.commit("updateClickFlag", false);
        }
    }
};
</script>
<style>
html{
    width: 100%;
    height: 100%;
}
body {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>