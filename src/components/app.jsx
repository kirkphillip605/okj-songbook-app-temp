import React, { useState, useEffect } from 'react';
import {
  f7ready,
  App,
  View,
  Views,
  Toolbar,
  Link,
  Panel,
  Page,
  Navbar,
  NavTitle,
  NavRight,
  f7,
} from 'framework7-react';
import { useStore } from 'framework7-react';

import routes from '../js/routes';
import store from '../js/store';
import RequestSheet from './RequestSheet.jsx';

const LeftPanelContent = () => {
  const checkedInVenue = useStore('checkedInVenue');

  const handleLeaveShow = () => {
    store.dispatch('checkOutVenue');
    f7.tab.show('#view-shows');
    f7.panel.close('left');
    f7.toast.create({
      text: 'Checked out of show',
      position: 'bottom',
      closeTimeout: 1500,
    }).open();
  };

  return (
    <Page name="left-panel" className="left-panel-page">
      <Navbar>
        <NavTitle>Menu</NavTitle>
        <NavRight>
          <Link iconF7="multiply" panelClose />
        </NavRight>
      </Navbar>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 44px)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {/* Checked-in Venue Card */}
          <div className="panel-card">
            <div className="panel-card-title">Current Show</div>
            {checkedInVenue ? (
              <div className="venue-status-checkedin">
                <div className="venue-badge">
                  <i className="f7-icons" style={{ fontSize: '13px', color: '#fff', marginRight: '4px' }}>checkmark_seal_fill</i>
                  Checked In
                </div>
                <div className="venue-name">{checkedInVenue.name}</div>
                <div className="venue-id-sub">ID: {checkedInVenue.venueId}</div>
                <button className="leave-show-btn" onClick={handleLeaveShow}>
                  <i className="f7-icons" style={{ fontSize: '16px', marginRight: '4px' }}>arrow_left_square</i> Leave Show
                </button>
              </div>
            ) : (
              <div className="venue-status-empty">
                <div className="empty-text">Not checked in to any venue</div>
                <button className="go-to-shows-btn" onClick={() => { f7.tab.show('#view-shows'); f7.panel.close('left'); }}>
                  Find a Show
                </button>
              </div>
            )}
          </div>

          {/* Menu Options */}
          <div className="menu-list" style={{ marginTop: '24px' }}>
            <a href="#" className="menu-item-link" onClick={(e) => e.preventDefault()}>
              <i className="f7-icons">placemark</i>
              <span>Favorite Venues</span>
            </a>
            <a href="#" className="menu-item-link" onClick={(e) => e.preventDefault()}>
              <i className="f7-icons">heart</i>
              <span>Favorite Songs</span>
            </a>
            <a href="#" className="menu-item-link" onClick={(e) => e.preventDefault()}>
              <i className="f7-icons">clock</i>
              <span>Request History</span>
            </a>
          </div>
        </div>

        {/* Sticky Settings Section */}
        <div className="sticky-settings-panel">
          <a href="#" className="menu-item-link" onClick={(e) => { e.preventDefault(); f7.panel.close('left'); f7.panel.open('right'); }}>
            <i className="f7-icons">gear_alt</i>
            <span>Settings / Profile</span>
          </a>
        </div>
      </div>
    </Page>
  );
};

const ProfilePanelContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const singerName = useStore('singerName');
  const [singerInput, setSingerInput] = useState(singerName || '');

  useEffect(() => {
    setSingerInput(singerName || '');
  }, [singerName]);

  const handleSaveName = () => {
    store.dispatch('setSingerName', singerInput.trim());
    f7.toast.create({
      text: 'Name saved!',
      position: 'bottom',
      closeTimeout: 1500,
    }).open();
  };

  return (
    <Page name="profile-panel" className="profile-panel-page">
      <Navbar>
        <NavTitle>{isLoggedIn ? 'Profile' : 'Account'}</NavTitle>
        <NavRight>
          <Link iconF7="multiply" panelClose />
        </NavRight>
      </Navbar>

      <div style={{ padding: '16px', height: 'calc(100% - 44px)', boxSizing: 'border-box', overflowY: 'auto' }}>
        {isLoggedIn ? (
          <div>
            {/* Signed-in Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  <i className="f7-icons">person_crop_circle_fill</i>
                </div>
              </div>
              <div className="profile-name">Phillip Kirk</div>
              <div className="profile-email">phillip@kirknetworks.com</div>
              
              {/* Singer Name Editing */}
              <div className="singer-name-edit-section">
                <div className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Singer Name</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter singer name"
                    value={singerInput}
                    onChange={(e) => setSingerInput(e.target.value)}
                    style={{ flex: 1, margin: 0, height: '36px' }}
                    id="singer-input-panel"
                  />
                  <button className="save-singer-btn" onClick={handleSaveName}>
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="menu-list" style={{ marginTop: '24px' }}>
              <a href="#" className="menu-item-link" onClick={(e) => e.preventDefault()}>
                <i className="f7-icons">person</i>
                <span>Manage Profile</span>
              </a>
              <a href="#" className="menu-item-link" onClick={(e) => e.preventDefault()}>
                <i className="f7-icons">lock_shield</i>
                <span>Password & Security</span>
              </a>
              <a href="#" className="menu-item-link logout" onClick={(e) => { e.preventDefault(); setIsLoggedIn(false); }}>
                <i className="f7-icons">arrow_left_square</i>
                <span>Log Out</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="logged-out-state">
            <div className="avatar-placeholder">
              <i className="f7-icons">person_crop_circle</i>
            </div>
            <div className="logged-out-title">Welcome to Vibe</div>
            <div className="logged-out-sub">Sign in to sync your favorites and request history.</div>

            <button className="auth-btn-signin" onClick={() => setIsLoggedIn(true)}>
              Sign In
            </button>
            <button className="auth-btn-signup" onClick={() => setIsLoggedIn(true)}>
              Create Account
            </button>
          </div>
        )}

        {/* App Info Footer */}
        <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
          <img
            src="/icon.png"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              marginBottom: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            }}
            alt="App Icon"
          />
          <div style={{
            fontSize: '11px',
            color: 'var(--vibe-text-tertiary)',
            lineHeight: 1.6,
          }}>
            Vibe Songbook v1.0.0<br />
            Powered by OKJ Songbook API
          </div>
        </div>
      </div>
    </Page>
  );
};

const AppContent = () => {
  const requestSheetOpen = useStore('requestSheetOpen');
  const requestSheetSong = useStore('requestSheetSong');

  return (
    <>
      <Views tabs className="safe-areas">
        {/* Bottom Tab Bar */}
        <Toolbar tabbar icons bottom className="tabbar-icons">
          <Link
            tabLink="#view-shows"
            tabLinkActive
            iconF7="calendar"
            text="Shows"
          />
          <Link
            tabLink="#view-search"
            iconF7="search"
            text="Search"
          />
          <Link
            tabLink="#view-favorites"
            iconF7="heart"
            text="Favorites"
          />
          <Link
            tabLink="#view-live"
            iconF7="play_circle"
            text="Live"
          />
        </Toolbar>

        {/* Tab Views */}
        <View
          id="view-shows"
          main
          tab
          tabActive
          url="/shows/"
          iosDynamicNavbar={false}
        />
        <View
          id="view-search"
          tab
          url="/search/"
          iosDynamicNavbar={false}
        />
        <View
          id="view-favorites"
          tab
          url="/favorites/"
          iosDynamicNavbar={false}
        />
        <View
          id="view-live"
          tab
          url="/live/"
          iosDynamicNavbar={false}
        />
      </Views>

      {/* Global Request Sheet */}
      <RequestSheet
        opened={requestSheetOpen}
        song={requestSheetSong}
        onClose={() => store.dispatch('closeRequestSheet')}
      />
    </>
  );
};

const MyApp = () => {
  const f7params = {
    name: 'Vibe Songbook',
    theme: 'ios',
    darkMode: true,
    colors: {
      primary: '#ff5e36',
    },
    touch: {
      tapHold: true,
    },
    store: store,
    routes: routes,
  };

  f7ready(() => {
    // F7 is ready
  });

  return (
    <App {...f7params}>
      {/* Slide-out Left Menu Panel */}
      <Panel left cover id="panel-left">
        <View>
          <LeftPanelContent />
        </View>
      </Panel>

      {/* Slide-out Profile Panel */}
      <Panel right cover id="panel-profile">
        <View>
          <ProfilePanelContent />
        </View>
      </Panel>

      <AppContent />
    </App>
  );
};

export default MyApp;
