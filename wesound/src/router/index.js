import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "Home", component: () => import("../views/Home.vue")},
  { path: '/signin', name: 'SignIn', component: () => import("../views/SignIn.vue") },
  { path: '/signup', name: 'SignUp', component: () => import('@/views/SignUp.vue')},
  { path: "/feed", name: "Feed", component: () => import("../views/Feed.vue") },
  { path: "/messages", name: "Messages", component: () => import("../views/Messages.vue") },
  { path: "/profile/:id", name: "Profile", component: () => import("../views/Profile.vue") },
  { path: "/song/:id", name: "Song", component: () => import("../views/SongDetail.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Auth Guard
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (!requiresAuth) return next();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return next({ name: "Login" });
    }

    next();
});

export default router;