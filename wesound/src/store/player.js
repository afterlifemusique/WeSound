import { defineStore } from "pinia";

export const usePlayer = defineStore("player", {
  state: () => ({
    audio: new Audio(),
    track: null,
    playing: false
  }),
  actions: {
    play(song) {
      if (!this.track || this.track.id !== song.id) {
        this.audio.src = song.audio_url;
        this.track = song;
      }
      this.audio.play();
      this.playing = true;
    },
    pause() {
      this.audio.pause();
      this.playing = false;
    }
  }
});
