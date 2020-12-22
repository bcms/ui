import TemplatesElements from '../../elements/templates'
import Utils from '../../../classes/utils'
const utils = new Utils()
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
    let required

    if (props.required === true) {
      required = 'required'
    } else {
      required = 'not-required'
    }

    return cy.get(TemplatesElements.properties)
      .children()
      .eq(props.position)
      .each(($el) => {
        cy.wrap($el).then((element) => {
          expect(element.children().children().first()).to.have.attr('data-cy', `${required}`)
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
   
    cy.get(TemplatesElements.name).type(propertySettings.label, { force: true })

    if (propertySettings.required) {
      cy.get(TemplatesElements.required).click()
    }

    cy.get('body').then((body) => {
      if (body.find(TemplatesElements.arrayOption).length > 0 && propertySettings.array) {
        cy.get(TemplatesElements.array).click()
      }
      else if (body.find(TemplatesElements.enumerations).length > 0) {
        cy.get(TemplatesElements.enumerations).click()
        cy.get(TemplatesElements.enumerations).type(`${propertySettings.firstEnum}{enter}`)
        cy.get(TemplatesElements.enumerations).type(`${propertySettings.secondEnum}{enter}`)
        cy.get(TemplatesElements.enumerations).type(`${propertySettings.thirdEnum}{enter}`)
        cy.get(TemplatesElements.addItem).click()
      } else {
        cy.get(TemplatesElements.addItem).click()
      }
    })
    
    cy.get(TemplatesElements.addItem).click()
    }
  }

export default Templates