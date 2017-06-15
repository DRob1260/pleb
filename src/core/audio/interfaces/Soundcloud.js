const url = require('url');
const request = require('axios');

class SoundCloud {

  /**
     * Add command arguments to the playlist.
     * @param {Array} args
     * @return {Promise<Array<Song>>}
     */
  async get(args) {
    const urls = args.filter((e, i) => {
      const is = SoundCloud.isViewURL(e);
      if (is) args.splice(i, 1);
      return is;
    });
    const loaded = await Promise.all(urls.map(r => this._loadResource(r)));
    return loaded.reduce((p, c) => p.concat(c.filter(r => r)), []);
  }

  /**
     * Load a SoundCloud resource.
     * @param resource
     * @return {Promise<Array<?Song>>}
     * @private
     */
  async _loadResource(resource) {
    let thing;
    try {
      thing = (await request.get('https://api.soundcloud.com/resolve', {
        params: { url: resource, client_id: process.env.soundcloud }
      })).data;
    } catch (e) {
      return [];
    }

    switch (thing.kind) {
      case 'playlist':
        return this._addPlaylist(thing);
      case 'track':
        return [this._addTrack(thing)];
      default:
        return [];
    }
  }

  /**
     * Add a SoundCloud playlist resource to the playlist.
     * @param resource
     * @return {Array<?Song>}
     * @private
     */
  _addPlaylist(resource) {
    return resource.tracks.map(t => this._addTrack(t));
  }

  /**
     * Add a SoundCloud track resource to the playlist.
     * @param track
     * @return {?Song}
     * @private
     */
  _addTrack(track, playlistID) {
    if (!track.streamable) return null;

    return {
      type: 'soundcloud',
      stream: async () => {
        return (await request.get(track.stream_url, {
          params: { client_id: process.env.soundcloud },
          responseType: 'stream'
        })).data;
      },
      title: track.title,
      playlistID,
      trackID: track.id
    };
  }

  /**
     * Whether the given string is a valid URL form for resolving.
     * @param {String} testURL
     * @return {boolean}
     */
  static isViewURL(testURL) {
    const parsed = url.parse(testURL);
    if (!parsed.pathname || !parsed.hostname) return false;
    const parts = parsed.pathname.split('/');
    return (parsed.hostname === 'soundcloud.com' || parsed.hostname === 'www.soundcloud.com') && parts.length >= 2;
  }
}

module.exports = SoundCloud;
