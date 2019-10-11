<template>
  <div>
    <div class="header">私信</div>
    <!-- list -->
    <a-list v-if="!loading" itemLayout="vertical" :dataSource="listData">
      <a-list-item slot="renderItem" slot-scope="item" key="item.dm.id">
        <a-list-item-meta>
          <div slot="title" class="list-title">
            <div class="screen-name" @click="goUserPage(item.otherid)">
              {{
                item.otherid === item.dm.recipient.id
                  ? item.dm.recipient.screen_name
                  : item.dm.sender.screen_name
              }}
            </div>
            <div class="time">{{ item.dm.created_at | dateFormat }}</div>
          </div>
          <a-avatar
            slot="avatar"
            :src="
              item.otherid === item.dm.recipient.id
                ? item.dm.recipient.profile_image_origin_large
                : item.dm.sender.profile_image_origin_large
            "
            @click="goUserPage(item.otherid)"
          />
          <div slot="description">
            <div>{{ item.dm.text }}</div>
          </div>
        </a-list-item-meta>
      </a-list-item>
      <div
        v-if="showLoadingMore"
        slot="loadMore"
        :style="{
          textAlign: 'center',
          marginTop: '12px',
          height: '32px',
          lineHeight: '32px'
        }"
      >
        <a-spin v-if="loadingMore" />
        <a-button v-else block class="load-more-button" @click="onLoadMore">
          <span class="load-more-icon"
            ><a-icon type="double-right" style=""/></span
        ></a-button>
      </div>
    </a-list>
    <a-list v-else itemLayout="vertical">
      <a-list-item v-for="index in 30" :key="index">
        <a-skeleton :loading="loading" active avatar :paragraph="{ rows: 3 }">
        </a-skeleton>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { getConversationList } from "@/utils/fanfouService";
export default {
  data() {
    return {
      loading: true,
      showLoadingMore: true,
      loadingMore: false,
      listData: [],
      modalOption: {
        type: -1,
        title: "",
        text: "",
        visible: false
      },
      replyOption: {},
      retweetOption: {},
      deleteOption: {},
      // 回复
      replyStatusId: "",
      replyModalTitle: "",
      replyModalText: "",
      replyModalVisible: false,
      // 转发
      retweetStatusId: "",
      retweetModalTitle: "",
      retweetModalText: "",
      retweetModalVisible: false,
      // 删除
      deleteStatusId: "",
      deleteModalTitle: "",
      deleteModalText: "",
      deleteModalVisible: false,
      // 分页
      page: 1
    };
  },
  mounted() {
    this.loadingMore = false;
    this.loadData();
  },
  methods: {
    async loadData() {
      const listData = await getConversationList();
      if (listData === null) {
        this.$message.error("获取数据失败");
      } else {
        this.listData = listData;
      }
      this.loading = false;
    },
    async onLoadMore() {
      if (this.loadingMore || this.listData.length === 0) {
        return;
      }
      this.loadingMore = true;
      this.page += 1;
      const listData = await getConversationList({ page: this.page });
      if (listData === null) {
        this.page -= 1;
        this.$message.error("获取数据失败");
      } else {
        if (listData.length === 0) {
          this.showLoadingMore = false;
        }
        this.listData = this.listData.concat(listData);
      }
      this.loadingMore = false;
    },
    handleReplyClick(item) {
      this.replyModalTitle = `回复：${item.plain_text}`;
      this.replyModalText = `@${item.user.screen_name} `;
      this.replyModalVisible = true;
    },
    replyModalOkClick() {
      alert(123);
    },
    handleStarClick(item) {
      console.log(item);
    },
    handleRetweetClick(item) {
      this.retweetModalText = `转@${item.user.screen_name} ${item.plain_text}`;
      this.retweetModalVisible = true;
      this.$nextTick(() => {
        console.log(this.$refs.textArea);
        this.$refs.textArea.focus();
        console.log(this.$refs.textArea.setSelectionRange);
        console.log(this.$refs.textArea.createTextRange);
      });
      console.log(item);
    },
    handleDeleteClick(item) {
      this.deleteModalTitle = `你确定要删除这条消息吗？`;
      this.deleteModalText = item.plain_text;
      this.deleteModalVisible = true;
      console.log(item);
    },
    retweetModalOkClick() {
      alert(123);
    },
    deleteModalOkClick() {
      alert(123);
    },
    goUserPage(userId) {
      alert(userId);
    }
  }
};
</script>

<style lang="less" scoped></style>
