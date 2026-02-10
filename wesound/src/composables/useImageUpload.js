import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export function useImageUpload(currentUser) {
    const uploading = ref(false);
    const deleting = ref(false);

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

    async function handleDeletePost(postId, onSuccess) {
        if (!currentUser.value) return;

        try {
            deleting.value = true;

            // Get the post to find the image URL
            const { data: post } = await supabase
                .from('posts')
                .select('image_url')
                .eq('id', postId)
                .single();

            if (post) {
                // Extract file path from URL
                const urlParts = post.image_url.split('/posts/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[1];

                    // Delete from storage
                    await supabase.storage
                        .from('posts')
                        .remove([filePath]);
                }
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)
                .eq('user_id', currentUser.value.id); // Security: only delete own posts

            if (dbError) throw dbError;

            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error deleting post: ' + error.message);
        } finally {
            deleting.value = false;
        }
    }

    return {
        uploading,
        deleting,
        handleFileUpload,
        handleDeletePost
    };
}