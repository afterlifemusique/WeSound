import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
    state: () => ({
        track: null,
        playing: false,
        audio: null,
    }),
    actions: {
        play(song) {
            if (!this.audio) {
                this.audio = new Audio();
            }

            // If a song is provided, set new track and audio src
            if (song) {
                this.track = song;
                this.audio.src = song.url;
            }

            // If no song passed, resume current track
            this.audio.play();
            this.playing = true;
        },
        pause() {
            if (this.audio) {
                this.audio.pause();
            }
            this.playing = false;
        },
    },
});
