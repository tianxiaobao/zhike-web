const state = {
    clickFlag: false,
    scrollTop: 0
};

const getters = {
    clickFlag: state => state.clickFlag,
    scrollTop: state => state.scrollTop

};

const mutations = {
    updateClickFlag (state, status) {
        // 点击状态
        state.clickFlag = status;
    },
    updateScrollTop (state, status) {
        state.scrollTop = status;
    }
};

const actions = {
};

export default {
    state,
    getters,
    mutations,
    actions
};
