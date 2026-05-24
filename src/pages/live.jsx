import React from 'react';
import { Page, Block } from 'framework7-react';
import VibeNavbar from '../components/VibeNavbar.jsx';

const LivePage = () => {
  // Simulated data for mockup
  const nowPlaying = {
    title: 'Beautiful Dreamer',
    artist: 'Al Jolson',
    singer: 'Phillip Kirk',
  };

  const rotation = [
    { id: 1, name: 'Alice Smith', song: 'Teenage Dream', order: 1 },
    { id: 2, name: 'David Jones', song: 'Rocket Man', order: 2 },
    { id: 3, name: 'Sarah Miller', song: 'Don\'t Stop Believin\'', order: 3 },
    { id: 4, name: 'James Wilson', song: 'My Way', order: 4 },
  ];

  return (
    <Page name="live" className="live-page">
      <VibeNavbar />

      <div className="page-header" style={{ paddingBottom: '8px' }}>
        <div className="page-header-title">Live Stage</div>
        <div className="page-header-sub">See who is on stage and upcoming rotation</div>
      </div>

      <Block style={{ margin: '16px' }}>
        {/* Now Playing Banner */}
        <div className="live-now-playing-banner">
          <div className="banner-glowing-effect"></div>
          <div className="banner-badge">
            <span className="pulse-indicator-live"></span>
            ON STAGE
          </div>
          <div className="now-playing-song">{nowPlaying.title}</div>
          <div className="now-playing-artist">by {nowPlaying.artist}</div>
          <div className="now-playing-footer">
            <i className="f7-icons">person_crop_circle_fill</i>
            <span>Singer: {nowPlaying.singer}</span>
          </div>
        </div>

        {/* Show Stats */}
        <div className="live-stats-row" style={{ marginTop: '16px' }}>
          <div className="stat-card">
            <div className="stat-value">15</div>
            <div className="stat-label">Singers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">45m</div>
            <div className="stat-label">Est. Wait</div>
          </div>
          <div className="stat-card">
            <div className="stat-value active">Open</div>
            <div className="stat-label">Requests</div>
          </div>
        </div>

        {/* Rotation Card */}
        <div className="panel-card" style={{ marginTop: '20px', padding: '16px 20px' }}>
          <div className="panel-card-title" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Upcoming Rotation</span>
            <span style={{ fontSize: '11px', color: 'var(--vibe-text-tertiary)', fontWeight: 'normal' }}>Refresh auto</span>
          </div>

          <div className="rotation-list">
            {rotation.map((item) => (
              <div key={item.id} className="rotation-item">
                <div className="rotation-number">#{item.order}</div>
                <div className="rotation-info">
                  <div className="rotation-singer">{item.name}</div>
                  <div className="rotation-song">{item.song}</div>
                </div>
                <div className="rotation-time">
                  {item.order * 12}m wait
                </div>
              </div>
            ))}
          </div>
        </div>
      </Block>
    </Page>
  );
};

export default LivePage;
