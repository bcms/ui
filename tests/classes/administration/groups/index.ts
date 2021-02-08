import TemplatesElements from '../../elements/adminElements'
import Admin from '../admin'

class Groups extends Admin {
  addNewGroup(templateName: string, templateDescription: string) {
    cy.get(TemplatesElements.name).type(templateName)
    cy.get(TemplatesElements.description).type(templateDescription)
    cy.get(TemplatesElements.addItem).click()
  }

  editGroup(templateName: string, templateDescription: string) {
    cy.get(TemplatesElements.editTemplate).click()

    cy.get(TemplatesElements.name)
      .clear()
      .type(templateName)

    cy.get(TemplatesElements.description)
      .click()
      .type(templateDescription)
    
    cy.get(TemplatesElements.addItem).click()
  }

  assertGroupName() {
    return cy.get(TemplatesElements.createdTitle)
  }

  assertGroupDescription() {
    return cy.get(TemplatesElements.createdDescription)
  }
}

export default Groups