import UtilsElements from '../elements/utils'

class Utils {
  selectItem(item: string, subItem: string) {
    cy.selectSidemenuItem(item, subItem)
  }

  resetDB() {
    cy.resetDB()
  }

  logout() {
    cy.logout()
  }

  closeNotification() {
    cy.get(UtilsElements.closeNotification).click()
  }
}

export default Utils
