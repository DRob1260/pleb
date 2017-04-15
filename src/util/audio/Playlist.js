/**
 * Created by Will on 1/14/2017.
 */

const Soundcloud = require('./interfaces/Soundcloud');
const Youtube = require('./interfaces/Youtube');

const shuffle = require('knuth-shuffle').knuthShuffle;

/**
 * @typedef {Object} Song
 * @property {String} type Soundcloud or YouTube
 * @property {Function} stream The audio stream.
 * @property {String} title
 * @property {String} trackID
 * @property {String} playlistID
 */

class Playlist {

    /**
     * @constructor
     */
    constructor() {

        /**
         * The array of songs.
         * @type {Array.<Song>}
         */
        this.list = [];

        /**
         * The array pointer.
         * @type {number}
         * @private
         */
        this._pos = 0;

        /**
         * Information about this playlist. (Not guaranteed to be accurate,
         * since songs can be arbitrarily manipulated.)
         * @type {Object}
         * @property {string} title
         * @property {string} description
         * @property {string} thumbnail - URL to thumbnail image.
         * @property {string} displayURL - URL to playlist itself
         * @property {string} author
         */
        this.info = {};

        /**
         * The SoundCloud interface.
         * @type {Soundcloud}
         */
        this.sc = new Soundcloud(this);

        /**
         * The YouTube interface.
         * @type {Youtube}
         */
        this.yt = new Youtube(this);
    }

    /**
     * Get the length of the playlist.
     * @return {Number}
     */
    get length() {
        return this.list.length;
    }

    /**
     * Get the current position of the playlist (starting at 1).
     * @return {number}
     */
    get pos() {
        return this._pos + 1;
    }

    /**
     * Get the current playlist item.
     * @return {Song}
     */
    get current() {
        return this.list[this._pos];
    }

    /**
     * Send the playlist back one song.
     * @return {number}
     */
    prev() {
        if(this.hasPrev()) this._pos--;
        return this.pos;
    }

    /**
     * Whether there is a previous song.
     * @return {boolean}
     */
    hasPrev() {
        return (this._pos - 1) >= 0;
    }

    /**
     * Advance to the next song.
     * @return {number}
     */
    next() {
        if(this.hasNext()) this._pos++;
        return this.pos;
    }

    /**
     * Whether there is a next song.
     * @return {boolean}
     */
    hasNext() {
        return (this._pos + 1) <= this.list.length - 1;
    }

    /**
     * Get the next song.
     * @return {Song}
     */
    getNext() {
        return this.list[this._pos + 1];
    }

    /**
     * Get the last song.
     * @return {Song|*}
     */
    getLast() {
        return this.list[this.list.length - 1];
    }

    /**
     * Shuffle the playlist.
     */
    shuffle() {
        this.list = shuffle(this.list);
        this._pos = 0;
    }

    /**
     * Add command arguments to the playlist.  Order is not guaranteed.
     * @param {Response} res
     * @param {Array<String>} args
     * @return {Playlist}
     */
    async add(res, args) {
        await res.send('adding songs to playlist...');

        let added =
            (await this.sc.add(args))
            .concat(await this.yt.add(args));
        added = added.filter(e => e);

        if(added.length < 1) {
            return res.error('Unable to find that resource.');
        } else if(added.length === 1) {
            res.success(`added \`${added[0].title}\` to playlist`);
        } else {
            res.success(`added **${added.length}** songs to playlist`);
        }

        this.addSongs(added);
        return added;
    }

    /**
     * Add a song to the playlist.
     * @param {Array<Song>} song
     */
    addSongs(songs) {
        for(const s of songs) if(s) this.list.push(s);
    }
}

module.exports = Playlist;
