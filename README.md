# 📊 PPTS — Apresentações Interativas e Dinâmicas

Este repositório tem como objetivo principal armazenar e fornecer **modelos de apresentações (slides) modernos, dinâmicos e interativos**. 

Utilizando tecnologias web nativas como **HTML5, CSS3, JavaScript** e outras linguagens modernas, o projeto substitui apresentações estáticas tradicionais por experiências ricas, fluídas e de alto impacto visual. As apresentações são construídas para funcionar de forma **100% offline**, garantindo segurança e disponibilidade em qualquer ambiente corporativo, sem a necessidade de servidores, dependências complexas ou acesso à internet.

---

## 📁 Estrutura do Repositório

O repositório está organizado por pastas temáticas. Cada apresentação segue uma estrutura padronizada com duas subpastas:

- **`Edição/`** — Contém os arquivos-fonte para edição (slides modulares, assets, scripts de build)
- **`Apresentação Final/`** — Contém a versão consolidada pronta para apresentar offline

```text
PPTS/
├── .gitignore
├── README.md
├── Evento Lançamento Office 365/
│   ├── Edição/                    ← Arquivos-fonte para edição
│   └── Apresentação Final/        ← Versão pronta para apresentar
├── Infraestrutura de TI Codevasf/
│   ├── Edição/                    ← Arquivos-fonte para edição
│   └── Apresentação Final/        ← Versão pronta para apresentar
├── Apresentação Aventureiros/
│   ├── Edição/                    ← Arquivos-fonte para edição
│   └── Apresentação Final/        ← Versão pronta para apresentar
└── ... (novos modelos e eventos)
```

---

## 🚀 Como usar os Modelos

### 📽️ Para Apresentar (uso rápido)

1. Navegue até a pasta do evento desejado (ex: `Infraestrutura de TI Codevasf/`)
2. Abra a subpasta **`Apresentação Final/`**
3. Abra o arquivo `index.html` no navegador (Google Chrome, Edge, Firefox)
4. A apresentação carregará instantaneamente com todas as animações

> **Dica:** Utilize `F11` para tela cheia e ter a experiência imersiva completa.

### ✏️ Para Editar

1. Navegue até a subpasta **`Edição/`** do evento desejado
2. Edite os arquivos de slides individuais (em `slides/`) ou o `index.html` diretamente
3. Para apresentações modularizadas, execute `node build.js` dentro da pasta `Edição/` para gerar a versão final consolidada em `Apresentação Final/`

---

## 💡 Por que utilizar este formato?

- **Interatividade:** Transições suaves, elementos animados e navegação dinâmica.
- **Portabilidade:** Roda em qualquer navegador moderno, independentemente do sistema operacional.
- **Personalização Profunda:** Qualquer elemento visual ou lógica pode ser customizado via CSS e JavaScript para se adequar perfeitamente ao tema do evento.
- **Independência:** Não requer instalação de licenças ou softwares específicos de apresentação na máquina.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| **HTML5** | Estruturação semântica dos slides |
| **CSS3** | Estilização avançada, responsividade, animações e efeitos visuais |
| **JavaScript (ES6+)** | Lógica de navegação, interações e controle de eventos |
| **Node.js** | Script de build para consolidar slides modulares (opcional) |
| **Fontes & Ícones** | Tipografias modernas (ex: Inter) e bibliotecas como Font Awesome (executadas localmente) |

---

*Repositório de modelos de apresentação mantido para impulsionar a inovação digital.*