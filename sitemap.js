const fs = require("fs");
const path = require("path");

const BASE_URL = "https://jefbecker.com";

// Detecta automaticamente o diretório correto
let ROOT_DIR = __dirname;

// Se existir uma pasta "public" dentro do diretório atual, usa ela
if (fs.existsSync(path.join(__dirname, "public"))) {
  ROOT_DIR = path.join(__dirname, "public");
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 🚫 Ignorar diretórios que começam com "."
      if (file.startsWith(".")) return;

      // 🚫 Ignorar diretório "thumbnail"
      if (file === "thumbnail") return;

      walk(fullPath, fileList);
    } else if (file === "index.html") {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

function filePathToUrl(filePath) {
  let relative = filePath.replace(ROOT_DIR, "");

  // Normaliza separadores (Windows → URL)
  relative = relative.replace(/\\/g, "/");

  // Remove index.html
  relative = relative.replace(/index\.html$/, "");

  return relative || "/";
}

function getLastMod(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime.toISOString().split("T")[0];
}

function generateSitemap() {
  console.log("📁 Usando diretório:", ROOT_DIR);

  const files = walk(ROOT_DIR);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;

  files.forEach(file => {
    const url = filePathToUrl(file);
    const lastmod = getLastMod(file);

    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `  </url>\n\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(path.join(__dirname, "sitemap.xml"), xml);

  console.log("✅ sitemap.xml gerado com sucesso");
}

generateSitemap();

// Gerar novo sitemap: node sitemap.js