import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export function useMusicUpload(currentUser) {
    const uploading = ref(false);
    const deleting = ref(false);

    async function handleMusicUpload(file, onSuccess) {
        if (!file || !currentUser.value) return;

        try {
            uploading.value = true;

            // Validate file type
            const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav'];
            if (!validTypes.includes(file.type)) {
                throw new Error('Please upload an MP3 or WAV file');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.value.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('songs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('songs')
                .getPublicUrl(filePath);

            // Get audio duration (optional, requires HTMLAudioElement)
            const duration = await getAudioDuration(file);

            // Extract title from filename (remove extension)
            const title = file.name.replace(/\.[^/.]+$/, "");

            // Insert into database
            const { error: dbError } = await supabase
                .from('songs')
                .insert({
                    uploaded_by: currentUser.value.id,
                    title: title,
                    artist: currentUser.value.username || 'Unknown Artist',
                    url: publicUrl,
                    duration: duration || 0,
                    is_public: true
                });

            if (dbError) throw dbError;

            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error uploading song: ' + error.message);
        } finally {
            uploading.value = false;
        }
    }

    async function handleDeleteSong(songId, onSuccess) {
        if (!currentUser.value) return;

        try {
            deleting.value = true;

            // Get the song to find the audio URL
            const { data: song } = await supabase
                .from('songs')
                .select('url')
                .eq('id', songId)
                .single();

            if (song) {
                // Extract file path from URL
                const urlParts = song.url.split('/songs/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[1];

                    // Delete from storage
                    await supabase.storage
                        .from('songs')
                        .remove([filePath]);
                }
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from('songs')
                .delete()
                .eq('id', songId)
                .eq('uploaded_by', currentUser.value.id); // Security: only delete own songs

            if (dbError) throw dbError;

            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error deleting song: ' + error.message);
        } finally {
            deleting.value = false;
        }
    }

    // Helper function to get audio duration
    function getAudioDuration(file) {
        return new Promise((resolve) => {
            const audio = document.createElement('audio');
            audio.preload = 'metadata';

            audio.onloadedmetadata = function() {
                window.URL.revokeObjectURL(audio.src);
                resolve(Math.floor(audio.duration));
            };

            audio.onerror = function() {
                resolve(0); // Fallback if metadata can't be read
            };

            audio.src = URL.createObjectURL(file);
        });
    }

    return {
        uploading,
        deleting,
        handleMusicUpload,
        handleDeleteSong
    };
}