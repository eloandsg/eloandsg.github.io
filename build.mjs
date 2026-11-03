// Génère index.html (site GitHub Pages) et profil/README.md (README du profil GitHub)
// à partir de projets.json. Usage : node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(join(racine, 'projets.json'), 'utf8'))
const SITE = 'https://eloandsg.github.io'

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const { profil, statuts, projets, archives } = data
const vedettes = projets.filter((p) => p.vedette)
const autres = projets.filter((p) => !p.vedette)
const categories = [...new Set(autres.map((p) => p.categorie))]
const aujourdhui = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const statut = (p) =>
  `<span class="statut statut-${esc(p.statut)}"><i aria-hidden="true"></i>${esc(statuts[p.statut])}</span>`

const liens = (p) =>
  p.liens.length
    ? `<p class="liens">${p.liens.map((l) => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`).join('')}</p>`
    : p.note
      ? `<p class="note">${esc(p.note)}</p>`
      : ''

const stack = (p) => (p.stack.length ? `<p class="stack">${p.stack.map(esc).join(' / ')}</p>` : '')

const carteVedette = (p) => `
      <article class="carte vedette" style="--accent:${esc(p.accent)}">
        <img src="${esc(p.capture)}" alt="Capture de ${esc(p.nom)}" loading="lazy" width="1200" height="750">
        <div class="corps">
          <div class="entete"><h3>${esc(p.nom)}</h3>${statut(p)}</div>
          <p class="resume">${esc(p.resume)}</p>
          ${stack(p)}
          ${liens(p)}
        </div>
      </article>`

const carte = (p) => `
      <article class="carte" data-cat="${esc(p.categorie)}"${p.accent ? ` style="--accent:${esc(p.accent)}"` : ''}>
        ${p.capture ? `<img src="${esc(p.capture)}" alt="Capture de ${esc(p.nom)}" loading="lazy" width="1200" height="300">` : ''}
        <div class="corps">
          <div class="entete"><h3>${esc(p.nom)}</h3>${statut(p)}</div>
          <p class="resume">${esc(p.resume)}</p>
          ${stack(p)}
          ${liens(p)}
        </div>
      </article>`

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Eloan, projets construits</title>
<meta name="description" content="${esc(profil.intro)}">
<meta property="og:title" content="Eloan, projets construits">
<meta property="og:description" content="${esc(profil.titre)} Apps, outils, automatisations et contenus.">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}/">
<link rel="preload" href="assets/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="haut">
  <div class="conteneur">
    <p class="nom">${esc(profil.nom)}</p>
    <h1>${esc(profil.titre)}</h1>
    <p class="intro">${esc(profil.intro)}</p>
    <p class="liens-profil">${profil.liens.map((l) => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`).join('')}</p>
  </div>
</header>

<main class="conteneur">
  <section aria-labelledby="t-vedette">
    <h2 id="t-vedette">En ligne, à essayer</h2>
    <div class="grille deux">${vedettes.map(carteVedette).join('')}
    </div>
  </section>

  <section aria-labelledby="t-tous">
    <h2 id="t-tous">Tous les projets</h2>
    <div class="filtres" role="group" aria-label="Filtrer par catégorie" hidden>
      <button type="button" class="actif" data-filtre="">Tous</button>${categories.map((c) => `
      <button type="button" data-filtre="${esc(c)}">${esc(c)}</button>`).join('')}
    </div>
    <div class="grille trois">${autres.map(carte).join('')}
    </div>
  </section>

  <section aria-labelledby="t-archives">
    <h2 id="t-archives">Archives</h2>
    <p class="sous-titre">Les premiers essais, gardés parce qu'on apprend aussi des projets abandonnés.</p>
    <ul class="archives">${archives.map((a) => `
      <li><span class="a-nom">${esc(a.nom)}</span><span class="a-detail">${esc(a.detail)}</span><span class="a-annee">${esc(a.annee)}</span></li>`).join('')}
    </ul>
  </section>
</main>

<footer class="pied">
  <div class="conteneur">
    <p>La plupart des dépôts sont privés : les liens mènent aux produits en ligne. Mis à jour le ${esc(aujourdhui)}.</p>
  </div>
</footer>

<script>
  var barre = document.querySelector('.filtres')
  if (barre) {
    barre.hidden = false
    barre.addEventListener('click', function (e) {
      var b = e.target.closest('button')
      if (!b) return
      barre.querySelectorAll('button').forEach(function (x) { x.classList.toggle('actif', x === b) })
      var f = b.getAttribute('data-filtre')
      document.querySelectorAll('.grille.trois .carte').forEach(function (c) {
        c.hidden = !!f && c.getAttribute('data-cat') !== f
      })
    })
  }
</script>
</body>
</html>
`

writeFileSync(join(racine, 'index.html'), html)

// README du profil GitHub (dépôt eloandsg/eloandsg)
const enLigne = projets.filter((p) => p.statut === 'en-ligne' && p.liens.length)
const readme = `## ${profil.nom}

${profil.titre} ${profil.intro}

**Portfolio complet : ${SITE}**

### En ligne

${enLigne.map((p) => `- [${p.nom}](${p.liens[0].url}) : ${p.resume.split(/[.:]/)[0]}.`).join('\n')}

### En construction

${projets.filter((p) => p.statut === 'en-construction').map((p) => `- ${p.nom}`).join('\n')}
`
mkdirSync(join(racine, 'profil'), { recursive: true })
writeFileSync(join(racine, 'profil', 'README.md'), readme)

console.log(`index.html et profil/README.md générés (${projets.length} projets, ${archives.length} archives)`)
