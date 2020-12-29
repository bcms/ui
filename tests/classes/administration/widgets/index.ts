import AdminElements from '../../elements/adminElements'
import Admin from '../admin'

class Widgets extends Admin {
  addNewWidget(widgetName: string, widgetDescription: string) {
    cy.get(AdminElements.name).type(widgetName)
    cy.get(AdminElements.description).type(widgetDescription)
    cy.get(AdminElements.addItem).click()
  }

  editWidget(widgetName: string, widgetDescription: string) {
    cy.get(AdminElements.editTemplate).click()

    cy.get(AdminElements.name)
      .clear()
      .type(widgetName)

    cy.get(AdminElements.description)
      .click()
      .type(widgetDescription)
    
    cy.get(AdminElements.addItem).click()
  }

  deleteWidget(widgetName: string) {
    cy.get(AdminElements.deleteItem).click()

    cy.get(AdminElements.confirmBoxWidget).type(widgetName)

    // Very hacky, but won't work otherwise
    cy.get(AdminElements.modalBody)
      .find('button')
      .first()
      .click()
  }

  assertWidgetTitle() {
    return cy.get(AdminElements.createdTitle)
  }

  assertWidgetDescription() {
    return cy.get(AdminElements.createdDescription)
  }
}

export default Widgets