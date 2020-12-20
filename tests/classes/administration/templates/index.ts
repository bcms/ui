import TemplatesElements from '../../elements/templates'

class Templates {
  addNewTemplate(templateName: string, templateDescription: string) {
    cy.get(TemplatesElements.name).type(templateName)
    cy.get(TemplatesElements.description).type(templateDescription)
    cy.get(TemplatesElements.addItem).click()
  }

  editTemplate(templateName: string, templateDescription: string) {
    cy.get(TemplatesElements.editTemplate).click()

    cy.get(TemplatesElements.name)
      .clear()
      .type(templateName)

    cy.get(TemplatesElements.description)
      .click()
      .type(templateDescription)
    
    cy.get(TemplatesElements.addItem).click()
  }

  assertTemplateTitle() {
    return cy.get(TemplatesElements.createdTitle)
  }

  assertTemplateDescription() {
    return cy.get(TemplatesElements.createdDescription)
  }

  assertProperties(props) {
    return cy.get(TemplatesElements.properties)
      .children()
      .eq(props.position)
      .each(($el) => {
        cy.wrap($el).then((element) => {
          expect(element.children().eq(0).text()).to.contain(props.label)
          expect(element.children().eq(1).text()).to.contain(props.name)
          expect(element.children().eq(2).text()).to.contain(props.type)
        })
      })
  }

  addNewProperty(propertySettings) {
    cy.get(TemplatesElements.addProperty).click()

    cy.get(TemplatesElements.newProperty)
      .contains(propertySettings.type)
      .click()
   
    cy.get(TemplatesElements.name).type(propertySettings.label)

    if (propertySettings.required) {
      cy.get(TemplatesElements.required).click()
    }

    cy.get(TemplatesElements.arrayOption).then(($button) => {
      if (propertySettings.array && $button.is(':visible')) {
        cy.get(TemplatesElements.array).click()
      }
    })
    
    cy.get(TemplatesElements.addItem).click()
    }
  }

export default Templates