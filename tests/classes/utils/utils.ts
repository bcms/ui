class Utils {
  selectItem(item: string, subItem: string) {
    cy.selectSidemenuItem(item, subItem)
  }
}

export default Utils
