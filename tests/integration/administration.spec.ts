import Utils from '../classes/utils'
import Media from '../classes/administration/media'
import Templates from '../classes/administration/templates'
import Groups from '../classes/administration/groups'
import Widgets from '../classes/administration/widgets'

const utils = new Utils()
const media = new Media()
const templates = new Templates()
const groups = new Groups()
const widgets = new Widgets()

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

    it('I can create a new template with all properties', () => {
      utils.selectSingleItem('Templates')
      utils.addNewItem()

      templates.addNewTemplate(templateName, templateDescription)

      utils
        .notification()
        .contains('Template successfully created.')

      utils.closeNotification()

      templates.assertProperties({
          position: 1,
          required: true,
          label: 'Title',
          name: 'title',
          type: 'String'
      })

      templates.assertProperties({
          position: 2,
          required: true,
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

      utils.closeNotification()
      
      templates.assertProperties({
          position: 3,
          required: true,
          label: 'A label',
          name: 'a_label',
          type: 'String'
      })

      templates.addNewProperty({
        type: 'Number',
        label: 'number',
        required: true,
        array: true
      })

      utils.closeNotification()

      templates.assertProperties({
        position: 4,
        required: true,
        label: 'number',
        name: 'number',
        type: 'Number'
      })

      templates.addNewProperty({
        type: 'Date',
        label: 'Date',
        required: false,
        array: true
      })

      utils.closeNotification()

      templates.assertProperties({
        position: 5,
        required: false,
        label: 'Date',
        name: 'date',
        type: 'Date'
      })

      templates.addNewProperty({
        type: 'Boolean',
        label: 'Boolean',
        required: true,
        array: false
      })

      templates.assertProperties({
        position: 6,
        required: true,
        label: 'Boolean',
        name: 'boolean',
        type: 'Boolean'
      })

      utils.waitASecond(5)

      templates.addNewProperty({
        type: 'Rich Text',
        label: 'Rich Text',
        required: false,
        array: false
      })

      templates.assertProperties({
        position: 7,
        required: false,
        label: 'Rich Text',
        name: 'rich_text',
        type: 'Rich Text'
      })

      templates.addNewProperty({
        type: 'Enumeration',
        label: 'Enumeration',
        required: false,
        firstEnum: 'One',
        secondEnum: 'Two',
        thirdEnum: 'Three',
      })

      templates.assertProperties({
        position: 8,
        required: false,
        label: 'Enumeration',
        name: 'enumeration',
        type: 'Enumeration'
      })

      utils.waitASecond(5)

      templates.addNewProperty({
        type: 'Media',
        label: 'Media',
        required: true,
      })

      templates.assertProperties({
        position: 9,
        required: true,
        label: 'Media',
        name: 'media',
        type: 'Media'
      })
    })
  })

  context('Groups', () => {
    beforeEach(() => {
      utils.resetDB()
      utils.setupTests()
    })

    const groupName = 'A group'
    const groupDescription = 'A group description'
    const editedGroupName = 'Edited group'
    const editedGroupDescription = 'Also something else'

    it('I can create a new group', () => {
      utils.selectSingleItem('Groups')
      utils.addNewItem()

      groups.addNewGroup(groupName, groupDescription)

      utils
        .notification()
        .contains('Group successfully created.')

      groups
        .assertGroupName()
        .contains(groupName)

      groups
        .assertGroupDescription()
        .contains(groupDescription)
    })

    it('I can edit a group', () => {
      utils.selectSingleItem('Groups')
      utils.addNewItem()

      groups.addNewGroup(
          groupName,
          groupDescription
      )

      utils
        .notification()
        .contains('Group successfully created.')

      utils.closeNotification()

      groups.editGroup(
          editedGroupName,
          editedGroupDescription
      )

      utils
        .notification()
        .contains('Group updated successfully.')

      groups
        .assertGroupName()
        .contains(editedGroupName)

      groups
        .assertGroupDescription()
        .contains(editedGroupDescription)
    })

    it('I can create a new group with all properties', () => {
      utils.selectSingleItem('Groups')
      utils.addNewItem()

      groups.addNewGroup(groupName, groupDescription)

      utils
        .notification()
        .contains('Group successfully created.')

      utils.closeNotification()

      groups.addNewProperty({
        type: 'String',
        label: 'A label',
        required: true,
        array: true
      })

      utils.closeNotification()

      groups.assertProperties({
          position: 1,
          required: true,
          label: 'A label',
          name: 'a_label',
          type: 'String'
      })

      groups.addNewProperty({
        type: 'Number',
        label: 'number',
        required: true,
        array: true
      })

      utils.closeNotification()

      groups.assertProperties({
        position: 2,
        required: true,
        label: 'number',
        name: 'number',
        type: 'Number'
      })

      groups.addNewProperty({
        type: 'Date',
        label: 'Date',
        required: false,
        array: true
      })

      utils.closeNotification()

      groups.assertProperties({
        position: 3,
        required: false,
        label: 'Date',
        name: 'date',
        type: 'Date'
      })

      groups.addNewProperty({
        type: 'Boolean',
        label: 'Boolean',
        required: true,
        array: false
      })

      groups.assertProperties({
        position: 4,
        required: true,
        label: 'Boolean',
        name: 'boolean',
        type: 'Boolean'
      })

      utils.waitASecond(5)

      groups.addNewProperty({
        type: 'Rich Text',
        label: 'Rich Text',
        required: false,
        array: false
      })

      groups.assertProperties({
        position: 5,
        required: false,
        label: 'Rich Text',
        name: 'rich_text',
        type: 'Rich Text'
      })

      groups.addNewProperty({
        type: 'Enumeration',
        label: 'Enumeration',
        required: false,
        firstEnum: 'One',
        secondEnum: 'Two',
        thirdEnum: 'Three',
      })

      groups.assertProperties({
        position: 6,
        required: false,
        label: 'Enumeration',
        name: 'enumeration',
        type: 'Enumeration'
      })

      utils.waitASecond(5)

      groups.addNewProperty({
        type: 'Media',
        label: 'Media',
        required: true,
      })

      groups.assertProperties({
        position: 7,
        required: true,
        label: 'Media',
        name: 'media',
        type: 'Media'
      })
    })
  })

  context('Widgets', () => {
    beforeEach(() => {
      utils.resetDB()
      utils.setupTests()
    })

    const widgetName = 'A widget'
    const widgetDescription = 'A widget description'
    const editedWidgetTitle = 'Edited widget'
    const editedWidgetDecription = 'Also something else'

    it('I can create a new wigdet', () => {
      utils.selectSingleItem('Widgets')
      utils.addNewItem()

      widgets.addNewWidget(widgetName, widgetDescription)

      utils
        .notification()
        .contains('Widget successfully created.')

        widgets
        .assertWidgetTitle()
        .contains(widgetName)

      widgets
        .assertWidgetDescription()
        .contains(widgetDescription)
    })

    it('I can edit a widget', () => {
      utils.selectSingleItem('Widgets')
      utils.addNewItem()

      widgets.addNewWidget(
          widgetName,
          widgetDescription
      )

      utils
        .notification()
        .contains('Widget successfully created.')

      utils.closeNotification()

      widgets.editWidget(
          editedWidgetTitle,
          editedWidgetDecription
      )

      utils
        .notification()
        .contains('Widget updated successfully.')

      widgets
        .assertWidgetTitle()
        .contains(editedWidgetTitle)

      widgets
        .assertWidgetDescription()
        .contains(editedWidgetDecription)
    })

    it('I can create a new widget with all properties', () => {
      utils.selectSingleItem('Widgets')
      utils.addNewItem()

      widgets.addNewWidget(widgetName, widgetDescription)

      utils
        .notification()
        .contains('Widget successfully created.')

      utils.closeNotification()

      widgets.addNewProperty({
        type: 'String',
        label: 'A label',
        required: true,
        array: true
      })

      utils.closeNotification()

      widgets.assertProperties({
          position: 1,
          required: true,
          label: 'A label',
          name: 'a_label',
          type: 'String'
      })

      widgets.addNewProperty({
        type: 'Number',
        label: 'number',
        required: true,
        array: true
      })

      utils.closeNotification()

      widgets.assertProperties({
        position: 2,
        required: true,
        label: 'number',
        name: 'number',
        type: 'Number'
      })

      widgets.addNewProperty({
        type: 'Date',
        label: 'Date',
        required: false,
        array: true
      })

      utils.closeNotification()

      widgets.assertProperties({
        position: 3,
        required: false,
        label: 'Date',
        name: 'date',
        type: 'Date'
      })

      widgets.addNewProperty({
        type: 'Boolean',
        label: 'Boolean',
        required: true,
        array: false
      })

      widgets.assertProperties({
        position: 4,
        required: true,
        label: 'Boolean',
        name: 'boolean',
        type: 'Boolean'
      })

      utils.waitASecond(5)

      widgets.addNewProperty({
        type: 'Rich Text',
        label: 'Rich Text',
        required: false,
        array: false
      })

      widgets.assertProperties({
        position: 5,
        required: false,
        label: 'Rich Text',
        name: 'rich_text',
        type: 'Rich Text'
      })

      widgets.addNewProperty({
        type: 'Enumeration',
        label: 'Enumeration',
        required: false,
        firstEnum: 'One',
        secondEnum: 'Two',
        thirdEnum: 'Three',
      })

      widgets.assertProperties({
        position: 6,
        required: false,
        label: 'Enumeration',
        name: 'enumeration',
        type: 'Enumeration'
      })

      utils.waitASecond(5)

      widgets.addNewProperty({
        type: 'Media',
        label: 'Media',
        required: true,
      })

      widgets.assertProperties({
        position: 7,
        required: true,
        label: 'Media',
        name: 'media',
        type: 'Media'
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
