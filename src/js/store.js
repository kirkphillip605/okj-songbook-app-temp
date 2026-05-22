import { createStore } from 'framework7/lite';

const SINGER_STORAGE_KEY = 'vibe_singer_name';

// Venue is hardcoded — not user-configurable
const VENUE_URL_NAME = 'wobblypenguin';

const store = createStore({
  state: {
    venueUrlName: VENUE_URL_NAME,
    // Remembered singer name
    singerName: localStorage.getItem(SINGER_STORAGE_KEY) || '',
    // Search state
    searchResults: [],
    searchCount: 0,
    searchLoading: false,
    searchQuery: '',
    // Browse state
    browseResults: [],
    browseCount: 0,
    browseLoading: false,
    activeLetter: '',
    // Request state
    requestLoading: false,
    requestSuccess: false,
    requestError: '',
  },
  getters: {
    venueUrlName({ state }) {
      return state.venueUrlName;
    },
    singerName({ state }) {
      return state.singerName;
    },
    searchResults({ state }) {
      return state.searchResults;
    },
    searchCount({ state }) {
      return state.searchCount;
    },
    searchLoading({ state }) {
      return state.searchLoading;
    },
    searchQuery({ state }) {
      return state.searchQuery;
    },
    browseResults({ state }) {
      return state.browseResults;
    },
    browseCount({ state }) {
      return state.browseCount;
    },
    browseLoading({ state }) {
      return state.browseLoading;
    },
    activeLetter({ state }) {
      return state.activeLetter;
    },
    requestLoading({ state }) {
      return state.requestLoading;
    },
  },
  actions: {
    setSingerName({ state }, name) {
      state.singerName = name;
      localStorage.setItem(SINGER_STORAGE_KEY, name);
    },
    setSearchResults({ state }, { songs, count, query }) {
      state.searchResults = songs;
      state.searchCount = count;
      state.searchQuery = query;
    },
    setSearchLoading({ state }, loading) {
      state.searchLoading = loading;
    },
    setBrowseResults({ state }, { songs, count, letter }) {
      state.browseResults = songs;
      state.browseCount = count;
      state.activeLetter = letter;
    },
    setBrowseLoading({ state }, loading) {
      state.browseLoading = loading;
    },
    setRequestLoading({ state }, loading) {
      state.requestLoading = loading;
    },
    clearSearch({ state }) {
      state.searchResults = [];
      state.searchCount = 0;
      state.searchQuery = '';
    },
    clearBrowse({ state }) {
      state.browseResults = [];
      state.browseCount = 0;
      state.activeLetter = '';
    },
  },
});

export default store;
