import React from 'react';

/**
 * Reusable song list component.
 * Displays song title + artist, with a tap-to-request action.
 */
const SongList = ({ songs, onSongTap }) => {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div
          key={`${song.songId}-${index}`}
          className="song-item"
          onClick={() => onSongTap(song)}
          role="button"
          tabIndex={0}
        >
          <div className="song-item-info">
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
          <div className="song-item-action">
            <i className="f7-icons">plus</i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
