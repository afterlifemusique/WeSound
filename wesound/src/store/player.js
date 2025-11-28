import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
    state: () => ({
        playlist: [],
        currentIndex: -1,
        track: null,
        playing: false,
        audio: null,

        // modes: "repeat-one" | "shuffle" | "repeat-all"
        mode: "repeat-all",

        shuffleQueue: [],      // upcoming random indices
        shuffleHistory: [],    // ordered history of played indices
        historyIndex: -1,      // pointer into shuffleHistory
        playedSet: new Set(),  // prevents repeats within a shuffle round
    }),

    actions: {
        setPlaylist(songs) {
            this.playlist = songs;
            this.currentIndex = 0;
            this.track = this.playlist[0] || null;

            if (!this.audio) {
                this.audio = new Audio();
            }

            if (this.track) {
                this._loadTrack(this.track);
            }

            // If we're already in shuffle mode, initialize shuffle structures
            if (this.mode === "shuffle") {
                this.shuffleHistory = [this.currentIndex];
                this.historyIndex = 0;
                this.playedSet = new Set([this.currentIndex]);
                this._buildShuffleQueue();
            } else {
                // clear shuffle bookkeeping
                this.shuffleQueue = [];
                this.shuffleHistory = [];
                this.historyIndex = -1;
                this.playedSet = new Set();
            }
        },

        play(song) {
            if (!this.audio) this.audio = new Audio();

            if (song) {
                const index = this.playlist.findIndex(s => s.id === song.id);
                this.currentIndex = index !== -1 ? index : this.playlist.length - 1;
                this.track = this.playlist[this.currentIndex];
                this._loadTrack(this.track);
            }

            // In shuffle mode: record in history (move pointer to this item)
            if (this.mode === "shuffle") {
                this._addToShuffleHistory(this.currentIndex);
            }

            this.audio.play();
            this.playing = true;
        },

        pause() {
            if (this.audio) this.audio.pause();
            this.playing = false;
        },

        restart() {
            if (!this.audio) return;

            if (this.audio.currentTime > 3) {
                this.audio.currentTime = 0;
                this.audio.play();
                this.playing = true;
            } else {
                this.previous();
            }
        },

        previous() {
            if (this.playlist.length === 0) return;

            if (this.mode === "shuffle") {
                // if we can move back in history, do it
                if (this.historyIndex > 0) {
                    this.historyIndex -= 1;
                    const prevIndex = this.shuffleHistory[this.historyIndex];

                    this.currentIndex = prevIndex;
                    this.track = this.playlist[prevIndex];

                    this._loadTrack(this.track);
                    this.audio.play();
                    this.playing = true;
                    return;
                }

                // no previous in history -> restart current
                if (this.audio) {
                    this.audio.currentTime = 0;
                    this.audio.play();
                    this.playing = true;
                }
                return;
            }

            // normal mode behavior
            this.currentIndex =
                (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
            this.track = this.playlist[this.currentIndex];
            this._loadTrack(this.track);
            this.audio.play();
            this.playing = true;
        },

        next() {
            if (this.playlist.length === 0) return;

            if (this.mode === "shuffle") {
                this._nextShuffle();
                return;
            }

            // repeat-all / normal advance
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
            this.track = this.playlist[this.currentIndex];
            this._loadTrack(this.track);
            this.audio.play();
            this.playing = true;
        },

        toggleMode() {
            if (this.mode === "repeat-all") {
                this.mode = "shuffle";
                // initialize shuffle structures for current context
                this.shuffleHistory = [this.currentIndex];
                this.historyIndex = 0;
                this.playedSet = new Set([this.currentIndex]);
                this._buildShuffleQueue();
            } else if (this.mode === "shuffle") {
                this.mode = "repeat-one";
            } else {
                // turning off shuffle -> clear bookkeeping
                this.mode = "repeat-all";
                this.shuffleQueue = [];
                this.shuffleHistory = [];
                this.historyIndex = -1;
                this.playedSet = new Set();
            }
        },

        random() {
            if (this.playlist.length === 0) return;

            let newIndex = this.currentIndex;
            while (newIndex === this.currentIndex && this.playlist.length > 1) {
                newIndex = Math.floor(Math.random() * this.playlist.length);
            }

            this.currentIndex = newIndex;
            this.track = this.playlist[newIndex];

            if (this.mode === "shuffle") {
                // treat as a newly chosen shuffled track (append to history)
                this._addToShuffleHistory(newIndex);
                this.playedSet.add(newIndex);
            }

            this._loadTrack(this.track);
            this.audio.play();
            this.playing = true;
        },

        _loadTrack(track) {
            if (!this.audio) this.audio = new Audio();
            this.audio.src = track.url;
            this.audio.load();
        },

        // Build queue of indices not yet played in this shuffle round.
        _buildShuffleQueue() {
            const indexes = this.playlist.map((_, i) => i);

            // remove already played indices (playedSet) and currentIndex if necessary
            const filtered = indexes.filter(i => !this.playedSet.has(i));

            // shuffle filtered
            for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
            }

            this.shuffleQueue = filtered;
        },

        // Add index to shuffleHistory and move historyIndex to end
        _addToShuffleHistory(index) {
            if (this.shuffleHistory.length === 0) {
                this.shuffleHistory.push(index);
                this.historyIndex = 0;
                return;
            }
            const last = this.shuffleHistory[this.shuffleHistory.length - 1];
            if (last !== index) {
                // If user had moved back in history and then selects a new song,
                // discard any forward history to mimic real player behavior
                if (this.historyIndex < this.shuffleHistory.length - 1) {
                    this.shuffleHistory.splice(this.historyIndex + 1);
                }

                this.shuffleHistory.push(index);
                this.historyIndex = this.shuffleHistory.length - 1;
            } else {
                // if same as last, ensure pointer points to last
                this.historyIndex = this.shuffleHistory.length - 1;
            }
        },

        _nextShuffle() {
            // If user had just pressed previous and there is forward history, go forward
            if (this.historyIndex < this.shuffleHistory.length - 1) {
                this.historyIndex += 1;
                const idx = this.shuffleHistory[this.historyIndex];

                this.currentIndex = idx;
                this.track = this.playlist[idx];

                this._loadTrack(this.track);
                this.audio.play();
                this.playing = true;
                return;
            }

            // otherwise we need to take from queue (or rebuild)
            if (this.shuffleQueue.length === 0) {
                this._buildShuffleQueue();

                // if still empty -> all songs were played; reset playedSet except current
                if (this.shuffleQueue.length === 0) {
                    this.playedSet = new Set([this.currentIndex]);
                    this._buildShuffleQueue();
                }
            }

            // take next from queue
            const nextIndex = this.shuffleQueue.shift();

            // record it as next in history and mark played
            this._addToShuffleHistory(nextIndex);
            this.playedSet.add(nextIndex);

            this.currentIndex = nextIndex;
            this.track = this.playlist[nextIndex];

            this._loadTrack(this.track);
            this.audio.play();
            this.playing = true;
        },
    },
});