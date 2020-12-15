import SettingsElements from '../elements/settings'

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
    cy.get(SettingsElements.confirmMemberChange).click()
  }

  selectMember(member: string) {
    cy.contains(member).click()
  }

  allowAllPermissions() {
    cy.get(SettingsElements.allowAllPermissions).click()
  }
  
  closeNotification() {
    cy.get(SettingsElements.closeNotification).click()
  }

  update() {
    cy.get(SettingsElements.update).click()
  }

  deleteMember() {
    cy.get(SettingsElements.deleteMember).click()
    cy.get(SettingsElements.confirmMemberChange).click()
  }
}

export default Settings
