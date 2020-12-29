import AdminElements from '../../elements/adminElements'
class Admin {
  assertProperties(props) {
    let required: string

    if (props.required === true) {
      required = 'required'
    } else if (props.required === false) {
      required = 'not-required'
    }

    return cy.get(AdminElements.properties)
      .children()
      .eq(props.position)
      .each(($el) => {
        cy.wrap($el).then((element) => {
          expect(
              element
              .children()
              .children()
              .first()
            ).to.have.attr('data-cy', `${required}`)

          expect(
              element
              .children()
              .eq(0)
              .text()
            ).to.contain(props.label)

          expect(
              element
              .children()
              .eq(1)
              .text()
            ).to.contain(props.name)

          expect(
              element
              .children()
              .eq(2)
              .text()
            ).to.contain(props.type)
        })
      })
  }

  delete(itemName: string) {
    cy.get(AdminElements.deleteItem).click()

    cy.get(AdminElements.confirmBox).type(itemName)
    cy.get(AdminElements.confirm).click()
  }

  swapPlaces() {
    cy.get(AdminElements.options).click()
    cy.get(AdminElements.moveUp).click()
  }

  swapPlacesOtherProperties() {
    cy.get(AdminElements.plainOptions).click()
    cy.get(AdminElements.moveUp).click()
  }

  editProperty(newName: string) {
    cy.get(AdminElements.options).click()
    cy.get(AdminElements.editOption).click()
    cy.get(AdminElements.name)
      .clear()
      .type(newName)

    cy.get(AdminElements.toggle).click()
    cy.get(AdminElements.confirm).click()
  }

  editGroupProperty(newName: string) {
    cy.get(AdminElements.plainOptions).click()
    cy.get(AdminElements.editOption).click()
    cy.get(AdminElements.name)
      .clear()
      .type(newName)

    cy.get(AdminElements.toggle).click()
    cy.get(AdminElements.confirm).click()
  }

  addNewProperty(propertySettings) {
    cy.get(AdminElements.addProperty).click()

    cy.get(AdminElements.newProperty)
      .contains(propertySettings.type)
      .click()
   
    cy.get(AdminElements.name).type(propertySettings.label, { force: true })

    if (propertySettings.required) {
      cy.get(AdminElements.required).click()
    }

    cy.get('body').then((body) => {
      if (body.find(AdminElements.arrayOption).length > 0 && propertySettings.array) {
        cy.get(AdminElements.array).click()
      } else if (body.find(AdminElements.enumerations).length > 0) {
        cy.get(AdminElements.enumerations).click()
        cy.get(AdminElements.enumerations).type(`${propertySettings.firstEnum}{enter}`)
        cy.get(AdminElements.enumerations).type(`${propertySettings.secondEnum}{enter}`)
        cy.get(AdminElements.enumerations).type(`${propertySettings.thirdEnum}{enter}`)
      }
    })

    cy.get(AdminElements.addItem).click()
  }
  
  addNewPropertyPlain(propertySettings) {
    cy.get(AdminElements.addProperty).click()

    cy.get(AdminElements.newProperty)
      .contains(propertySettings.type)
      .click()
   
    cy.get(AdminElements.name).type(propertySettings.label, { force: true })

    cy.get(AdminElements.addItem).click()
  }

  addNewPointerProperty(propertySettings) {
    cy.get(AdminElements.addProperty).click()

    cy.get(AdminElements.newProperty)
      .contains(propertySettings.type)
      .click()

    cy.get(AdminElements.name).type(propertySettings.label, { force: true })

    if (propertySettings.kind === 'entry') {
      cy.get(AdminElements.entryPointer).click()
      cy.get(AdminElements.entryPointerItem).click()
    }

    else if (propertySettings.kind === 'group') {
      cy.get(AdminElements.groupPointer).click()
      cy.get(AdminElements.groupPointerItem).click()
    }

    cy.get('body').then((body) => {
      if (body.find(AdminElements.entryArrayOptions).length > 0 && propertySettings.array) {
        cy.get(AdminElements.entryArrayOptions).click()
      }
    })
  }
}

export default Admin