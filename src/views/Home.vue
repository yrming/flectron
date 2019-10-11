<template>
  <div>
    <div class="header">首页</div>
    <Timeline :timelineType="timelineType"></Timeline>
  </div>
</template>

<script>
import { getHomeTimeline } from "@/utils/fanfouService";
import Timeline from "@/components/Timeline";
export default {
  data() {
    return {
      timelineType: -1,
      loading: true,
      showLoadingMore: true,
      loadingMore: false,
      listData: [],
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
      deleteModalVisible: false
    };
  },
  mounted() {
    // this.loadData();
    this.timelineType = 0;
  },
  methods: {
    async loadData() {
      const listData = await getHomeTimeline();
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
      const maxId = this.listData[this.listData.length - 1].id;
      const listData = await getHomeTimeline({ max_id: maxId });
      if (listData === null) {
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
        this.$refs.textArea.focus();
      });
      console.log(item);
    },
    handleDeleteClick(item) {
      this.deleteModalVisible = true;
      console.log(item);
    },
    retweetModalOkClick() {
      alert(123);
    },
    deleteModalOkClick() {
      alert(123);
    },
    highlighClick(textItem) {
      if (textItem.type === "at") {
        // alert(textItem.text);
        this.$router.push({
          path: "/profile",
          query: { userId: textItem.id, userName: textItem.name }
        });
      } else if (textItem.type === "link") {
        window.open(textItem.text);
      }
    },
    goUserPage(userId) {
      alert(userId);
    }
  },
  components: {
    Timeline
  }
};
</script>

<style lang="less" scoped></style>
