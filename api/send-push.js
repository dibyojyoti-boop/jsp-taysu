import admin from "firebase-admin";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    if (!admin.apps.length) {
      const serviceAccount =
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const {
      token,
      title,
      body,
      icon,
      url,
      tag
    } = req.body || {};

    if (!token) {
      return res.status(400).json({
        error: "FCM token is required"
      });
    }

    const message = {
  token,

  

  data: {
    title: title || "JSP TAYSU",
    body: body || "",
    senderName: title || "Member",
senderPhotoURL: icon || "",
    icon: icon || "https://dibyojyoti-boop.github.io/jsp-taysu/favicon.ico",
    url: url || "https://dibyojyoti-boop.github.io/jsp-taysu/community.html",
    tag: tag || "jsp-taysu-notification"
  },

  webpush: {
  headers: {
    Urgency: "high"
  },
  fcmOptions: {
    link: url || "https://dibyojyoti-boop.github.io/jsp-taysu/community.html"
  }
}
};

    const response = await admin.messaging().send(message);

    return res.status(200).json({
      success: true,
      messageId: response
    });

  } catch (error) {

    console.error("FCM error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
