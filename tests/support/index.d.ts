/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom Cypress command to login to the UI
     * @example cy.login()
    */
    login(): Chainable<Element>
    /**
     * Custom Cypress command to select sidemenu items
     * @example cy.selectSidemenuItem('Administration', 'Templates')
     */
    selectSidemenuItem(item: string, subItem: string): Chainable<Element>
  }
}