<template>
  <div>
    <div class="header-container">
      <div class="header-title">
        <div class="left-btn">
          <a-icon
            v-if="$route.query.from"
            type="arrow-left"
            @click="goBackClick"
          />
        </div>
        <div class="user-name">
          <img :src="user.profile_image_url_large" alt="" />
          {{ $route.query.userName }}
        </div>
        <div class="right-btn">
          <a-icon
            v-if="loginUserId === user.id"
            type="logout"
            @click="logoutClick"
          />
        </div>
      </div>
      <div class="header-nav">
        <a-tabs
          :animated="false"
          defaultActiveKey="5"
          size="small"
          @change="callback"
        >
          <a-tab-pane
            :tab="'消息(' + user.statuses_count + ')'"
            key="5"
          ></a-tab-pane>
          <a-tab-pane
            :tab="'收藏(' + user.favourites_count + ')'"
            key="2"
          ></a-tab-pane>
          <a-tab-pane
            :tab="'照片(' + user.photo_count + ')'"
            key="4"
          ></a-tab-pane>
          <a-tab-pane
            :tab="'关注(' + user.friends_count + ')'"
            key="7"
          ></a-tab-pane>
          <a-tab-pane
            :tab="'粉丝(' + user.followers_count + ')'"
            key="6"
          ></a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div v-if="user.id !== loginUserId && user.protected && !user.following">
      <div class="lock-tip">
        <a-icon type="lock" />
        <div class="tip">我只向关注我的人公开我的消息</div>
      </div>
    </div>
    <div v-else ref="timeline" style="padding-top:37px;">
      <Timeline
        :timelineType="timelineType"
        :userId="$route.query.userId"
      ></Timeline>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/utils/fanfouService";
import Timeline from "@/components/Timeline";
export default {
  data() {
    return {
      timelineType: -1,
      currentTabKey: 0,
      user: {
        statuses_count: 0,
        favourites_count: 0,
        photo_count: 0,
        followers_count: 0,
        friends_count: 0,
        following: false,
        protected: false,
        profile_image_url_large: ""
      }
    };
  },
  mounted() {
    console.log(this.$route.query.userName);
    this.loadUserInfo();
  },
  computed: {
    loginUserId() {
      let account = JSON.parse(localStorage.getItem("account")) || {};
      if (account && account.profile) {
        return account.profile.id;
      }
      return "";
    }
  },
  methods: {
    async loadUserInfo() {
      const user = await getUserInfo({ id: this.$route.query.userId });
      if (user === null) {
        this.$message.error("获取数据失败");
      } else {
        this.user = user;
        this.timelineType = 5;
      }
    },
    callback(key) {
      this.currentTabKey = key;
      this.timelineType = Number(key);
    },
    goBackClick() {
      this.$router.replace({ path: this.$route.query.from });
    },
    logoutClick() {
      let self = this;
      this.$confirm({
        title: `确认退出当前账号（@${this.$route.query.userName}）吗？`,
        content: "",
        cancelText: "取消",
        okText: "确认",
        onOk() {
          localStorage.removeItem("account");
          self.$router.replace({
            path: "/"
          });
        },
        onCancel() {}
      });
    }
  },
  watch: {
    "$route.query.userId"() {
      this.timelineType = -1;
      this.loadUserInfo();
    }
  },
  components: {
    Timeline
  }
};
</script>

<style lang="less" scoped>
.header-container {
  position: fixed;
  left: 70px;
  right: 0;
  top: 0;
  border-bottom: 1px solid #171717;
  z-index: 1;
  background: #212121;
  padding: 0;
  height: 72px;
  .header-title {
    padding: 0 16px;
    height: 35px;
    color: #c0c0c0;
    font-weight: bold;
    // border-bottom: 1px solid #171717;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-btn,
    .right-btn {
      width: 32px;
      height: 35px;
      line-height: 35px;
    }
    .right-btn {
      text-align: right;
    }
    .user-name {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .header-nav {
    text-align: center;
    background-color: #212121;
    padding: 0 6px;
  }
  .header-nav /deep/ .ant-tabs-nav-container {
    border-bottom: 1px solid #171717 !important;
  }
  .header-nav /deep/ .ant-tabs-tab {
    color: #c0c0c0;
    // margin-bottom: 0;
    margin: 0 !important;
  }
  .header-nav /deep/ .ant-tabs-small-bar {
    // margin-bottom: 0;
    margin: 0 !important;
  }
  .header-nav /deep/ .ant-tabs-tab-active {
    color: #1890ff;
  }
}
.lock-tip {
  margin-top: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(247, 247, 247, 0.75);
  font-size: 14px;
  padding: 16px;
  .tip {
    margin-left: 8px;
  }
}
</style>
