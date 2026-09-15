importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDpv2vqAZbCFgT_XJ4u-KB0AeZWVB2GIUs",
  authDomain: "jsp-taysu.firebaseapp.com",
  projectId: "jsp-taysu",
  storageBucket: "jsp-taysu.firebasestorage.app",
  messagingSenderId: "280992025632",
  appId: "1:280992025632:web:48efa21208a78be9a78045"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  
  const title = data.title || "JSP TAYSU";
  const senderPhoto = data.senderPhotoURL || data.icon || "/jsp-taysu/favicon.ico";
  const options = {
    body: data.body || "",
    icon: senderPhoto,
    data: {
      url: data.url || "/jsp-taysu/community.html"
    },
    tag: data.tag || "jsp-taysu-notification",
    renotify: true
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/jsp-taysu/community.html";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
