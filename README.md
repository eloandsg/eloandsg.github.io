# Portfolio

Site vitrine de mes projets, publié sur GitHub Pages : https://eloandsg.github.io

## Ajouter ou modifier un projet

Tout vit dans `projets.json` (profil, projets). Puis :

```
node build.mjs
```

Le script génère `index.html` (le site) et `profil/README.md` (le README du profil GitHub, dépôt `eloandsg/eloandsg`). Aucune dépendance, Node 20+.

Champs d'un projet : `id`, `nom`, `resume`, `statut` (`en-ligne`, `en-construction`, `en-local`, `realise`), `categorie`, `annee`, `stack`, `liens` (`label` + `url`), `capture` (optionnel, `assets/shots/`), `vedette` (aussi montré en grande carte dans « À essayer en ligne », en bas de page ; demande une `capture`), `note` (texte à la place du lien, ex. « Accès privé »).

## Règles

- Vitrine sans code : seuls les produits publics ont un lien. Aucun client, nom de prospect, clé, chiffre d'affaires ni donnée personnelle.
- Captures : seulement l'interface de mes produits, jamais de photos ou contenus de tiers.
- Polices (Archivo, JetBrains Mono, licence OFL) hébergées dans `assets/fonts/`, aucun appel externe.
