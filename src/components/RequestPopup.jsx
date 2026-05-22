import React, { useState, useEffect } from 'react';
import {
  Popup,
  NavBar,
  NavRight,
  Link,
  Preloader,
  List,
  ListInput,
  Button,
  Block,
  Icon,
  f7,
} from 'framework7-react';
import { submitRequest } from '../js/api';
import store from '../js/store';
import { useStore } from 'framework7-react';

const MAX_GROUP_MEMBERS = 4;

/**
 * Popup that contains the request form.
 * Props:
 *   opened      – boolean, whether popup is visible
 *   onClose     – callback when popup is closed
 *   song        – song object (songId, title, artist)
 *   perfType    – 'solo' | 'duet' | 'group'
 */
export default function RequestPopup({ opened, onClose, song, perfType }) {
  const venueUrlName = useStore('venueUrlName');

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
      setSoloName('');
      setDuetNames(['', '']);
      setGroupMode('name');
      setGroupName('');
      setGroupMembers(['', '']);
    }
  }, [opened]);

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

  const canSubmit = buildSingerName().length > 0 && !loading && song;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    // Persist solo name for convenience
    if (perfType === 'solo' && soloName.trim()) {
      store.dispatch('setSingerName', soloName.trim());
    }

    const singerName = buildSingerName();
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
          position: 'center',
          closeTimeout: 2000,
        }).open();
      }
    } catch (err) {
      console.error('Submit error:', err);
      f7.toast.create({
        text: 'Network error. Please try again.',
        position: 'center',
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
      swipeToClose
      closeByBackdropClick
      className="request-popup"
    >
      <NavBar title="Request Song" noHairline>
        <NavRight>
          <Link popupClose iconF7="xmark" />
        </NavRight>
      </NavBar>

      {success ? (
        <Block strong className="text-align-center">
          <Icon f7="checkmark_circle_fill" size="70" color="green" />
          <p className="padding-top">Your request was submitted!</p>
        </Block>
      ) : (
        <Block strong className="request-form">
          {/* Header */}
          <div className="song-header">
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>

          {/* Form body */}
          {perfType === 'solo' && (
            <List inputs>
              <ListInput
                label="Your name"
                placeholder="Enter your name"
                value={soloName}
                onInput={(e) => setSoloName(e.target.value)}
                clearButton
              />
            </List>
          )}

          {perfType === 'duet' && (
            <List inputs>
              <ListInput
                label="Singer 1"
                placeholder="First singer"
                value={duetNames[0]}
                onInput={(e) => updateDuet(0, e.target.value)}
                clearButton
              />
              <ListInput
                label="Singer 2"
                placeholder="Second singer"
                value={duetNames[1]}
                onInput={(e) => updateDuet(1, e.target.value)}
                clearButton
              />
            </List>
          )}

          {perfType === 'group' && (
            <Block className="group-section">
              {/* Toggle between "Group name" and "Members" */}
              <div className="display-flex justify-content-space-between margin-bottom">
                <Button
                  fill={groupMode === 'name'}
                  onClick={() => setGroupMode('name')}
                >
                  Group Name
                </Button>
                <Button
                  fill={groupMode === 'members'}
                  onClick={() => setGroupMode('members')}
                >
                  Members
                </Button>
              </div>

              {groupMode === 'name' ? (
                <List inputs>
                  <ListInput
                    label="Group name"
                    placeholder="e.g. The Karaoke Crew"
                    value={groupName}
                    onInput={(e) => setGroupName(e.target.value)}
                    clearButton
                  />
                </List>
              ) : (
                <List inputs>
                  {groupMembers.map((m, i) => (
                    <ListInput
                      key={i}
                      label={`Singer ${i + 1}`}
                      placeholder={`Name ${i + 1}`}
                      value={m}
                      onInput={(e) => updateMember(i, e.target.value)}
                      clearButton
                      media={
                        groupMembers.length > 1 ? (
                          <Icon
                            f7="minus_circle_fill"
                            onClick={() => removeMember(i)}
                          />
                        ) : null
                      }
                    />
                  ))}
                  {groupMembers.length < MAX_GROUP_MEMBERS && (
                    <Button fill small onClick={addMember}>
                      <Icon f7="plus_circle_fill" /> Add Singer
                    </Button>
                  )}
                </List>
              )}
            </Block>
          )}

          {/* Key‑change stepper */}
          <Block className="key-stepper-block">
            <div className="display-flex align-items-center">
              <span className="margin-right">Key</span>
              <Button
                round
                small
                disabled={keyChange <= -6}
                onClick={() => setKeyChange((c) => Math.max(-6, c - 1))}
              >
                <Icon f7="minus" />
              </Button>
              <span className="margin-horizontal">
                {keyChange > 0 ? `+${keyChange}` : keyChange}
              </span>
              <Button
                round
                small
                disabled={keyChange >= 6}
                onClick={() => setKeyChange((c) => Math.min(6, c + 1))}
              >
                <Icon f7="plus" />
              </Button>
            </div>
          </Block>

          {/* Submit button */}
          <Block className="text-align-center">
            <Button
              fill
              large
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {loading ? <Preloader /> : 'Submit Request'}
            </Button>
          </Block>
        </Block>
      )}
    </Popup>
  );
}
