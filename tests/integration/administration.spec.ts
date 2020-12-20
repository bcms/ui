import Utils from '../classes/utils'
import Media from '../classes/administration/media'
import Templates from '../classes/administration/templates'
const utils = new Utils()
const media = new Media()
const templates = new Templates()

describe('Administration', () => {
  context('Templates', () => {
    beforeEach(() => {
      utils.resetDB()
      utils.setupTests()
    })

    const templateName = 'A template'
    const templateDescription = 'A description'
    const editedTemplateName = 'Something else'
    const editedTemplateDescription = 'Also something else'

    it('I can create a template', () => {
      utils.selectSingleItem('Templates')
      utils.addNewItem()

      templates.addNewTemplate(templateName, templateDescription)

      utils
        .notification()
        .contains('Template successfully created.')

      templates
        .assertTemplateTitle()
        .contains(templateName)

      templates
        .assertTemplateDescription()
        .contains(templateDescription)
    })

    it('I can edit a template', () => {
      utils.selectSingleItem('Templates')
      utils.addNewItem()

      templates.addNewTemplate(
          templateName,
          templateDescription
      )

      utils
        .notification()
        .contains('Template successfully created.')

      utils.closeNotification()

      templates.editTemplate(
          editedTemplateName,
          editedTemplateDescription
      )

      utils
        .notification()
        .contains('Template updated successfully.')

      templates
        .assertTemplateTitle()
        .contains(editedTemplateName)

      templates
        .assertTemplateDescription()
        .contains(editedTemplateDescription)
    })

    it('I can create a new template with all types', () => {
      utils.selectSingleItem('Templates')
      utils.addNewItem()

      templates.addNewTemplate(templateName, templateDescription)

      utils
        .notification()
        .contains('Template successfully created.')

      templates.assertProperties({
          position: 1,
          label: 'Title',
          name: 'title',
          type: 'String'
      })

      templates.assertProperties({
          position: 2,
          label: 'Slug',
          name: 'slug',
          type: 'String'
      })

      templates.addNewProperty({
        type: 'String',
        label: 'A label',
        required: true,
        array: true
      })

      utils
        .notification()
        .contains('Property successfully added.')
      
      templates.assertProperties({
          position: 3,
          label: 'A label',
          name: 'a_label',
          type: 'String'
      })
    })
  })

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
})
