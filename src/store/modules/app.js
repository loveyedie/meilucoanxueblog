/**
 * Created by Administrator on 2017/12/24.
 */
const app = {
  state: {

    sidebar: {
      opened: !+sessionStorage.getItem('sidebarStatus')
    },
    searchHistory: []
    //language: Cookies.get('language') || 'zh'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        sessionStorage.setItem('sidebarStatus', 1)
      } else {
        sessionStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    UPDATE_SEARCH_HISTORY: (state, searchKey) => {
      if(state.searchHistory.length > 9){
        state.searchHistory.shift(1);
      }
      searchKey && state.searchHistory.push(searchKey);
    }
    /*SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    }*/
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    updateSearchHistory({ commit }){
      commit('UPDATE_SEARCH_HISTORY')
    }
    /*setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }*/
  }
}

export default app
