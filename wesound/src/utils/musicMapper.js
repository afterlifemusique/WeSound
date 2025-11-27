export function mapITunesTrack(track) {
    return {
        id: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        cover: track.artworkUrl100?.replace("100x100", "600x600"),
        url: track.previewUrl,
        duration: Math.floor(track.trackTimeMillis / 1000)
    };
}
