import React, { useState, useCallback } from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  Preloader,
} from 'framework7-react';
import { useStore } from 'framework7-react';
import { browseSongs } from '../js/api';
import store from '../js/store';
import SongList from '../components/SongList.jsx';
import PerformanceTypePopover from '../components/PerformanceTypePopover.jsx';
import RequestPopup from '../components/RequestPopup.jsx';

const LETTERS = [
  '#', '@',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

const BrowsePage = () => {
  const venueUrlName = useStore('venueUrlName');
  const browseResults = useStore('browseResults');
  const browseCount = useStore('browseCount');
  const browseLoading = useStore('browseLoading');
  const activeLetter = useStore('activeLetter');

  const [selectedSong, setSelectedSong] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [perfType, setPerfType] = useState('solo');

  const handleLetterTap = useCallback(async (letter) => {
    if (!venueUrlName) return;
    if (letter === activeLetter && browseResults.length > 0) return;

    store.dispatch('setBrowseLoading', true);
    store.dispatch('setBrowseResults', { songs: [], count: 0, letter });

    try {
      const result = await browseSongs(venueUrlName, letter);
      store.dispatch('setBrowseResults', {
        songs: result.songs,
        count: result.resultCount,
        letter,
      });
    } catch (err) {
      console.error('Browse failed:', err);
    } finally {
      store.dispatch('setBrowseLoading', false);
    }
  }, [venueUrlName, activeLetter, browseResults.length]);

  // User taps a song – open popover to pick performance type
  const handleSongTap = (song) => {
    setSelectedSong(song);
    setPerfType('solo'); // default
    setPopoverOpen(true);
  };

  // Called from popover when a type is chosen
  const handlePerfSelect = (type) => {
    setPerfType(type);
    setPopoverOpen(false);
    setPopupOpen(true);
  };

  return (
    <Page name="browse" className="browse-page">
      <Navbar>
        <NavTitle>Browse</NavTitle>
      </Navbar>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">Browse Artists</div>
        <div className="page-header-sub">Tap a letter to explore</div>
      </div>

      {/* Alphabet Index */}
      <div className="alpha-index">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            className={`alpha-index-btn${activeLetter === letter ? ' active' : ''}`}
            onClick={() => handleLetterTap(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Loading */}
      {browseLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <Preloader />
        </div>
      )}

      {/* Results Header */}
      {!browseLoading && activeLetter && browseResults.length > 0 && (
        <div className="results-header">
          <span className="results-label">Artists starting with "{activeLetter}"</span>
          <span className="results-count">{browseCount} songs</span>
        </div>
      )}

      {/* Song Results */}
      {!browseLoading && browseResults.length > 0 && (
        <SongList songs={browseResults} onSongTap={handleSongTap} />
      )}

      {/* Empty state: no results for letter */}
      {!browseLoading && activeLetter && browseResults.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="f7-icons">music_note</i>
          </div>
          <div className="empty-state-title">No artists found</div>
          <div className="empty-state-text">
            No artists start with "{activeLetter}" in this venue's catalog.
          </div>
        </div>
      )}

      {/* Empty state: no letter selected */}
      {!browseLoading && !activeLetter && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="f7-icons">textformat_abc</i>
          </div>
          <div className="empty-state-title">Pick a letter</div>
          <div className="empty-state-text">
            Tap any letter above to browse artists in the catalog.
          </div>
        </div>
      )}

      {/* Popover for performance type selection */}
      <PerformanceTypePopover
        opened={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        onSelect={handlePerfSelect}
      />

      {/* Request popup (solo / duet / group) */}
      <RequestPopup
        opened={popupOpen}
        onClose={() => setPopupOpen(false)}
        song={selectedSong}
        perfType={perfType}
      />
    </Page>
  );
};

export default BrowsePage;
