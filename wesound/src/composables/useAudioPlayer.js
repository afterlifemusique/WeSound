import { ref } from "vue";

export function useAudioPlayer() {
  const audio = new Audio();
  const playing = ref(false);
  const currentTrack = ref(null);

  function play(track) {
    if (!currentTrack.value || currentTrack.value.id !== track.id) {
      audio.src = track.audio_url;
      currentTrack.value = track;
    }
    audio.play();
    playing.value = true;
  }

  function pause() {
    audio.pause();
    playing.value = false;
  }

  return { audio, playing, currentTrack, play, pause };
}
