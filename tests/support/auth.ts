import AuthElements from '../classes/elements/auth'

Cypress.Commands.add('login', (username: string = Cypress.env('username'), password: string = Cypress.env('password')) => {
  cy.get(AuthElements.username).type(username)
  cy.get(AuthElements.password).type(password)
  cy.get(AuthElements.login).click()
})