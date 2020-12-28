import AdminElements from '../../elements/adminElements'
import Admin from '../admin'
import Utils from '../../utils'
import EntriesElements from '../../elements/entriesElements'
const utils = new Utils()

class Entries extends Admin {
  addNewGroup(groupName: string, groupDescription: string) {
    cy.get(AdminElements.name).type(groupName)
    cy.get(AdminElements.description).type(groupDescription)
    cy.get(AdminElements.addItem).click()
  }

  addNewTemplate(templateName: string, templateDescription: string) {
    cy.get(AdminElements.name).type(templateName)
    cy.get(AdminElements.description).type(templateDescription)
    cy.get(AdminElements.addItem).click()
  }
  
  addNewDirectorEntry(title: string) {
    cy.get(EntriesElements.entries).first().click()
    cy.get(EntriesElements.addNewEntry).click()
    cy.get(EntriesElements.title).type(title)
    cy.get(EntriesElements.save).click()
  }

  prepareEntriesTests() {
    utils.selectSingleItem('Groups')
    utils.addNewItem()
    this.addNewGroup('A group', 'A description')

    utils.closeNotification()

    this.addNewPropertyPlain({
        type: 'String',
        label: 'Street address'
    })

    utils.closeNotification()

    this.addNewPropertyPlain({
      type: 'String',
      label: 'Street address 2'
    })

    utils.closeNotification()

    this.addNewPropertyPlain({
      type: 'String',
      label: 'City'
    })

    utils.closeNotification()

    this.addNewPropertyPlain({
      type: 'String',
      label: 'State'
    })

    utils.closeNotification()

    this.addNewPropertyPlain({
      type: 'String',
      label: 'Country'
    })

    utils.closeNotification()

    utils.selectSingleItem('Templates')
    cy.contains('Add new template').click()

    this.addNewTemplate('Director', 'A description')
    cy.contains('Add new template').click()

    this.addNewTemplate('Company', 'A description')

    // prepare directors for the company
    this.addNewDirectorEntry('John Doe')

    cy.go('back')
  
    this.addNewDirectorEntry('Jane Doe')

    utils.selectSingleItem('Templates')

    // HACK: this should ideally be a data-cy selector
    cy.get(AdminElements.company).click()

    this.addNewPropertyPlain({
      type: 'Media',
      label: 'photo'
    })

    this.addNewPointerProperty({
      kind: 'entry',
      array: true,
      type: 'Entry Pointer',
      label: 'Directors',
      pointer: 'Director'
    })

    cy.get(AdminElements.addItem).click()

    this.addNewPointerProperty({
      kind: 'group',
      type: 'Group Pointer',
      label: 'Address',
      pointer: 'A group'
    })

    cy.get(AdminElements.addItem).click()

  }
}

export default Entries