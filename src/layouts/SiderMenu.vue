<template>
  <div>
    <div style="width: 70px">
      <a-menu
        :selectedKeys="selectedKeys"
        :openKeys.sync="openKeys"
        mode="inline"
        theme="dark"
      >
        <template v-for="item in menuData">
          <a-menu-item
            v-if="!item.children"
            :key="item.path"
            @click="goPathClick(item)"
          >
            <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
          <sub-menu v-else :menu-info="item" :key="item.path" />
        </template>
      </a-menu>
    </div>
    <!-- send modal -->
    <a-modal
      :title="sendModalTitle"
      v-model="sendModalVisible"
      :closable="false"
      :destroyOnClose="true"
    >
      <a-textarea
        :defaultValue="sendModalText"
        v-model="sendModalText"
        :rows="4"
        maxlength="140"
      />
      <template slot="footer">
        <div class="send-modal-footer">
          <div>
            <a-button key="upload" @click="handleUpload"
              ><a-icon type="plus"
            /></a-button>
          </div>
          <div>
            <a-button key="cancel" @click="handleCancel">取消</a-button>
            <a-button
              :disabled="!sendModalText"
              key="submit"
              type="primary"
              @click="handleOk"
            >
              发送
            </a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
/*
 * recommend SubMenu.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
 * SubMenu1.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
 * */
import SubMenu from "./SubMenu";
export default {
  components: {
    "sub-menu": SubMenu
  },
  watch: {
    "$route.path": function(val) {
      console.log(val);
      if (val !== "/profile") {
        this.selectedKeys = this.selectedKeysMap[val];
        this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
      }
    }
  },
  data() {
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    const menuData = this.getMenuData(this.$router.options.routes);
    return {
      collapsed: true,
      menuData,
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path],
      sendModalTitle: "你在做什么？",
      sendModalText: "",
      sendModalVisible: false
    };
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    getMenuData(routes = [], parentKeys = [], selectedKey) {
      const menuData = [];
      routes.forEach(item => {
        if (item.name && !item.hideInMenu) {
          this.openKeysMap[item.path] = parentKeys;
          this.selectedKeysMap[item.path] = [selectedKey || item.path];
          const newItem = { ...item };
          delete newItem.children;
          if (item.children && !item.hideChildrenInMenu) {
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
          } else {
            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path],
              selectedKey || item.path
            );
          }
          menuData.push(newItem);
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          menuData.push(...this.getMenuData(item.children));
        }
      });
      return menuData;
    },
    goPathClick(item) {
      if (item.name === "send") {
        // alert("send");
        this.sendModalVisible = true;
      } else {
        this.$router.replace({ path: item.path });
      }
    },
    handleCancel() {
      this.sendModalVisible = false;
    },
    handleUpload() {},
    handleOk() {}
  }
};
</script>
<style lang="less" scoped>
.send-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
