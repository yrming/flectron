import Vue from "vue";
import Router from "vue-router";
// import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      hideInMenu: true,
      component: () =>
        import(/* webpackChunkName: "user" */ "./views/user/Login")
    },
    {
      path: "/basic",
      component: () =>
        import(/* webpackChunkName: "layout" */ "./layouts/BasicLayout"),
      children: [
        {
          path: "/basic",
          redirect: "/home"
        },
        {
          path: "/home",
          name: "home",
          meta: {
            icon: "clock-circle",
            title: "首页"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/user/Home")
        },
        {
          path: "/mentions",
          name: "mentions",
          meta: {
            icon: "bell",
            title: "@提到我的"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/user/Mentions")
        },
        {
          path: "/privatemsg",
          name: "privatemsg",
          meta: {
            icon: "mail",
            title: "私信"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/user/PrivateMsg")
        },
        {
          path: "/favorites",
          name: "favorites",
          meta: {
            icon: "star",
            title: "收藏"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/user/Favorites")
        },
        {
          path: "/album",
          name: "album",
          meta: {
            icon: "picture",
            title: "照片"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/user/Album")
        },
        {
          path: "/send",
          name: "send",
          meta: {
            icon: "form",
            title: "你在做什么？"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/user/Album")
        }
      ]
    },
    {
      path: "*",
      hideInMenu: true,
      component: () => import(/* webpackChunkName: "user" */ "./views/404")
    }
  ],
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  // NProgress.start();
  next();
});

router.afterEach(() => {
  // NProgress.done();
});

export default router;
