const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.text({ type: "*/*" }));

app.post("/proxy", async (req, res) => {
  console.log("Gelen SOAP isteği:\n", req.body);

  try {
    const targetUrl = "https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx";
    const soapAction = "http://tempuri.org/GetHatOtoKonum_json";

    const response = await axios.post(targetUrl, req.body, {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": soapAction,
        "User-Agent": "Mozilla/5.0 (Node.js Proxy)",
      },
      timeout: 10000,
    });

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, SOAPAction");

    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Hata Detayı:");
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else {
      console.error("Proxy Hatası:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

app.options("/proxy", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, SOAPAction");
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`CORS proxy ${PORT} portunda çalışıyor`);
});
