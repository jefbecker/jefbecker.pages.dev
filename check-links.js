const fs = require("fs");
const path = require("path");

const BASE_DOMAIN = "jefbecker.com";
const CONCURRENCY_LIMIT = 10; // ajuste conforme necessário
const TIMEOUT_MS = 8000;

// ignorar domínios (opcional)
const IGNORE_DOMAINS = [
  "localhost"
];

// Detecta diretório automaticamente
let ROOT_DIR = __dirname;
if (fs.existsSync(path.join(__dirname, "public"))) {
  ROOT_DIR = path.join(__dirname, "public");
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

function extractLinks(html) {
  const regex = /<a\s+[^>]*href="([^"]+)"/gi;
  const links = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function normalizeUrl(link) {
  try {
    return new URL(link, "https://" + BASE_DOMAIN).href;
  } catch {
    return null;
  }
}

function isExternal(url) {
  try {
    const u = new URL(url);
    return (
      !u.hostname.includes(BASE_DOMAIN) &&
      !IGNORE_DOMAINS.some(d => u.hostname.includes(d))
    );
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function checkLink(url) {
  try {
    let res = await fetchWithTimeout(url, { method: "HEAD" });

    if (!res.ok && res.status === 405) {
      res = await fetchWithTimeout(url, { method: "GET" });
    }

    return res.status;
  } catch {
    return "FALHA";
  }
}

// Executor com limite de concorrência
async function runWithLimit(tasks, limit) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workers = Array.from({ length: limit }, worker);
  await Promise.all(workers);

  return results;
}

async function run() {
  console.log("🔍 Verificando links externos em:", ROOT_DIR);

  const files = walk(ROOT_DIR);
  const uniqueLinks = new Set();

  // Coleta links
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const links = extractLinks(html);

    links.forEach(link => {
      const url = normalizeUrl(link);
      if (url && isExternal(url)) {
        uniqueLinks.add(url);
      }
    });
  }

  const linksArray = Array.from(uniqueLinks);

  console.log(`🌐 Total de links externos únicos: ${linksArray.length}`);

  const deadByStatus = {};

  // Cria tarefas
  const tasks = linksArray.map(url => async () => {
    const status = await checkLink(url);

    if (status === 200) {
      console.log(`✅ ${url}`);
      return;
    }

    console.log(`❌ ${status} → ${url}`);

    const key = String(status);

    if (!deadByStatus[key]) {
      deadByStatus[key] = [];
    }

    deadByStatus[key].push(url);
  });

  await runWithLimit(tasks, CONCURRENCY_LIMIT);

  // Gera relatório
  let report = "";
  report += `Total de links externos únicos: ${linksArray.length}\n\n`;

  if (Object.keys(deadByStatus).length === 0) {
    report += "Nenhum link morto encontrado.\n";
  } else {
    report += "Links mortos por status:\n\n";

    Object.keys(deadByStatus)
      .sort()
      .forEach(status => {
        report += `${status}:\n`;
        deadByStatus[status].forEach(link => {
          report += `- ${link}\n`;
        });
        report += "\n";
      });
  }

  fs.writeFileSync("relatorio-links.txt", report);

  console.log("\n📄 Relatório salvo em: relatorio-links.txt");
}

run();

// Verificar links: node check-links.js