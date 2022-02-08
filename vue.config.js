module.exports = {
  pwa: {
    name: "cleep",
    themeColor: "#ffffff",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "white",
    manifestOptions: {
      share_target: {
        action: "/_share-target",
        enctype: "multipart/form-data",
        method: "POST",
        params: {
          title: "name",
          text: "description",
          url: "link",
          files: [
            {
              name: "media",
              accept: [
                "audio/*",
                "image/*",
                "video/*",
                "application/*",
                "text/*",
                "font/*",
              ],
            },
          ],
        },
      },
      start_url: ".",
      display: "standalone",
      background_color: "#000000",
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "./src/service-worker.js",
      // ...other Workbox options...
    },
  },
};
