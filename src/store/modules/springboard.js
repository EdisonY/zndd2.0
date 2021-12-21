const state = {
    link:{},
    scheme:{},
    plan:{},
    case:{},
    run:{},
    log:{},
    warn:{}
}
const getters = {
    websocketData(state) {
      return state.link;
    },
    schemeData(state){
        return state.scheme;
    },
    PlanData(state){
        return state.plan;
    },
    CaseData(state){
        return state.case;
    },
    RunData(state){
        return state.run;
    },
    LogData(state){
        return state.log
    },
    warnData(state){
        return state.warn
    },
}
const mutations = {
    get_WebsocketData(state, data) {
        state.link = data;
    },
    get_SchemeData(state, data) {
        state.scheme = data;
    },
    get_PlanData(state, data) {
        state.plan = data;
    },
    get_CaseData(state, data) {
        state.case = data;
    },
    get_RunData(state, data) {
        state.run = data;
    },
    get_LogData(state, data) {
        state.log = data
    },
    get_warnData(state, data) {
        state.warn = data
    },
}
const actions = {
    getWebsocketData({ commit }, data) {
        commit("get_WebsocketData", data);
    },
    getSchemeData({ commit }, data) {
        commit("get_SchemeData", data);
    },
    getPlanData({ commit }, data) {
        commit("get_PlanData", data);
    },
    getCaseData({ commit }, data) {
        commit("get_CaseData", data);
    },
    getLogData({ commit }, data) {
        commit("get_LogData", data);
    },
    getRunData({ commit }, data) {
        commit("get_RunData", data);
    },
    getwarnData({ commit }, data) {
        commit("get_warnData", data);
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}