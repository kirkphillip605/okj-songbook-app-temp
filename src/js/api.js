/**
 * OKJ Songbook API Client
 * All requests use PUT method to a single endpoint.
 */

const API_BASE = 'https://api.okjsongbook.com/';

/**
 * Generic API caller — all commands go through PUT.
 */
async function apiRequest(payload) {
  const response = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Search songs by title or artist.
 * @param {string} venueUrlName - The venue identifier
 * @param {string} searchString - Search query
 * @returns {Promise<{song_count: number, songs: Array<{song_id: string, artist: string, title: string}>}>}
 */
export async function searchSongs(venueUrlName, searchString) {
  const data = await apiRequest({
    command: 'search',
    venueUrlName,
    searchString,
  });
  return {
    songCount: data.song_count || 0,
    songs: (data.songs || []).map((s) => ({
      songId: String(s.song_id),
      artist: s.artist,
      title: s.title,
    })),
  };
}

/**
 * Browse songs by artist starting letter.
 * @param {string} venueUrlName - The venue identifier
 * @param {string} letter - A-Z, "#" for numbers, "@" for symbols
 * @returns {Promise<{resultCount: number, songs: Array}>}
 */
export async function browseSongs(venueUrlName, letter) {
  const data = await apiRequest({
    command: 'browse',
    venueUrlName,
    browseBy: 'artist',
    letter,
  });
  return {
    resultCount: data.result_count || 0,
    songs: (data.songs || []).map((s) => ({
      // API returns `songid` (no underscore), can be int or string
      songId: String(s.songid),
      artist: s.artist,
      title: s.title,
    })),
  };
}

/**
 * Submit a song request to the DJ queue.
 * @param {string} venueUrlName
 * @param {string} songId
 * @param {string} singerName
 * @param {string} keyChange - e.g. "+1", "-2", "0"
 * @returns {Promise<{success: boolean, error: string}>}
 */
export async function submitRequest(venueUrlName, songId, singerName, keyChange) {
  const data = await apiRequest({
    command: 'submitRequest',
    venueUrlName,
    songId: String(songId),
    singerName,
    keyChange: String(keyChange),
  });
  return {
    success: data.success === true,
    error: data.error,
  };
}

/**
 * Get nearby venues based on coordinates and range.
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} range - Distance range in miles
 * @returns {Promise<Array<{venueId: string, name: string, distance: number, accepting: boolean}>>}
 */
export async function getNearbyVenues(latitude, longitude, range = 15) {
  const data = await apiRequest({
    command: 'getNearbyVenues2',
    range: Number(range),
    latitude: Number(latitude),
    longitude: Number(longitude),
  });
  return data.nearby || [];
}

/**
 * Check if a venue exists by its venueUrlName.
 * @param {string} venueUrlName
 * @returns {Promise<{command: string, error: string, exists: boolean}>}
 */
export async function checkVenueExists(venueUrlName) {
  return await apiRequest({
    command: 'venueExists',
    venueUrlName,
  });
}

