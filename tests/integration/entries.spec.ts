import Entries from '../classes/administration/entries'
import Utils from '../classes/utils'
const entries = new Entries()
const utils = new Utils()

describe('Entries', () => {
  beforeEach(() => {
    utils.resetDB()
    utils.setupTests()
    entries.prepareEntriesTests()
  })

  it('I can create a new entry', () => {
    const firstCompanyName = 'A Los Angeles Company'
    const secondCompanyName = 'A New York Company'

    entries.addCompany({
      title: firstCompanyName,
      directors: {
        president: 'John Doe',
        vicePresident: 'Jane Doe'
      },
      address1: 'Long Beach Road Blvd 1111',
      address2: 'Palm Beach',
      city: 'Los Angeles',
      state: 'California',
      country: 'US'
    })

    entries.assertDirectorPositions('John Doe', 'Jane Doe')

    entries.swapDirectors()

    entries.assertDirectorPositions('Jane Doe', 'John Doe')

    entries.assertDirectorVisibility()
      .should('be.visible')

    entries.deleteDirector()

    entries.assertDirectorVisibility()
      .should('not.exist')

    entries.saveEntry()

    utils.notification()
      .should('contain', 'Entry successfully saved.')

    entries.addNewEntry()

    utils.waitASecond(1)

    entries.addCompany({
      title: secondCompanyName,
      directors: {
        president: 'Jane Doe',
        vicePresident: 'John Doe'
      },
      address1: 'Lexington Avenue, 12345',
      address2: 'Heights, Brooklyn',
      city: 'New York',
      state: 'New York',
      country: 'US'
    })

    entries.saveEntry()

    entries.addNewEntry()

    entries.assertCompanyDetails(0, {
      createdAt: '0 minute ago',
      companyName: secondCompanyName
    })

    entries.assertCompanyDetails(1, {
      createdAt: '0 minute ago',
      companyName: firstCompanyName
    })
  })

  it('I can edit an entry', () => {
    const companyName = 'A Los Angeles Company'
    const newCompanyName = 'A LA Company'

    entries.addCompany({
      title: companyName,
      directors: {
        president: 'John Doe',
        vicePresident: 'Jane Doe'
      },
      address1: 'Long Beach Road Blvd 1111',
      address2: 'Palm Beach',
      city: 'Los Angeles',
      state: 'California',
      country: 'US'
    })

    entries.saveEntry()
    entries.addNewEntry()

    entries.assertCompanyDetails(0, {
      createdAt: '0 minute ago',
      companyName: companyName
    })

    utils.waitASecond(1)

    entries.editEntry({
      newEntryName: newCompanyName
    })

    entries.saveEntry()
    entries.addNewEntry()

    entries.assertCompanyDetails(0, {
      createdAt: '0 minute ago',
      companyName: newCompanyName
    })
  })

  it('I can view an entry\'s model', () => {
    const companyName = 'A Los Angeles Company'

    entries.addCompany({
      title: companyName,
      directors: {
        president: 'John Doe',
        vicePresident: 'Jane Doe'
      },
      address1: 'Long Beach Road Blvd 1111',
      address2: 'Palm Beach',
      city: 'Los Angeles',
      state: 'California',
      country: 'US'
    })

    entries.saveEntry()
    entries.addNewEntry()

    entries.viewModel()

    entries.assertModelVisibility()
  })

  it('I can delete an entry', () => {
    const companyName = 'A Los Angeles Company'

    entries.addCompany({
      title: companyName,
      directors: {
        president: 'John Doe',
        vicePresident: 'Jane Doe'
      },
      address1: 'Long Beach Road Blvd 1111',
      address2: 'Palm Beach',
      city: 'Los Angeles',
      state: 'California',
      country: 'US'
    })

    entries.saveEntry()
    entries.addNewEntry()

    utils.waitASecond(1)

    entries.assertEntry()

    entries.deleteEntry()

    entries.assertEntryAfterDeletion({
      first: '0 entries found',
      second: 'There are no entries available.'
    })
  })
})