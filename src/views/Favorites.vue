<template>
  <div>
    <div class="header">收藏</div>
    <Timeline :timelineType="timelineType"></Timeline>
  </div>
</template>

<script>
import { getFavorites } from "@/utils/fanfouService";
import Timeline from "@/components/Timeline";
export default {
  data() {
    return {
      timelineType: -1,
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
    this.timelineType = 2;
  },
  methods: {
    async loadData() {
      const listData = await getFavorites();
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
      const listData = await getFavorites({ page: this.page });
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
  },
  components: {
    Timeline
  }
};
</script>

<style lang="less" scoped></style>
