import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export function useProfileContent(currentUser, isOwnProfile) {
    const songs = ref([]);
    const posts = ref([]);
    const threads = ref([]);

    async function fetchContent(id) {
        const [songsRes, threadsRes] = await Promise.all([
            supabase.from('songs').select('*').eq('uploaded_by', id).order('created_at', { ascending: false }),
            supabase.from('threads').select('*, profiles!threads_user_id_fkey(*)').eq('user_id', id).is('parent_id', null).order('created_at', { ascending: false })
        ]);

        songs.value = songsRes.data || [];
        threads.value = threadsRes.data || [];

        if (isOwnProfile.value) {
            const { data } = await supabase.from('posts').select('*').eq('user_id', id).order('created_at', { ascending: false });
            posts.value = data || [];
        } else {
            const { data: followCheck } = await supabase
                .from('followers')
                .select('status')
                .eq('follower_id', currentUser.value?.id)
                .eq('following_id', id)
                .eq('status', 'accepted')
                .maybeSingle();

            if (followCheck) {
                const { data: postsData } = await supabase.from('posts').select('*').eq('user_id', id).order('created_at', { ascending: false });
                posts.value = postsData || [];
            } else {
                posts.value = [];
            }
        }
    }

    return {
        songs,
        posts,
        threads,
        fetchContent
    };
}
