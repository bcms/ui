import Settings from '../classes/settings'
import Utils from '../classes/utils'
const settings = new Settings()
const utils = new Utils()

describe('Settings', () => {
  beforeEach(() => {
    utils.resetDB()
    settings.setupTests()
  })

  it('I can add languages', () => {
    utils.selectItem('Settings', 'Languages')

    settings.addLanguage('German')

    settings
      .notification()
      .contains('"German" language successfully added.')
  })

  it('I can remove languages', () => {
    utils.selectItem('Settings', 'Languages')

    settings.addLanguage('German')

    settings.removeLanguage('de')
    settings.confirmLanguageDelete()

    settings
      .notification()
      .contains('"German" language successfully removed.')
  })

  it('I can add a new member', () => {
    utils.selectItem('Settings', 'Members')

    settings.addStandardMember()

    settings
      .notification()
      .contains('User successfully added.')

    // assert that the same member cannot be added twice
    settings.addStandardMember()

    settings
      .notification()
      .contains('User with email "member@bcms.co" already exist.')
  })

  it('I can update a member', () => {
    utils.selectItem('Settings', 'Members')
    settings.addStandardMember()

    settings.selectMember('Mr Member')
    settings.allowAllPermissions()
    settings.closeNotification()
    settings.update()
    
    settings
      .notification()
      .contains('Member policy successfully updated')
  })

  it('I can delete a member', () => {
    utils.selectItem('Settings', 'Members')
    settings.addStandardMember()

    settings.selectMember('Mr Member')
    settings.deleteMember()
  })

  it('I can add keys', () => {
    utils.selectItem('Settings', 'Key Manager')

    settings.addNewKey()

    settings
      .notification()
      .contains('Key successfully created.')
  })

  it('I can remove keys', () => {
    utils.selectItem('Settings', 'Key Manager')

    settings.addNewKey()

    settings.deleteKey()
    settings.confirmKeyDelete()
  })
})
