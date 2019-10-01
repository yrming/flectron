<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="less">
.ant-layout-sider-collapsed {
  flex: 0 0 70px !important;
  max-width: 70px !important;
  min-width: 70px !important;
  width: 70px !important;
}
.ant-menu-item {
  width: 100% !important;
}
.ant-menu-inline-collapsed {
  width: 100% !important;
}
.ant-menu-inline-collapsed > .ant-menu-item,
.ant-menu-inline-collapsed
  > .ant-menu-item-group
  > .ant-menu-item-group-list
  > .ant-menu-item,
.ant-menu-inline-collapsed
  > .ant-menu-item-group
  > .ant-menu-item-group-list
  > .ant-menu-submenu
  > .ant-menu-submenu-title,
.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0 !important;
  text-align: center;
}
// .ant-menu.ant-menu-dark .ant-menu-item-selected,
// .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
//   background-color: #666666;
// }
.ant-menu-item:last-of-type {
  position: absolute !important;
  left: 15px !important;
  bottom: 22px !important;
  background-color: #767779 !important;
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
}

.ant-layout-header {
  position: fixed;
  left: 70px;
  right: 0;
  top: 0;
  border-bottom: 1px solid #171717;
  z-index: 1;
  background: #212121;
  padding: 0;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #c0c0c0;
  font-weight: bold;
}
.ant-layout-sider {
  // background: #35383c;
  background: #34383b;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 70px;
  z-index: 1;
}

.ant-menu-dark,
.ant-menu-dark .ant-menu-sub {
  background: #35383c;
}
.basic-layout-content {
  margin: 36px 16px 16px 86px;
  background: #212121;
  .header {
    position: fixed;
    left: 70px;
    right: 0;
    top: 0;
    border-bottom: 1px solid #171717;
    z-index: 1;
    background: #212121;
    padding: 0;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #c0c0c0;
    font-weight: bold;
  }
}
.ant-list-vertical .ant-list-item-action {
  margin-left: 56px;
}
.ant-list-item-action > li {
  color: #5a5a5a;
  font-weight: bold;
}
.ant-list-vertical .ant-list-item-meta-title {
  .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .screen-name {
      cursor: pointer;
    }
  }
  font-size: 14px;
  margin-bottom: 5px;
  color: rgba(247, 247, 247, 0.85);
  .time {
    color: #5a5a5a;
    font-size: 10px;
    font-weight: normal;
  }
}
.ant-list-vertical .ant-list-item-meta-description {
  color: rgba(247, 247, 247, 0.75);
}
.ant-list-item-action-split {
  background-color: #313131;
}
.ant-list-split .ant-list-item {
  border-bottom: 1px solid #313131;
}
.ant-list-something-after-last-item
  .ant-spin-container
  > .ant-list-item:last-child {
  border-bottom: 1px solid #313131;
}
.ant-list-vertical .ant-list-item-meta {
  margin-bottom: 10px;
}
.ant-avatar {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.ant-list-item-meta-description {
  word-break: break-all;
  .highlight {
    color: #93a9b7;
    cursor: pointer;
  }
}
.ant-spin-container:after {
  background: #313131;
}
ul {
  padding: 0;
}
.ant-modal-content {
  background-color: #060606;
  .ant-modal-header {
    background-color: #111112;
    border-bottom: 0px solid #313131;
    .ant-modal-title {
      color: rgba(247, 247, 247, 0.85);
    }
  }
  .ant-modal-body {
    .ant-input {
      background-color: #313131;
      border: 1px solid #313131;
      // color: #f7f7f7;
      color: rgba(247, 247, 247, 0.65);
    }
    .ant-input:focus {
      box-shadow: none;
    }
    textarea {
      resize: none;
    }
  }
  .ant-modal-footer {
    background-color: #111112;
    border-top: 0px solid #313131;
    .ant-btn-default {
      background-color: #2d2d2d;
      color: rgba(247, 247, 247, 0.85);
      border: none;
    }
    .ant-btn-primary[disabled] {
      background-color: #2d2d2d;
      color: rgba(247, 247, 247, 0.85);
      border: none;
    }
    .ant-btn-primary {
      color: rgba(247, 247, 247, 0.85);
      border: none;
    }
  }
}
</style>
