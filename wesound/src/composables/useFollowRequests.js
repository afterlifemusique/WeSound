import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export function useFollowRequests(currentUser) {
    const pendingRequests = ref([]);
    const processingId = ref(null);

    async function fetchPendingRequests() {
        if (!currentUser.value) return;

        const { data, error } = await supabase
            .from('followers')
            .select(`
        id,
        follower_id,
        profiles!followers_follower_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `)
            .eq('following_id', currentUser.value.id)
            .eq('status', 'pending');

        if (error) console.error("Error fetching requests:", error);
        else pendingRequests.value = data || [];
    }

    async function handleRequest(requestId, status, onSuccess) {
        processingId.value = requestId;
        try {
            if (status === 'accepted') {
                const { error } = await supabase
                    .from('followers')
                    .update({ status: 'accepted' })
                    .eq('id', requestId);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('followers')
                    .delete()
                    .eq('id', requestId);

                if (error) throw error;
            }

            await fetchPendingRequests();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Action failed:", error.message);
            alert("Could not update request: " + error.message);
        } finally {
            processingId.value = null;
        }
    }

    return {
        pendingRequests,
        processingId,
        fetchPendingRequests,
        handleRequest
    };
}
