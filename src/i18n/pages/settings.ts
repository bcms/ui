export default {
  en: {
    meta: {
      title: 'Settings',
    },
    title: 'Settings',
    accountManagement: {
      title: 'Account management',
      editCta: 'Edit account',
    },
    languages: {
      title: 'Languages',
      description: 'Add languages that will be available for entries',
      addCta: 'Add',
      input: {
        language: {
          label: 'Language',
        },
      },
      error: {
        emptyLanguage: 'Please select a language to add.',
      },
      confirm: {
        delete: {
          title: 'Delete Language',
          description:
            'Are you sure you want to delete <img class="w-6 h-6 mx-1 inline-block" src="/assets/flags/{langCode}.jpg" /> language?',
        },
      },
      notification: {
        langDeleteSuccess: 'Language successfully removed.',
        langAddSuccess: '"{label}" language successfully added.',
      },
    },
    team: {
      title: 'Team',
      subtitle: 'Members',
      inviteCta: 'Invite {pl} member',
      pendingCta: 'Pending',
      viewCta: 'View',
    },
  },
};
