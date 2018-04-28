import * as types from '../mutation-types';

// state
const state = {
    userPackage: {}
};

// getters
const getters = {
    userPackage: state => state.userPackage
};

// mutations
const mutations = {
    [types.INIT_PACKAGE] (state) {
        state.userPackage = {};
    },
    [types.SET_PACKAGE] (state, userPackage) {
        state.userPackage = userPackage;
    }
};

// actions
const actions = {
    setPackage ({ commit }, userPackage) {
        commit(types.SET_PACKAGE, userPackage);
    },
    initPackage ({ commit }) {
        commit(type.INIT_PACKAGE);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};