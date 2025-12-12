const axios = require("axios");

// ---- Pretty Print Function ----
function pretty(obj) {
  return JSON.stringify(obj, null, 2); // always pretty print
}

module.exports = async function (req, res) {
  res.setHeader("Content-Type", "application/json"); // force JSON output

  const { url } = req.query;

  if (!url) {
    return res.status(400).send(
      pretty({
        success: false,
        author: "MinatoCode",
        message: "Missing ?url="
      })
    );
  }

  try {
    const form = new URLSearchParams();
    form.append("url", url);

    const response = await axios.post(
      "https://www.fbvideo.l2u.in/app/main.php",
      form,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
          Accept: "*/*",
          "Accept-Language": "en-IN,en;q=0.9",
          Cookie: "FCCDCF=1; FCNEC=1; gads=1; gpi=1;"
        }
      }
    );

    const data = response.data;

    const sd =
      data?.data?.links?.["Download Low Quality"] ||
      data?.links?.["Download Low Quality"] ||
      null;

    const hd =
      data?.data?.links?.["Download High Quality"] ||
      data?.links?.["Download High Quality"] ||
      null;

    return res.status(200).send(
      pretty({
        success: true,
        author: "MinatoCode",
        platform: "facebook",
        sd,
        hd
      })
    );
  } catch (err) {
    return res.status(500).send(
      pretty({
        success: false,
        author: "MinatoCode",
        error: err.message
      })
    );
  }
};
      
