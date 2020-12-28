import AdminElements from '../../elements/adminElements'
import Admin from '../admin'
class Templates extends Admin {
  addNewTemplate(templateName: string, templateDescription: string) {
    cy.get(AdminElements.name).type(templateName)
    cy.get(AdminElements.description).type(templateDescription)
    cy.get(AdminElements.addItem).click()
  }

  editTemplate(templateName: string, templateDescription: string) {
    cy.get(AdminElements.editTemplate).click()

    cy.get(AdminElements.name)
      .clear()
      .type(templateName)

    cy.get(AdminElements.description)
      .click()
      .type(templateDescription)
    
    cy.get(AdminElements.addItem).click()
  }

  assertTemplateTitle() {
    return cy.get(AdminElements.createdTitle)
  }

  assertTemplateDescription() {
    return cy.get(AdminElements.createdDescription)
  }
}

export default Templates