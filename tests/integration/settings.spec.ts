import Settings from '../classes/settings'
import Utils from '../classes/utils'
const settings = new Settings()
const utils = new Utils()

describe('Settings', () => {
  beforeEach(() => {
    utils.resetDB()
    utils.setupTests()
  })

  it('I can add languages', () => {
    utils.selectItem('Settings', 'Languages')

    settings.addLanguage('German')

    utils
      .notification()
      .contains('"German" language successfully added.')
  })

  it('I can remove languages', () => {
    utils.selectItem('Settings', 'Languages')

    settings.addLanguage('German')

    settings.removeLanguage('de')
    settings.confirmLanguageDelete()

    utils
      .notification()
      .contains('"German" language successfully removed.')
  })

  it('I can add a new member', () => {
    utils.selectItem('Settings', 'Members')

    settings.addStandardMember()

    utils
      .notification()
      .contains('User successfully added.')

    // assert that the same member cannot be added twice
    settings.addStandardMember()

    utils
      .notification()
      .contains('User with email "member@bcms.co" already exist.')
  })

  it('I can update a member', () => {
    utils.selectItem('Settings', 'Members')
    settings.addStandardMember()

    settings.selectMember('Mr Member')
    settings.allowAllPermissions()

    utils.closeNotification()
    settings.update()
    
    utils
      .notification()
      .contains('Member policy successfully updated')
  })

  it('I can delete a member', () => {
    utils.selectItem('Settings', 'Members')
    settings.addStandardMember()

    settings.selectMember('Mr Member')
    settings.deleteMember()
  })

  it('A non-admin member should not have access to new entries', () => {
    utils.selectItem('Settings', 'Members')

    settings.addStandardMember()

    utils
      .notification()
      .contains('User successfully added.')
    
    utils.logout()

    cy.loginAsNonAdminMember()

    settings
      .assertEntriesVisibility()
      .children()
      .should('not.be.visible')
  })

  it('Once promoted to admin, a user cannot be downgraded to regular user', () => {
    utils.selectItem('Settings', 'Members')

    settings.addStandardMember()

    utils
      .notification()
      .contains('User successfully added.')

    utils.closeNotification()

    settings.promoteToAdmin()

    utils
      .notification()
      .contains('Member is now an admin.')

    utils.closeNotification()
    
    settings
      .assertUserCannotBeDowngraded()
      .should('not.exist')
  })

  it('I can add keys', () => {
    utils.selectItem('Settings', 'Key Manager')

    settings.addNewKey()

    utils
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
