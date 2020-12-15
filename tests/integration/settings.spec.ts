import Settings from '../classes/settings/settings'
const settings = new Settings()

describe('Settings', () => {
  beforeEach(() => {
    settings.setupTests()
  })

  it('I can add/remove languages', () => {
    settings.selectSettings()
    settings.selectLanguages()
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