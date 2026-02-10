import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';

export function useProfile(userId, currentUser) {
    const profile = ref(null);
    const loading = ref(true);
    const stats = ref({ followers: 0, following: 0, totalLikes: 0 });
    const followStatus = ref(null);

    const isOwnProfile = computed(() => {
        return currentUser.value && profile.value && currentUser.value.id === profile.value.id;
    });

    async function fetchProfile(id) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (data) profile.value = data;
    }

    async function fetchStats(id) {
        try {
            const [followers, following, likes, followCheck] = await Promise.all([
                supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', id).eq('status', 'accepted'),
                supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', id).eq('status', 'accepted'),
                supabase.from('song_likes').select('song_id', { count: 'exact', head: true }).eq('song_id', id),
                supabase.from('followers')
                    .select('status')
                    .eq('follower_id', currentUser.value?.id)
                    .eq('following_id', id)
                    .maybeSingle()
            ]);

            stats.value = {
                followers: followers.count || 0,
                following: following.count || 0,
                totalLikes: likes.count || 0
            };

            followStatus.value = followCheck.data?.status || null;
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    }

    async function toggleFollow(targetId) {
        if (!currentUser.value) return alert("Please log in");

        if (!followStatus.value) {
            const { error } = await supabase
                .from('followers')
                .insert({
                    follower_id: currentUser.value.id,
                    following_id: targetId,
                    status: 'pending'
                });
            if (!error) followStatus.value = 'pending';
        } else {
            const { error } = await supabase
                .from('followers')
                .delete()
                .eq('follower_id', currentUser.value.id)
                .eq('following_id', targetId);
            if (!error) followStatus.value = null;
        }
        fetchStats(targetId);
    }

    return {
        profile,
        loading,
        stats,
        followStatus,
        isOwnProfile,
        fetchProfile,
        fetchStats,
        toggleFollow
    };
}
