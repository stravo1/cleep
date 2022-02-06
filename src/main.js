import Vue from "vue";
import App from "./App.vue";
// import './registerServiceWorker'
import router from "./router";
import store from "./store";
// Webpack CSS import
import "onsenui/css/onsenui.css";
if (localStorage.getItem("dark") === "true") {
  import("onsenui/css/dark-onsen-css-components.css").then(() => {
    console.log("Dark theme!");
  });
} else {
  import("onsenui/css/onsen-css-components.css").then(() => {
    console.log("Dark theme available! Check Settings.");
  });
}
//import 'onsenui/css/dark-onsen-css-components.css';

// JS import
import VueOnsen from "vue-onsenui"; // This imports 'onsenui', so no need to import it separately

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });

  window.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register(
      "service-worker.js"
    );

    // After the initial load, force a service worker update check each time
    // our web app is hidden and then brought back to the foreground.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        registration.update();
      }
    });

    //await syncContentIndex(registration);
  });
}
Vue.use(VueOnsen);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
