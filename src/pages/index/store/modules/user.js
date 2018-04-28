const SET_USERNAME = 'SET_USERNAME';
const SET_USERPIN = 'SET_USERPIN';
const SET_AUTHS = 'SET_AUTHS';
const SET_AUTHS_BUTTON = 'SET_AUTHS_BUTTON';

import { getAuths,getUserPms } from '@/apis/user';
import * as authTypes from '@/pages/index/auth_types';

let authPromise = null;

const state = {
    username: '',
    userpin: '',
    auths: null,
    authsButton:''
};

// getters
const getters = {
    username: state => state.username,
    userpin: state => state.userpin,
    auths: state => state.auths || [],
    authsButton: state => state.authsButton || []
};

// actions
const actions = {
    setUserName ({ commit }, username) {
        commit(SET_USERNAME, username);
    },
    setUserPin ({ commit }, userpin) {
        commit(SET_USERPIN, userpin);
    },
    getAuths ({ dispatch, commit, state, getters }) {
        if(!state.auths) {
            if(!authPromise) {
                authPromise = Promise.all([getAuths(), getUserPms()]).then(data => {
                    const auths = [];
                    if(data[0].message.Boolean) {
                        auths.push(authTypes.AUTH_ADMIN);
                    }
                    let map = [];
                    for(const i in data[1].message.HashMap.menu) {
                        map = map.concat(data[1].message.HashMap.menu[i]);
                    }
                    map.forEach(function (item) {
                        auths.push(item.code);
                    });
                    commit(SET_AUTHS_BUTTON, data[1].message.HashMap.permission);
                    commit(SET_AUTHS, auths);
                    return auths;
                }).catch(err => {
                    commit(SET_AUTHS, []);
                    if(err.message) {
                        dispatch('setError', '获取用户权限失败: ' + err.message);
                    }
                    return [];
                });
            }
            return authPromise;
        }
        return getters.auths;
    }
};

// mutations
const mutations = {
    [SET_USERNAME] (state, username) {
        state.username = username;
    },
    [SET_USERPIN] (state, userpin) {
        state.userpin = userpin;
    },
    [SET_AUTHS] (state, auths) {
        state.auths = auths;
    },
    [SET_AUTHS_BUTTON] (state, authsButton) {
        state.authsButton = authsButton;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};