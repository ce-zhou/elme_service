import { createRouter, createWebHistory } from "vue-router";

const router = new createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: () => import("../views/login/Login.vue"),
    },
    {
      path: "/home",
      component: () => import("../views/home/Home.vue"),
    },
    {
      path: "/",
      component: () => import("../views/admin/Admin.vue"),
    },
  ],
});

const whiteList = ["/login"]; //白名单

router.beforeEach((to, from, next) => {
  const hasToken = window.localStorage.getItem("accessToken");
  if (hasToken) {
    if (to.path === "/login") {
      // 如果已登录，则重定向到主页
      next({path: "/"});
    } else {
      //权限处理部分，可参考vue-element-admin框架中permision.js权限处理部分
      next()
    }
  } else {
    //没有token的情况
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在白名单内则直接跳转
      next();
    } else {
      // 其余页面重定向到登录页
      next(`/login?redirect=${to.path}`);
    }
  }
});

export default router;
