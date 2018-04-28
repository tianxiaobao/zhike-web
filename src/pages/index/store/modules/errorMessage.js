const SET_ERROR = 'SET_ERROR';

const state = {
    errorMessage: ''
};

const getters = {
    errorMessage: state => state.errorMessage
};

const mutations = {
    [SET_ERROR] (state, errMsg) {
        state.errorMessage = errMsg;
    }
};

const actions = {
    setError ({ commit }, errMsg) {
        commit(SET_ERROR, errMsg);
    },
    initError ({ commit }) {
        commit(SET_ERROR, '');
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};