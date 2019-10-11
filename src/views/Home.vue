<template>
  <div>
    <div class="header">首页</div>
    <!-- list -->
    <!-- <a-list v-if="!loading" itemLayout="vertical" :dataSource="listData">
      <a-list-item slot="renderItem" slot-scope="item" key="item.title">
        <template v-if="item.is_self" slot="actions">
          <span @click="handleStarClick(item)">
            <a-icon
              v-if="item.favorited"
              type="star"
              style="margin-right: 8px"
              theme="twoTone"
              twoToneColor="#fedd39"
            />
            <a-icon v-else type="star" style="margin-right: 8px" />
          </span>
          <span @click="handleRetweetClick(item)">
            <a-icon type="retweet" style="margin-right: 8px" />
          </span>
          <span @click="handleDeleteClick(item)">
            <a-icon type="delete" style="margin-right: 8px" />
          </span>
        </template>
        <template v-else slot="actions">
          <span @click="handleReplyClick(item)">
            <a-icon type="rollback" style="margin-right: 8px" />
          </span>
          <span @click="handleStarClick(item)">
            <a-icon
              v-if="item.favorited"
              type="star"
              style="margin-right: 8px"
              theme="twoTone"
              twoToneColor="#fedd39"
            />
            <a-icon v-else type="star" style="margin-right: 8px" />
          </span>
          <span @click="handleRetweetClick(item)">
            <a-icon type="retweet" style="margin-right: 8px" />
          </span>
        </template>
        <a-list-item-meta>
          <div slot="title" class="list-title">
            <div class="screen-name" @click="goUserPage(item.user.id)">
              {{ item.user.screen_name }}
            </div>
            <div class="time">{{ item.created_at | dateFormat }}</div>
          </div>
          <a-avatar
            slot="avatar"
            :src="item.user.profile_image_origin_large"
            @click="goUserPage(item.user.id)"
          />
          <div slot="description">
            <div>
              <span
                v-for="(textItem, index) in item.txt"
                :key="index"
                :class="{ highlight: textItem.type !== 'text' }"
                @click="highlighClick(textItem)"
                >{{ textItem.text }}</span
              >
            </div>
            <img
              class="timeline-photo"
              v-if="item.photo"
              :src="item.photo.originurl"
              alt=""
            />
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
    <div>
      <a-modal
        :title="replyModalTitle"
        v-model="replyModalVisible"
        :closable="false"
        :destroyOnClose="true"
        okText="发送"
        :okButtonProps="{
          props: { disabled: replyModalText ? false : true }
        }"
        cancelText="取消"
        @ok="replyModalOkClick"
      >
        <a-textarea
          :defaultValue="replyModalText"
          v-model="replyModalText"
          :rows="4"
          maxlength="140"
          auto-focus
        />
      </a-modal>
      <a-modal
        v-model="retweetModalVisible"
        :closable="false"
        :destroyOnClose="true"
        okText="发送"
        :okButtonProps="{
          props: { disabled: retweetModalText ? false : true }
        }"
        cancelText="取消"
        @ok="retweetModalOkClick"
      >
        <a-textarea
          :defaultValue="retweetModalText"
          v-model="retweetModalText"
          :rows="4"
          maxlength="140"
          ref="textArea"
        />
      </a-modal>
      <a-modal
        :title="deleteModalTitle"
        v-model="deleteModalVisible"
        :closable="false"
        :destroyOnClose="true"
        okText="确认"
        cancelText="取消"
        @ok="deleteModalOkClick"
      >
      </a-modal>
    </div> -->
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
