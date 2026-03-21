# 💎 LucãoBet — Casino Premium Global

> **Vibe:** Dubai + Las Vegas + Crypto Elite
> **Stack:** Tailwind CSS v3 • Alpine.js v3 • Lucide Icons • Vanilla JS
> **Versão:** 1.0.0 | 2026

---

## 📁 Estrutura do Projeto

```
lucaobet/
├── index.html          ← Página principal (todas as seções)
├── css/
│   └── style.css       ← Estilos premium (cursor, partículas, cards, modais)
├── js/
│   └── script.js       ← JS pesado (partículas, typing, confetti, counters)
├── assets/
│   └── img/            ← Coloque aqui as imagens 4K (ver lista abaixo)
└── README.md           ← Este arquivo
```

---

## 🚀 Como Rodar Localmente

### Opção 1 — Direto no navegador
```
1. Extraia/clone a pasta lucaobet/
2. Abra index.html em qualquer navegador moderno
   (Chrome, Firefox, Edge, Safari)
```

### Opção 2 — Live Server (recomendado para desenvolvimento)
```bash
# Com VS Code + extensão Live Server:
# Clique com botão direito no index.html → Open with Live Server

# OU com Node.js:
npx serve .

# OU com Python:
python -m http.server 8080
# Acesse: http://localhost:8080
```

---

## 🌐 Como Fazer Deploy

### Netlify (mais fácil — grátis)
```
1. Acesse netlify.com → Add new site → Deploy manually
2. Arraste a pasta lucaobet/ para a área de upload
3. Pronto — URL gerada automaticamente (ex: lucaobet.netlify.app)
4. Configure domínio customizado em: Site settings → Domain management
```

### Vercel
```bash
npm install -g vercel
cd lucaobet/
vercel
# Siga as instruções → URL gerada automaticamente
```

### Hostinger / cPanel / InfinityFree
```
1. Acesse o File Manager do painel de controle
2. Navegue até public_html/
3. Faça upload de TODOS os arquivos da pasta lucaobet/
   (index.html deve ficar em public_html/index.html)
4. Upload da pasta css/, js/ e assets/ completas
5. Acesse seu domínio — site já está no ar
```

### GitHub Pages (grátis)
```bash
git init
git add .
git commit -m "feat: LucaooBet v1.0.0"
git branch -M main
git remote add origin https://github.com/SEU_USER/lucaobet.git
git push -u origin main
# Ative em: Settings → Pages → Source: main / (root)
```

---

## 🖼️ Lista de 25+ Imagens 4K para Download

Baixe e salve em `assets/img/` com os nomes indicados:

### Slots & Casino Games
| Arquivo sugerido | URL (Unsplash/Pexels) |
|---|---|
| `slot-olympus.jpg` | https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=1920&q=90 |
| `slot-bonanza.jpg` | https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=90 |
| `slot-tiger.jpg` | https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1920&q=90 |
| `slot-wanted.jpg` | https://images.unsplash.com/photo-1605722625766-a4c989b747c2?w=1920&q=90 |
| `slot-dead.jpg` | https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=90 |
| `slot-gonzo.jpg` | https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1920&q=90 |
| `slot-reactoonz.jpg` | https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1920&q=90 |

### Crash & Live Games
| Arquivo sugerido | URL |
|---|---|
| `crash-aviator.jpg` | https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&q=90 |
| `live-crazytime.jpg` | https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=90 |
| `live-monopoly.jpg` | https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=90 |
| `live-roulette.jpg` | https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=1920&q=90 |
| `live-bacbo.jpg` | https://images.unsplash.com/photo-1529480780256-1ee33c2db3cd?w=1920&q=90 |
| `live-cashcrash.jpg` | https://images.unsplash.com/photo-1519671282429-b8491f27c3b2?w=1920&q=90 |

### Provably Fair / Mines / Plinko
| Arquivo sugerido | URL |
|---|---|
| `game-mines.jpg` | https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=90 |
| `game-plinko.jpg` | https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1920&q=90 |
| `game-balloon.jpg` | https://images.unsplash.com/photo-1531591374096-71e74c0a5e92?w=1920&q=90 |

### VIP / Luxo / Estilo de Vida
| Arquivo sugerido | URL |
|---|---|
| `vip-jet.jpg` | https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1920&q=90 |
| `vip-yacht.jpg` | https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=1920&q=90 |
| `vip-dubai.jpg` | https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=90 |
| `vip-gold.jpg` | https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1920&q=90 |
| `vip-diamonds.jpg` | https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=90 |
| `vip-casino.jpg` | https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=1920&q=90 |
| `vip-chips.jpg` | https://images.unsplash.com/photo-1529480780256-1ee33c2db3cd?w=1920&q=90 |

### Hero & Background
| Arquivo sugerido | URL |
|---|---|
| `hero-bg.jpg` | https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&q=90 |
| `hero-gold-rain.jpg` | https://images.unsplash.com/photo-1610375461246-83df859d849d?w=3840&q=90 |
| `hero-neon.jpg` | https://images.unsplash.com/photo-1548013146-72479768bada?w=3840&q=90 |

### Para substituir nos game cards do index.html:
```html
<!-- Exemplo: substitua as URLs dos jogos pelos caminhos locais -->
<img src="assets/img/slot-olympus.jpg" alt="Gates of Olympus" />
```

---

## ⚡ Otimizações para Lighthouse 100/100

### 1. Compressão de Imagens
```bash
# Instale: npm install -g imagemin-cli imagemin-webp
# Converta para WebP (até 80% menor):
imagemin assets/img/*.jpg --plugin=webp --out-dir=assets/img/webp/

# No HTML, use <picture> para WebP com fallback:
<picture>
  <source srcset="assets/img/webp/slot-olympus.webp" type="image/webp" />
  <img src="assets/img/slot-olympus.jpg" alt="..." loading="lazy" />
</picture>
```

### 2. LCP < 900ms
- Adicione `fetchpriority="high"` na imagem do hero
- Pré-carregue fontes críticas com `<link rel="preload">`
- Use `loading="eager"` apenas no hero, `lazy` no restante

### 3. CSS Crítico Inline
```html
<!-- No <head>, inline o CSS crítico do hero (~2KB) e carregue o resto async -->
<style>/* critical css aqui */</style>
<link rel="preload" href="css/style.css" as="style" onload="this.rel='stylesheet'" />
```

### 4. Minificação
```bash
# CSS:
npx cleancss -o css/style.min.css css/style.css
# JS:
npx terser js/script.js -o js/script.min.js --compress --mangle
# Atualize as referências no index.html
```

### 5. Service Worker (PWA)
```js
// Adicione no final do script.js para cache offline:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

---

## 🛠️ Personalização Rápida

### Alterar cores principais:
```css
/* css/style.css — linha 5, variáveis :root */
--gold:    #d4af37;   /* Ouro 24K */
--neon:    #00f5ff;   /* Cyan neon */
--magenta: #ff00aa;   /* Magenta premium */
--royal:   #4b0082;   /* Roxo royal */
```

### Alterar textos do hero:
```js
// js/script.js — linha 90, array phrases
const phrases = [
  'Seu Slogan Aqui.',
  'Segunda Mensagem.',
];
```

### Adicionar/remover jogos:
```js
// index.html — dentro do Alpine gamesFilter()
// Adicione um objeto ao array games:
{ id:21, name:'Novo Jogo', provider:'Provedor', rtp:96.0, cat:'slots', hot:true, new:true, img:'URL_DA_IMAGEM' }
```

### Configurar link de cadastro real:
```html
<!-- Substitua @click="openRegister = true" pelo seu link de afiliado: -->
<a href="https://seu-link-de-afiliado.com/register" class="cta-main ...">
```

---

## 📋 Tecnologias Utilizadas

| Tecnologia | Versão | CDN |
|---|---|---|
| Tailwind CSS | v3 (latest) | cdn.tailwindcss.com |
| Alpine.js | v3 (latest) | jsdelivr.net |
| Lucide Icons | latest | unpkg.com |
| Google Fonts | — | fonts.googleapis.com |
| Vanilla JS | ES2022 | — (sem libs externas) |

---

## 📄 Licença

Projeto desenvolvido para LucãoBet © 2026. Todos os direitos reservados.
Template para fins de demonstração. Adapte conforme sua legislação local de jogos online.

> ⚠️ **Jogo Responsável:** Este site é destinado a maiores de 18 anos.
> O jogo pode causar dependência. Jogue com responsabilidade.
> Se você ou alguém que conhece precisa de ajuda: **jogadoresanonimos.org.br**
