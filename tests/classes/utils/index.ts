import UtilsElements from '../elements/utils'

class Utils {
  setupTests() {
    cy.visit('')
    cy.login()
  }

  selectItem(item: string, subItem: string) {
    cy.selectSidemenuItem(item, subItem)
  }

  selectSingleItem(item: string) {
    cy.selectSingleSidemenuItem(item)
  }

  resetDB() {
    cy.resetDB()
  }

  logout() {
    cy.logout()
  }

  notification() {
    return cy.get(UtilsElements.notification)
  }

  closeNotification() {
    cy.get(UtilsElements.closeNotification).click()
  }

  addNewItem() {
    cy.get(UtilsElements.addNewItem).click()
  }
}

export default Utils
