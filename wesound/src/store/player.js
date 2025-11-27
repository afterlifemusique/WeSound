import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
    state: () => ({
        playlist: [],
        currentIndex: -1,
        track: null,
        playing: false,
        audio: null,
    }),

    actions: {
        setPlaylist(songs) {
            this.playlist = songs;
            this.currentIndex = 0;
            this.track = this.playlist[0] || null;

            if (!this.audio) {
                this.audio = new Audio();  // initialize audio here
            }

            if (this.track) {
                this._loadTrack(this.track);
            }
        },

        play(song) {
            if (!this.audio) {
                this.audio = new Audio();
            }

            if (song) {
                const index = this.playlist.findIndex(s => s.id === song.id);
                if (index !== -1) {
                    this.currentIndex = index;
                } else {
                    this.playlist.push(song);
                    this.currentIndex = this.playlist.length - 1;
                }
                this.track = song;
                this._loadTrack(song);
            }

            this.audio.play();
            this.playing = true;
        },

        pause() {
            if (this.audio) {
                this.audio.pause();
            }
            this.playing = false;
        },

        restart() {
            if (!this.audio) return;

            if (this.audio.currentTime > 3) {
                // Restart current song
                this.audio.currentTime = 0;
                this.audio.play();
                this.playing = true;
            } else {
                // Go to previous song
                this.previous();
            }
        },

        previous() {
            if (this.playlist.length === 0) return;

            this.currentIndex =
                (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
            const prevTrack = this.playlist[this.currentIndex];
            this.track = prevTrack;
            this._loadTrack(prevTrack);
            this.audio.play();
            this.playing = true;
        },


        next() {
            if (this.playlist.length === 0) return;

            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
            const nextTrack = this.playlist[this.currentIndex];
            this.track = nextTrack;
            this._loadTrack(nextTrack);
            this.audio.play();
            this.playing = true;
        },

        _loadTrack(track) {
            this.audio.src = track.url;
            this.audio.load();
        },
    },
});
