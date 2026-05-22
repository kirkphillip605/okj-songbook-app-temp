import React, { useState, useRef, useCallback } from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  Preloader,
} from 'framework7-react';
import { useStore } from 'framework7-react';
import { searchSongs } from '../js/api';
import store from '../js/store';
import SongList from '../components/SongList.jsx';
import RequestSheet from '../components/RequestSheet.jsx';

const SearchPage = () => {
  const venueUrlName = useStore('venueUrlName');
  const searchResults = useStore('searchResults');
  const searchCount = useStore('searchCount');
  const searchLoading = useStore('searchLoading');
  const searchQuery = useStore('searchQuery');

  const [inputValue, setInputValue] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const debounceRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      store.dispatch('clearSearch');
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (!venueUrlName) return;
      store.dispatch('setSearchLoading', true);
      try {
        const result = await searchSongs(venueUrlName, value.trim());
        store.dispatch('setSearchResults', {
          songs: result.songs,
          count: result.songCount,
          query: value.trim(),
        });
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        store.dispatch('setSearchLoading', false);
      }
    }, 350);
  }, [venueUrlName]);

  const clearSearch = () => {
    setInputValue('');
    store.dispatch('clearSearch');
  };

  const handleSongTap = (song) => {
    setSelectedSong(song);
    setSheetOpen(true);
  };



  return (
    <Page name="search" className="search-page">
      <Navbar>
        <NavTitle>Search</NavTitle>
      </Navbar>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">Find a Song</div>
        <div className="page-header-sub">Search by title or artist</div>
      </div>

      {/* Search Bar */}
      <div className="vibe-searchbar-wrap">
        <div className="vibe-searchbar">
          <i className="f7-icons search-icon">search</i>
          <input
            type="text"
            placeholder="Search songs or artists…"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            id="search-input"
          />
          <span
            className={`clear-btn f7-icons ${inputValue ? 'visible' : ''}`}
            onClick={clearSearch}
          >
            xmark_circle_fill
          </span>
        </div>
      </div>

      {/* Loading */}
      {searchLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <Preloader />
        </div>
      )}

      {/* Results Header */}
      {!searchLoading && searchQuery && (
        <div className="results-header">
          <span className="results-label">Results for "{searchQuery}"</span>
          <span className="results-count">{searchCount} songs</span>
        </div>
      )}

      {/* Song Results */}
      {!searchLoading && searchResults.length > 0 && (
        <SongList songs={searchResults} onSongTap={handleSongTap} />
      )}

      {/* Empty state: no results */}
      {!searchLoading && searchQuery && searchResults.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="f7-icons">music_note</i>
          </div>
          <div className="empty-state-title">No songs found</div>
          <div className="empty-state-text">
            Try a different search term or check your spelling.
          </div>
        </div>
      )}

      {/* Empty state: no query */}
      {!searchLoading && !searchQuery && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="f7-icons">search</i>
          </div>
          <div className="empty-state-title">Start searching</div>
          <div className="empty-state-text">
            Type a song title or artist name to find tracks.
          </div>
        </div>
      )}

      {/* Request Sheet */}
      <RequestSheet
        opened={sheetOpen}
        song={selectedSong}
        onClose={() => setSheetOpen(false)}
      />
    </Page>
  );
};

export default SearchPage;
