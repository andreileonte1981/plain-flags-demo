const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

require("dotenv").config();

const DIST_DIR = path.join(__dirname, "dist");
const INDEX_PATH = path.join(DIST_DIR, "index.html");

const PORT = Number(process.env.PORT || 5176);
const GRID_URL = process.env.GRID_URL || "http://localhost:3000/api/grid";

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

function writeNotFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
}

function writeError(res) {
  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Internal server error");
}

function writeInjectedIndex(res) {
  try {
    const html = fs.readFileSync(INDEX_PATH, "utf-8");
    const runtimeScript = `<script>window.ENV = {...(window.ENV || {}), GRID_URL: ${JSON.stringify(
      GRID_URL
    )}};</script>`;
    const injectedHtml = html.replace("</head>", `${runtimeScript}\n  </head>`);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(injectedHtml);
  } catch (error) {
    console.error("Failed to render index.html", error);
    writeError(res);
  }
}

function writeStaticFile(res, filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    console.error("Failed to read static file", error);
    writeError(res);
  }
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    writeNotFound(res);
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === "/" || pathname === "/index.html") {
    writeInjectedIndex(res);
    return;
  }

  const staticPath = path.normalize(path.join(DIST_DIR, pathname));
  if (!staticPath.startsWith(DIST_DIR)) {
    writeNotFound(res);
    return;
  }

  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    writeStaticFile(res, staticPath);
    return;
  }

  // SPA fallback for React Router routes
  writeInjectedIndex(res);
});

server.listen(PORT, () => {
  console.log(`Serving gcp/webapp on http://localhost:${PORT}`);
  console.log(`Runtime GRID_URL: ${GRID_URL}`);
});
