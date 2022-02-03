async function searchFiles(arg) {
  var accessToken = arg.accessToken;
  var folder = arg.folder;
  var mType = arg.mType;
  var name = arg.name;
  var outResolve, response;
  ////console.log(setFolders, "gg")
  var promise = new Promise((resolve, reject) => {
    outResolve = resolve;
  });
  var s = {
    " ": "%20",
    "=": "%3D",
    ",": "%2C",
    '"': "%22",
  };
  //try to simplify the following code later... future me sorry
  var fLink;
  folder != null
    ? (fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents")
    : (fLink = "");

  var mLink;
  mType != null
    ? (mLink = "mimeType" + s["="] + "'" + mType + "'")
    : (mLink = "");

  var nLink;
  name != null
    ? (nLink = "name" + s[" "] + "contains" + s[" "] + "'" + name + "'")
    : (nLink = "");

  var and = s[" "] + "and" + s[" "];

  var link =
    "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name%2C%20size%2C%20createdTime%2C%20mimeType)&q=" +
    nLink; //complex turnary upcoming lol xb
  name != null
    ? folder != null
      ? (link += and)
      : mType != null
      ? (link += and)
      : (link += "")
    : (link += "");
  link += fLink;
  mType != null
    ? name != null
      ? (link += and)
      : folder != null
      ? (link += and)
      : (link += "")
    : (link += "");
  link += mLink;

  //console.log(link);
  var xhr_s = new XMLHttpRequest();

  xhr_s.open("GET", link);

  xhr_s.setRequestHeader("Authorization", "Bearer " + accessToken);

  xhr_s.onload = function () {
    response = JSON.parse(this.response).files;
    //console.log(response, "resp");
    //setFolders ? commit('setFoldersList', JSON.parse(this.response).files) : false
    //setFolders ? //console.log(state.foldersList) : //console.log(response)
    outResolve();
  };

  xhr_s.send();
  await promise;
  return response;
}

const createFolder = async (accessToken, name, parent, last = false) => {
  var outResolve, response;
  var promise = new Promise((resolve, reject) => {
    outResolve = resolve;
  });
  var xhr_up = new XMLHttpRequest();
  xhr_up.open(
    "POST",
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
  );
  xhr_up.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr_up.onload = function () {
    if (this.status == 200) {
      //console.log("Uploaded", this.response)
      response = JSON.parse(this.response);
    } else {
      //console.log("error", this.status)
    }
    outResolve();
  };
  var fileContent, fileType, fileName;
  fileType = "application/vnd.google-apps.folder";
  fileName = name;

  if (last) {
    fileContent = '{"messages":[]}';
    fileType = "application/json";
  }
  var metadata = {
    name: fileName,
    mimeType: fileType,
    parents: [parent],
  };

  var file = new Blob([fileContent], { type: fileType });

  var data = new FormData();
  data.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  data.append("file", file);

  xhr_up.send(data);
  await promise;
  return response;
};
const upload = async (accessToken, parent, name, type, blob) => {
  var outResolve, response;
  var promise = new Promise((resolve, reject) => {
    outResolve = resolve;
  });
  var xhr_up = new XMLHttpRequest();
  xhr_up.open(
    "POST",
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
  );
  xhr_up.setRequestHeader("Authorization", "Bearer " + accessToken);
  //xhr_up.upload.onprogress = updateProgress;
  xhr_up.onload = function () {
    if (this.status == 200) {
      //console.log("Uploaded", this.response)
      response = JSON.parse(this.response);
    } else {
      //console.log("error", this.status)
    }
    outResolve();
  };

  var metadata = {
    name: name,
    mimeType: type,
    parents: [parent]
  };

  var file = blob;

  var data = new FormData();
  data.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  data.append("file", file);

  xhr_up.send(data);
  await promise;
  return response;
};
export { searchFiles, createFolder, upload };
