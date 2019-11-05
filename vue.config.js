module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "com.yrm.flectron",
        productName: "Flectron",
        publish: ["github"],
        mac: {
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist",
          icon: "build/icons/icon.icns"
        }
      }
    }
  }
};
