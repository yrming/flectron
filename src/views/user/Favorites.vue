<template>
  <div>
    <div class="header">收藏</div>
    <!-- list -->
    <a-list v-if="!loading" itemLayout="vertical" :dataSource="listData">
      <a-list-item slot="renderItem" slot-scope="item" key="item.title">
        <template
          v-if="item.plain_text === '此消息已删除或不公开'"
          slot="actions"
        >
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
        </template>
        <template v-else-if="item.is_self" slot="actions">
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
            <div v-if="item.plain_text !== '此消息已删除或不公开'" class="time">
              {{ item.created_at | dateFormat }}
            </div>
          </div>
          <a-avatar
            slot="avatar"
            :src="item.user.profile_image_origin_large"
            @click="goUserPage(item.user.id)"
          />
          <div slot="description">
            <span
              v-for="(textItem, index) in item.txt"
              :key="index"
              :class="{ highlight: textItem.type !== 'text' }"
              >{{ textItem.text }}</span
            >
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
      <!-- reply modal -->
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
      <!-- retweet modal -->
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
      <!-- delete modal -->
      <a-modal
        :title="deleteModalTitle"
        v-model="deleteModalVisible"
        :closable="false"
        :destroyOnClose="true"
        okText="确认"
        cancelText="取消"
        @ok="deleteModalOkClick"
      >
        <a-textarea
          :defaultValue="deleteModalText"
          :rows="4"
          :disabled="true"
        />
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getFavorites } from "../../utils/fanfouService";
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
  }
};
</script>

<style lang="less" scoped>
.timeline-photo {
  margin-top: 10px;
  // width: 300px;
  width: 100%;
  border-radius: 5px;
}
.load-more-button {
  background-color: transparent;
  border: none;
  box-shadow: none;
}
.load-more-icon {
  font-size: 16px;
  color: #f7f7f7;
  opacity: 0.65;
  transform: rotate(90deg);
}
</style>
