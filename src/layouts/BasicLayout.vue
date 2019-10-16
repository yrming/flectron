<template>
  <div>
    <a-layout style="min-height: 100vh;">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <div class="avatar-wrapper">
          <div class="avatar" @click="goUserPage">
            <img :src="avatarUrl" alt="" />
          </div>
        </div>
        <SiderMenu></SiderMenu>
      </a-layout-sider>
      <a-layout style="background: #212121;">
        <!-- <a-layout-header>
          <Header></Header>
        </a-layout-header> -->
        <a-layout-content class="basic-layout-content">
          <!-- <router-view></router-view> -->
          <keep-alive>
            <router-view v-if="$route.meta.needsKeepAlive" />
          </keep-alive>
          <router-view v-if="!$route.meta.needsKeepAlive" />
        </a-layout-content>
        <!-- <a-layout-footer style="text-align: center">
          <Footer></Footer>
        </a-layout-footer> -->
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { getAccount } from "@/utils/fanfouService";
import SiderMenu from "./SiderMenu";
export default {
  data() {
    return {
      collapsed: true
    };
  },
  computed: {
    avatarUrl() {
      let account = getAccount();
      if (account && account.profile) {
        return account.profile.profile_image_origin_large;
      } else {
        return "http://s3.meituan.net/v1/mss_3d027b52ec5a4d589e68050845611e68/avatar/l0/00/00/00.jpg";
      }
    },
    user() {
      let account = getAccount();
      if (account && account.profile) {
        return account.profile;
      }
      return {};
    }
  },
  methods: {
    goUserPage() {
      this.$router.push({
        path: "/profile",
        query: {
          userId: this.user.id,
          userName: this.user.screen_name
        }
      });
    }
  },
  components: {
    SiderMenu
  }
};
</script>

<style lang="less" scoped>
.avatar-wrapper {
  height: 88px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #fff;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #999;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    cursor: pointer;
  }
}
</style>
