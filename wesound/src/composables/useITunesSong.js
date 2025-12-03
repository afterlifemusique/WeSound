import { ref } from "vue";

export function useITunesSong() {
    const song = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchSong = async (id) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(
                `https://itunes.apple.com/lookup?id=${id}`
            );

            const data = await response.json();

            if (data.resultCount > 0) {
                const s = data.results[0];

                song.value = {
                    id: s.trackId,
                    title: s.trackName,
                    artist: s.artistName,
                    artwork: s.artworkUrl100.replace("100x100", "600x600"),
                    url: s.previewUrl,
                    album: s.collectionName,
                };
            } else {
                error.value = "Song not found";
            }
        } catch (err) {
            error.value = err.message;
        }

        loading.value = false;
    };

    return {
        song,
        loading,
        error,
        fetchSong,
    };
}