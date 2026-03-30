const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8000;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const requestPath = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = path.join(root, requestPath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type":
          mimeTypes[path.extname(filePath).toLowerCase()] ||
          "application/octet-stream",
      });

      fs.createReadStream(filePath).pipe(res);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
  });
