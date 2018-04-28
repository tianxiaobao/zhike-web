const state = {
    profile:''
};

// getters
const getters = {
    profile: state => state.profile
};

// actions
const actions = {
};

// mutations
const mutations = {
    setProfile (state, payload) {
        state.profile = payload;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};