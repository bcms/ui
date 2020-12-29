import AdminElements from '../../elements/adminElements'
import EntriesElements from '../../elements/EntriesElements'
import Admin from '../admin'
import Utils from '../../utils'

const utils = new Utils()
class Entries extends Admin {
  addNewGroup(groupName: string, groupDescription: string) {
    cy.get(AdminElements.name)
      .type(groupName)

    cy.get(AdminElements.description)
      .type(groupDescription)

    cy.get(AdminElements.addItem).click()
  }

  addNewTemplate(templateName: string, templateDescription: string) {
    cy.get(AdminElements.name)
      .type(templateName)

    cy.get(AdminElements.description)
      .type(templateDescription)

    cy.get(AdminElements.addItem).click()
  }
  
  addNewDirectorEntry(title: string) {
    cy.get(EntriesElements.entries)
      .first()
      .click()

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

    cy.wait(500)
    this.addNewTemplate('Director', 'A description')
    utils.closeNotification()

    cy.contains('Add new template').click()
    cy.wait(500)

    this.addNewTemplate('Company', 'A description')
    utils.closeNotification()

    this.addNewDirectorEntry('John Doe')
    utils.closeNotification()

    cy.go('back')
  
    this.addNewDirectorEntry('Jane Doe')
    utils.closeNotification()

    utils.selectSingleItem('Templates')

    cy.get(AdminElements.company).click()

    this.addNewPropertyPlain({
      type: 'Media',
      label: 'photo'
    })

    utils.closeNotification()

    this.addNewPointerProperty({
      kind: 'entry',
      array: true,
      type: 'Entry Pointer',
      label: 'Directors',
      pointer: 'Director'
    })

    cy.get(AdminElements.addItem).click()

    utils.closeNotification()

    this.addNewPointerProperty({
      kind: 'group',
      type: 'Group Pointer',
      label: 'Address',
      pointer: 'A group'
    })

    cy.get(AdminElements.addItem).click()

    utils.closeNotification()
  }

  addCompany(options) {
    cy.get(AdminElements.companies).click()
    cy.get(EntriesElements.addNewEntry).click()

    cy.get(EntriesElements.title)
      .type(options.title)

    cy.get(EntriesElements.addNewDirector).click()

    cy.get(EntriesElements.directorSelectBox).click()
    cy.get(`li:contains("${options.directors.president}")`).click()

    cy.get(EntriesElements.addNewDirector).click()
    cy.get(EntriesElements.secondDirectorSelectBox).click()
    cy.get(`li:contains("${options.directors.vicePresident}")`).click()

    cy.get(EntriesElements.streetAddress)
      .type(options.address1)

    cy.get(EntriesElements.streetAddress2)
      .type(options.address2)

    cy.get(EntriesElements.city)
      .type(options.city)

    cy.get(EntriesElements.state)
      .type(options.state)

    cy.get(EntriesElements.country)
      .type(options.country)
  }

  assertDirectorPositions(firstDirectorName: string, secondDirectorName: string) {
    cy.get(EntriesElements.firstDirector)
      .should('contain', firstDirectorName)

    cy.get(EntriesElements.secondDirector)
      .should('contain', secondDirectorName)
  }

  swapDirectors() {
    cy.get(EntriesElements.swapPositions).click()
  }

  deleteDirector() {
    cy.get(EntriesElements.deleteFirstDirector).click()
  }

  assertDirectorVisibility() {
    return cy.get(EntriesElements.secondDirectorSection)
  }

  saveEntry() {
    cy.get(EntriesElements.save).click()
  }

  addNewEntry() {
    cy.contains('Company').click()
  }

  assertCompanyDetails(index: number, details) {
    cy.get(`[data-cy=item-${index}] > .entryOverview--entries-createdAt > span`)
      .should('contain', details.createdAt)

    cy.get(`[data-cy=item-${index}] > .entryOverview--entries-title > span`)
      .should('contain', details.companyName)
  }

  editEntry(details) {
    cy.get(EntriesElements.edit).click()

    cy.get(EntriesElements.title)
      .clear()
      .type(details.newEntryName)
  }

   assertEntry() {
    cy.get(EntriesElements.firstCompanyName).should('be.visible')
  }

  assertEntryAfterDeletion(assertions) {
    cy.get('body').should('contain', assertions.first)
    cy.get('body').should('contain', assertions.second)
  }

  viewModel() {
    cy.get(EntriesElements.optionsMenu).click()
    cy.get(EntriesElements.model).click()
  }

  deleteEntry() {
    cy.get(EntriesElements.optionsMenu).click()
    cy.get(EntriesElements.deleteEntry).click()
    cy.contains('Confirm').click()
  }

  assertModelVisibility() {
    cy.get('body').then((body) => {
      if (body.find(EntriesElements.modalBody)) {
        return true
      }
    })
  }
}

export default Entries