import { supabase } from '../lib/supabase'

// Sign Up
export async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username,
                display_name: username
            }
        }
    })

    return { data, error }
}

// Sign In
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    return { data, error }
}

// Sign Out
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

// Get Current User
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Listen to Auth Changes
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChanged(callback)
}