/**
 * build.js — Script de Build para Apresentações Modulares
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SHELL_FILE = path.join(ROOT, 'shell.html');
const SLIDES_DIR = path.join(ROOT, 'slides');
const OUTPUT_DIR = path.join(ROOT, '..', 'Apresentação Final');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.html');

const SLIDE_FILES = [
  "slide-00-slide-00.html",
  "slide-01-calend-rio-oficial.html",
  "slide-02-acampamento-da-rede-.html",
  "slide-03-data-e-hor-rios.html",
  "slide-04-local-do-acampamento.html",
  "slide-05-barracas.html",
  "slide-06-quem-pode-participar.html",
  "slide-07-o-que-levar-para-o-a.html",
  "slide-08-especialidades-trilh.html",
  "slide-09-especialidade-de-aca.html",
  "slide-10-maravilhas-da-nature.html",
  "slide-11-especialidade-de-nat.html",
  "slide-12-especialidade-de-nat.html",
  "slide-13-explorador-ao-ar-liv.html",
  "slide-14-investimento-do-acam.html",
  "slide-15-como-realizar-a-insc.html",
  "slide-16-slide-16.html"
];

function build() {
  console.log('🔨 Iniciando build da apresentação...\n');

  if (!fs.existsSync(SHELL_FILE)) {
    console.error(`❌ Arquivo shell não encontrado: ${SHELL_FILE}`);
    process.exit(1);
  }
  const shell = fs.readFileSync(SHELL_FILE, 'utf-8');

  let slidesHtml = '';
  for (const file of SLIDE_FILES) {
    const filePath = path.join(SLIDES_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Slide não encontrado (ignorado): ${file}`);
      continue;
    }
    let content = fs.readFileSync(filePath, 'utf-8');

    const startMarker = '<!-- %%SLIDE_START%% -->';
    const endMarker = '<!-- %%SLIDE_END%% -->';
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
      content = content.substring(startIdx + startMarker.length, endIdx);
    }

    slidesHtml += '\n' + content.trim() + '\n';
    console.log(`  ✅ ${file}`);
  }

  slidesHtml = slidesHtml.replace(/src="\.\.\/imagens\//g, 'src="imagens/');
  slidesHtml = slidesHtml.replace(/href="\.\.\/imagens\//g, 'href="imagens/');

  const finalHtml = shell.replace('<!-- %%SLIDES%% -->', slidesHtml);

  const totalSlides = SLIDE_FILES.length;
  const finalOutput = finalHtml.replace(
    /<span id="total-slides">\d+<\/span>/,
    `<span id="total-slides">${totalSlides}</span>`
  );

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, finalOutput, 'utf-8');

  const assetDirs = ['css', 'js', 'fonts', 'imagens'];
  for (const dir of assetDirs) {
    const src = path.join(ROOT, dir);
    const dest = path.join(OUTPUT_DIR, dir);
    if (fs.existsSync(src)) {
      copyDirSync(src, dest);
      console.log(`  📁 ${dir}/ copiado`);
    }
  }

  console.log(`\n✅ Build concluído!`);
  console.log(`📄 Arquivo: Apresentação Final/index.html`);
  console.log(`📊 Total de slides: ${totalSlides}`);
  console.log(`📦 Tamanho: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

build();
