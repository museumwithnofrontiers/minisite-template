import { languageLabels, offeredLanguages, sectionMeta, useDataPackage } from '@museumwnf/viewer-core'
import {
  ISLAMICART_NO_COUNTRY, MinisiteHome, MinisiteShell, minisiteNavigation, minisiteRoutes, minisiteSettings,
} from '@museumwnf/viewer-layout/minisite'
import exhibition from './minisite.json'

// The whole declaration of this website: one of legacy Discover Islamic Art's
// or Discover Baroque Art's virtual exhibitions (minisite.json names it and
// its family), a website of its own. Its
// pages are every mini-site's — viewer-layout's `./minisite`, legacy's virtual
// exhibition pages — and what is this exhibition's own is minisite.json (what
// legacy configured for it alone), its theme (theme/tokens.css) and its legacy
// pictures (theme/assets/legacy/, SOURCES.json names where each was taken
// from), all three written by inventory-app's scripts/minisites/legacy-minisite.mjs.
// Its records come from the data package, its texts from viewer-i18n's bundle
// of its family (`minisite`, `minisiteBaroque`; and locales/, which may
// overload any).

const { manifest } = useDataPackage()

// The pictures of the frame, as Vite builds and fingerprints them; the pages
// name a file by its path under theme/assets/.
const chrome = import.meta.glob('../theme/assets/**/*.{jpg,jpeg,png,gif,svg}', {
  eager: true, query: '?url', import: 'default',
})

// The languages the exhibition has a title in: legacy's switcher offered them.
const languages = offeredLanguages()

// What the exhibitions of each family shared: the website that carried them on
// legacy (its header, menu and sheet links lead there), the records legacy
// named no country for (both families' pages kept Islamic Art's rule) and the
// Word document's title, legacy's own.
const FAMILIES = {
  ISL: {
    parent: 'https://museumwithnofrontiers.github.io/islamicart',
    noCountry: ISLAMICART_NO_COUNTRY,
    documentTitle: 'MWNF DISCOVER ISLAMIC ART: Exhibition',
  },
  BAR: {
    parent: 'https://museumwithnofrontiers.github.io/baroqueart',
    noCountry: ISLAMICART_NO_COUNTRY,
    documentTitle: 'MWNF DISCOVER BAROQUE ART - Exhibition',
  },
}
const family = exhibition.family ?? 'ISL'
const { parent, noCountry, documentTitle } = FAMILIES[family]

export default {
  // The dataset package this website renders. Must match the alias in
  // vite.config.js and the dependency in package.json.
  datasetPackage: '@museumwnf/__DATASET__-data',

  siteName: manifest.site?.names?.en ?? '__SITE_NAME__',

  // The absolute origin this build is deployed at, base path included, no
  // trailing slash: the GitHub Pages address of this repository.
  site: { origin: 'https://museumwithnofrontiers.github.io/__DATASET__' },

  features: { entities: [] },

  languages,

  shell: MinisiteShell,

  chrome,

  navigation: minisiteNavigation({ languages: languageLabels(languages), parent, family }),

  // What legacy configured for this exhibition alone (its libs/config.inc.php
  // and index.php, and its family's libs/config.inc.php).
  minisite: minisiteSettings({
    parent,
    family,
    // The home menu's second column starts at this position ($_HOME_MENU_COL2).
    menuSecondColumnFrom: exhibition.menuSecondColumnFrom,
    // The curators the home page credits (HOMELOGOS): a partner, or a name and
    // a country as legacy wrote them, each with its logo and the space after it.
    curators: exhibition.curators,
    // Discover Baroque Art's designer, credited beside the curators.
    design: exhibition.design,
    // Discover Baroque Art's home picture (#banner), when its exhibition drew one.
    banner: exhibition.banner,
    // The introduction's map ($INTROPAGE_HAVEMAP): one picture per language,
    // and one more per further map legacy drew.
    map: exhibition.maps
      ? {
          thumbnail: 'legacy/intro_map_thumb.jpg',
          picture: (lang, n) => (n ? `legacy/map${n}_${lang}.jpg` : `legacy/map_${lang}.jpg`),
          count: exhibition.maps,
        }
      : null,
    noCountry,
    documentTitle,
  }),

  views: { home: MinisiteHome },

  extraViews: minisiteRoutes(sectionMeta()),

  legacyRoutes: [],
}
