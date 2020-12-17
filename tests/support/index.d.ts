/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom Cypress command to login to the UI
     * @example cy.login()
    */
    login(): Chainable<Element>
    /**
     * Custom Cypress command to login as non-admin member
     * @example cy.loginAsNonAdminMember()
     */
    loginAsNonAdminMember(): Chainable<Element>
    /** Custom Cypress command to logout
     * @example cy.logout()
    */
    logout(): Chainable<Element>
    /**
     * Custom Cypress command to select sidemenu items
     * @example cy.selectSidemenuItem('Administration', 'Templates')
     */
    selectSidemenuItem(item: string, subItem: string): Chainable<Element>
    /**
     * Custom Cypress command to reset DB
     * @example cy.resetDB()
     */
    resetDB(): Chainable<Element>
  }
}