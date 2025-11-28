// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

// ---- CORS FIX ----
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow all domains
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
// -------------------

app.use(bodyParser.json());

const JUDGE0_URL = "http://localhost:2358";

// Decode base64 safely
const decode = (v) => (v ? Buffer.from(v, "base64").toString("utf8") : null);

// Poll until result ready
async function waitForResult(token) {
  while (true) {
    const res = await axios.get(`${JUDGE0_URL}/submissions/${token}?base64_encoded=true`);
    if (res.data.status.id >= 3) return res.data;
    await new Promise((r) => setTimeout(r, 200));
  }
}

app.post("/run", async (req, res) => {
  try {
    const { source, languageId, stdin } = req.body;

    const submission = await axios.post(
      `${JUDGE0_URL}/submissions?wait=false`,
      {
        source_code: source,
        language_id: languageId,
        stdin: stdin || "",
        cpu_time_limit: "2",
        memory_limit: 128000
      }
    );

    const token = submission.data.token;
    const result = await waitForResult(token);
    console.log("Judge0 Result:", JSON.stringify(result, null, 2));

    res.json({
      status: result.status.description,
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      compile_output: decode(result.compile_output),
      time: result.time,
      memory: result.memory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3005, () => {
  console.log("Server running on http://localhost:3005");
});
