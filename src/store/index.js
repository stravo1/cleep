import Vue from "vue";
import Vuex from "vuex";
import {
  createFolder,
  searchFiles,
  upload,
  download,
  deleteFile,
  getFileBlob,
} from "../assets/js/actions";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    signInState: false,
    isLoading: false,
    loadingMessage: "Loading",
    refreshState: false,
    accessToken: "",
    installedFile: {},
    filesList: [],
    foldersList: [],
    filesFolder: {},
    textsFolder: {},
    textList: [],
    toast: "",
    selectedFile: "",
    uploadText: "",
    uploadFiles: [],
    selectedFolder: { name: "root", id: "appDataFolder" },
  },
  mutations: {
    setSignInState(state, bool) {
      //console.log("updated", bool);
      state.signInState = bool;
    },
    setLoading(state, bool) {
      //console.log("updated", bool);
      state.isLoading = bool;
    },
    setLoadingMessage(state, arg) {
      //console.log("updated", bool);
      state.loadingMessage = arg;
    },
    setAccessToken(state, arg) {
      //console.log("updated", arg);
      state.accessToken = arg;
    },
    setRefreshState(state, arg) {
      state.refreshState = arg;
    },
    setFilesList(state, list) {
      state.filesList = list;
    },
    setFoldersList(state, list) {
      state.foldersList = list;
    },
    setSelectedFile(state, id) {
      ////console.log(name, "name")
      state.selectedFile = state.filesList.filter((file) => file.id == id)[0];
      ////console.log(state.selectedFile.name)
    },
    setSelectedFolder(state, arg) {
      //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed
      state.selectedFolder = state.foldersList.filter(
        (folder) => folder.name == arg
      )[0];
    },
    setToast(state, arg) {
      state.toast = arg;
    },
    setUploadText(state, arg) {
      state.uploadText = arg;
    },
    setUploadFiles(state, list) {
      state.uploadFiles = list;
    },
  },
  actions: {
    async checkInstall({ state, dispatch }) {
      state.isLoading = true;
      var initialFiles = await searchFiles({
        folder: state.selectedFolder.id,
        name: null,
        mType: null,
        accessToken: state.accessToken,
      }); // initialize all root files
      state.isLoading = false;

      var installed = initialFiles.filter((file) => file.name === "installed");
      if (installed.length) {
        state.foldersList = initialFiles.filter(
          (file) => file.mimeType === "application/vnd.google-apps.folder"
        ); // root folders
        state.textsFolder = state.foldersList.filter(
          (folder) => folder.name == "texts"
        )[0]; // textFolder
        state.filesFolder = state.foldersList.filter(
          (folder) => folder.name == "files"
        )[0]; // filesFolder
        // if(not skipped) { // skip in case of direct shares
        await dispatch("loadTexts");
        dispatch("loadFiles");
      } else {
        state.isLoading = true;
        state.loadingMessage = "Initializing your app";
        await dispatch("installApp");
        state.loadingMessage = "Loading";
        state.isLoading = false;
      }
    },
    async installApp({ state }) {
      await createFolder(state.accessToken, "texts", state.selectedFolder.id);
      await createFolder(state.accessToken, "files", state.selectedFolder.id);
      var blob = new Blob([JSON.stringify(new Date().getTime())], {
        type: "text/plain",
      });
      await upload(
        state.accessToken,
        state.selectedFolder.id,
        "installed",
        "text/plain",
        blob
      );
    },
    async loadFiles({ state }) {
      state.isLoading = true;
      state.loadingMessage = "Loading files";
      state.filesList = await searchFiles({
        name: null,
        mType: null,
        folder: state.filesFolder.id,
        accessToken: state.accessToken,
      });
      state.isLoading = false;
      state.loadingMessage = "Loading";
      console.log(state.filesList);
    },
    async loadTexts({ state }) {
      state.isLoading = true;
      state.loadingMessage = "Loading texts";
      state.textList = await searchFiles({
        name: null,
        mType: null,
        folder: state.textsFolder.id,
        accessToken: state.accessToken,
      });
      state.isLoading = false;
      state.loadingMessage = "Loading";
      console.log(state.textList);
    },
    async getContent({ state }, file) {
      var blob = await getFileBlob(file.id, state.accessToken);
      return blob;
    },
    async download({ state }, file) {
      state.toast("Downloading, please wait", {
        buttonLabel: "ok",
        timeout: 2000,
        force: true,
      });
      download(state.accessToken, file);
    },
    async uploadContent({ state }) {
      if (state.uploadText !== "") {
        // upload text
        var textBlob = new Blob([state.uploadText], { type: "text/plain" });
        state.toast("Uploading text...", { buttonLabel: "ok", timeout: 1500 });
        var resp = await upload(
          state.accessToken,
          state.textsFolder.id,
          JSON.stringify(new Date().getTime()),
          "text/plain",
          textBlob
        );
        state.toast("Text uploaded!", { buttonLabel: "ok", timeout: 1500 });
        state.textList.unshift(resp);
      }
      if (state.uploadFiles.length) {
        state.uploadFiles.forEach(async (file) => {
          var fileBlob;
          if (file.category === "file")
            fileBlob = new Blob([file.content], { type: file.type });
          else {
            fileBlob = await file.content.blob();
          }
          state.toast("Uploading " + file.name, {
            buttonLabel: "ok",
            timeout: 1500,
          });
          var resp = await upload(
            state.accessToken,
            state.filesFolder.id,
            file.name,
            file.type,
            fileBlob
          );
          resp.size = file.size;
          // add new file to fileList
          state.filesList.unshift(resp);
          state.toast(file.name + " uploaded!", {
            buttonLabel: "ok",
            timeout: 1500,
            force: true,
          });
        });
      }
    },
    async deleteFile({ state }, file) {
      await deleteFile(state.accessToken, file.id);
      state.toast(file.name + " deleted!", {
        buttonLabel: "ok",
        timeout: 1500,
        force: true,
      });
      state.filesList.splice(state.filesList.indexOf(file), 1);
    },
    async deleteText({ state }, file) { // redundant code 
      await deleteFile(state.accessToken, file.id);
      state.toast("Deleted!", {
        buttonLabel: "ok",
        timeout: 1500,
        force: true,
      });
      state.textList.splice(state.textList.indexOf(file), 1);
    },
    
    async refresh({ state }) {},
  },
  getters: {
    timeFormatter: (state) => (arg) => {
      if (arg == "just now") return arg;
      var then = new Date(arg);
      var now = new Date();
      //console.log(arg, now.toString(), then.toString());
      if (now.getFullYear() - then.getFullYear() > 0) {
        return (
          JSON.stringify(then.getFullYear()) +
          new Intl.DateTimeFormat("en-US", { month: "long" }).format(then)
        );
      } else if (now.getMonth() - then.getMonth() > 0) {
        return (
          new Intl.DateTimeFormat("en-US", { month: "long" }).format(then) +
          ", " +
          JSON.stringify(then.getDate())
        );
      } else if (now.getDate() - then.getDate() >= 7) {
        return +JSON.stringify(then.getDate()) + "th, this month";
      } else if (
        now.getDay() - then.getDay() == 1 ||
        now.getDay() - then.getDay() == -6
      ) {
        return (
          "yesterday " +
          new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(then)
        );
      } else if (
        now.getDay() - then.getDay() > 1 ||
        now.getDay() - then.getDay() <= -1
      ) {
        return (
          new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(then) +
          " " +
          new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(then)
        );
      } else if (now.getHours() - then.getHours() > 1) {
        return JSON.stringify(now.getHours() - then.getHours()) + " hours ago";
      } else if (
        now.getHours() - then.getHours() == 1 &&
        now.getMinutes() - then.getMinutes() > 1
      ) {
        return "1 hour ago";
      } else if (now.getMinutes() - then.getMinutes() > 1) {
        return (
          JSON.stringify(now.getMinutes() - then.getMinutes()) + " minutes ago"
        );
      } else if (now.getMinutes() - then.getMinutes() < -1) {
        return (
          JSON.stringify(60 + (now.getMinutes() - then.getMinutes())) +
          " minutes ago"
        );
      } else {
        return "moments ago";
      }
    },
  },
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        options: {},
      },
      mutations: {
        push(state, page) {
          state.stack.push(page);
        },
        pop(state) {
          if (state.stack.length > 1) {
            state.stack.pop();
          }
        },
        replace(state, page) {
          state.stack.pop();
          state.stack.push(page);
        },
        reset(state, page) {
          state.stack = [page || state.stack[0]];
        },
        options(state, newOptions = {}) {
          state.options = newOptions;
        },
      },
    },

    splitter: {
      strict: true,
      namespaced: true,
      state: {
        open: false,
      },
      mutations: {
        toggle(state, shouldOpen) {
          if (typeof shouldOpen === "boolean") {
            state.open = shouldOpen;
          } else {
            state.open = !state.open;
          }
        },
      },
    },

    tabbar: {
      strict: true,
      namespaced: true,
      state: {
        index: 0,
      },
      mutations: {
        set(state, index) {
          state.index = index;
        },
      },
    },
  },
});
