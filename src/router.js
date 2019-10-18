import Vue from "vue";
import Router from "vue-router";
// import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(Router);

const router = new Router({
  // mode: "history",
  routes: [
    {
      path: "/",
      name: "login",
      hideInMenu: true,
      component: () => import(/* webpackChunkName: "user" */ "./views/Login")
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
            needsKeepAlive: true,
            icon: "clock-circle",
            title: "首页"
          },
          component: () => import(/* webpackChunkName: "user" */ "./views/Home")
        },
        {
          path: "/mentions",
          name: "mentions",
          meta: {
            needsKeepAlive: true,
            icon: "bell",
            title: "@提到我的"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Mentions")
        },
        {
          path: "/conversationlist",
          name: "conversationlist",
          meta: {
            needsKeepAlive: true,
            icon: "mail",
            title: "私信"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/ConversationList")
        },
        {
          path: "/favorites",
          name: "favorites",
          meta: {
            needsKeepAlive: true,
            icon: "star",
            title: "收藏"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Favorites")
        },
        {
          path: "/album",
          name: "album",
          meta: {
            needsKeepAlive: true,
            icon: "picture",
            title: "照片"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Album")
        },
        {
          path: "/send",
          name: "send",
          meta: {
            needsKeepAlive: true,
            icon: "form",
            title: "你在做什么？"
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Album")
        },
        {
          path: "/profile",
          name: "profile",
          hideInMenu: true,
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Profile")
        },
        {
          path: "/conversation",
          name: "conversation",
          hideInMenu: true,
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Conversation")
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
