<template>
  <div>
    <div class="header">
      <div class="header-nav">
        <div class="left-btn"></div>
        <div>收藏</div>
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
      timelineType: -1
    };
  },
  mounted() {
    this.timelineType = 2;
  },
  methods: {
    refreshClick() {
      this.timelineType = -1;
      setTimeout(() => {
        this.timelineType = 2;
      }, 10);
    }
  },
  components: {
    Timeline
  }
};
</script>

<style lang="less" scoped></style>
