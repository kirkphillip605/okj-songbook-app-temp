import { createStore } from 'framework7/lite';

const SINGER_STORAGE_KEY = 'vibe_singer_name';
const VENUE_ID_STORAGE_KEY = 'vibe_venue_url_name';
const VENUE_OBJECT_STORAGE_KEY = 'vibe_checked_in_venue';
const FAVORITES_STORAGE_KEY = 'vibe_favorites';

const DEFAULT_VENUE_ID = 'wobblypenguin';
const DEFAULT_VENUE_NAME = 'Wobbly Penguin';

const store = createStore({
  state: {
    venueUrlName: localStorage.getItem(VENUE_ID_STORAGE_KEY) || DEFAULT_VENUE_ID,
    checkedInVenue: JSON.parse(localStorage.getItem(VENUE_OBJECT_STORAGE_KEY)) || {
      venueId: DEFAULT_VENUE_ID,
      name: DEFAULT_VENUE_NAME
    },
    // Remembered singer name
    singerName: localStorage.getItem(SINGER_STORAGE_KEY) || '',
    // Favorites list
    favorites: JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [],
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
    // Request sheet state
    requestSheetOpen: false,
    requestSheetSong: null,
  },
  getters: {
    venueUrlName({ state }) {
      return state.venueUrlName;
    },
    checkedInVenue({ state }) {
      return state.checkedInVenue;
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
    favorites({ state }) {
      return state.favorites;
    },
    requestSheetOpen({ state }) {
      return state.requestSheetOpen;
    },
    requestSheetSong({ state }) {
      return state.requestSheetSong;
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
    toggleFavorite({ state }, song) {
      const idx = state.favorites.findIndex(s => s.songId === song.songId);
      let newFavorites;
      if (idx >= 0) {
        newFavorites = state.favorites.filter(s => s.songId !== song.songId);
      } else {
        newFavorites = [...state.favorites, song];
      }
      state.favorites = newFavorites;
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
    },
    openRequestSheet({ state }, song) {
      state.requestSheetSong = song;
      state.requestSheetOpen = true;
    },
    closeRequestSheet({ state }) {
      state.requestSheetOpen = false;
    },
    checkInVenue({ state }, venue) {
      state.venueUrlName = venue.venueId;
      state.checkedInVenue = venue;
      localStorage.setItem(VENUE_ID_STORAGE_KEY, venue.venueId);
      localStorage.setItem(VENUE_OBJECT_STORAGE_KEY, JSON.stringify(venue));
    },
    checkOutVenue({ state }) {
      state.venueUrlName = '';
      state.checkedInVenue = null;
      localStorage.removeItem(VENUE_ID_STORAGE_KEY);
      localStorage.removeItem(VENUE_OBJECT_STORAGE_KEY);
    },
  },
});

export default store;
