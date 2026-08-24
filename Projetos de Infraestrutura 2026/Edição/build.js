/**
 * build.js — Script de Build para Apresentações Modulares
 * 
 * Concatena os fragmentos HTML de slides individuais (pasta slides/)
 * em um único index.html completo, pronto para uso 100% offline.
 * 
 * Uso (a partir da pasta Edição/):
 *   node build.js
 * 
 * O arquivo gerado fica em: ../Apresentação Final/index.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SHELL_FILE = path.join(ROOT, 'shell.html');
const SLIDES_DIR = path.join(ROOT, 'slides');
const OUTPUT_DIR = path.join(ROOT, '..', 'Apresentação Final');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.html');

// Ordem dos slides (deve corresponder aos arquivos na pasta slides/)
const SLIDE_FILES = [
  'slide-00-capa.html',
  'slide-01-lista-de-Projetos.html',
  'slide-02-time-line.html',
  'slide-03-colaborativa.html',
  'slide-04-contas-migradas.html',
  'slide-05-volume-dados.html',
  'slide-06-50gb-email.html',
  'slide-07-petabytes.html',
  'slide-08-testes-validacao.html',
  'slide-09-ecossistema.html',
  'slide-10-transformacao.html',
];

function build() {
  console.log('🔨 Iniciando build da apresentação...\n');

  // 1. Ler o shell (template HTML)
  if (!fs.existsSync(SHELL_FILE)) {
    console.error(`❌ Arquivo shell não encontrado: ${SHELL_FILE}`);
    process.exit(1);
  }
  const shell = fs.readFileSync(SHELL_FILE, 'utf-8');

  // 2. Ler e concatenar slides (extraindo conteúdo entre marcadores %%SLIDE_START%% e %%SLIDE_END%%)
  let slidesHtml = '';
  for (const file of SLIDE_FILES) {
    const filePath = path.join(SLIDES_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Slide não encontrado (ignorado): ${file}`);
      continue;
    }
    let content = fs.readFileSync(filePath, 'utf-8');

    // Extrair apenas o conteúdo entre os marcadores (slides são HTML completos para preview)
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

  // 3. Normalizar caminhos relativos dos slides (../imagens/ → imagens/) para o build final
  slidesHtml = slidesHtml.replace(/src="\.\.\/imagens\//g, 'src="imagens/');
  slidesHtml = slidesHtml.replace(/href="\.\.\/imagens\//g, 'href="imagens/');

  // 4. Injetar slides no placeholder do shell
  const finalHtml = shell.replace('<!-- %%SLIDES%% -->', slidesHtml);

  // 4. Atualizar contagem total de slides no HTML
  const totalSlides = SLIDE_FILES.length;
  const finalOutput = finalHtml.replace(
    /<span id="total-slides">\d+<\/span>/,
    `<span id="total-slides">${totalSlides}</span>`
  );

  // 5. Criar pasta de saída e escrever o arquivo final
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, finalOutput, 'utf-8');

  // 6. Copiar assets para a pasta de saída (css, js, fonts, imagens)
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

/**
 * Copia recursivamente um diretório
 */
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
