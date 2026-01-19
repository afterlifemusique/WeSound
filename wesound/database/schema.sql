-- Drop existing tables (in correct order to avoid FK constraints)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.thread_likes CASCADE;
DROP TABLE IF EXISTS public.threads CASCADE;
DROP TABLE IF EXISTS public.followers CASCADE;
DROP TABLE IF EXISTS public.song_likes CASCADE;
DROP TABLE IF EXISTS public.playlist_songs CASCADE;
DROP TABLE IF EXISTS public.playlists CASCADE;
DROP TABLE IF EXISTS public.songs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (users)
-- NOTE: A server-side trigger on the Supabase platform is configured to automatically
-- create a new user profile in this table upon the insertion of a new user into
-- the `auth.users` table. This trigger copies the user ID and any relevant metadata.
-- This logic is not present in the client-side application code.
CREATE TABLE public.profiles (
                                 id uuid NOT NULL,
                                 username text UNIQUE NOT NULL,
                                 display_name text,
                                 avatar_url text,
                                 bio text,
                                 is_verified boolean DEFAULT false,
                                 created_at timestamp with time zone DEFAULT now(),
                                 updated_at timestamp with time zone DEFAULT now(),
                                 CONSTRAINT profiles_pkey PRIMARY KEY (id),
                                 CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
                                 CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- Songs table
CREATE TABLE public.songs (
                              id uuid NOT NULL DEFAULT gen_random_uuid(),
                              title text NOT NULL,
                              artist text NOT NULL,
                              album text,
                              genre text,
                              url text NOT NULL,
                              artwork_url text,
                              duration integer NOT NULL,
                              play_count integer DEFAULT 0,
                              uploaded_by uuid,
                              is_public boolean DEFAULT true,
                              created_at timestamp with time zone DEFAULT now(),
                              updated_at timestamp with time zone DEFAULT now(),
                              CONSTRAINT songs_pkey PRIMARY KEY (id),
                              CONSTRAINT songs_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
                              CONSTRAINT title_not_empty CHECK (char_length(title) > 0),
                              CONSTRAINT duration_positive CHECK (duration > 0)
);

-- Playlists table
CREATE TABLE public.playlists (
                                  id uuid NOT NULL DEFAULT gen_random_uuid(),
                                  user_id uuid NOT NULL,
                                  title text NOT NULL,
                                  description text,
                                  cover_image_url text,
                                  is_public boolean DEFAULT true,
                                  created_at timestamp with time zone DEFAULT now(),
                                  updated_at timestamp with time zone DEFAULT now(),
                                  CONSTRAINT playlists_pkey PRIMARY KEY (id),
                                  CONSTRAINT playlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

-- Playlist songs (junction table with proper ordering)
CREATE TABLE public.playlist_songs (
                                       id uuid NOT NULL DEFAULT gen_random_uuid(),
                                       playlist_id uuid NOT NULL,
                                       song_id uuid NOT NULL,
                                       position integer NOT NULL,
                                       added_at timestamp with time zone DEFAULT now(),
                                       CONSTRAINT playlist_songs_pkey PRIMARY KEY (id),
                                       CONSTRAINT playlist_songs_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON DELETE CASCADE,
                                       CONSTRAINT playlist_songs_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE,
                                       CONSTRAINT unique_song_per_playlist UNIQUE (playlist_id, song_id),
                                       CONSTRAINT position_positive CHECK (position > 0)
);

-- Song likes
CREATE TABLE public.song_likes (
                                   id uuid NOT NULL DEFAULT gen_random_uuid(),
                                   user_id uuid NOT NULL,
                                   song_id uuid NOT NULL,
                                   created_at timestamp with time zone DEFAULT now(),
                                   CONSTRAINT song_likes_pkey PRIMARY KEY (id),
                                   CONSTRAINT song_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                   CONSTRAINT song_likes_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id) ON DELETE CASCADE,
                                   CONSTRAINT unique_user_song_like UNIQUE (user_id, song_id)
);

-- Followers table (for user following)
CREATE TABLE public.followers (
                                  id uuid NOT NULL DEFAULT gen_random_uuid(),
                                  follower_id uuid NOT NULL,
                                  following_id uuid NOT NULL,
                                  created_at timestamp with time zone DEFAULT now(),
                                  CONSTRAINT followers_pkey PRIMARY KEY (id),
                                  CONSTRAINT followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                  CONSTRAINT followers_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                  CONSTRAINT unique_follower_following UNIQUE (follower_id, following_id),
                                  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
    );

-- Threads (posts/comments)
CREATE TABLE public.threads (
                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                user_id uuid NOT NULL,
                                parent_id uuid,
                                content text NOT NULL,
                                like_count integer DEFAULT 0,
                                reply_count integer DEFAULT 0,
                                created_at timestamp with time zone DEFAULT now(),
                                updated_at timestamp with time zone DEFAULT now(),
                                CONSTRAINT threads_pkey PRIMARY KEY (id),
                                CONSTRAINT threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                CONSTRAINT threads_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.threads(id) ON DELETE CASCADE,
                                CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- Thread likes
CREATE TABLE public.thread_likes (
                                     id uuid NOT NULL DEFAULT gen_random_uuid(),
                                     user_id uuid NOT NULL,
                                     thread_id uuid NOT NULL,
                                     created_at timestamp with time zone DEFAULT now(),
                                     CONSTRAINT thread_likes_pkey PRIMARY KEY (id),
                                     CONSTRAINT thread_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                     CONSTRAINT thread_likes_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.threads(id) ON DELETE CASCADE,
                                     CONSTRAINT unique_user_thread_like UNIQUE (user_id, thread_id)
);

-- Messages (direct messaging)
CREATE TABLE public.messages (
                                 id uuid NOT NULL DEFAULT gen_random_uuid(),
                                 sender_id uuid NOT NULL,
                                 receiver_id uuid NOT NULL,
                                 content text NOT NULL,
                                 is_read boolean DEFAULT false,
                                 created_at timestamp with time zone DEFAULT now(),
                                 CONSTRAINT messages_pkey PRIMARY KEY (id),
                                 CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                 CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
                                 CONSTRAINT content_not_empty CHECK (char_length(content) > 0),
                                 CONSTRAINT no_self_message CHECK (sender_id != receiver_id)
    );

-- Create indexes for better query performance
CREATE INDEX idx_songs_artist ON public.songs(artist);
CREATE INDEX idx_songs_genre ON public.songs(genre);
CREATE INDEX idx_songs_uploaded_by ON public.songs(uploaded_by);
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlist_songs_playlist_id ON public.playlist_songs(playlist_id);
CREATE INDEX idx_playlist_songs_song_id ON public.playlist_songs(song_id);
CREATE INDEX idx_song_likes_user_id ON public.song_likes(user_id);
CREATE INDEX idx_song_likes_song_id ON public.song_likes(song_id);
CREATE INDEX idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX idx_followers_following_id ON public.followers(following_id);
CREATE INDEX idx_threads_user_id ON public.threads(user_id);
CREATE INDEX idx_threads_parent_id ON public.threads(parent_id);
CREATE INDEX idx_thread_likes_thread_id ON public.thread_likes(thread_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Public read, users can update own profile
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
                                    USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
                                    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Songs: Public songs viewable by all, private only by owner
CREATE POLICY "Public songs are viewable by everyone"
  ON public.songs FOR SELECT
                                        USING (is_public = true OR uploaded_by = auth.uid());

CREATE POLICY "Users can insert own songs"
  ON public.songs FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update own songs"
  ON public.songs FOR UPDATE
                                        USING (uploaded_by = auth.uid());

-- Playlists: Public playlists viewable, users manage own
CREATE POLICY "Public playlists are viewable by everyone"
  ON public.playlists FOR SELECT
                                     USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can manage own playlists"
  ON public.playlists FOR ALL
  USING (user_id = auth.uid());

-- Playlist songs: viewable with playlist, manageable by playlist owner
CREATE POLICY "Playlist songs viewable with playlist"
  ON public.playlist_songs FOR SELECT
                                                 USING (
                                                 EXISTS (
                                                 SELECT 1 FROM public.playlists
                                                 WHERE playlists.id = playlist_songs.playlist_id
                                                 AND (playlists.is_public = true OR playlists.user_id = auth.uid())
                                                 )
                                                 );

CREATE POLICY "Users can manage own playlist songs"
  ON public.playlist_songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Song likes: users can manage own likes
CREATE POLICY "Users can view all song likes"
  ON public.song_likes FOR SELECT
                                             USING (true);

CREATE POLICY "Users can manage own song likes"
  ON public.song_likes FOR ALL
  USING (user_id = auth.uid());

-- Followers: public read, users manage own follows
CREATE POLICY "Followers are viewable by everyone"
  ON public.followers FOR SELECT
                                            USING (true);

CREATE POLICY "Users can manage own follows"
  ON public.followers FOR ALL
  USING (follower_id = auth.uid());

-- Threads: public read, users manage own threads
CREATE POLICY "Threads are viewable by everyone"
  ON public.threads FOR SELECT
                                          USING (true);

CREATE POLICY "Users can create threads"
  ON public.threads FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own threads"
  ON public.threads FOR UPDATE
                                          USING (user_id = auth.uid());

CREATE POLICY "Users can delete own threads"
  ON public.threads FOR DELETE
USING (user_id = auth.uid());

-- Thread likes: public read, users manage own likes
CREATE POLICY "Thread likes are viewable by everyone"
  ON public.thread_likes FOR SELECT
                                        USING (true);

CREATE POLICY "Users can manage own thread likes"
  ON public.thread_likes FOR ALL
  USING (user_id = auth.uid());

-- Messages: Only sender and receiver can view
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
                                           USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());