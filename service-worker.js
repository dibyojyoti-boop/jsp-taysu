const CACHE_NAME = "taysu-v2";


// =========================================================
// SERVICE WORKER INSTALL
// =========================================================

self.addEventListener("install", event => {
  self.skipWaiting();
});


// =========================================================
// SERVICE WORKER ACTIVATE
// =========================================================

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});


// =========================================================
// FIREBASE CLOUD MESSAGING
// =========================================================

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);


firebase.initializeApp({
  apiKey:
    "AIzaSyDpv2vqAZbCFgT_XJ4u-KB0AeZWVB2GIUs",

  authDomain:
    "jsp-taysu.firebaseapp.com",

  projectId:
    "jsp-taysu",

  storageBucket:
    "jsp-taysu.firebasestorage.app",

  messagingSenderId:
    "280992025632",

  appId:
    "1:280992025632:web:48efa21208a78be9a78045"
});


const messaging =
  firebase.messaging();


// =========================================================
// BACKGROUND MESSAGE
// =========================================================

messaging.onBackgroundMessage(
  payload => {

    console.log(
      "[TAYSU SW] Background message:",
      payload
    );


    const data =
      payload.data || {};


    const senderName =
      data.senderName ||
      data.title ||
      "Member";


    const messageBody =
      data.body ||
      "sent you a message.";


    const senderPhoto =
      data.senderPhotoURL ||
      data.icon ||
      "https://dibyojyoti-boop.github.io/jsp-taysu/jasingpha-icon.png";


    const targetUrl =
      data.url ||
      "https://dibyojyoti-boop.github.io/jsp-taysu/message.html";


    const notificationOptions = {

      body:
        messageBody,

      icon:
        senderPhoto,

      badge:
        "https://dibyojyoti-boop.github.io/jsp-taysu/jasingpha-icon.png",

      tag:
        data.tag ||
        "taysu-message",

      renotify:
        true,

      data: {
        url:
          targetUrl
      }
    };


    return self.registration.showNotification(
      senderName,
      notificationOptions
    );

  }
);


// =========================================================
// NOTIFICATION CLICK
// =========================================================

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const targetUrl =
      event.notification?.data?.url ||
      "https://dibyojyoti-boop.github.io/jsp-taysu/message.html";


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      }).then(
        clientList => {

          for(
            const client of clientList
          ){

            if(
              "focus" in client
            ){

              client.navigate(
                targetUrl
              );

              return client.focus();

            }

          }


          if(
            clients.openWindow
          ){

            return clients.openWindow(
              targetUrl
            );

          }

        }
      )

    );

  }
);


// =========================================================
// FETCH / OFFLINE FALLBACK
// =========================================================

self.addEventListener(
  "fetch",
  event => {

    if(
      event.request.method !== "GET"
    ){

      return;

    }


    event.respondWith(

      fetch(event.request)
        .catch(
          () => {

            return caches.match(
              event.request
            );

          }
        )

    );

  }
);
