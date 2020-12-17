import MediaElements from '../../elements/media'
const file = 'logo.svg'

class Media {
  addNewMedia() {
    cy.get(MediaElements.uploadMedia).click()
  }

  performDragAndDropFileUpload() {
    cy.get(MediaElements.dropArea).attachFile(file, { subjectType: 'drag-n-drop' })
    cy.get(MediaElements.continueUpload).click()
  }

  assertMediaIsUploaded() {
    return cy.get(MediaElements.fileActions)
  }

  deleteMedia() {
    cy.get(MediaElements.delete).click()
    cy.get(MediaElements.confirmDeleteMedia).click()
  }

  createNewFolder() {
    cy.get(MediaElements.createNewFolder).click()
  }

  enterFolderName(folderName: string) {
    cy.get(MediaElements.folderName).type(folderName)
  }

  saveFolder() {
    cy.get(MediaElements.saveFolder).click()
  }

  accessFolder() {
    cy.get(MediaElements.folder).click()
  }

  assertThatInFolder() {
    return cy.get(MediaElements.breadcrumbs)
  }
}

export default Media