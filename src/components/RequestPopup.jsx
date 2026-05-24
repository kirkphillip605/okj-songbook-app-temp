import React, { useState, useEffect } from 'react';
import {
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Preloader,
  List,
  ListInput,
  Button,
  Block,
  BlockTitle,
  Icon,
  Stepper,
  f7,
} from 'framework7-react';
import { submitRequest } from '../js/api';
import store from '../js/store';
import { useStore } from 'framework7-react';

const MAX_GROUP_MEMBERS = 4;

export default function RequestPopup({ opened, onClose, song, perfType }) {
  const venueUrlName = useStore('venueUrlName');
  const savedSingerName = useStore('singerName');

  // ----- Shared state -----
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [keyChange, setKeyChange] = useState(0);

  // ----- Solo -----
  const [soloName, setSoloName] = useState('');

  // ----- Duet -----
  const [duetNames, setDuetNames] = useState(['', '']);

  // ----- Group -----
  const [groupMode, setGroupMode] = useState('name'); // 'name' or 'members'
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState(['', '']);

  // Reset fields each time the popup opens
  useEffect(() => {
    if (opened) {
      setLoading(false);
      setSuccess(false);
      setKeyChange(0);
      setSoloName(savedSingerName || '');
      setDuetNames([savedSingerName || '', '']);
      setGroupMode('name');
      setGroupName('');
      setGroupMembers([savedSingerName || '', '']);
    }
  }, [opened, savedSingerName]);

  // Build final singer name based on perf type
  const buildSingerName = () => {
    if (perfType === 'solo') return soloName.trim();

    if (perfType === 'duet') {
      const a = duetNames[0].trim();
      const b = duetNames[1].trim();
      if (a && b) return `${a} & ${b}`;
      return a || b;
    }

    // group
    if (groupMode === 'name') {
      return groupName.trim();
    }
    
    // members mode – ignore empty entries, limit to MAX_GROUP_MEMBERS
    const names = groupMembers
      .map((n) => n.trim())
      .filter(Boolean)
      .slice(0, MAX_GROUP_MEMBERS);
    
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return names.slice(0, -1).join(', ') + ', & ' + names[names.length - 1];
  };

  const singerName = buildSingerName();
  const canSubmit = singerName.length > 0 && !loading && song;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    // Persist name for convenience
    if (perfType === 'solo' && soloName.trim()) {
      store.dispatch('setSingerName', soloName.trim());
    } else if (perfType === 'duet' && duetNames[0].trim()) {
      store.dispatch('setSingerName', duetNames[0].trim());
    } else if (perfType === 'group' && groupMode === 'members' && groupMembers[0].trim()) {
      store.dispatch('setSingerName', groupMembers[0].trim());
    }

    const keyStr = keyChange > 0 ? `+${keyChange}` : String(keyChange);

    setLoading(true);
    try {
      const result = await submitRequest(venueUrlName, song.songId, singerName, keyStr);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        f7.toast.create({
          text: result.error || 'Request failed. Please try again.',
          position: 'bottom',
          closeTimeout: 2000,
        }).open();
      }
    } catch (err) {
      console.error('Submit error:', err);
      f7.toast.create({
        text: 'Network error. Please try again.',
        position: 'bottom',
        closeTimeout: 2000,
      }).open();
    } finally {
      setLoading(false);
    }
  };

  // ----- Helpers for dynamic lists -----
  const updateDuet = (idx, val) => {
    const copy = [...duetNames];
    copy[idx] = val;
    setDuetNames(copy);
  };
  
  const updateMember = (idx, val) => {
    const copy = [...groupMembers];
    copy[idx] = val;
    setGroupMembers(copy);
  };
  
  const addMember = () => {
    if (groupMembers.length < MAX_GROUP_MEMBERS) {
      setGroupMembers([...groupMembers, '']);
    }
  };
  
  const removeMember = (idx) => {
    if (groupMembers.length <= 1) return;
    setGroupMembers(groupMembers.filter((_, i) => i !== idx));
  };

  if (!song) return null;

  return (
    <Popup
      opened={opened}
      onPopupClosed={onClose}
      swipeToClose="to-bottom"
      closeByBackdropClick
      className="request-popup"
    >
      <Page className="request-popup-page">
        <Navbar title={`Request as ${perfType.charAt(0).toUpperCase() + perfType.slice(1)}`} noHairline>
          <NavRight>
            <Link onClick={onClose} iconF7="xmark" />
          </NavRight>
        </Navbar>

        {success ? (
          <div className="success-state-container">
            <div className="success-checkmark">
              <Icon f7="checkmark" />
            </div>
            <div className="success-title">Request Sent!</div>
            <div className="success-text">
              <strong>{singerName}</strong> has been added to the queue for:
              <div className="success-song-title">"{song.title}"</div>
            </div>
          </div>
        ) : (
          <div className="request-popup-content">
            {/* Song Meta Card */}
            <div className="request-song-card">
              <div className="request-song-title">{song.title}</div>
              <div className="request-song-artist">{song.artist}</div>
            </div>

            {/* Singer Input Section */}
            <div className="request-fields-container">
              {perfType === 'solo' && (
                <List className="no-margin-top no-margin-bottom theme-list-inputs">
                  <ListInput
                    label="Singer Name"
                    type="text"
                    placeholder="Enter your name"
                    value={soloName}
                    onInput={(e) => setSoloName(e.target.value)}
                    clearButton
                    id="solo-singer-input"
                  />
                </List>
              )}

              {perfType === 'duet' && (
                <List className="no-margin-top no-margin-bottom theme-list-inputs">
                  <ListInput
                    label="Singer 1"
                    type="text"
                    placeholder="First singer's name"
                    value={duetNames[0]}
                    onInput={(e) => updateDuet(0, e.target.value)}
                    clearButton
                  />
                  <ListInput
                    label="Singer 2"
                    type="text"
                    placeholder="Second singer's name"
                    value={duetNames[1]}
                    onInput={(e) => updateDuet(1, e.target.value)}
                    clearButton
                  />
                </List>
              )}

              {perfType === 'group' && (
                <div className="group-form-wrapper">
                  <div className="group-mode-segment-wrapper">
                    <div className="group-segmented">
                      <button
                        className={`group-segment-button${groupMode === 'name' ? ' active' : ''}`}
                        type="button"
                        onClick={() => setGroupMode('name')}
                      >
                        Group Name
                      </button>
                      <button
                        className={`group-segment-button${groupMode === 'members' ? ' active' : ''}`}
                        type="button"
                        onClick={() => setGroupMode('members')}
                      >
                        Member Names
                      </button>
                    </div>
                  </div>

                  {groupMode === 'name' ? (
                    <List className="no-margin-top no-margin-bottom theme-list-inputs">
                      <ListInput
                        label="Group / Band Name"
                        type="text"
                        placeholder="e.g. Wobbly Penguins"
                        value={groupName}
                        onInput={(e) => setGroupName(e.target.value)}
                        clearButton
                      />
                    </List>
                  ) : (
                    <div className="group-members-list-container">
                      <List className="no-margin-top no-margin-bottom theme-list-inputs">
                        {groupMembers.map((member, i) => (
                          <div key={i} className="group-member-input-row">
                            <ListInput
                              label={`Singer ${i + 1}`}
                              type="text"
                              placeholder={`Name of singer ${i + 1}`}
                              value={member}
                              onInput={(e) => updateMember(i, e.target.value)}
                              clearButton
                            />
                            {groupMembers.length > 1 && (
                              <button
                                type="button"
                                className="group-member-delete-btn"
                                onClick={() => removeMember(i)}
                              >
                                <Icon f7="trash" />
                              </button>
                            )}
                          </div>
                        ))}
                      </List>
                      {groupMembers.length < MAX_GROUP_MEMBERS && (
                        <div className="add-member-button-wrapper">
                          <Button
                            outline
                            small
                            className="add-member-btn"
                            onClick={addMember}
                          >
                            <Icon f7="plus" size="14" />
                            Add Singer ({groupMembers.length}/{MAX_GROUP_MEMBERS})
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stepper for Keychange and Submit side-by-side */}
            <div className="request-popup-actions-footer">
              <div className="key-stepper-control">
                <span className="key-stepper-label">Key Change</span>
                <Stepper
                  min={-6}
                  max={6}
                  value={keyChange}
                  onStepperChange={(val) => setKeyChange(val)}
                  fill
                  small
                  raised
                />
              </div>

              <Button
                fill
                large
                className="popup-submit-btn"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {loading ? (
                  <Preloader color="white" size={24} />
                ) : (
                  <>
                    <Icon f7="paperplane_fill" size="18" />
                    <span>Send Request</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Page>
    </Popup>
  );
}
