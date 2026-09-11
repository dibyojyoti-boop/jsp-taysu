export default async function handler(req, res) {
  // Allow requests from your JSP TAYSU website
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({
        error: "ImageKit private key is not configured"
      });
    }

    const token = crypto.randomUUID();

    // Token valid for 10 minutes
    const expire = Math.floor(Date.now() / 1000) + 600;

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(privateKey),
      {
        name: "HMAC",
        hash: "SHA-1"
      },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(token + expire)
    );

    const signature = Array.from(
      new Uint8Array(signatureBuffer)
    )
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");

    return res.status(200).json({
      token,
      expire,
      signature
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to generate ImageKit authentication"
    });
  }
}
