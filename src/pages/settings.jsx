import React, { useState } from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  f7,
} from 'framework7-react';
import { useStore } from 'framework7-react';
import store from '../js/store';

const SettingsPage = () => {
  const singerName = useStore('singerName');
  const [singerInput, setSingerInput] = useState(singerName || '');

  const handleSave = () => {
    store.dispatch('setSingerName', singerInput.trim());
    f7.toast.create({
      text: 'Settings saved!',
      position: 'center',
      closeTimeout: 1500,
    }).open();
  };

  return (
    <Page name="settings" className="settings-page">
      <Navbar>
        <NavTitle>Settings</NavTitle>
      </Navbar>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">Settings</div>
        <div className="page-header-sub">Configure your experience</div>
      </div>

      {/* Singer Name */}
      <div className="section-title">Singer</div>
      <div style={{ padding: '0 16px' }}>
        <div className="settings-item">
          <div className="settings-item-icon">
            <i className="f7-icons">person_fill</i>
          </div>
          <div className="settings-item-content" style={{ flex: 1 }}>
            <div className="form-label" style={{ margin: 0 }}>Your Name</div>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your singer name"
              value={singerInput}
              onChange={(e) => setSingerInput(e.target.value)}
              style={{ marginTop: '8px' }}
              id="singer-input"
            />
            <div style={{
              fontSize: '12px',
              color: 'var(--vibe-text-tertiary)',
              marginTop: '6px',
              lineHeight: 1.4,
            }}>
              This will be remembered for future song requests.
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ padding: '24px 16px 0' }}>
        <button
          className="submit-btn"
          onClick={handleSave}
          style={{ marginTop: 0 }}
        >
          <i className="f7-icons" style={{ fontSize: '18px' }}>checkmark_alt</i>
          Save Settings
        </button>
      </div>

      {/* App Info */}
      <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--vibe-text-tertiary)',
          lineHeight: 1.6,
        }}>
          Vibe Songbook v1.0.0<br />
          Powered by OKJ Songbook API
        </div>
      </div>
    </Page>
  );
};

export default SettingsPage;
