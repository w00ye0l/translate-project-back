const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { client_id, client_secret } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "https://translate-project.vercel.app"],
  })
);

app.get("/", (req, res) => {
  console.log("home");
  res.end("home");
});

app.post("/translate", function (req, res) {
  const api_url = "https://openapi.naver.com/v1/papago/n2mt";
  const target = req.body.target;
  const query = req.body.text;
  const options = {
    url: api_url,
    form: { source: "ko", target: target, text: query },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        console.log(body);
        res.json(JSON.parse(body));
      } catch (error) {
        console.error("JSON parsing error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
