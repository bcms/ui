export default {
  en: {
    meta: {
      createTitle: 'Create Entry',
      updateTitle: 'Update Entry',
    },
    actions: {
      save: 'Save',
      update: 'Update',
    },
    instructions: 'Instructions',
    input: {
      title: {
        label: 'Title',
        placeholder: 'Title for {label} entry',
      },
      slug: {
        placeholder: 'slug',
      },
    },
    confirm: {
      pageLeave: {
        title: 'Leaving the page',
        description:
          'Are you sure you want to leave this page? You have unsaved progress which will be lost.',
      },
    },
    notification: {
      entrySaveSuccess: 'Entry saved successfully.',
      emptyTemplate: 'Template does not exist.',
      entryErrors:
        'Entry contains one or more errors. Please fix them and try again.',
    },
    spinner: {
      message: 'Loading entry...',
      savingMessage: 'We are saving your entry, please wait...',
    },
  },
};
