class Utils {
  selectItem(item: string, subItem: string) {
    cy.selectSidemenuItem(item, subItem)
  }

  resetDB() {
    cy.resetDB()
  }
}

export default Utils
