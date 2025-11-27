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
