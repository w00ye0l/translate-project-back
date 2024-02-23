const express = require("express");
const serverless = require("serverless-http");
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

app.post("/translate", function (req, res) {
  try {
    const requestBody = req.body;

    if (!requestBody) {
      // 필수 필드가 누락된 경우 400 Bad Request 응답을 반환
      return res
        .status(400)
        .json({ error: "Bad Request: 필수 필드가 누락되었습니다." });
    }

    const api_url = "https://openapi.naver.com/v1/papago/n2mt";
    const target = requestBody.target;
    const query = requestBody.text;
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
        console.log(body);
        res.json(JSON.parse(body));
      } else {
        console.error("에러 발생:", error);
        console.error("상태 코드:", response ? response.statusCode : "없음");
        console.error("응답 바디:", body || "없음");
        console.error("데이터:", options);
        res
          .status(response ? response.statusCode : 500)
          .json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "Internal Server Error", req: req });
  }
});

module.exports.handler = serverless(app);
