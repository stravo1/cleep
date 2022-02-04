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
    parents: [parent],
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

const getFileBlob = async (fileId, accessToken) => {
  var header = new Headers();
  header.append("Authorization", "Bearer " + accessToken);
  var response = await fetch(
    "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media",
    {
      method: "GET",
      headers: header,
    }
  );
  return response.blob();
  
};

const downloadBlob = async (blob, name) => {
  //console.log(blob)
  var filename = name;
  var downloadUrl;
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    //console.log('elseee')
    var URL = window.URL || window.webkitURL;
    downloadUrl = URL.createObjectURL(blob);
  }
  /*
      var embed = document.createElement('embed')
      embed.type = response[1]
      embed.src = downloadUrl
      embed.height = embed.width = "200px"
      document.getElementById('holder').appendChild(embed)
      return downloadUrl
      */
  //console.log(110)
  if (filename) {
    // use HTML5 a[download] attribute to specify filename
    var a = document.createElement("a");
    // safari doesn't support this yet
    if (typeof a.download === "undefined") {
      window.location = downloadUrl;
    } else {
      //console.log('else2')
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
    }
  } else {
    window.location = downloadUrl;
  }
};
const download = async (accessToken, file) => {
  var blob = await getFileBlob(file.id, accessToken);
  downloadBlob(blob, file.name);
};

const deleteFile = async (accessToken, fileId) => {
  var outResolve;
  var promise = new Promise((resolve, reject) => {
    outResolve = resolve;
  });
  var xhr_dlt = new XMLHttpRequest();
  var link = "https://www.googleapis.com/drive/v3/files/" + fileId;
  xhr_dlt.open("DELETE", link);
  xhr_dlt.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr_dlt.onload = function () {
    if (this.status == 204) {
      // 204 = success => No Content
      console.log("Deleted!");
    }
    if (this.status === 404) {
      console.log("File missing!");
    }
    //console.log(this.response, this.status);
    outResolve();
  };
  xhr_dlt.send();
  await promise;
  return true;
};
export { searchFiles, createFolder, upload, download, getFileBlob, deleteFile };
