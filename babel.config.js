module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true },
      "ant-design-vue"
    ],
    [
      "import",
      { libraryName: "view-design", libraryDirectory: "src/components" },
      "view-design"
    ]
  ]
};
