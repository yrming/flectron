<template>
  <div>
    <Scroll :height="675" :loading-text="''" :on-reach-top="handleReachTop">
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
            私信
          </div>
          <div class="right-btn">
            <a-icon @click="sendMsgClick" type="plus" />
          </div>
        </div>
      </div>
      <a-list
        style="padding-right: 16px;"
        v-if="!loading"
        itemLayout="vertical"
        :dataSource="listData"
        :split="false"
      >
        <a-list-item
          class="conversation-list-item"
          :class="{ 'me-send': item.sender_id !== otherUserId }"
          slot="renderItem"
          slot-scope="item"
          key="item.id"
        >
          <template slot="actions">
            <span class="time">{{ item.created_at | dateFormat }}</span>
          </template>
          <a-list-item-meta>
            <a-avatar
              v-if="item.sender_id == otherUserId"
              slot="avatar"
              :src="item.sender.profile_image_origin_large"
            />
            <a-avatar
              v-else-if="item.recipient_id == otherUserId"
              slot="avatar"
              :src="item.sender.profile_image_origin_large"
            />
            <div class="msg-text" slot="description">
              <div>{{ item.text }}</div>
            </div>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <a-list
        style="padding-right: 16px;"
        v-else
        itemLayout="vertical"
        :split="false"
      >
        <a-list-item
          class="conversation-skeleton-list-item"
          v-for="index in 30"
          :key="index"
        >
          <a-skeleton :loading="loading" active avatar :paragraph="{ rows: 3 }">
          </a-skeleton>
        </a-list-item>
      </a-list>
    </Scroll>
    <div>
      <a-modal
        :title="modalTitle"
        v-model="modalVisible"
        :closable="false"
        :destroyOnClose="true"
        okText="发送"
        :okButtonProps="{
          props: { disabled: modalText ? false : true }
        }"
        cancelText="取消"
        @ok="modalOkClick"
      >
        <a-textarea
          :defaultValue="modalText"
          v-model="modalText"
          maxlength="140"
          auto-focus
        />
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getConversation, sendDirectMsg } from "@/utils/fanfouService";
export default {
  data() {
    return {
      loading: true,
      listData: [],
      isSending: false,
      otherUserId: this.$route.query.userId,
      modalTitle: "",
      modalText: "",
      modalVisible: false
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    goBackClick() {
      this.$router.replace({ path: this.$route.query.from });
    },
    async loadData() {
      const listData = await getConversation({ id: this.otherUserId });
      if (listData === null) {
        this.$message.error("获取数据失败");
      } else {
        this.listData = listData.reverse();
      }
      this.loading = false;
    },
    async handleReachTop() {
      if (this.isSending || this.loading || this.listData.length === 0) {
        return;
      }
      this.isSending = true;
      const data = await getConversation({
        id: this.otherUserId,
        max_id: this.listData[0].id
      });
      if (data === null) {
        this.$message.error("获取数据失败");
      } else {
        this.listData = data
          .reverse()
          .slice(0, data.length - 1)
          .concat(this.listData);
        this.isSending = false;
      }
    },
    goUserPage(userId) {
      alert(userId);
    },
    sendMsgClick() {
      this.modalTitle = "发送私信";
      this.modalVisible = true;
    },
    async modalOkClick() {
      if (this.isSending) {
        return;
      }
      this.isSending = true;
      const msgData = await sendDirectMsg({
        user: this.otherUserId,
        text: this.modalText
      });
      if (msgData === null) {
        this.$message.error("发送失败");
      } else {
        this.$message.success("发送成功");
        this.listData.push(msgData);
      }
      this.isSending = false;
      this.modalVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
// .basic-layout-content {
//   // margin: 39px 0px 16px 86px !important;
// }
.header-container {
  -webkit-app-region: drag;
  position: fixed;
  left: 70px;
  right: 0;
  top: 0;
  border-bottom: 1px solid #171717;
  z-index: 1;
  background: #212121;
  padding: 0;
  height: 35px;
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
}
.conversation-skeleton-list-item {
  &:nth-child(even) {
    transform: rotateY(180deg);
  }
}
.me-send /deep/ .ant-list-item-action {
  transform: rotateY(180deg);
  text-align: right;
}
.me-send /deep/ .ant-list-item-action > li {
  padding: 0;
}
.msg-text {
  display: inline-block;
  background: #333;
  color: #fff;
  padding: 10px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  min-height: 35px;
  min-width: 35px;
  max-width: 80%;
}
.time {
  font-size: 12px;
  color: #5a5a5a;
  opacity: 0.85;
  font-weight: 100;
}
.me-send {
  transform: rotateY(180deg);
  .ant-list-item-meta-avatar {
    transform: rotateY(180deg);
  }
  .screen-name {
    transform: rotateY(180deg);
  }
  .msg-text {
    transform: rotateY(180deg);
    border-top-right-radius: 0px;
    border-top-left-radius: 8px;
    background: #2593fc;
  }
  .ant-list-item-action {
    li {
      transform: rotateY(180deg);
    }
  }
}
</style>
