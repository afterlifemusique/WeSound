import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/home", name: "Home", component: () => import("../views/Home.vue") },
  { path: "/feed", name: "Feed", component: () => import("../views/Feed.vue") },
  { path: "/messages", name: "Messages", component: () => import("../views/Messages.vue") },
  { path: "/profile/:id", name: "Profile", component: () => import("../views/Profile.vue") }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
