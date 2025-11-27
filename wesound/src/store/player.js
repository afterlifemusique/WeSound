import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
    state: () => ({
        track: null,
        audio: null,
        playing: false,
    }),
    actions: {
        play(song) {
            if (!this.audio) {
                this.audio = new Audio();
            }
            this.track = song;
            this.audio.src = song.url;
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
