Cypress.Commands.add('selectSidemenuItem', (item: string, subItem: string) => {
  cy.contains(item).click()
  cy.contains(subItem).click()
})