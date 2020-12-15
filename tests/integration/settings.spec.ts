import Settings from '../classes/settings'
import Utils from '../classes/utils/utils'
const settings = new Settings()
const utils = new Utils()

describe('Settings', () => {
  beforeEach(() => {
    settings.setupTests()
  })

  it('I can add/remove languages', () => {
    utils.selectItem('Settings', 'Languages')

    settings.addLanguage('German')

    settings
      .assertLanguageUpdate()
      .contains('"German" language successfully added.')
    
    settings.removeLanguage('de')
    settings.confirmLanguageDelete()

    settings
      .assertLanguageUpdate()
      .contains('"German" language successfully removed.')
  })
})