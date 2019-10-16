<template>
  <div>
    <div class="header">
      <div class="header-nav">
        <div class="left-btn"></div>
        <div>首页</div>
        <div class="right-btn" @click="refreshClick">
          <a-icon type="sync" />
        </div>
      </div>
    </div>
    <Timeline :timelineType="timelineType"></Timeline>
  </div>
</template>

<script>
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
    this.timelineType = 0;
  },
  methods: {
    refreshClick() {
      this.timelineType = -1;
      setTimeout(() => {
        this.timelineType = 0;
      }, 100);
    }
  },
  components: {
    Timeline
  }
};
</script>

<style lang="less" scoped></style>
