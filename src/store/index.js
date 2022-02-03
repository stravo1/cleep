import Vue from "vue";
import Vuex from "vuex";
import { createFolder, searchFiles, upload } from "../assets/js/actions";
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
    selectedFile: "",
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

      //console.log(state.selectedFolder.name, "hh", state.previousFolders);
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
        dispatch("loadTexts");
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
