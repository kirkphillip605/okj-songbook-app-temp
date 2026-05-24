import React from 'react';
import {
  Page,
} from 'framework7-react';
import { useStore } from 'framework7-react';
import SongList from '../components/SongList.jsx';
import store from '../js/store';
import VibeNavbar from '../components/VibeNavbar.jsx';

const FavoritesPage = () => {
  const favorites = useStore('favorites') || [];

  const handleSongTap = (song) => {
    store.dispatch('openRequestSheet', song);
  };

  return (
    <Page
      name="favorites"
      className="favorites-page"
    >
      <VibeNavbar />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">Favorites</div>
        <div className="page-header-sub">Your quick-request song list</div>
      </div>

      {/* Favorites List Content */}
      <div style={{ padding: '0 16px 24px' }}>
        {favorites.length > 0 ? (
          <SongList songs={favorites} onSongTap={handleSongTap} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="f7-icons">heart</i>
            </div>
            <div className="empty-state-title">No favorites yet</div>
            <div className="empty-state-text">
              Tap the heart icon next to any song in Search or Browse to save it here for quick access.
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default FavoritesPage;
