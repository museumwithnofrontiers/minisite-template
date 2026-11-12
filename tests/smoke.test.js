import { describeMinisiteSmoke } from '@museumwnf/viewer-layout/minisite/testing'
import { catalogues as sharedTexts } from '../src/texts.js'
import ownTexts from '../locales/en.json'
import config from '../src/dataset.config.js'
import exhibition from '../src/minisite.json'
import sources from '../theme/assets/legacy/SOURCES.json'

// The family's smoke test (@museumwnf/viewer-layout/minisite/testing), run
// against this site's own settings, chrome and dataset. Tests of this site's
// own go after the call.
describeMinisiteSmoke({ config, exhibition, sharedTexts, ownTexts, sources, namespace: '__SITE_NAMESPACE__' })
