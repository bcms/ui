export const modalTranslationsEn = {
  viewModel: {
    title: 'View entry model',
    empty: '// No entry is selected',
    original: 'Original',
    parsed: 'Parsed',
  },
  addUpdateGroup: {
    title: 'Add/Update group',
    newTitle: 'Create new group',
    editTitle: 'Edit {label} Group',
    input: {
      label: {
        label: 'Label',
        placeholder: "Group's label",
      },
      description: {
        label: 'Description',
        placeholder: "Group's description",
        helperText: '*Supports markdown',
      },
    },
    error: {
      emptyLabel: 'Label cannot be empty.',
      duplicateLabel: 'Group with label "{label}" already exists.',
    },
  },
  addUpdateTemplate: {
    title: 'Add/Update template',
    newTitle: 'Create new template',
    editTitle: 'Edit {label} Template',
    input: {
      label: {
        label: 'Label',
        placeholder: "Template's label",
      },
      description: {
        label: 'Description',
        placeholder: "Template's description",
        helperText: '*Supports markdown',
      },
      singleEntry: {
        label: 'Single entry',
        helperText: 'This template will be able to have only 1 entry.',
      },
    },
    error: {
      emptyLabel: 'Label cannot be empty.',
      duplicateLabel: 'Template with label "{label}" already exists.',
    },
  },
  addUpdateWidget: {
    title: 'Add/Update widget',
    newTitle: 'Create new widget',
    editTitle: 'Edit {label} Widget',
    input: {
      label: {
        label: 'Label',
        placeholder: "Widget's label",
      },
      description: {
        label: 'Description',
        placeholder: "Widget's description",
        helperText: '*Supports markdown',
      },
      previewImage: {
        title: 'Preview image',
      },
    },
    error: {
      emptyLabel: 'Label cannot be empty.',
      duplicateLabel: 'Widget with label "{label}" already exists.',
    },
  },
  addProp: {
    title: 'Select a property type',
    actionSlot: {
      createLabel: 'Create',
      backLabel: 'Back',
    },
    type: {
      string: {
        label: 'String',
        description: 'Any character array value',
      },
      richText: {
        label: 'Rich Text',
        description: 'Text with options for bold, italic, list...',
      },
      number: {
        label: 'Number',
        description: 'Any real number',
      },
      date: {
        label: 'Date',
        description: 'Unix timestamp - date in milliseconds',
      },
      boolean: {
        label: 'Boolean',
        description: 'Yer or no, true of false, 1 or 0',
      },
      enumeration: {
        label: 'Enumeration',
        description: 'List of choices',
      },
      media: {
        label: 'Media',
        description: 'Select a media file using media picker',
      },
      groupPointer: {
        label: 'Group Pointer',
        description: 'Extend properties of a group',
      },
      entryPointer: {
        label: 'Entry Pointer',
        description: 'Extend properties of an entry',
      },
    },
    input: {
      label: {
        label: 'Label',
        placeholder: 'Label',
      },
      enumeration: {
        label: 'Enumerations',
        placeholder: 'Type something and press Enter key',
      },
      required: {
        label: 'Required',
        states: ['Yes', 'No'],
      },
      array: {
        label: 'Array',
        states: ['Yes', 'No'],
      },
    },
    error: {
      emptyType: 'You must select a type.',
      emptyLabel: 'Label is required.',
      duplicateLabel: 'Label is already taken.',
      emptyGroupPointer: 'Please select a group.',
      emptyTemplatePointer: 'Please select a template.',
      emptyEnumeration: 'At least 1 value must be provided.',
      duplicateEnumeration: "Enumeration with name '{label}' is already added.",
    },
  },
  editProp: {
    title: 'Edit property {label}',
    actionName: 'Update',
    input: {
      label: {
        label: 'Label',
        placeholder: "Property's label",
      },
      enumeration: {
        label: 'Enumeration',
        placeholder: 'Type something and press Enter key',
      },
      required: {
        label: 'Required',
        states: ['Yes', 'No'],
      },
      array: {
        label: 'Array',
        states: ['Yes', 'No'],
      },
    },
    error: {
      emptyLabel: 'Label is required.',
      duplicateLabel: 'Label is already taken.',
      emptyEnumeration: 'At least 1 value must be provided.',
      duplicateEnumeration: "Enumeration with name '{label}' is already added.",
      emptyEntryPointer: 'You must select at least 1 template.',
    },
  },
  entryStatus: {
    title: 'Edit entry statuses',
    confirm: {
      done: {
        title: 'Update statuses',
        description: 'Are you sure you want to update statuses?',
      },
    },
    input: {
      enumeration: {
        label: 'Add new status',
        placeholder: 'Status name',
      },
    },
    error: {
      duplicateEnumeration: 'Status with name "{label}" is already added.',
    },
  },
  mediaPicker: {
    title: 'Media picker',
    selectedTitle: 'Select media file',
    error: {
      emptyFile: 'You must select a media file.',
    },
  },
  addUpdateDirectory: {
    title: 'Create new folder',
    input: {
      label: {
        label: 'Folder name',
        placeholder: 'Folder name',
      },
    },
    error: {
      emptyLabel: 'Folder name is required.',
      duplicateFolder:
        'Folder "{label}" already exists. Please choose a different name.',
    },
  },
  uploadMedia: {
    title: 'Upload files',
    notification: {
      emptyFile: 'There are no files to upload.',
    },
  },
  confirm: {
    title: 'Confirm',
    actionName: 'Confirm',
    input: {
      label: {
        label: 'Confirm',
        helperText: 'Please write <strong>{label}</strong>',
      },
    },
    error: {
      prompt: 'You must type "{value}"',
    },
  },
  showDescriptionExample: {
    title: 'Overview examples to inspire you',
    views: [
      {
        title: 'Test Space',
        description: 'A virtual gathering place for your team',
      },
      {
        title: 'Project Space',
        description: 'Coordinate project work in one place',
      },
      {
        title: 'Personal Space',
        description: 'A space for your own stuff',
      },
    ],
  },
  whereIsItUsed: {
    title: 'Where is it used?',
    groupTitle: '{label} is used in',
    widgetTitle: '{label} is used in',
    table: {
      columns: {
        type: 'Type',
        label: 'Label',
        location: 'Location',
      },
      openCta: 'Open',
    },
  },
  contentLink: {
    title: 'Link URL',
    input: {
      url: {
        label: 'URL',
        helperText: 'Link must start with http:// or https://',
      },
    },
    error: {
      wrongUrl: 'Invalid URL was provided.',
    },
  },
  addWidget: {
    title: 'Add widget',
    actionName: 'Add widget to the content',
    spinnerMessage: 'Loading widgets',
    notification: {
      emptyWidget: 'You need to select a widget.',
    },
  },
  templateOrganizer: {
    title: 'Organize entries',
    actionName: 'Create',
    input: {
      label: {
        placeholder: 'Name the collection',
      },
    },
    error: {
      emptyLabel: 'Please name your collection.',
    },
  },
  addUpdateApiKey: {
    addTitle: 'Add API Key',
    editTitle: 'Edit {label} Key',
    actionName: 'Create',
    input: {
      label: {
        label: 'Name',
        placeholder: 'Name',
      },
      description: {
        label: 'Description',
        placeholder: 'Description',
      },
    },
    error: {
      emptyLabel: 'Name is required',
    },
  },
  viewUser: {
    title: 'View member',
    input: {
      mode: {
        label: 'Toggle mode',
        states: ['Advanced mode', 'Simple mode'],
      },
      mediaPermission: {
        title: 'Media Permissions',
        advancedModeTitle: 'Can view and edit media',
        subtitle: 'Media',
        values: [
          {
            description: 'Can get resources',
          },
          {
            description: 'Can add data',
          },
          {
            description: 'Can update data',
          },
          {
            description: 'Can delete data',
          },
        ],
      },
      templatePermission: {
        title: 'Template Permissions',
        advancedModeTitle: 'Can view and edit {label}',
        emptyTitle: 'There are no templates',
        values: [
          {
            description: 'Can get resources',
          },
          {
            description: 'Can add data',
          },
          {
            description: 'Can update data',
          },
          {
            description: 'Can delete data',
          },
        ],
      },
      pluginPermission: {
        title: 'Plugin Permissions',
        advancedModeTitle: 'Allow full access to {label}',
      },
    },
    notification: {
      userPolicySuccess: 'Users policy updated successfully.',
    },
  },
  globalSearch: {
    input: {
      value: {
        placeholder: 'Search for anything',
      },
    },
    select: 'Select',
    members: 'Members',
  },
  multiSelect: {
    title: 'Select templates',
  },
  backups: {
    title: 'Backups',
    inProcess: 'In process',
    action: 'Create new backup',
    empty: 'There are no backups available',
  },
};
