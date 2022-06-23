export default {
  en: {
    meta: {
      title: 'Entries',
      dynamicTitle: '{label} entries',
    },
    filters: {
      entriesCount: '{count} {pluralEntry} found',
      emptyState: {
        subtitle: 'No entries found.',
        actionText: 'Add new {label}',
      },
      input: {
        search: {
          placeholder: 'Search entries by Title or ID',
        },
        dateCreated: {
          label: 'Date Created',
        },
        dateUpdated: {
          label: 'Date Updated',
        },
      },
    },
    table: {
      emptyTitle: 'No given title',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      title: 'Title',
      status: 'Status',
      edit: 'Edit',
      overflowItems: {
        duplicate: 'Duplicate',
        viewModel: 'View Model',
        remove: 'Remove',
      },
    },
    confirm: {
      remove: {
        title: 'Remove entry',
        description:
          'Are you sure you want to delete <strong>{label}</strong> entry? This action is permanent and irreversible!',
      },
      duplicate: {
        title: 'Duplicate',
        description:
          'Are you sure you want to duplicate <strong>{label}</strong>?',
      },
    },
    notification: {
      entryDeleteSuccess: 'Entry {label} successfully removed.',
      entryDuplicateSuccess: 'Entry successfully duplicated.',
      emptyTemplate: 'Selected template does not exist.',
    },
    spinner: {
      message: 'Loading content...',
    },
  },
};
