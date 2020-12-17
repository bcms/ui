import SettingsElements from '../elements/settings'
import Utils from '../utils'
const utils = new Utils()

class Settings {
  setupTests() {
    cy.visit('')
    cy.login()
  }

  selectSettings() {
    cy.get(SettingsElements.settingsSideMenuItem).click()
  }

  selectLanguages() {
    cy.get(SettingsElements.languages).click()
  }

  addLanguage(language: string) {
    cy.get(SettingsElements.addLanguage).click()
    cy.get(SettingsElements.searchLanguage).type(language)
    cy.get(SettingsElements.selectLanguageFromSearch).click()
  }

  removeLanguage(languageCode: string) {
    cy.get(`[data-cy=remove-${languageCode}] > svg`).click()
  }

  confirmLanguageDelete() {
    cy.get(SettingsElements.confirmLanguageDelete).click()
  }

   notification() {
    return cy.get(SettingsElements.notification)
  }

  addMember() {
    cy.get(SettingsElements.addMember).click()
  }

  enterMemberDetails(details) {
    cy.get(SettingsElements.email).type(details.email)
    cy.get(SettingsElements.firstName).type(details.firstName)
    cy.get(SettingsElements.lastName).type(details.lastName)
    cy.get(SettingsElements.password).type(details.password)
  }

  confirmNewMember() {
    cy.get(SettingsElements.confirmActionInModal).click()
  }

  selectMember(member: string) {
    cy.contains(member).click()
  }

  addStandardMember() {
    this.addMember()

    this.enterMemberDetails({
        email: 'member@bcms.co',
        firstName: 'Mr',
        lastName: 'Member',
        password: 'Pass12345'
    })

    this.confirmNewMember()
  }

  allowAllPermissions() {
    cy.get(SettingsElements.allowAllPermissions).click()
  }

  update() {
    cy.get(SettingsElements.update).click()
  }

  deleteMember() {
    cy.get(SettingsElements.deleteMember).click()
    cy.get(SettingsElements.confirmActionInModal).click()
  }

  addKey() {
    cy.get(SettingsElements.addNewKey).click()
  }

  enterKeyLabel(label: string) {
    cy.get(SettingsElements.enterKeyLabel).type(label)
  }

  enterKeyDescription(description: string) {
    cy.get(SettingsElements.enterKeyDescription).type(description)
  }
  
  confirmAddNewKey() {
    cy.get(SettingsElements.confirmActionInModal).click()
  }

  addNewKey() {
    this.addKey()
    this.enterKeyLabel('A label')
    this.enterKeyDescription('A description')

    this.confirmAddNewKey()
  }

  deleteKey() {
    cy.get(SettingsElements.deleteKey).click()
  }

  confirmKeyDelete() {
    cy.get(SettingsElements.confirmActionInModal).click()
  }

  assertEntriesVisibility() {
    return cy.get(SettingsElements.entries)
  }

  promoteToAdmin() {
    cy.get(SettingsElements.promoteToAdmin).click()
    cy.get(SettingsElements.confirmActionInModal).click()
  }

  assertUserCannotBeDowngraded() {
    return cy.get(SettingsElements.promoteToAdmin)
  }
}

export default Settings
