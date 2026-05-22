import React, { useState, useEffect } from 'react';
import {
  Sheet,
  Preloader,
  f7,
} from 'framework7-react';
import { useStore } from 'framework7-react';
import { submitRequest } from '../js/api';
import store from '../js/store';

const PERF_TYPES = [
  { key: 'solo', label: 'Solo', icon: 'person_fill' },
  { key: 'duet', label: 'Duet', icon: 'person_2_fill' },
  { key: 'group', label: 'Group', icon: 'person_3_fill' },
];

/**
 * Build the final singer name string from the performance type and inputs.
 */
function buildSingerName(perfType, soloName, duetNames, groupMode, groupName, groupMembers) {
  if (perfType === 'solo') {
    return soloName.trim();
  }
  if (perfType === 'duet') {
    const a = duetNames[0].trim();
    const b = duetNames[1].trim();
    if (a && b) return `${a} & ${b}`;
    return a || b;
  }
  if (perfType === 'group') {
    if (groupMode === 'name') {
      return groupName.trim();
    }
    // Individual members
    const names = groupMembers.map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return names.slice(0, -1).join(', ') + ', & ' + names[names.length - 1];
  }
  return '';
}

const RequestSheet = ({ opened, song, onClose }) => {
  const venueUrlName = useStore('venueUrlName');
  const savedSingerName = useStore('singerName');

  // Performance type
  const [perfType, setPerfType] = useState('solo');

  // Solo
  const [soloName, setSoloName] = useState('');

  // Duet
  const [duetNames, setDuetNames] = useState(['', '']);

  // Group
  const [groupMode, setGroupMode] = useState('name'); // 'name' or 'members'
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState(['', '']);

  // Key change stepper
  const [keyChange, setKeyChange] = useState(0);

  // State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset when sheet opens
  useEffect(() => {
    if (opened) {
      setPerfType('solo');
      setSoloName(savedSingerName || '');
      setDuetNames([savedSingerName || '', '']);
      setGroupMode('name');
      setGroupName('');
      setGroupMembers(['', '']);
      setKeyChange(0);
      setSuccess(false);
      setLoading(false);
    }
  }, [opened, savedSingerName]);

  const singerName = buildSingerName(perfType, soloName, duetNames, groupMode, groupName, groupMembers);
  const canSubmit = singerName.length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit || !song) return;

    // Persist solo name for convenience
    if (perfType === 'solo' && soloName.trim()) {
      store.dispatch('setSingerName', soloName.trim());
    }

    setLoading(true);
    try {
      const keyStr = keyChange > 0 ? `+${keyChange}` : String(keyChange);
      const result = await submitRequest(venueUrlName, song.songId, singerName, keyStr);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      } else {
        f7.toast.create({ text: 'Request failed. Please try again.', position: 'center', closeTimeout: 2000 }).open();
      }
    } catch (err) {
      console.error('Submit failed:', err);
      f7.toast.create({ text: 'Network error. Please try again.', position: 'center', closeTimeout: 2000 }).open();
    } finally {
      setLoading(false);
    }
  };

  // Duet helpers
  const updateDuet = (idx, val) => {
    const next = [...duetNames];
    next[idx] = val;
    setDuetNames(next);
  };

  // Group member helpers
  const updateMember = (idx, val) => {
    const next = [...groupMembers];
    next[idx] = val;
    setGroupMembers(next);
  };
  const addMember = () => setGroupMembers([...groupMembers, '']);
  const removeMember = (idx) => {
    if (groupMembers.length <= 2) return;
    setGroupMembers(groupMembers.filter((_, i) => i !== idx));
  };

  if (!song) return null;

  return (
    <Sheet
      className="request-sheet"
      opened={opened}
      onSheetClosed={onClose}
      backdrop
      closeByBackdropClick
      closeByOutsideClick
      swipeToClose
      style={{ height: 'auto', maxHeight: '90vh' }}
    >
      <div className="sheet-handle">
        <div className="sheet-handle-bar" />
      </div>

      {success ? (
        <div className="success-state">
          <div className="success-checkmark">
            <i className="f7-icons">checkmark</i>
          </div>
          <div className="success-title">You're in the queue!</div>
          <div className="success-text">
            "{song.title}" has been submitted.<br />
            Get ready to sing! 🎤
          </div>
        </div>
      ) : (
        <>
          {/* Header — compact */}
          <div className="request-sheet-header">
            <div className="request-sheet-title">{song.title}</div>
            <div className="request-sheet-subtitle">{song.artist}</div>
          </div>

          <div className="request-sheet-body">
            {/* Performance Type Selector */}
            <div className="perf-type-row">
              {PERF_TYPES.map((p) => (
                <button
                  key={p.key}
                  className={`perf-type-btn${perfType === p.key ? ' active' : ''}`}
                  onClick={() => setPerfType(p.key)}
                >
                  <i className="f7-icons">{p.icon}</i>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Singer Name Inputs */}
            <div className="singer-inputs">
              {perfType === 'solo' && (
                <input
                  className="form-input"
                  type="text"
                  placeholder="Your name"
                  value={soloName}
                  onChange={(e) => setSoloName(e.target.value)}
                  autoComplete="off"
                />
              )}

              {perfType === 'duet' && (
                <div className="duet-inputs">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Singer 1"
                    value={duetNames[0]}
                    onChange={(e) => updateDuet(0, e.target.value)}
                    autoComplete="off"
                  />
                  <span className="duet-amp">&</span>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Singer 2"
                    value={duetNames[1]}
                    onChange={(e) => updateDuet(1, e.target.value)}
                    autoComplete="off"
                  />
                </div>
              )}

              {perfType === 'group' && (
                <div className="group-inputs">
                  {/* Toggle: group name vs individual */}
                  <div className="group-mode-toggle">
                    <button
                      className={`group-mode-btn${groupMode === 'name' ? ' active' : ''}`}
                      onClick={() => setGroupMode('name')}
                    >
                      Group Name
                    </button>
                    <button
                      className={`group-mode-btn${groupMode === 'members' ? ' active' : ''}`}
                      onClick={() => setGroupMode('members')}
                    >
                      Individual Names
                    </button>
                  </div>

                  {groupMode === 'name' ? (
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. The Karaoke Crew"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      autoComplete="off"
                    />
                  ) : (
                    <div className="group-member-list">
                      {groupMembers.map((member, idx) => (
                        <div key={idx} className="group-member-row">
                          <input
                            className="form-input"
                            type="text"
                            placeholder={`Singer ${idx + 1}`}
                            value={member}
                            onChange={(e) => updateMember(idx, e.target.value)}
                            autoComplete="off"
                          />
                          {groupMembers.length > 2 && (
                            <button
                              className="member-remove-btn"
                              onClick={() => removeMember(idx)}
                            >
                              <i className="f7-icons">minus_circle_fill</i>
                            </button>
                          )}
                        </div>
                      ))}
                      <button className="member-add-btn" onClick={addMember}>
                        <i className="f7-icons">plus_circle_fill</i>
                        <span>Add Singer</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Key Change Stepper + Submit — side by side */}
            <div className="request-footer">
              <div className="key-stepper">
                <span className="key-stepper-label">Key</span>
                <button
                  className="stepper-btn"
                  onClick={() => setKeyChange(Math.max(-6, keyChange - 1))}
                  disabled={keyChange <= -6}
                >
                  <i className="f7-icons">minus</i>
                </button>
                <span className={`stepper-value${keyChange !== 0 ? ' changed' : ''}`}>
                  {keyChange > 0 ? `+${keyChange}` : keyChange}
                </span>
                <button
                  className="stepper-btn"
                  onClick={() => setKeyChange(Math.min(6, keyChange + 1))}
                  disabled={keyChange >= 6}
                >
                  <i className="f7-icons">plus</i>
                </button>
              </div>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {loading ? (
                  <Preloader />
                ) : (
                  <>
                    <i className="f7-icons" style={{ fontSize: '16px' }}>paperplane_fill</i>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
};

export default RequestSheet;
