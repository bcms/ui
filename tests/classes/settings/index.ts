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

  assertLanguageUpdate() {
    return cy.get(SettingsElements.addLanguageSuccess)
  }
}

export default Settings