const SET_TIPS = 'SET_TIPS';

const state = {
    tips: '知客为您提供无缝的数据服务'
};

// getters
const getters = {
    tips: state => state.tips
};

// actions
const actions = {
    setTips ({ commit }, tips) {
        commit(SET_TIPS, tips);
    }
};

// mutations
const mutations = {
    [SET_TIPS] (state, tips) {
        state.tips = tips;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};