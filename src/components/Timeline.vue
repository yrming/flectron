<template>
  <div style="padding-right: 16px;">
    <a-list
      ref="list"
      v-if="!loading"
      itemLayout="vertical"
      :locale="{ emptyText: emptyText }"
      :dataSource="listData"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" key="item.title">
        <template v-if="item.is_self && timelineType !== 2" slot="actions">
          <span @click="handleStarClick(item, index)">
            <a-icon
              v-if="item.favorited"
              type="star"
              theme="twoTone"
              twoToneColor="#fedd39"
            />
            <a-icon v-else type="star" />
          </span>
          <span @click="handleRetweetClick(item, index)">
            <a-icon type="retweet" />
          </span>
          <span @click="handleDeleteClick(item, index)">
            <a-icon type="delete" />
          </span>
        </template>
        <template
          v-else-if="timelineType == 2 && item.text === '此消息已删除或不公开'"
          slot="actions"
        >
          <span @click="handleStarClick(item, index)">
            <a-icon
              v-if="item.favorited"
              type="star"
              theme="twoTone"
              twoToneColor="#fedd39"
            />
            <a-icon v-else type="star" />
          </span>
        </template>
        <template
          v-else-if="timelineType == 6 || timelineType == 7"
          slot="actions"
        >
          <span>
            <a-icon
              @click="handleUnFoClick(item, index)"
              v-if="item.following"
              type="link"
            />
            <a-icon @click="handleFoClick(item, index)" v-else type="api" />
          </span>
        </template>
        <template v-else slot="actions">
          <span @click="handleReplyClick(item, index)">
            <a-icon type="rollback" />
          </span>
          <span @click="handleStarClick(item, index)">
            <a-icon
              v-if="item.favorited"
              type="star"
              theme="twoTone"
              twoToneColor="#fedd39"
            />
            <a-icon v-else type="star" />
          </span>
          <span @click="handleRetweetClick(item, index)">
            <a-icon type="retweet" />
          </span>
        </template>
        <a-list-item-meta v-if="timelineType == 6 || timelineType == 7">
          <div slot="title" class="list-title">
            <div class="screen-name" @click="goUserPage(item.id)">
              {{ item.screen_name }}
            </div>
          </div>
          <a-avatar
            slot="avatar"
            :src="item.profile_image_origin_large"
            @click="goUserPage(item.id)"
          />
          <div slot="description">
            <div>
              <span v-if="!item.following && item.protected"
                ><a-icon type="lock"
              /></span>
              <span v-else>{{ item.status && item.status.text }}</span>
            </div>
          </div>
        </a-list-item-meta>
        <a-list-item-meta v-else>
          <div slot="title" class="list-title">
            <div
              class="screen-name"
              @click="goUserPage(item.user && item.user.id)"
            >
              {{ item.user && item.user.screen_name }}
            </div>
            <div class="time">{{ item.created_at | dateFormat }}</div>
          </div>
          <a-avatar
            slot="avatar"
            :src="item.user && item.user.profile_image_origin_large"
            @click="goUserPage(item.user && item.user.id)"
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
          :autosize="true"
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
          :autosize="true"
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
          :disabled="true"
          :defaultValue="deleteModalText"
          v-model="deleteModalText"
          maxlength="140"
          :autosize="true"
          ref="textArea"
        />
      </a-modal>
    </div>
  </div>
</template>

<script>
import {
  getHomeTimeline,
  getMentions,
  getFavorites,
  getConversationList,
  getPhotos,
  getUserTimeline,
  getUserFriends,
  getUserFollowers,
  deleteStatus,
  createFavorite,
  destroyFavorite,
  postStatus,
  createFirendship,
  destoryFirendship
} from "@/utils/fanfouService";
import { shell } from "electron";
export default {
  props: {
    timelineType: {
      type: Number,
      default: -1 // 0：我的消息；1：@提到的；2：收藏；3：私信列表；4：照片; 5: 他人的消息; 6: 关注; 7: 粉丝
    }
  },
  data() {
    return {
      loading: true,
      showLoadingMore: false,
      loadingMore: false,
      listData: [],
      emptyText: "",
      page: 1,
      currentListItemIndex: -1,
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
      deleteModalTitle: "确认删除这条消息吗？",
      deleteModalText: "",
      deleteModalVisible: false,
      // 发送私信
      msgOtherUserId: "",
      msgModalTitle: "",
      msgModalText: "",
      msgModalVisible: false
    };
  },
  watch: {
    timelineType() {
      this.loading = true;
      this.showLoadingMore = false;
      this.loadingMore = false;
      this.page = 1;
      document.documentElement.scrollTop = 0;
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      let listData = [];
      switch (this.timelineType) {
        case 0:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getHomeTimeline({ id: this.$route.query.userId });
          } else {
            listData = await getHomeTimeline();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有消息";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 1:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getMentions({ id: this.$route.query.userId });
          } else {
            listData = await getMentions();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有提到我的消息";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 2:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getFavorites({ id: this.$route.query.userId });
          } else {
            listData = await getFavorites();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有收藏";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 3:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getConversationList({
              id: this.$route.query.userId
            });
          } else {
            listData = await getConversationList();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有私信";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 4:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getPhotos({ id: this.$route.query.userId });
          } else {
            listData = await getPhotos();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有照片";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 5:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getUserTimeline({ id: this.$route.query.userId });
          } else {
            listData = await getUserTimeline();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有消息";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 6:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getUserFriends({ id: this.$route.query.userId });
          } else {
            listData = await getUserFriends();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有关注";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        case 7:
          if (this.$route.query && this.$route.query.userId) {
            listData = await getUserFollowers({ id: this.$route.query.userId });
          } else {
            listData = await getUserFollowers();
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.emptyText = "目前没有粉丝";
            }
            this.listData = listData;
          }
          this.loading = false;
          break;
        default:
          break;
      }
    },
    async onLoadMore() {
      if (this.loadingMore || this.listData.length === 0) {
        return;
      }
      this.loadingMore = true;
      let maxId = "";
      let listData = [];
      switch (this.timelineType) {
        case 0:
          maxId = this.listData[this.listData.length - 1].id;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getHomeTimeline({
              max_id: maxId,
              id: this.$route.query.userId
            });
          } else {
            listData = await getHomeTimeline({ max_id: maxId });
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 1:
          maxId = this.listData[this.listData.length - 1].id;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getMentions({
              max_id: maxId,
              id: this.$route.query.userId
            });
          } else {
            listData = await getMentions({ max_id: maxId });
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 2:
          this.page += 1;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getFavorites({
              page: this.page,
              id: this.$route.query.userId
            });
          } else {
            listData = await getFavorites({ page: this.page });
          }
          if (listData === null) {
            this.page -= 1;
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 3:
          this.page += 1;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getConversationList({
              page: this.page,
              id: this.$route.query.userId
            });
          } else {
            listData = await getConversationList({ page: this.page });
          }
          if (listData === null) {
            this.page -= 1;
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 4:
          this.page += 1;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getPhotos({
              page: this.page,
              id: this.$route.query.userId
            });
          } else {
            listData = await getPhotos({ page: this.page });
          }
          if (listData === null) {
            this.page -= 1;
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 5:
          maxId = this.listData[this.listData.length - 1].id;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getUserTimeline({
              max_id: maxId,
              id: this.$route.query.userId
            });
          } else {
            listData = await getUserTimeline({ max_id: maxId });
          }
          if (listData === null) {
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 6:
          this.page += 1;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getUserFriends({
              page: this.page,
              id: this.$route.query.userId
            });
          } else {
            listData = await getUserFriends({ page: this.page });
          }
          if (listData === null) {
            this.page -= 1;
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        case 7:
          this.page += 1;
          if (this.$route.query && this.$route.query.userId) {
            listData = await getUserFollowers({
              page: this.page,
              id: this.$route.query.userId
            });
          } else {
            listData = await getUserFollowers({ page: this.page });
          }
          if (listData === null) {
            this.page -= 1;
            this.$message.error("获取数据失败");
          } else {
            if (listData.length > 0) {
              this.showLoadingMore = true;
            } else {
              this.showLoadingMore = false;
            }
            this.listData = this.listData.concat(listData);
          }
          break;
        default:
          break;
      }
      this.loadingMore = false;
    },
    handleReplyClick(item) {
      this.replyStatusId = item.id;
      this.replyModalTitle = `回复：${item.plain_text}`;
      this.replyModalText = `@${item.user.screen_name} `;
      this.replyModalVisible = true;
    },
    async replyModalOkClick() {
      let data = await postStatus({
        in_reply_to_status_id: this.replyStatusId,
        status: this.replyModalText
      });
      if (data === null) {
        this.$message.error("回复失败");
      }
      this.replyModalVisible = false;
      this.$message.success("回复成功");
    },
    async handleStarClick(item, index) {
      let data;
      if (item.favorited) {
        data = await destroyFavorite(item.id);
        if (data === null) {
          this.$message.error("取消收藏失败");
        }
      } else {
        data = await createFavorite(item.id);
        if (data === null) {
          this.$message.error("收藏失败");
        }
      }
      this.listData[index].favorited = !item.favorited;
    },
    handleRetweetClick(item) {
      this.retweetStatusId = item.id;
      this.retweetModalText = `转@${item.user.screen_name} ${item.plain_text}`;
      this.retweetModalVisible = true;
      this.$nextTick(() => {
        this.$refs.textArea.focus();
      });
    },
    handleDeleteClick(item, index) {
      this.deleteModalText = item.plain_text;
      this.deleteStatusId = item.id;
      this.currentListItemIndex = index;
      this.deleteModalVisible = true;
    },
    async retweetModalOkClick() {
      let data = await postStatus({
        repost_status_id: this.retweetStatusId,
        status: this.retweetModalText
      });
      if (data === null) {
        this.$message.error("转发失败");
      }
      this.retweetModalVisible = false;
      this.$message.success("转发成功");
    },
    async deleteModalOkClick() {
      let data = await deleteStatus({ id: this.deleteStatusId });
      if (data === null) {
        this.$message.error("删除失败");
      }
      this.deleteModalVisible = false;
      this.listData.splice(this.currentListItemIndex, 1);
      this.$message.success("删除成功");
    },
    highlighClick(textItem) {
      if (textItem.type === "at") {
        this.$router.push({
          path: "/profile",
          query: {
            from: this.$route.fullPath,
            userId: textItem.id
          }
        });
      } else if (textItem.type === "link") {
        shell.openExternal(textItem.text);
      }
    },
    goUserPage(userId) {
      this.$router.push({
        path: "/profile",
        query: {
          from: this.$route.fullPath,
          userId: userId
        }
      });
    },
    async handleUnFoClick(item, index) {
      let data = await destoryFirendship({ id: item.id });
      if (data === null) {
        this.$message.error("取消关注失败");
      } else {
        this.$message.success("取消关注成功");
        this.listData[index].following = !item.following;
      }
    },
    async handleFoClick(item, index) {
      let data = await createFirendship({ id: item.id });
      if (data === null) {
        if (item.protected) {
          this.$message.success("已向TA发出关注请求，请等待确认");
        } else {
          this.$message.error("关注失败");
        }
      } else {
        this.$message.success("关注成功");
        this.listData[index].following = !item.following;
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
