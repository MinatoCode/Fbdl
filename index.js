const axios = require("axios");
const qs = require("querystring");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Only GET allowed" });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "Missing 'url' query parameter" });
  }

  const payload = { id: url, locale: "en" };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://likeedownloader.com",
    "Referer": "https://likeedownloader.com/facebook-video-downloader",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    const response = await axios.post(
      "https://likeedownloader.com/process",
      qs.stringify(payload),
      { headers }
    );

    const rawHtml = response.data.template;

    // Extract thumbnail
    const thumbMatch = rawHtml.match(/<img src="([^"]+)"/);
    const thumbnail = thumbMatch ? thumbMatch[1] : null;

    // Extract HD URL
    const hdMatch = rawHtml.match(/<span>\s*hd\s*<\/span>[\s\S]*?href="([^"]+)"/i);
    const hd = hdMatch ? hdMatch[1] : null;

    // Extract SD URL
    const sdMatch = rawHtml.match(/<span>\s*sd\s*<\/span>[\s\S]*?href="([^"]+)"/i);
    const sd = sdMatch ? sdMatch[1] : null;

    const output = {
      success: true,
      originalUrl: url,
      thumbnail,
      hd,
      sd,
    };

    // Always pretty-print JSON
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify(output, null, 2));
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.response?.data || err.message,
    });
  }
}
