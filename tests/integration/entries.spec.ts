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
  })
})