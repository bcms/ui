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
      .notification()
      .contains('"German" language successfully added.')
    
    settings.removeLanguage('de')
    settings.confirmLanguageDelete()

    settings
      .notification()
      .contains('"German" language successfully removed.')
  })

  it('I can add/update/remove a member', () => {
    utils.selectItem('Settings', 'Members')

    settings.addMember()

    settings.enterMemberDetails({
        email: 'member@bcms.co',
        firstName: 'Mr',
        lastName: 'Member',
        password: 'Pass12345'
    })

    settings.confirmNewMember()

    settings
      .notification()
      .contains('User successfully added.')

    // update member
    settings.selectMember('Mr Member')
    settings.allowAllPermissions()
    settings.closeNotification()
    settings.update()
    
    settings
      .notification()
      .contains('Member policy successfully updated')

    // delete member
    settings.selectMember('Mr Member')
    settings.deleteMember()
  })
})
