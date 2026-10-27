# minisite-template

Template repository for MWNF **mini-site** websites: legacy Discover Islamic
Art's virtual exhibitions, each a website of its own. Every new mini-site repo
(`museumwithnofrontiers/islamicart-<legacy folder>`, public) is created
**once** from this template — it is never installed as a dependency and never
updated in existing websites.

**Its role.** On legacy, Discover Islamic Art carried its virtual exhibitions
inside itself (`islamicart.museumwnf.org/exhibitions/ISL/<folder>/`), every one
on the same pages (`exhibitions/ISL/generic_*.php`). Here each is a product of
its own, and Discover Islamic Art links to it. What every mini-site shares —
the frame, the home page, the introduction, the exhibition pages, the credits,
map and zoom windows, legacy's caption and page-order rules, the stylesheet —
comes from the mini-site family layer, `@museumwnf/viewer-layout/minisite`, and
its texts from `@museumwnf/viewer-i18n/minisite`, so a change there reaches
every mini-site at once. A mini-site keeps only what legacy configured for its
exhibition alone: its settings, its theme, its pictures and its texts.

A gallery starts from
[`gallery-template`](https://github.com/museumwithnofrontiers/gallery-template),
an exhibition from
[`exhibition-template`](https://github.com/museumwithnofrontiers/exhibition-template),
and a new kind of product from
[`website-template`](https://github.com/museumwithnofrontiers/website-template).

This template ships as a real, working mini-site — The Umayyads', the first of
them, as it stood on 2026-10-27 — with the dataset-specific parts turned into
placeholders and `TODO(dataset)` markers.

| Package | Role |
| --- | --- |
| `@museumwnf/<slug>-data` | the exhibition: its collection, its themes and pages, the items they place, the curators it credits |
| `@museumwnf/viewer-core` | application engine (routing, data access, texts, language) |
| `@museumwnf/viewer-layout` | the mini-site pages and frame (`./minisite`), themed by `theme/tokens.css` |
| `@museumwnf/viewer-i18n` | the texts every mini-site renders (`./minisite`) |

---

## Admin — creating a new mini-site

Creating one takes an operator with admin rights on the organization (the tool
below applies the settings every live site carries) and an `inventory-app`
checkout, with Docker. Each step is a script; nothing is copied by hand.

### 0. The legacy exhibition's own values and its data package

In `inventory-app`, from the legacy exhibition's folder:

```bash
docker run --rm -v "${PWD}:/repo" -w /repo node:24-alpine node scripts/minisites/legacy-minisite.mjs .legacy-code/islamicart/www.discoverislamicart.org/exhibitions/ISL/<folder> --name "<English title>"
```

writes the exporter instance `scripts/exporters/instances/islamicart-<folder>.json`
(the exhibition's collection and its curators' partners, by the importer's own
ids). Merge it, then export and publish `@museumwnf/islamicart-<folder>-data`
with the `islamicart` exporter (`scripts/exporters/instances/README.md`,
"Mini-sites").

### 1. Create the repository

From a `viewer-workflows` checkout, as its `MAINTENANCE.md` ("Creating a
website") describes:

```bash
node tools/new-website.mjs --slug islamicart-<folder> --class minisite --namespace <ns> --title "<English title>" --no-merge
```

It creates the repository from this template, applies the settings, replaces
the placeholders and opens the first pull request without merging it:

- `__DATASET__` — the slug (`islamicart-the-umayyads`);
- `__SITE_NAME__` — the exhibition's English title (`The Umayyads`);
- `__SITE_NAMESPACE__` — this website's own texts namespace: one lowercase
  word, no hyphens (`umayyads`, `arabicCalligraphy`).

`scripts/check-placeholders.js` (a `preinstall` hook) refuses to install while
one of them survives.

### 2. The exhibition's own values

On that pull request's branch, run step 0's script again with
`--site <the clone>`: it writes

- `src/minisite.json` — what legacy configured for this exhibition alone:
  its address, where the home menu's second column starts, the curators the
  home page credits (a partner, or a name and a country as legacy wrote them,
  each with its logo and the space after it), and how many maps its
  introduction opens;
- `theme/tokens.css` — every value the exhibition's legacy stylesheet set;
- `theme/assets/legacy/` — the frame's pictures, each byte for byte the file
  legacy serves, and `SOURCES.json`, where each was taken from and its hash;
- `README.md` — the site's own, in place of this one.

Push them onto the pull request and enable auto-merge. Until they are there,
the smoke test's "carries this exhibition's own settings" fails on purpose.

**Proof:** `npm run test` and `npm run build` pass; the pull request merges
and deploys to `https://museumwithnofrontiers.github.io/<slug>/`.

### 3. Record and discover

Back in `inventory-app`: record the site as a `.new-architecture/<slug>`
submodule, run the discovery check and list it on the organization site —
steps 7 to 9 of `docs/deployment/new-website.md`.

---

## Translator — editing the website's texts

You only need a GitHub account and a browser. The texts every mini-site shows
— the menu, the navigation, the credits window's labels — are shared, in
[`viewer-i18n`](https://github.com/museumwithnofrontiers/viewer-i18n)'s
`minisite/` folder, and are edited there, the same way. The exhibition's own
texts — its titles, quotes, essays and captions — arrive translated in the data
package and are not edited anywhere.

The files under `locales/` hold **this website's own texts**, one file per
language (`en.json` English, `fr.json` French, …); they start empty, and may
override any shared entry by writing the same entry name.

1. **Open the folder.** On the website's GitHub page, open `locales/` and click
   the language file you want to change (to start one, copy `en.json`'s
   content into a new file named with the two-letter language code).
2. **Click the pencil** (✏️, top right of the file view). Change only the text
   between the second pair of quotation marks on a line — the part before the
   colon is the name of the entry and must stay exactly as it is.
3. **Click "Commit changes…" then "Propose changes".** The automatic check runs
   on your proposal; a green tick means it goes live by itself a few minutes
   later, and a comment says in plain language what to fix otherwise.

A text is **just text**, formatted with Markdown if you want (`**bold**`,
`*italic*`); it may not contain HTML tags, `{` or `}`.

---

## Webdesigner — theming the website

The website's look is legacy's exhibition frame, kept as it was:

- `theme/tokens.css` — every value the exhibition's legacy stylesheet set,
  as `--minisite-*` tokens: colours, fonts, and where the titles, menus and
  links sit on the pictures. `node_modules/@museumwnf/viewer-layout/src/styles/minisite.css`
  reads them, for every mini-site; a token left unset falls back to what the
  browser drew on legacy. Change a value here;
- `theme/assets/legacy/` — legacy's own pictures of the frame: the
  backgrounds of the home page, the introduction and the exhibition pages
  (and their Arabic mirror images), the MWNF logo per language, the map per
  language, the curators' logos, the small icons. `tests/assets.test.js`
  checks every file against `SOURCES.json`, so a picture is replaced on
  purpose, with its entry;
- `theme/overrides.css` — the escape hatch, empty until a need cannot be
  expressed with a token.

A change to the pages' layout itself is a change to every mini-site: a request
for [`viewer-layout`](https://github.com/museumwithnofrontiers/viewer-layout)'s
`./minisite`, not a stylesheet here.

To preview your changes, install Docker Desktop and run `docker compose up` in
the folder, then open **http://localhost:5173**. Propose changes as a pull
request; styling changes are reviewed before they merge.

---

## Developer notes

- `src/dataset.config.js` is the whole declaration and needs no edit: the
  shell, the routes, the navigation and the exhibition's settings, read from
  `src/minisite.json`. Discover Islamic Art's address is written there once,
  as `parent`; the header, the menu and "More information" lead there.
- The pages, the caption rules (legacy's `class.exhibition.inc.php` and
  `generic_exhibition.php`: the page's own text first, the item's own
  otherwise, a later view falling back to the first; the museum for an object
  only; location, province and country, with legacy's exception for
  Jerusalem; the typographic characters legacy's `cleanText()` printed plain)
  and the reading order are viewer-layout's `./minisite`. A page every
  mini-site needs changed is a change there; see its README, "Mini-sites".
- A page shows each item at its position, and the views of it — the dots under
  the caption — are the placements at that position, each with its own
  picture and texts.
- **Checking it against legacy.** Every caption legacy prints is in its pages'
  `pageItems` script, all views included; a page here can be compared field by
  field with the page there, in every language.
- CI (`.github/workflows/`) is a set of thin callers of
  [`viewer-workflows`](https://github.com/museumwithnofrontiers/viewer-workflows),
  pinned at an exact version. `@museumwnf` packages are deliberately not
  managed by Dependabot.

**Commands** (Docker, no Node on the host):

```bash
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm ci && npm test && npm run lint && npm run build"
```

## Licence

This package is Content of the MWNF Website under the
[MWNF legal notice](https://www.museumwnf.org/about/legal-notice), which
governs its use (non-commercial, personal, educational and scientific use
is permitted, with attribution and mandatory reporting — see the notice for
the full terms). The notice text also ships in this package as
`LICENSE.md`. Every website scaffolded from this template inherits both the
notice and the `license` field in `package.json`.
