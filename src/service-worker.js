import { registerRoute } from "workbox-routing";
import { clientsClaim, skipWaiting } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
self.__precacheManifest = [].concat(self.__precacheManifest || []);
console.log("Hello from service worker");

skipWaiting();
clientsClaim();

precacheAndRoute(self.__precacheManifest);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "MESSAGE_IDENTIFIER") {
    // do something
    postMsg("message from client!");
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function postMsg(message) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}

const shareTargetHandler = async ({ event }) => {
  const trigger = await caches.open("trigger");
  await trigger.put(
    "tigger",
    new Response(new Blob(["trigger"], { type: "text/plain" }))
  );
  const formData = await event.request.formData();

  const mediaFiles = formData.getAll("media");
  const texts = formData.getAll("description");

  const cache = await caches.open("add");
  for (const mediaFile of mediaFiles) {
    // TODO: Instead of bailing, come up with a
    // default name for each possible MIME type.

    const cacheKey = mediaFile.name;
    await cache.put(
      cacheKey,
      new Response(mediaFile, {
        headers: {
          "content-length": mediaFile.size,
          "content-type": mediaFile.type,
        },
      })
    );
  }
  for (const text of texts) {
    // TODO: Instead of bailing, come up with a
    // default name for each possible MIME type.
    console.log(text);
    const cacheKey = new URL(`${Date.now()}`, self.location).href;
    const txtBlob = new Blob([text], { type: "text/plain" });
    await cache.put(
      cacheKey,
      new Response(txtBlob, {
        headers: {
          "content-length": txtBlob.size,
          "content-type": "text/plain",
        },
      })
    );
  }
  //postMsg("file received");
  return Response.redirect("/", 303);
};

registerRoute("/_share-target", shareTargetHandler, "POST");
