Cypress.Commands.add('selectSidemenuItem', (item: string, subItem: string) => {
  cy.contains(item).click()
  cy.contains(subItem).click()
})

Cypress.Commands.add('selectSingleSidemenuItem', (item: string) => {
  cy.contains(item).click()
})

Cypress.Commands.add('resetDB', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:1280/api/cy/reset'
  })
})
