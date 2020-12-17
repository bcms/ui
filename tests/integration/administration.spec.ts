import Utils from '../classes/utils'
import Media from '../classes/administration/media'
const utils = new Utils()
const media = new Media()

context('Media', () => {
  beforeEach(() => {
    utils.resetDB()
    utils.setupTests()
  })

  it('I can upload new media', () => {
    utils.selectSingleItem('Media')
    
    media.addNewMedia()
    media.performDragAndDropFileUpload()
    
    utils
      .notification()
      .contains('Files uploaded successfully.')

    media
      .assertMediaIsUploaded()
      .should('be.visible')
  })

  it('I can upload new media to a folder', () => {
    const folderName = 'molder'

    utils.selectSingleItem('Media')

    media.createNewFolder()
    media.enterFolderName(folderName)
    media.saveFolder()
    
    utils
      .notification()
      .contains('Folder successfully created.')

    media.accessFolder()
    media.addNewMedia()

    media.performDragAndDropFileUpload()

    media
      .assertThatInFolder()
      .contains(folderName)
  })

  it('I can delete uploaded media', () => {
    utils.selectSingleItem('Media')

    media.addNewMedia()
    media.performDragAndDropFileUpload()

    utils
      .notification()
      .contains('Files uploaded successfully.')

    media.deleteMedia()

    utils
      .notification()
      .contains('Media successfully removed.')
  })
})
