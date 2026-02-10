import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export function useImageUpload(currentUser) {
    const uploading = ref(false);

    async function handleFileUpload(file, onSuccess) {
        if (!file || !currentUser.value) return;

        try {
            uploading.value = true;

            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.value.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('posts')
                .insert({
                    user_id: currentUser.value.id,
                    image_url: publicUrl,
                    caption: "New post"
                });

            if (dbError) throw dbError;

            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error uploading post: ' + error.message);
        } finally {
            uploading.value = false;
        }
    }

    return {
        uploading,
        handleFileUpload
    };
}
