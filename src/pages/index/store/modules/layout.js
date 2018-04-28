const SET_NAV_HIDDEN = 'SET_NAV_HIDDEN';
const SET_SIDE_HIDDEN = 'SET_SIDE_HIDDEN';
const SET_SIDE_COLLAPSE = 'SET_SIDE_COLLAPSE';
const SET_CONTENT_SIZE = 'SET_CONTENT_SIZE';
const SET_CURRENT_MENU = 'SET_CURRENT_MENU';

const state = {
    navHidden: false,
    sideHidden: false,
    sideCollapse: false,
    contentSize: {
        w: -1,
        h: -1
    },
    currentMenu:''
};

const getters = {
    navHidden: state => state.navHidden,
    sideHidden: state => state.sideHidden,
    sideCollapse: state => state.sideCollapse,
    contentSize: state => state.contentSize,
    currentMenu:state => state.currentMenu
};

const mutations = {
    [SET_NAV_HIDDEN] (state, isHidden) {
        state.navHidden = isHidden;
    },
    [SET_SIDE_COLLAPSE] (state, isCollapse) {
        state.sideCollapse = isCollapse;
    },
    [SET_SIDE_HIDDEN] (state, isHidden) {
        state.sideHidden = isHidden;
    },
    [SET_CONTENT_SIZE] (state, size) {
        if(state.contentSize.w !== size.w || state.contentSize.h !== size.h) {
            state.contentSize = size;
        }
    },
    [SET_CURRENT_MENU] (state, currentMenu) {
        state.currentMenu = currentMenu;
    }
};

const actions = {
    collapseSideBar ({ commit }) {
        commit(SET_SIDE_COLLAPSE, true);
    },
    unfoldSideBar ({ commit }) {
        commit(SET_SIDE_COLLAPSE, false);
    },
    toggleSideBar ({ commit, state }) {
        commit(SET_SIDE_COLLAPSE, !state.sideCollapse);
    },
    showSideBar ({ commit }) {
        commit(SET_SIDE_HIDDEN, false);
    },
    hiddenSideBar ({ commit }) {
        commit(SET_SIDE_HIDDEN, true);
    },
    setSideBarVisibility ({ commit }, visibility) {
        commit(SET_SIDE_HIDDEN, !visibility);
    },
    showNavBar ({ commit }) {
        commit(SET_NAV_HIDDEN, false);
    },
    hiddenNavBar ({ commit }) {
        commit(SET_NAV_HIDDEN, true);
    },
    setNavBarVisibility ({ commit }, visibility) {
        commit(SET_NAV_HIDDEN, !visibility);
    },
    setContentSize ({ commit }, size) {
        commit(SET_CONTENT_SIZE, size);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};