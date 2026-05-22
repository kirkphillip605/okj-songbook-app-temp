import React from 'react';
import {
  f7ready,
  App,
  View,
  Views,
  Toolbar,
  Link,
} from 'framework7-react';

import routes from '../js/routes';
import store from '../js/store';

const MyApp = () => {
  const f7params = {
    name: 'Vibe Songbook',
    theme: 'ios',
    darkMode: true,
    colors: {
      primary: '#6c5ce7',
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
      <Views tabs className="safe-areas">
        {/* Bottom Tab Bar */}
        <Toolbar tabbar icons bottom className="tabbar-icons">
          <Link
            tabLink="#view-search"
            tabLinkActive
            iconF7="search"
            text="Search"
          />
          <Link
            tabLink="#view-browse"
            iconF7="music_note_list"
            text="Browse"
          />
          <Link
            tabLink="#view-settings"
            iconF7="gear_alt"
            text="Settings"
          />
        </Toolbar>

        {/* Tab Views */}
        <View
          id="view-search"
          main
          tab
          tabActive
          url="/search/"
          iosDynamicNavbar={false}
        />
        <View
          id="view-browse"
          tab
          url="/browse/"
          iosDynamicNavbar={false}
        />
        <View
          id="view-settings"
          tab
          url="/settings/"
          iosDynamicNavbar={false}
        />
      </Views>
    </App>
  );
};

export default MyApp;