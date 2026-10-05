import {
  createWebHashHistory,
  createRouter,
  type RouterOptions,
} from "vue-router";

const routes: RouterOptions["routes"] = [
  {
    path: "/",
    component: () => import("@/pages/index.vue"),
  },
  {
    path: "/test",
    component: () => import("@/pages/test.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
