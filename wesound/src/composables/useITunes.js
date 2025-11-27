import { ref } from "vue";
import { mapITunesTrack } from "../utils/musicMapper";
export function useITunes() {
    const songs = ref([]);
    const loading = ref(false);

    async function searchSongs(term) {
        loading.value = true;

        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=25`;

        const res = await fetch(url);
        const data = await res.json();

        songs.value = data.results.map(mapITunesTrack);

        loading.value = false;
    }

    return { songs, loading, searchSongs };
}
