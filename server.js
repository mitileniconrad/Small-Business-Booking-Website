// Small booking server: serves the app and keeps bookings in data/bookings.json
// Run it with:  node server.js   then open http://localhost:3000
// No packages to install, it only uses what comes with Node.

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

const ALREADY_BOOKED = "This date is already booked. Please choose another date.";

// Only these are served as files, so data/bookings.json and server.js stay private
const PUBLIC_FOLDERS = ["CSS", "JS", "assets"];
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon"
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ---------- bookings.json ----------

// Every change goes through this queue, one at a time, so two requests can never overwrite each other
let queue = Promise.resolve();
function withLock(task) {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
}

async function readBookings() {
  let raw;
  try {
    raw = await fs.promises.readFile(DATA_FILE, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return [];   //no file yet = no bookings yet
    throw err;
  }
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    // never overwrite a file that was edited by hand and broke
    throw new HttpError(500, "data/bookings.json is not valid JSON. Fix it or delete it.");
  }
}

async function writeBookings(list) {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  await fs.promises.writeFile(tmp, JSON.stringify(list, null, 2) + "\n");
  await fs.promises.rename(tmp, DATA_FILE);   //swap in the finished file so it is never half written
}

// ---------- validation ----------

function todayYMD() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function checkDate(date) {
  const m = typeof date === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) throw new HttpError(400, "Please pick a valid date.");
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const real = new Date(y, mo - 1, d);
  if (real.getFullYear() !== y || real.getMonth() !== mo - 1 || real.getDate() !== d) {
    throw new HttpError(400, "Please pick a valid date.");
  }
  if (date < todayYMD()) throw new HttpError(400, "Please choose today or a future date.");
}

// One booking per business per day
function checkFree(list, businessId, date, ignoreId) {
  if (list.some(b => b.businessId === businessId && b.date === date && b.id !== ignoreId)) {
    throw new HttpError(409, ALREADY_BOOKED);
  }
}

// ---------- API ----------

async function readJsonBody(req) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) {
    throw new HttpError(415, "Send JSON.");
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 10000) throw new HttpError(413, "Request too large.");
    chunks.push(chunk);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new HttpError(400, "Invalid JSON.");
  }
}

async function handleApi(req, res, parts) {
  // parts: ["api", "bookings"] or ["api", "bookings", id]
  if (parts[1] !== "bookings" || parts.length > 3) throw new HttpError(404, "Not found.");
  const id = parts[2];

  if (req.method === "GET" && !id) {
    return send(res, 200, await readBookings());
  }

  if (req.method === "POST" && !id) {
    const body = await readJsonBody(req);
    const { businessId, businessName, customerName, date } = body;
    if (!Number.isInteger(businessId) || businessId < 1) throw new HttpError(400, "Missing business.");
    if (typeof businessName !== "string" || !businessName.trim() || businessName.length > 100) {
      throw new HttpError(400, "Missing business name.");
    }
    if (customerName !== undefined && (typeof customerName !== "string" || customerName.length > 30)) {
      throw new HttpError(400, "Invalid name.");
    }
    checkDate(date);

    const booking = await withLock(async () => {
      const list = await readBookings();
      checkFree(list, businessId, date);
      const created = {
        id: crypto.randomUUID(),
        businessId,
        businessName: businessName.trim(),
        customerName: (customerName || "").trim(),
        date,
        createdAt: new Date().toISOString()
      };
      list.push(created);
      await writeBookings(list);
      return created;
    });
    return send(res, 201, booking);
  }

  if (req.method === "PUT" && id) {
    const body = await readJsonBody(req);
    checkDate(body.date);

    const booking = await withLock(async () => {
      const list = await readBookings();
      const found = list.find(b => b.id === id);
      if (!found) throw new HttpError(404, "Booking not found.");
      checkFree(list, found.businessId, body.date, id);
      found.date = body.date;
      found.updatedAt = new Date().toISOString();
      await writeBookings(list);
      return found;
    });
    return send(res, 200, booking);
  }

  if (req.method === "DELETE" && id) {
    await withLock(async () => {
      const list = await readBookings();
      const next = list.filter(b => b.id !== id);
      if (next.length === list.length) throw new HttpError(404, "Booking not found.");
      await writeBookings(next);
    });
    return send(res, 200, { ok: true });
  }

  throw new HttpError(405, "Method not allowed.");
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

// ---------- static files ----------

async function serveFile(res, urlPath) {
  let rel;
  try {
    rel = decodeURIComponent(urlPath);
  } catch {
    throw new HttpError(400, "Bad request.");
  }
  if (rel === "/") rel = "/index.html";

  const file = path.normalize(path.join(ROOT, rel));
  const inside = path.relative(ROOT, file);
  const top = inside.split(path.sep)[0];
  const allowed = inside === "index.html" || PUBLIC_FOLDERS.includes(top);
  if (inside.startsWith("..") || path.isAbsolute(inside) || !allowed) throw new HttpError(404, "Not found.");

  let data;
  try {
    data = await fs.promises.readFile(file);
  } catch {
    throw new HttpError(404, "Not found.");
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
  res.end(data);
}

// ---------- server ----------

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, "http://localhost");
    const parts = pathname.split("/").filter(Boolean);

    if (parts[0] === "api") {
      await handleApi(req, res, parts);
    } else if (req.method === "GET" || req.method === "HEAD") {
      await serveFile(res, pathname);
    } else {
      throw new HttpError(405, "Method not allowed.");
    }
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    if (status === 500 && !(err instanceof HttpError)) console.error(err);
    if (res.headersSent) return res.end();
    const wantsJson = String(req.url).startsWith("/api");
    if (wantsJson) {
      send(res, status, { error: status === 500 && !(err instanceof HttpError) ? "Something went wrong on the server." : err.message });
    } else {
      res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  }
});

// If the port is taken, say so instead of crashing with a long error
server.on("error", err => {
  if (err.code === "EADDRINUSE") {
    console.error("Port " + PORT + " is already in use by another program, so the booking server did NOT start.");
    console.error("Use a different port, for example:");
    console.error("  Windows (cmd):  set PORT=3001 && node server.js");
    console.error("  PowerShell:     $env:PORT=3001; node server.js");
    console.error("  Mac/Linux:      PORT=3001 node server.js");
    console.error("Then open http://localhost:3001");
  } else {
    console.error(err);
  }
  process.exit(1);
});

// 127.0.0.1 = only this computer can reach it
server.listen(PORT, "127.0.0.1", () => {
  console.log("Booking app running at http://localhost:" + PORT);
  console.log("Bookings are saved in " + DATA_FILE);
});