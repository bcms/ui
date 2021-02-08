import AuthElements from '../classes/elements/auth'

Cypress.Commands.add('login', (username: string = Cypress.env('username'), password: string = Cypress.env('password')) => {
  cy.get(AuthElements.username).type(username)
  cy.get(AuthElements.password).type(password)
  cy.get(AuthElements.login).click()
})

Cypress.Commands.add('loginAsNonAdminMember', (username: string = 'member@bcms.co', password: string = 'Pass12345') => {
  cy.get(AuthElements.username).type(username)
  cy.get(AuthElements.password).type(password)
  cy.get(AuthElements.login).click()
})

Cypress.Commands.add('logout', () => {
  cy.get(AuthElements.logout).click()
  cy.get(AuthElements.confirmLogout).click()
})